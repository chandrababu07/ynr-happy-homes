import { PropertyCategoryType, PropertyListingStatus } from '@prisma/client';
import prisma from '../utils/prisma.js';

export interface PropertyQueryFilters {
  search?: string;
  category?: string;
  status?: string;
  city?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface CreatePropertyData {
  id?: string;
  title: string;
  category?: PropertyCategoryType;
  type: string;
  price: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode?: string;
  description: string;
  amenities?: string[];
  images?: string[];
  status?: PropertyListingStatus;
  mapCoordinates?: Record<string, any>;
}

export interface UpdatePropertyData {
  title?: string;
  category?: PropertyCategoryType;
  type?: string;
  price?: string;
  address?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  description?: string;
  amenities?: string[];
  images?: string[];
  status?: PropertyListingStatus;
  mapCoordinates?: Record<string, any>;
}

// Map category strings to Enum
function parseCategory(cat?: string): PropertyCategoryType | undefined {
  if (!cat || cat === 'ALL') return undefined;
  const upper = cat.toUpperCase().replace(/\s*\/\s*/g, '_').replace(/\s+/g, '_');
  if (Object.values(PropertyCategoryType).includes(upper as any)) {
    return upper as PropertyCategoryType;
  }
  // Frontend text mapping
  if (cat === 'Land') return PropertyCategoryType.LAND;
  if (cat === 'Sites / Plots') return PropertyCategoryType.SITES_PLOTS;
  if (cat === 'Apartments') return PropertyCategoryType.APARTMENTS;
  if (cat === 'Individual Houses') return PropertyCategoryType.INDIVIDUAL_HOUSES;
  if (cat === 'Commercial Land') return PropertyCategoryType.COMMERCIAL_LAND;
  if (cat === 'Commercial Properties') return PropertyCategoryType.COMMERCIAL_PROPERTIES;
  return undefined;
}

// Memory fallback store if database connection is offline during local development
let mockPropertyStore: any[] = [];

export class PropertyRepository {
  async findAll(params?: PropertyQueryFilters) {
    const page = Math.max(1, Number(params?.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params?.limit) || 50));
    const skip = (page - 1) * limit;

    const where: any = {};

    // Search query on title, address, area, city, description
    if (params?.search && params.search.trim() !== '') {
      const q = params.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
        { area: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Category filter
    const parsedCat = parseCategory(params?.category);
    if (parsedCat) {
      where.category = parsedCat;
    }

    // Status filter
    if (params?.status && params.status !== 'ALL') {
      const statusUpper = params.status.toUpperCase();
      if (Object.values(PropertyListingStatus).includes(statusUpper as any)) {
        where.status = statusUpper as PropertyListingStatus;
      }
    }

    // City / Area filter
    if (params?.city && params.city.trim() !== '') {
      where.OR = [
        ...(where.OR || []),
        { city: { contains: params.city.trim(), mode: 'insensitive' } },
        { area: { contains: params.city.trim(), mode: 'insensitive' } },
      ];
    }

    // Order By sort
    let orderBy: any = { createdAt: 'desc' };
    if (params?.sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (params?.sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (params?.sort === 'price_desc') {
      orderBy = { price: 'desc' };
    }

    try {
      const [items, total] = await Promise.all([
        prisma.property.findMany({
          where,
          orderBy,
          skip,
          take: limit,
        }),
        prisma.property.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit) || 1;

      return {
        items,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      console.warn('[PropertyRepository] Database connection error. Serving in-memory fallback store with filtering.');
      
      let filtered = [...mockPropertyStore];

      if (params?.search && params.search.trim() !== '') {
        const q = params.search.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.address.toLowerCase().includes(q) ||
            p.area.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }

      if (parsedCat) {
        filtered = filtered.filter((p) => p.category === parsedCat);
      }

      if (params?.status && params.status !== 'ALL') {
        filtered = filtered.filter((p) => p.status?.toUpperCase() === params.status?.toUpperCase());
      }

      if (params?.sort === 'oldest') {
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else if (params?.sort === 'newest') {
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      const total = filtered.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const items = filtered.slice(skip, skip + limit);

      return {
        items,
        total,
        page,
        limit,
        totalPages,
      };
    }
  }

  async findById(id: string) {
    try {
      return await prisma.property.findUnique({
        where: { id },
      });
    } catch (error) {
      return mockPropertyStore.find((item) => item.id === id) || null;
    }
  }

  async create(data: CreatePropertyData) {
    try {
      return await prisma.property.create({
        data: {
          ...(data.id && { id: data.id }),
          title: data.title,
          category: data.category || PropertyCategoryType.SITES_PLOTS,
          type: data.type,
          price: data.price,
          address: data.address,
          area: data.area,
          city: data.city,
          state: data.state,
          pincode: data.pincode || null,
          description: data.description,
          amenities: data.amenities || [],
          images: data.images || [],
          status: data.status || PropertyListingStatus.AVAILABLE,
          mapCoordinates: data.mapCoordinates || undefined,
        },
      });
    } catch (error) {
      const newItem: any = {
        id: data.id || `prop-${Date.now()}`,
        ...data,
        category: data.category || PropertyCategoryType.SITES_PLOTS,
        amenities: data.amenities || [],
        images: data.images || [],
        status: data.status || PropertyListingStatus.AVAILABLE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPropertyStore.unshift(newItem);
      return newItem;
    }
  }

  async update(id: string, data: UpdatePropertyData) {
    try {
      return await prisma.property.update({
        where: { id },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.category && { category: data.category }),
          ...(data.type && { type: data.type }),
          ...(data.price && { price: data.price }),
          ...(data.address && { address: data.address }),
          ...(data.area && { area: data.area }),
          ...(data.city && { city: data.city }),
          ...(data.state && { state: data.state }),
          ...(data.pincode !== undefined && { pincode: data.pincode }),
          ...(data.description && { description: data.description }),
          ...(data.amenities !== undefined && { amenities: data.amenities }),
          ...(data.images !== undefined && { images: data.images }),
          ...(data.status && { status: data.status }),
          ...(data.mapCoordinates && { mapCoordinates: data.mapCoordinates }),
        },
      });
    } catch (error) {
      const index = mockPropertyStore.findIndex((item) => item.id === id);
      if (index >= 0) {
        mockPropertyStore[index] = {
          ...mockPropertyStore[index],
          ...data,
          updatedAt: new Date(),
        };
        return mockPropertyStore[index];
      }
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return await prisma.property.delete({
        where: { id },
      });
    } catch (error) {
      mockPropertyStore = mockPropertyStore.filter((item) => item.id !== id);
      return { id };
    }
  }
}

export const propertyRepository = new PropertyRepository();
