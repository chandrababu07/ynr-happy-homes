import { IEquipmentRepository } from '../interfaces';
import { Equipment } from '../../types';
import { storageService } from '../../services/storage';

export class LocalStorageEquipmentRepository implements IEquipmentRepository {
  async getAll(): Promise<Equipment[]> {
    return storageService.getEquipment();
  }

  async getById(id: string): Promise<Equipment | undefined> {
    return storageService.getEquipmentById(id);
  }

  async save(equipment: Equipment): Promise<Equipment> {
    return storageService.saveEquipment(equipment);
  }

  async delete(id: string): Promise<boolean> {
    return storageService.deleteEquipment(id);
  }
}
