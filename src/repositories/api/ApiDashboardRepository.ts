import { IDashboardRepository, DashboardSummary } from '../interfaces';
import { apiClient } from '../../services/apiClient';

export class ApiDashboardRepository implements IDashboardRepository {
  async getSummary(): Promise<DashboardSummary> {
    try {
      return await apiClient.get<DashboardSummary>('/dashboard/summary');
    } catch (err) {
      console.warn('[ApiDashboardRepository] Error fetching summary analytics:', err);
      return {
        properties: { total: 0, available: 0, underOffer: 0, sold: 0, archived: 0, byCategory: {} },
        projects: { total: 0, planning: 0, underConstruction: 0, completed: 0, byType: {}, averageProgress: 0 },
        equipment: { total: 0, available: 0, onRent: 0, maintenance: 0, inactive: 0, byCategory: {} },
        enquiries: { total: 0, new: 0, contacted: 0, inProgress: 0, closed: 0, byCategory: {} },
        users: { total: 0, active: 0, disabled: 0, admins: 0, staff: 0, customers: 0 },
        recentActivity: [],
      };
    }
  }
}
