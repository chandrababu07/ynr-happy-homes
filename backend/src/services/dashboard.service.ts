import { dashboardRepository } from '../repositories/dashboard.repository.js';

export interface ActivityItem {
  id: string;
  type: 'ENQUIRY' | 'PROPERTY' | 'PROJECT' | 'EQUIPMENT' | 'USER';
  title: string;
  subtitle: string;
  timestamp: string;
  badge: string;
}

export class DashboardService {
  async getSummary() {
    const rawData = await dashboardRepository.getSummaryData();

    // Construct unified Recent Activity Feed sorted chronologically
    const activityFeed: ActivityItem[] = [];

    (rawData.recentItems.enquiries || []).forEach((e: any) => {
      activityFeed.push({
        id: `act-enq-${e.id}`,
        type: 'ENQUIRY',
        title: `Customer Lead: ${e.customerName}`,
        subtitle: `Category: ${e.category} | Status: ${e.status}`,
        timestamp: e.createdAt ? new Date(e.createdAt).toISOString() : new Date().toISOString(),
        badge: e.status,
      });
    });

    (rawData.recentItems.properties || []).forEach((p: any) => {
      activityFeed.push({
        id: `act-prop-${p.id}`,
        type: 'PROPERTY',
        title: `Real Estate Listed: ${p.title}`,
        subtitle: `Category: ${p.category}`,
        timestamp: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
        badge: 'LISTED',
      });
    });

    (rawData.recentItems.projects || []).forEach((proj: any) => {
      activityFeed.push({
        id: `act-proj-${proj.id}`,
        type: 'PROJECT',
        title: `Construction Project: ${proj.name}`,
        subtitle: `Type: ${proj.projectType}`,
        timestamp: proj.createdAt ? new Date(proj.createdAt).toISOString() : new Date().toISOString(),
        badge: 'PROJECT',
      });
    });

    (rawData.recentItems.equipment || []).forEach((eq: any) => {
      activityFeed.push({
        id: `act-eq-${eq.id}`,
        type: 'EQUIPMENT',
        title: `Fleet Machinery: ${eq.name}`,
        subtitle: `Category: ${eq.category}`,
        timestamp: eq.createdAt ? new Date(eq.createdAt).toISOString() : new Date().toISOString(),
        badge: 'FLEET',
      });
    });

    (rawData.recentItems.users || []).forEach((u: any) => {
      activityFeed.push({
        id: `act-usr-${u.id}`,
        type: 'USER',
        title: `User Account: ${u.name}`,
        subtitle: `Role: ${u.role}`,
        timestamp: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
        badge: u.role,
      });
    });

    // Sort descending by timestamp and take top 10
    activityFeed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const topRecentActivity = activityFeed.slice(0, 10);

    return {
      properties: rawData.properties,
      projects: rawData.projects,
      equipment: rawData.equipment,
      enquiries: rawData.enquiries,
      users: rawData.users,
      recentActivity: topRecentActivity,
    };
  }
}

export const dashboardService = new DashboardService();
