import { ProjectListingStatus, UnitListingStatus } from '@prisma/client';
import prisma from '../utils/prisma.js';

export interface CreateProjectBlockData {
  name: string;
  description?: string;
}

export interface UpdateProjectBlockData {
  name?: string;
  description?: string;
}

export interface CreateProjectUnitData {
  id?: string;
  blockId?: string;
  unitNumber: string;
  unitType: string;
  floor: number;
  area: number;
  areaUnit?: string;
  bedrooms?: number;
  bathrooms?: number;
  balcony?: boolean;
  facing?: string;
  price: string;
  status?: UnitListingStatus;
  floorPlanImage?: string;
}

export interface UpdateProjectUnitData {
  blockId?: string;
  unitNumber?: string;
  unitType?: string;
  floor?: number;
  area?: number;
  areaUnit?: string;
  bedrooms?: number;
  bathrooms?: number;
  balcony?: boolean;
  facing?: string;
  price?: string;
  status?: UnitListingStatus;
  floorPlanImage?: string;
}

export interface CreateProjectData {
  id?: string;
  name: string;
  projectType: string;
  status?: ProjectListingStatus;
  location: string;
  description: string;
  mainImage?: string;
  galleryImages?: string[];
  brochureUrl?: string;
  amenities?: string[];
  progressPercentage?: number;
  totalUnits?: number;
  availableUnits?: number;
  bookedUnits?: number;
  soldUnits?: number;
  blocks?: CreateProjectBlockData[];
}

export interface UpdateProjectData {
  name?: string;
  projectType?: string;
  status?: ProjectListingStatus;
  location?: string;
  description?: string;
  mainImage?: string;
  galleryImages?: string[];
  brochureUrl?: string;
  amenities?: string[];
  progressPercentage?: number;
  totalUnits?: number;
  availableUnits?: number;
  bookedUnits?: number;
  soldUnits?: number;
}

// In-Memory store fallback if database connection is offline
let mockProjectStore: any[] = [];

export class ProjectRepository {
  async findAll() {
    try {
      return await prisma.constructionProject.findMany({
        include: {
          blocks: {
            include: {
              units: true,
            },
          },
          units: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.warn('[ProjectRepository] Database connection error. Serving in-memory fallback store.');
      return mockProjectStore;
    }
  }

  async findById(id: string) {
    try {
      return await prisma.constructionProject.findUnique({
        where: { id },
        include: {
          blocks: {
            include: {
              units: true,
            },
          },
          units: true,
        },
      });
    } catch (error) {
      return mockProjectStore.find((item) => item.id === id) || null;
    }
  }

  async create(data: CreateProjectData) {
    try {
      return await prisma.constructionProject.create({
        data: {
          ...(data.id && { id: data.id }),
          name: data.name,
          projectType: data.projectType,
          status: data.status || ProjectListingStatus.UNDER_CONSTRUCTION,
          location: data.location,
          description: data.description,
          mainImage: data.mainImage || null,
          galleryImages: data.galleryImages || [],
          brochureUrl: data.brochureUrl || null,
          amenities: data.amenities || [],
          progressPercentage: data.progressPercentage ?? 0,
          totalUnits: data.totalUnits ?? 0,
          availableUnits: data.availableUnits ?? 0,
          bookedUnits: data.bookedUnits ?? 0,
          soldUnits: data.soldUnits ?? 0,
          ...(data.blocks && data.blocks.length > 0 && {
            blocks: {
              create: data.blocks.map((b) => ({
                name: b.name,
                description: b.description || null,
              })),
            },
          }),
        },
        include: {
          blocks: true,
          units: true,
        },
      });
    } catch (error) {
      const newItem: any = {
        id: data.id || `proj-${Date.now()}`,
        ...data,
        status: data.status || ProjectListingStatus.UNDER_CONSTRUCTION,
        galleryImages: data.galleryImages || [],
        amenities: data.amenities || [],
        progressPercentage: data.progressPercentage ?? 0,
        totalUnits: data.totalUnits ?? 0,
        availableUnits: data.availableUnits ?? 0,
        bookedUnits: data.bookedUnits ?? 0,
        soldUnits: data.soldUnits ?? 0,
        blocks: (data.blocks || []).map((b, idx) => ({ id: `blk-${idx}`, projectId: data.id || 'proj-temp', name: b.name, description: b.description })),
        units: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockProjectStore.unshift(newItem);
      return newItem;
    }
  }

  async update(id: string, data: UpdateProjectData) {
    try {
      return await prisma.constructionProject.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.projectType && { projectType: data.projectType }),
          ...(data.status && { status: data.status }),
          ...(data.location && { location: data.location }),
          ...(data.description && { description: data.description }),
          ...(data.mainImage !== undefined && { mainImage: data.mainImage }),
          ...(data.galleryImages !== undefined && { galleryImages: data.galleryImages }),
          ...(data.brochureUrl !== undefined && { brochureUrl: data.brochureUrl }),
          ...(data.amenities !== undefined && { amenities: data.amenities }),
          ...(data.progressPercentage !== undefined && { progressPercentage: data.progressPercentage }),
          ...(data.totalUnits !== undefined && { totalUnits: data.totalUnits }),
          ...(data.availableUnits !== undefined && { availableUnits: data.availableUnits }),
          ...(data.bookedUnits !== undefined && { bookedUnits: data.bookedUnits }),
          ...(data.soldUnits !== undefined && { soldUnits: data.soldUnits }),
        },
        include: {
          blocks: true,
          units: true,
        },
      });
    } catch (error) {
      const index = mockProjectStore.findIndex((item) => item.id === id);
      if (index >= 0) {
        mockProjectStore[index] = {
          ...mockProjectStore[index],
          ...data,
          updatedAt: new Date(),
        };
        return mockProjectStore[index];
      }
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return await prisma.constructionProject.delete({
        where: { id },
      });
    } catch (error) {
      mockProjectStore = mockProjectStore.filter((item) => item.id !== id);
      return { id };
    }
  }

