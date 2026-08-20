import { equipmentRepository, CreateEquipmentData, UpdateEquipmentData } from '../repositories/equipment.repository.js';

export class EquipmentService {
  async getAllEquipment() {
    return equipmentRepository.findAll();
  }

  async getEquipmentById(id: string) {
    const item = await equipmentRepository.findById(id);
    if (!item) {
      const error: any = new Error(`Equipment with ID '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return item;
  }

  async createEquipment(data: CreateEquipmentData) {
    return equipmentRepository.create(data);
  }

  async updateEquipment(id: string, data: UpdateEquipmentData) {
    // Verify existence first
    await this.getEquipmentById(id);
    return equipmentRepository.update(id, data);
  }

  async deleteEquipment(id: string) {
    // Verify existence first
    await this.getEquipmentById(id);
    return equipmentRepository.delete(id);
  }
}

export const equipmentService = new EquipmentService();
