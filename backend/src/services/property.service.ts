import { propertyRepository, CreatePropertyData, UpdatePropertyData, PropertyQueryFilters } from '../repositories/property.repository.js';

export class PropertyService {
  async getAllProperties(params?: PropertyQueryFilters) {
    return propertyRepository.findAll(params);
  }

  async getPropertyById(id: string) {
    const item = await propertyRepository.findById(id);
    if (!item) {
      const error: any = new Error(`Property with ID '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return item;
  }

  async createProperty(data: CreatePropertyData) {
    return propertyRepository.create(data);
  }

  async updateProperty(id: string, data: UpdatePropertyData) {
    await this.getPropertyById(id);
    return propertyRepository.update(id, data);
  }

  async deleteProperty(id: string) {
    await this.getPropertyById(id);
    return propertyRepository.delete(id);
  }
}

export const propertyService = new PropertyService();