  // --- PROJECT BLOCK METHODS ---

  async findBlockById(blockId: string) {
    try {
      return await prisma.projectBlock.findUnique({
        where: { id: blockId },
        include: { units: true },
      });
    } catch (error) {
      for (const p of mockProjectStore) {
        const b = p.blocks?.find((blk: any) => blk.id === blockId);
        if (b) return b;
      }
      return null;
    }
  }

  async createBlock(projectId: string, data: CreateProjectBlockData) {
    try {
      return await prisma.projectBlock.create({
        data: {
          projectId,
          name: data.name,
          description: data.description || null,
        },
        include: { units: true },
      });
    } catch (error) {
      const proj = mockProjectStore.find((p) => p.id === projectId);
      const newBlock = {
        id: `blk-${Date.now()}`,
        projectId,
        name: data.name,
        description: data.description || null,
        units: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      if (proj) {
        proj.blocks = proj.blocks || [];
        proj.blocks.push(newBlock);
      }
      return newBlock;
    }
  }

  async updateBlock(blockId: string, data: UpdateProjectBlockData) {
    try {
      return await prisma.projectBlock.update({
        where: { id: blockId },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.description !== undefined && { description: data.description }),
        },
        include: { units: true },
      });
    } catch (error) {
      for (const p of mockProjectStore) {
        const b = p.blocks?.find((blk: any) => blk.id === blockId);
        if (b) {
          if (data.name) b.name = data.name;
          if (data.description !== undefined) b.description = data.description;
          return b;
        }
      }
      throw error;
    }
  }

  async deleteBlock(blockId: string) {
    try {
      const deleted = await prisma.projectBlock.delete({
        where: { id: blockId },
      });
      await this.recalculateProjectStats(deleted.projectId);
      return deleted;
    } catch (error) {
      for (const p of mockProjectStore) {
        if (p.blocks) {
          p.blocks = p.blocks.filter((b: any) => b.id !== blockId);
        }
      }
      return { id: blockId };
    }
  }

  // --- PROJECT UNIT / FLAT METHODS ---

  async findUnitById(unitId: string) {
    try {
      return await prisma.projectUnit.findUnique({
        where: { id: unitId },
        include: { block: true },
      });
    } catch (error) {
      for (const p of mockProjectStore) {
        const u = p.units?.find((unit: any) => unit.id === unitId);
        if (u) return u;
      }
      return null;
    }
  }

  async createUnit(projectId: string, data: CreateProjectUnitData) {
    try {
      const unit = await prisma.projectUnit.create({
        data: {
          ...(data.id && { id: data.id }),
          projectId,
          blockId: data.blockId || null,
          unitNumber: data.unitNumber,
          unitType: data.unitType,
          floor: Number(data.floor),
          area: Number(data.area),
          areaUnit: data.areaUnit || 'sq.ft',
          bedrooms: data.bedrooms ?? null,
          bathrooms: data.bathrooms ?? null,
          balcony: data.balcony ?? null,
          facing: data.facing || null,
          price: String(data.price),
          status: data.status || UnitListingStatus.AVAILABLE,
          floorPlanImage: data.floorPlanImage || null,
        },
      });
      await this.recalculateProjectStats(projectId);
      return unit;
    } catch (error) {
      const proj = mockProjectStore.find((p) => p.id === projectId);
      const newUnit = {
        id: data.id || `unit-${Date.now()}`,
        projectId,
        blockId: data.blockId || null,
        unitNumber: data.unitNumber,
        unitType: data.unitType,
        floor: Number(data.floor),
        area: Number(data.area),
        areaUnit: data.areaUnit || 'sq.ft',
        bedrooms: data.bedrooms ?? null,
        bathrooms: data.bathrooms ?? null,
        balcony: data.balcony ?? null,
        facing: data.facing || null,
        price: String(data.price),
        status: data.status || UnitListingStatus.AVAILABLE,
        floorPlanImage: data.floorPlanImage || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      if (proj) {
        proj.units = proj.units || [];
        proj.units.push(newUnit);
        await this.recalculateProjectStats(projectId);
      }
      return newUnit;
    }
  }

  async batchCreateUnits(projectId: string, unitsData: CreateProjectUnitData[]) {
    try {
      const createdUnits = await prisma.$transaction(async (tx) => {
        const results = [];
        for (const data of unitsData) {
          const u = await tx.projectUnit.create({
            data: {
              ...(data.id && { id: data.id }),
              projectId,
              blockId: data.blockId || null,
              unitNumber: data.unitNumber,
              unitType: data.unitType,
              floor: Number(data.floor),
              area: Number(data.area),
              areaUnit: data.areaUnit || 'sq.ft',
              bedrooms: data.bedrooms ?? null,
              bathrooms: data.bathrooms ?? null,
              balcony: data.balcony ?? null,
              facing: data.facing || null,
              price: String(data.price),
              status: data.status || UnitListingStatus.AVAILABLE,
              floorPlanImage: data.floorPlanImage || null,
            },
          });
          results.push(u);
        }
        return results;
      });

      await this.recalculateProjectStats(projectId);
      return createdUnits;
    } catch (error) {
      const created = [];
      for (const data of unitsData) {
        const u = await this.createUnit(projectId, data);
        created.push(u);
      }
      return created;
    }
  }

  async updateUnit(unitId: string, data: UpdateProjectUnitData) {
    try {
      const updated = await prisma.projectUnit.update({
        where: { id: unitId },
        data: {
          ...(data.blockId !== undefined && { blockId: data.blockId }),
          ...(data.unitNumber && { unitNumber: data.unitNumber }),
          ...(data.unitType && { unitType: data.unitType }),
          ...(data.floor !== undefined && { floor: Number(data.floor) }),
          ...(data.area !== undefined && { area: Number(data.area) }),
          ...(data.areaUnit && { areaUnit: data.areaUnit }),
          ...(data.bedrooms !== undefined && { bedrooms: data.bedrooms }),
          ...(data.bathrooms !== undefined && { bathrooms: data.bathrooms }),
          ...(data.balcony !== undefined && { balcony: data.balcony }),
          ...(data.facing !== undefined && { facing: data.facing }),
          ...(data.price && { price: String(data.price) }),
          ...(data.status && { status: data.status }),
          ...(data.floorPlanImage !== undefined && { floorPlanImage: data.floorPlanImage }),
        },
      });
      await this.recalculateProjectStats(updated.projectId);
      return updated;
    } catch (error) {
      for (const p of mockProjectStore) {
        const u = p.units?.find((unit: any) => unit.id === unitId);
        if (u) {
          Object.assign(u, data);
          await this.recalculateProjectStats(p.id);
          return u;
        }
      }
      throw error;
    }
  }

  async deleteUnit(unitId: string) {
    try {
      const deleted = await prisma.projectUnit.delete({
        where: { id: unitId },
      });
      await this.recalculateProjectStats(deleted.projectId);
      return deleted;
    } catch (error) {
      for (const p of mockProjectStore) {
        if (p.units) {
          const originalLength = p.units.length;
          p.units = p.units.filter((u: any) => u.id !== unitId);
          if (p.units.length !== originalLength) {
            await this.recalculateProjectStats(p.id);
          }
        }
      }
      return { id: unitId };
    }
  }

  // --- AUTOMATIC PROJECT UNIT STAT RECALCULATION ---

  async recalculateProjectStats(projectId: string) {
    try {
      const [total, available, booked, sold] = await Promise.all([
        prisma.projectUnit.count({ where: { projectId } }),
        prisma.projectUnit.count({ where: { projectId, status: UnitListingStatus.AVAILABLE } }),
        prisma.projectUnit.count({ where: { projectId, status: UnitListingStatus.BOOKED } }),
        prisma.projectUnit.count({ where: { projectId, status: UnitListingStatus.SOLD } }),
      ]);

      await prisma.constructionProject.update({
        where: { id: projectId },
        data: {
          totalUnits: total,
          availableUnits: available,
          bookedUnits: booked,
          soldUnits: sold,
        },
      });
    } catch (error) {
      const proj = mockProjectStore.find((p) => p.id === projectId);
      if (proj && proj.units) {
        proj.totalUnits = proj.units.length;
        proj.availableUnits = proj.units.filter((u: any) => u.status === 'AVAILABLE').length;
        proj.bookedUnits = proj.units.filter((u: any) => u.status === 'BOOKED').length;
        proj.soldUnits = proj.units.filter((u: any) => u.status === 'SOLD').length;
      }
    }
  }
}

export const projectRepository = new ProjectRepository();
