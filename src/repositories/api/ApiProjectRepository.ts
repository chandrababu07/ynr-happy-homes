import { IProjectRepository } from '../interfaces';
import { ConstructionProject, ProjectBlock, ProjectUnit } from '../../types';
import { apiClient } from '../../services/apiClient';
import { LocalStorageProjectRepository } from '../localStorage/LocalStorageProjectRepository';

function toFrontendProject(item: any): ConstructionProject {
  return {
    id: item.id,
    name: item.name,
    projectType: item.projectType || 'Apartments',
    status: item.status || 'UNDER_CONSTRUCTION',
    location: item.location || 'Mangalagiri, AP',
    description: item.description || '',
    mainImage: item.mainImage || null,
    galleryImages: Array.isArray(item.galleryImages) ? item.galleryImages : [],
    brochureUrl: item.brochureUrl || null,
    floorPlans: item.floorPlans || [],
    amenities: Array.isArray(item.amenities) ? item.amenities : [],
    progressPercentage: item.progressPercentage ?? 0,
    totalUnits: item.totalUnits ?? 0,
    availableUnits: item.availableUnits ?? 0,
    bookedUnits: item.bookedUnits ?? 0,
    soldUnits: item.soldUnits ?? 0,
    blocks: Array.isArray(item.blocks) ? item.blocks : [],
    units: Array.isArray(item.units) ? item.units : [],
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  };
}

function toBackendProject(p: ConstructionProject): any {
  return {
    ...(p.id && { id: p.id }),
    name: p.name,
    projectType: p.projectType || 'Apartments',
    status: p.status || 'UNDER_CONSTRUCTION',
    location: p.location || 'Mangalagiri, AP',
    description: p.description || '',
    mainImage: p.mainImage || null,
    galleryImages: p.galleryImages || [],
    brochureUrl: p.brochureUrl || null,
    amenities: p.amenities || [],
    progressPercentage: Number(p.progressPercentage) || 0,
    totalUnits: Number(p.totalUnits) || 0,
    availableUnits: Number(p.availableUnits) || 0,
    bookedUnits: Number(p.bookedUnits) || 0,
    soldUnits: Number(p.soldUnits) || 0,
  };
}

export class ApiProjectRepository implements IProjectRepository {
  private fallbackRepo = new LocalStorageProjectRepository();

  async getAll(): Promise<ConstructionProject[]> {
    try {
      const data = await apiClient.get<any[]>('/projects');
      return data.map(toFrontendProject);
    } catch (err) {
      console.warn('[ApiProjectRepository] API connection error. Using local fallback repository:', err);
      return this.fallbackRepo.getAll();
    }
  }

  async getById(id: string): Promise<ConstructionProject | undefined> {
    try {
      const item = await apiClient.get<any>(`/projects/${id}`);
      return item ? toFrontendProject(item) : undefined;
    } catch (err) {
      console.warn(`[ApiProjectRepository] Error fetching project '${id}' from API:`, err);
      return this.fallbackRepo.getById(id);
    }
  }

  async save(project: ConstructionProject): Promise<ConstructionProject> {
    try {
      const isExisting = Boolean(
        project.id &&
        !project.id.startsWith('proj-temp-') &&
        !project.id.startsWith('temp-') &&
        !project.id.startsWith('new-') &&
        project.id.length > 5
      );

      const payload = toBackendProject(project);

      if (isExisting) {
        const updated = await apiClient.put<any>(`/projects/${project.id}`, payload);
        return toFrontendProject(updated);
      } else {
        const { id, ...createPayload } = payload;
        const created = await apiClient.post<any>('/projects', createPayload);
        return toFrontendProject(created);
      }
    } catch (err) {
      console.warn('[ApiProjectRepository] Error saving project via API. Falling back to local storage:', err);
      return this.fallbackRepo.save(project);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/projects/${id}`);
      return true;
    } catch (err) {
      console.warn(`[ApiProjectRepository] Error deleting project '${id}' via API:`, err);
      return this.fallbackRepo.delete(id);
    }
  }

  // --- BLOCK MANAGEMENT ---

  async saveBlock(projectId: string, block: { id?: string; name: string; description?: string }): Promise<ProjectBlock> {
    try {
      if (block.id && !block.id.startsWith('blk-temp-')) {
        return await apiClient.put<ProjectBlock>(`/projects/${projectId}/blocks/${block.id}`, block);
      } else {
        const { id, ...createPayload } = block;
        return await apiClient.post<ProjectBlock>(`/projects/${projectId}/blocks`, createPayload);
      }
    } catch (err) {
      console.warn('[ApiProjectRepository] Error saving block via API. Falling back to local storage:', err);
      return this.fallbackRepo.saveBlock(projectId, block);
    }
  }

  async deleteBlock(projectId: string, blockId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/projects/${projectId}/blocks/${blockId}`);
      return true;
    } catch (err) {
      console.warn(`[ApiProjectRepository] Error deleting block '${blockId}' via API:`, err);
      return this.fallbackRepo.deleteBlock(projectId, blockId);
    }
  }

  // --- UNIT MANAGEMENT ---

  async getUnits(projectId?: string): Promise<ProjectUnit[]> {
    if (!projectId) return [];
    try {
      const proj = await this.getById(projectId);
      return proj?.units || [];
    } catch (err) {
      return this.fallbackRepo.getUnits(projectId);
    }
  }

  async saveUnit(projectId: string, unit: Partial<ProjectUnit>): Promise<ProjectUnit> {
    try {
      if (unit.id && !unit.id.startsWith('unit-temp-')) {
        return await apiClient.put<ProjectUnit>(`/projects/${projectId}/units/${unit.id}`, unit);
      } else {
        const { id, ...createPayload } = unit;
        return await apiClient.post<ProjectUnit>(`/projects/${projectId}/units`, createPayload);
      }
    } catch (err) {
      console.warn('[ApiProjectRepository] Error saving unit via API. Falling back to local storage:', err);
      return this.fallbackRepo.saveUnit(projectId, unit);
    }
  }

  async batchCreateUnits(projectId: string, units: Partial<ProjectUnit>[]): Promise<ProjectUnit[]> {
    try {
      return await apiClient.post<ProjectUnit[]>(`/projects/${projectId}/units/batch`, units);
    } catch (err) {
      console.warn('[ApiProjectRepository] Error batch creating units via API. Falling back to local storage:', err);
      return this.fallbackRepo.batchCreateUnits(projectId, units);
    }
  }

  async deleteUnit(projectId: string, unitId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/projects/${projectId}/units/${unitId}`);
      return true;
    } catch (err) {
      console.warn(`[ApiProjectRepository] Error deleting unit '${unitId}' via API:`, err);
      return this.fallbackRepo.deleteUnit(projectId, unitId);
    }
  }
}
