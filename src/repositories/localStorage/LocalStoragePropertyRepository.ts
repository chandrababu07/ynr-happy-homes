import { IPropertyRepository, PropertyQueryFilters, PaginatedProperties } from '../interfaces';
import { Property } from '../../types';
import { storageService } from '../../services/storage';

export class LocalStoragePropertyRepository implements IPropertyRepository {
  async getAll(filters?: PropertyQueryFilters): Promise<PaginatedProperties> {
    const all = storageService.getProperties();
    let filtered = [...all];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.area.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q)
      );
    }

    if (filters?.category && filters.category !== 'ALL') {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters?.status && filters.status !== 'ALL') {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    if (filters?.sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (filters?.sort === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const limit = filters?.limit || 12;
    const page = filters?.page || 1;
    const skip = (page - 1) * limit;
    const items = filtered.slice(skip, skip + limit);
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getById(id: string): Promise<Property | undefined> {
    return storageService.getPropertyById(id);
  }

  async save(property: Property): Promise<Property> {
    return storageService.saveProperty(property);
  }

  async delete(id: string): Promise<boolean> {
    return storageService.deleteProperty(id);
  }
}
