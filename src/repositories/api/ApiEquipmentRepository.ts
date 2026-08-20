import { IEquipmentRepository } from '../interfaces';
import { Equipment } from '../../types';
import { apiClient } from '../../services/apiClient';
import { LocalStorageEquipmentRepository } from '../localStorage/LocalStorageEquipmentRepository';

export class ApiEquipmentRepository implements IEquipmentRepository {
  private fallbackRepo = new LocalStorageEquipmentRepository();

  async getAll(): Promise<Equipment[]> {
    try {
      const data = await apiClient.get<Equipment[]>('/equipment');
      return data;
    } catch (err) {
      console.warn('[ApiEquipmentRepository] API connection error. Using local fallback repository:', err);
      return this.fallbackRepo.getAll();
    }
  }

  async getById(id: string): Promise<Equipment | undefined> {
    try {
      const item = await apiClient.get<Equipment>(`/equipment/${id}`);
      return item;
    } catch (err) {
      console.warn(`[ApiEquipmentRepository] Error fetching equipment '${id}' from API:`, err);
      return this.fallbackRepo.getById(id);
    }
  }

  async save(equipment: Equipment): Promise<Equipment> {
    try {
      const isExisting = Boolean(
        equipment.id &&
        !equipment.id.startsWith('temp-') &&
        !equipment.id.startsWith('new-') &&
        equipment.id.length > 5
      );

      if (isExisting) {
        // Update existing equipment record
        return await apiClient.put<Equipment>(`/equipment/${equipment.id}`, equipment);
      } else {
        // Create new equipment record (omit client-generated ID if temporary)
        const { id, ...createPayload } = equipment;
        return await apiClient.post<Equipment>('/equipment', createPayload);
      }
    } catch (err) {
      console.warn('[ApiEquipmentRepository] Error saving equipment via API. Falling back to local storage:', err);
      return this.fallbackRepo.save(equipment);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/equipment/${id}`);
      return true;
    } catch (err) {
      console.warn(`[ApiEquipmentRepository] Error deleting equipment '${id}' via API:`, err);
      return this.fallbackRepo.delete(id);
    }
  }
}
