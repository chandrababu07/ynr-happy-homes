import prisma from '../utils/prisma.js';
import { equipmentRepository } from './equipment.repository.js';
import { propertyRepository } from './property.repository.js';
import { projectRepository } from './project.repository.js';
import { enquiryRepository } from './enquiry.repository.js';
import { userRepository } from './user.repository.js';

export class DashboardRepository {
  async getSummaryData() {
    try {
      // 1. Property Counts & Breakdowns
      const [
        totalProperties,
        availableProperties,
        underOfferProperties,
        soldProperties,
        archivedProperties,
        propertiesByCategoryRaw,
        recentProperties,
      ] = await Promise.all([
        prisma.property.count(),
        prisma.property.count({ where: { status: 'AVAILABLE' } }),
        prisma.property.count({ where: { status: 'UNDER_OFFER' } }),
        prisma.property.count({ where: { status: 'SOLD' } }),
        prisma.property.count({ where: { status: 'ARCHIVED' } }),
        prisma.property.groupBy({
          by: ['category'],
          _count: { category: true },
        }),
        prisma.property.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, title: true, category: true, createdAt: true },
        }),
      ]);

      const propertiesByCategory: Record<string, number> = {};
      propertiesByCategoryRaw.forEach((item) => {
        propertiesByCategory[item.category] = item._count.category;
      });

      // 2. Project Counts & Breakdowns
      const [
        totalProjects,
        planningProjects,
        underConstructionProjects,
        completedProjects,
        projectsByTypeRaw,
        progressAggregate,
        recentProjects,
      ] = await Promise.all([
        prisma.constructionProject.count(),
        prisma.constructionProject.count({ where: { status: 'PLANNING' } }),
        prisma.constructionProject.count({ where: { status: 'UNDER_CONSTRUCTION' } }),
        prisma.constructionProject.count({ where: { status: 'COMPLETED' } }),
        prisma.constructionProject.groupBy({
          by: ['projectType'],
          _count: { projectType: true },
        }),
        prisma.constructionProject.aggregate({
          _avg: { progressPercentage: true },
        }),
        prisma.constructionProject.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, projectType: true, createdAt: true },
        }),
      ]);

      const projectsByType: Record<string, number> = {};
      projectsByTypeRaw.forEach((item) => {
        projectsByType[item.projectType] = item._count.projectType;
      });

      // 3. Equipment Counts & Breakdowns
      const [
        totalEquipment,
        availableEquipment,
        onRentEquipment,
        maintenanceEquipment,
        inactiveEquipment,
        equipmentByCategoryRaw,
        recentEquipment,
      ] = await Promise.all([
        prisma.equipment.count(),
        prisma.equipment.count({ where: { availabilityStatus: 'AVAILABLE' } }),
        prisma.equipment.count({ where: { availabilityStatus: 'ON_RENT' } }),
        prisma.equipment.count({ where: { availabilityStatus: 'MAINTENANCE' } }),
        prisma.equipment.count({ where: { availabilityStatus: 'INACTIVE' } }),
        prisma.equipment.groupBy({
          by: ['category'],
          _count: { category: true },
        }),
        prisma.equipment.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, category: true, createdAt: true },
        }),
      ]);

      const equipmentByCategory: Record<string, number> = {};
      equipmentByCategoryRaw.forEach((item) => {
        equipmentByCategory[item.category] = item._count.category;
      });

      // 4. Enquiry Counts & Breakdowns
      const [
        totalEnquiries,
        newEnquiries,
        contactedEnquiries,
        inProgressEnquiries,
        closedEnquiries,
        enquiriesByCategoryRaw,
        recentEnquiries,
      ] = await Promise.all([
        prisma.enquiry.count(),
        prisma.enquiry.count({ where: { status: 'NEW' } }),
        prisma.enquiry.count({ where: { status: 'CONTACTED' } }),
        prisma.enquiry.count({ where: { status: 'IN_PROGRESS' } }),
        prisma.enquiry.count({ where: { status: 'CLOSED' } }),
        prisma.enquiry.groupBy({
          by: ['category'],
          _count: { category: true },
        }),
        prisma.enquiry.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, customerName: true, category: true, status: true, createdAt: true },
        }),
      ]);

      const enquiriesByCategory: Record<string, number> = {};
      enquiriesByCategoryRaw.forEach((item) => {
        enquiriesByCategory[item.category] = item._count.category;
      });

      // 5. User Counts & Breakdowns
      const [
        totalUsers,
        activeUsers,
        disabledUsers,
        adminUsers,
        staffUsers,
        customerUsers,
        recentUsers,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } as any }),
        prisma.user.count({ where: { isActive: false } as any }),
        prisma.user.count({ where: { role: 'ADMIN' } }),
        prisma.user.count({ where: { role: 'STAFF' } }),
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, role: true, createdAt: true },
        }),
      ]);

      return {
        properties: {
          total: totalProperties,
          available: availableProperties,
          underOffer: underOfferProperties,
          sold: soldProperties,
          archived: archivedProperties,
          byCategory: propertiesByCategory,
        },
        projects: {
          total: totalProjects,
          planning: planningProjects,
          underConstruction: underConstructionProjects,
          completed: completedProjects,
          byType: projectsByType,
          averageProgress: Math.round(progressAggregate._avg.progressPercentage || 0),
        },
        equipment: {
          total: totalEquipment,
          available: availableEquipment,
          onRent: onRentEquipment,
          maintenance: maintenanceEquipment,
          inactive: inactiveEquipment,
          byCategory: equipmentByCategory,
        },
        enquiries: {
          total: totalEnquiries,
          new: newEnquiries,
          contacted: contactedEnquiries,
          inProgress: inProgressEnquiries,
          closed: closedEnquiries,
          byCategory: enquiriesByCategory,
        },
        users: {
          total: totalUsers,
          active: activeUsers,
          disabled: disabledUsers,
          admins: adminUsers,
          staff: staffUsers,
          customers: customerUsers,
        },
        recentItems: {
          properties: recentProperties,
          projects: recentProjects,
          equipment: recentEquipment,
          enquiries: recentEnquiries,
          users: recentUsers,
        },
      };
    } catch (error) {
      console.warn('[DashboardRepository] Database connection error. Calculating summary from fallback stores.');

      const [propertiesData, projects, equipmentList, enquiries, users] = await Promise.all([
        propertyRepository.findAll(),
        projectRepository.findAll(),
        equipmentRepository.findAll(),
        enquiryRepository.findAll(),
        userRepository.findAll(),
      ]);

      const properties = Array.isArray(propertiesData) ? propertiesData : (propertiesData as any).items || [];

      return {
        properties: {
          total: properties.length,
          available: properties.filter((p: any) => p.status === 'AVAILABLE').length,
          underOffer: properties.filter((p: any) => p.status === 'UNDER_OFFER').length,
          sold: properties.filter((p: any) => p.status === 'SOLD').length,
          archived: properties.filter((p: any) => p.status === 'ARCHIVED').length,
          byCategory: properties.reduce((acc: any, p: any) => {
            acc[p.category] = (acc[p.category] || 0) + 1;
            return acc;
          }, {}),
        },
        projects: {
          total: projects.length,
          planning: projects.filter((p: any) => p.status === 'PLANNING').length,
          underConstruction: projects.filter((p: any) => p.status === 'UNDER_CONSTRUCTION').length,
          completed: projects.filter((p: any) => p.status === 'COMPLETED').length,
          byType: projects.reduce((acc: any, p: any) => {
            acc[p.projectType] = (acc[p.projectType] || 0) + 1;
            return acc;
          }, {}),
          averageProgress: projects.length
            ? Math.round(projects.reduce((sum: number, p: any) => sum + (p.progressPercentage || 0), 0) / projects.length)
            : 0,
        },
        equipment: {
          total: equipmentList.length,
          available: equipmentList.filter((e: any) => e.availabilityStatus === 'AVAILABLE').length,
          onRent: equipmentList.filter((e: any) => e.availabilityStatus === 'ON_RENT').length,
          maintenance: equipmentList.filter((e: any) => e.availabilityStatus === 'MAINTENANCE').length,
          inactive: equipmentList.filter((e: any) => e.availabilityStatus === 'INACTIVE').length,
          byCategory: equipmentList.reduce((acc: any, e: any) => {
            acc[e.category] = (acc[e.category] || 0) + 1;
            return acc;
          }, {}),
        },
        enquiries: {
          total: enquiries.length,
          new: enquiries.filter((e: any) => e.status === 'NEW').length,
          contacted: enquiries.filter((e: any) => e.status === 'CONTACTED').length,
          inProgress: enquiries.filter((e: any) => e.status === 'IN_PROGRESS').length,
          closed: enquiries.filter((e: any) => e.status === 'CLOSED').length,
          byCategory: enquiries.reduce((acc: any, e: any) => {
            acc[e.category] = (acc[e.category] || 0) + 1;
            return acc;
          }, {}),
        },
        users: {
          total: users.length,
          active: users.filter((u: any) => u.isActive !== false).length,
          disabled: users.filter((u: any) => u.isActive === false).length,
          admins: users.filter((u: any) => u.role?.toUpperCase() === 'ADMIN').length,
          staff: users.filter((u: any) => u.role?.toUpperCase() === 'STAFF').length,
          customers: users.filter((u: any) => u.role?.toUpperCase() === 'CUSTOMER').length,
        },
        recentItems: {
          properties: properties.slice(0, 5),
          projects: projects.slice(0, 5),
          equipment: equipmentList.slice(0, 5),
          enquiries: enquiries.slice(0, 5),
          users: users.slice(0, 5),
        },
      };
    }
  }
}

export const dashboardRepository = new DashboardRepository();
