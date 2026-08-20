import { IProjectRepository } from '../interfaces';
import { ConstructionProject, ProjectBlock, ProjectUnit } from '../../types';
import { storageService } from '../../services/storage';

export class LocalStorageProjectRepository implements IProjectRepository {
  async getAll(): Promise<ConstructionProject[]> {
    return storageService.getProjects();
  }

  async getById(id: string): Promise<ConstructionProject | undefined> {
    return storageService.getProjectById(id);
  }

  async save(project: ConstructionProject): Promise<ConstructionProject> {
    return storageService.saveProject(project);
  }

  async delete(id: string): Promise<boolean> {
    return storageService.deleteProject(id);
  }

  async saveBlock(projectId: string, block: { id?: string; name: string; description?: string }): Promise<ProjectBlock> {
    const projects = storageService.getProjects();
    const proj = projects.find((p) => p.id === projectId);
    const newBlock: ProjectBlock = {
      id: block.id || `blk-${Date.now()}`,
      projectId,
      name: block.name,
      description: block.description || undefined,
    };
    if (proj) {
      proj.blocks = proj.blocks || [];
      const idx = proj.blocks.findIndex((b) => b.id === newBlock.id);
      if (idx >= 0) {
        proj.blocks[idx] = newBlock;
      } else {
        proj.blocks.push(newBlock);
      }
      storageService.saveProject(proj);
    }
    return newBlock;
  }

  async deleteBlock(projectId: string, blockId: string): Promise<boolean> {
    const projects = storageService.getProjects();
    const proj = projects.find((p) => p.id === projectId);
    if (proj && proj.blocks) {
      proj.blocks = proj.blocks.filter((b) => b.id !== blockId);
      storageService.saveProject(proj);
    }
    return true;
  }

  async getUnits(projectId?: string): Promise<ProjectUnit[]> {
    return storageService.getUnits(projectId);
  }

  async saveUnit(projectId: string, unit: Partial<ProjectUnit>): Promise<ProjectUnit> {
    const fullUnit: ProjectUnit = {
      id: unit.id || `unit-${Date.now()}`,
      projectId: projectId,
      blockId: unit.blockId || undefined,
      unitNumber: unit.unitNumber || '101',
      unitType: unit.unitType || '2BHK',
      floor: unit.floor || 1,
      area: unit.area || 1200,
      bedrooms: unit.bedrooms || 2,
      bathrooms: unit.bathrooms || 2,
      facing: unit.facing || 'East',
      price: unit.price || '₹45,00,000',
      status: unit.status || 'AVAILABLE',
    };
    return storageService.saveUnit(fullUnit);
  }

  async batchCreateUnits(projectId: string, units: Partial<ProjectUnit>[]): Promise<ProjectUnit[]> {
    const created: ProjectUnit[] = [];
    for (const u of units) {
      const saved = await this.saveUnit(projectId, u);
      created.push(saved);
    }
    return created;
  }

  async deleteUnit(_projectId: string, unitId: string): Promise<boolean> {
    return storageService.deleteUnit(unitId);
  }
}
