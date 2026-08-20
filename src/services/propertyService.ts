import { propertyRepository, PropertyQueryFilters, PaginatedProperties } from '../repositories';
import { Property } from '../types';

export const propertyService = {
  async getAll(filters?: PropertyQueryFilters): Promise<PaginatedProperties> {
    return propertyRepository.getAll(filters);
  },

  async getById(id: string): Promise<Property | undefined> {
    return propertyRepository.getById(id);
  },

  async save(property: Property): Promise<Property> {
    return propertyRepository.save(property);
  },

  async delete(id: string): Promise<boolean> {
    return propertyRepository.delete(id);
  }
};
