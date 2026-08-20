import { useState, useEffect, useCallback } from 'react';
import { Equipment } from '../types';
import { equipmentService } from '../services/equipmentService';

export function useEquipment() {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await equipmentService.getAll();
      setEquipmentList(data);
    } catch (err: any) {
      console.error('Failed to load equipment list from API:', err);
      setError(err.message || 'Failed to load equipment data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveEquipment = async (item: Equipment) => {
    const saved = await equipmentService.save(item);
    await refresh();
    return saved;
  };

  const deleteEquipment = async (id: string) => {
    const success = await equipmentService.delete(id);
    await refresh();
    return success;
  };

  return { equipmentList, loading, error, refresh, saveEquipment, deleteEquipment };
}
