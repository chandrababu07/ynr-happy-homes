import { useState, useEffect, useCallback } from 'react';
import { DashboardSummary } from '../repositories/interfaces';
import { dashboardRepository } from '../repositories';

const defaultSummary: DashboardSummary = {
  properties: { total: 0, available: 0, underOffer: 0, sold: 0, archived: 0, byCategory: {} },
  projects: { total: 0, planning: 0, underConstruction: 0, completed: 0, byType: {}, averageProgress: 0 },
  equipment: { total: 0, available: 0, onRent: 0, maintenance: 0, inactive: 0, byCategory: {} },
  enquiries: { total: 0, new: 0, contacted: 0, inProgress: 0, closed: 0, byCategory: {} },
  users: { total: 0, active: 0, disabled: 0, admins: 0, staff: 0, customers: 0 },
  recentActivity: [],
};

export function useDashboard() {
  const [summary, setSummary] = useState<DashboardSummary>(defaultSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardRepository.getSummary();
      setSummary(data);
    } catch (err: any) {
      console.error('Failed to load dashboard summary analytics:', err);
      setError(err.message || 'Failed to load dashboard analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { summary, loading, error, refresh };
}
