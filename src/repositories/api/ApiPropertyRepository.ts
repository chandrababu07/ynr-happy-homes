import { IPropertyRepository, PropertyQueryFilters, PaginatedProperties } from '../interfaces';
import { Property, PropertyCategory } from '../../types';
import { apiClient } from '../../services/apiClient';
import { LocalStoragePropertyRepository } from '../localStorage/LocalStoragePropertyRepository';

function categoryToBackend(cat?: string): string {
  switch (cat) {
    case 'Land':
      return 'LAND';
    case 'Sites / Plots':
      return 'SITES_PLOTS';
    case 'Apartments':
      return 'APARTMENTS';
    case 'Individual Houses':
      return 'INDIVIDUAL_HOUSES';
    case 'Commercial Land':
      return 'COMMERCIAL_LAND';
    case 'Commercial Properties':
      return 'COMMERCIAL_PROPERTIES';
    default:
      return 'SITES_PLOTS';
  }
}

function categoryToFrontend(cat?: string): PropertyCategory {
  switch (cat) {
    case 'LAND':
      return 'Land';
    case 'SITES_PLOTS':
      return 'Sites / Plots';
    case 'APARTMENTS':
      return 'Apartments';
    case 'INDIVIDUAL_HOUSES':
      return 'Individual Houses';
    case 'COMMERCIAL_LAND':
      return 'Commercial Land';
    case 'COMMERCIAL_PROPERTIES':
      return 'Commercial Properties';
    default:
      return 'Sites / Plots';
  }
}

function toFrontendProperty(item: any): Property {
  return {
    id: item.id,
    title: item.title,
    category: categoryToFrontend(item.category),
    type: item.type || 'Property',
    price: item.price || 'Price on Request',
    location: {
      address: item.address || item.area || 'Mangalagiri',
      city: item.city || 'Guntur District',
      state: item.state || 'Andhra Pradesh',
      pincode: item.pincode || undefined,
      area: item.area || item.address || 'Mangalagiri',
    },
    description: item.description || '',
    amenities: Array.isArray(item.amenities) ? item.amenities : [],
    images: Array.isArray(item.images) ? item.images : [],
    status: item.status || 'AVAILABLE',
    mapCoordinates: item.mapCoordinates || undefined,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  };
}

function toBackendProperty(p: Property): any {
  return {
    ...(p.id && { id: p.id }),
    title: p.title,
    category: categoryToBackend(p.category),
    type: p.type || 'Open Plot',
    price: String(p.price || ''),
    address: p.location?.address || p.location?.area || 'Mangalagiri',
    area: p.location?.area || p.location?.address || 'Mangalagiri',
    city: p.location?.city || 'Guntur District',
    state: p.location?.state || 'Andhra Pradesh',
    pincode: p.location?.pincode || null,
    description: p.description || '',
    amenities: p.amenities || [],
    images: p.images || [],
    status: p.status || 'AVAILABLE',
    mapCoordinates: p.mapCoordinates || undefined,
  };
}

export class ApiPropertyRepository implements IPropertyRepository {
  private fallbackRepo = new LocalStoragePropertyRepository();

  async getAll(filters?: PropertyQueryFilters): Promise<PaginatedProperties> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category && filters.category !== 'ALL') params.append('category', filters.category);
      if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
      if (filters?.city) params.append('city', filters.city);
      if (filters?.sort) params.append('sort', filters.sort);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await apiClient.get<any>(`/properties${queryString}`);

      // Handle both paginated response `{ data: [...], meta: {...} }` and legacy array response
      if (Array.isArray(response)) {
        const items = response.map(toFrontendProperty);
        return {
          items,
          total: items.length,
          page: 1,
          limit: items.length || 50,
          totalPages: 1,
        };
      }

      const items = Array.isArray(response?.items)
        ? response.items.map(toFrontendProperty)
        : Array.isArray(response)
        ? response.map(toFrontendProperty)
        : [];

      return {
        items,
        total: response?.total ?? items.length,
        page: response?.page ?? 1,
        limit: response?.limit ?? 12,
        totalPages: response?.totalPages ?? 1,
      };
    } catch (err) {
      console.warn('[ApiPropertyRepository] API connection error. Using local fallback repository:', err);
      return this.fallbackRepo.getAll(filters);
    }
  }

  async getById(id: string): Promise<Property | undefined> {
    try {
      const item = await apiClient.get<any>(`/properties/${id}`);
      return item ? toFrontendProperty(item) : undefined;
    } catch (err) {
      console.warn(`[ApiPropertyRepository] Error fetching property '${id}' from API:`, err);
      return this.fallbackRepo.getById(id);
    }
  }

  async save(property: Property): Promise<Property> {
    try {
      const isExisting = Boolean(
        property.id &&
        !property.id.startsWith('prop-temp-') &&
        !property.id.startsWith('temp-') &&
        !property.id.startsWith('new-') &&
        property.id.length > 5
      );

      const payload = toBackendProperty(property);

      if (isExisting) {
        // Update existing property
        const updated = await apiClient.put<any>(`/properties/${property.id}`, payload);
        return toFrontendProperty(updated);
      } else {
        // Create new property
        const { id, ...createPayload } = payload;
        const created = await apiClient.post<any>('/properties', createPayload);
        return toFrontendProperty(created);
      }
    } catch (err) {
      console.warn('[ApiPropertyRepository] Error saving property via API. Falling back to local storage:', err);
      return this.fallbackRepo.save(property);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/properties/${id}`);
      return true;
    } catch (err) {
      console.warn(`[ApiPropertyRepository] Error deleting property '${id}' via API:`, err);
      return this.fallbackRepo.delete(id);
    }
  }
}
