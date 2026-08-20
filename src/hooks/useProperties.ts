import { useState, useEffect, useCallback } from 'react';
import { Property } from '../types';
import { propertyService } from '../services/propertyService';
import { PropertyQueryFilters } from '../repositories/interfaces';

export function useProperties(initialFilters?: PropertyQueryFilters) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialFilters?.page || 1);
  const [limit, setLimit] = useState(initialFilters?.limit || 12);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (filters?: PropertyQueryFilters) => {
    setLoading(true);
    setError(null);
    try {
      const result = await propertyService.getAll(filters);
      setProperties(result.items);
      setTotal(result.total);
      setPage(result.page);
      setLimit(result.limit);
      setTotalPages(result.totalPages);
    } catch (err: any) {
      console.error('Failed to load property listings from API:', err);
      setError(err.message || 'Failed to load property data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh(initialFilters);
  }, [refresh, JSON.stringify(initialFilters)]);

  const saveProperty = async (property: Property) => {
    const saved = await propertyService.save(property);
    await refresh(initialFilters);
    return saved;
  };

  const deleteProperty = async (id: string) => {
    const success = await propertyService.delete(id);
    await refresh(initialFilters);
    return success;
  };

  return { properties, total, page, limit, totalPages, loading, error, refresh, saveProperty, deleteProperty };
}
