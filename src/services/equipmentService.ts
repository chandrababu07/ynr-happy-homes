import { equipmentRepository } from '../repositories';
import { Equipment } from '../types';

export const equipmentService = {
  async getAll(): Promise<Equipment[]> {
    return equipmentRepository.getAll();
  },

  async getById(id: string): Promise<Equipment | undefined> {
    return equipmentRepository.getById(id);
  },

  async save(equipment: Equipment): Promise<Equipment> {
    return equipmentRepository.save(equipment);
  },

  async delete(id: string): Promise<boolean> {
    return equipmentRepository.delete(id);
  }
};
