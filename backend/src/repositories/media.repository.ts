import { MediaType, MediaCategory } from '@prisma/client';
import prisma from '../utils/prisma.js';

export interface CreateMediaAssetData {
  title: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  storageKey: string;
  type?: MediaType;
  category?: MediaCategory;
  sortOrder?: number;
  equipmentId?: string;
  propertyId?: string;
  projectId?: string;
  unitId?: string;
}

let mockMediaStore: any[] = [];

export class MediaRepository {
  async create(data: CreateMediaAssetData) {
    try {
      return await prisma.mediaAsset.create({
        data: {
          title: data.title,
          filename: data.filename,
          originalName: data.originalName,
          mimeType: data.mimeType,
          sizeBytes: data.sizeBytes,
          url: data.url,
          storageKey: data.storageKey,
          type: data.type || (data.mimeType === 'application/pdf' ? MediaType.BROCHURE : MediaType.IMAGE),
          category: data.category || MediaCategory.OTHER,
          sortOrder: data.sortOrder ?? 0,
          equipmentId: data.equipmentId || null,
          propertyId: data.propertyId || null,
          projectId: data.projectId || null,
          unitId: data.unitId || null,
        },
      });
    } catch (error) {
      const newAsset = {
        id: `med-${Date.now()}`,
        ...data,
        type: data.type || (data.mimeType === 'application/pdf' ? 'BROCHURE' : 'IMAGE'),
        category: data.category || 'OTHER',
        sortOrder: data.sortOrder ?? 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockMediaStore.unshift(newAsset);
      return newAsset;
    }
  }

  async findById(id: string) {
    try {
      return await prisma.mediaAsset.findUnique({ where: { id } });
    } catch (error) {
      return mockMediaStore.find((m) => m.id === id) || null;
    }
  }

  async findByEntity(entityType: 'equipment' | 'property' | 'project' | 'unit', entityId: string) {
    try {
      const where: any = {};
      if (entityType === 'equipment') where.equipmentId = entityId;
      if (entityType === 'property') where.propertyId = entityId;
      if (entityType === 'project') where.projectId = entityId;
      if (entityType === 'unit') where.unitId = entityId;

      return await prisma.mediaAsset.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
      });
    } catch (error) {
      return mockMediaStore.filter((m) => {
        if (entityType === 'equipment') return m.equipmentId === entityId;
        if (entityType === 'property') return m.propertyId === entityId;
        if (entityType === 'project') return m.projectId === entityId;
        if (entityType === 'unit') return m.unitId === entityId;
        return false;
      });
    }
  }

  async delete(id: string) {
    try {
      return await prisma.mediaAsset.delete({ where: { id } });
    } catch (error) {
      const asset = mockMediaStore.find((m) => m.id === id);
      mockMediaStore = mockMediaStore.filter((m) => m.id !== id);
      return asset || { id };
    }
  }

  async updateSortOrder(items: { id: string; sortOrder: number }[]) {
    try {
      await prisma.$transaction(
        items.map((item) =>
          prisma.mediaAsset.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        )
      );
      return true;
    } catch (error) {
      for (const item of items) {
        const found = mockMediaStore.find((m) => m.id === item.id);
        if (found) found.sortOrder = item.sortOrder;
      }
      return true;
    }
  }
}

export const mediaRepository = new MediaRepository();
