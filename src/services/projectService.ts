import { projectRepository } from '../repositories';
import { ConstructionProject, ProjectBlock, ProjectUnit } from '../types';

export const projectService = {
  async getAll(): Promise<ConstructionProject[]> {
    return projectRepository.getAll();
  },

  async getById(id: string): Promise<ConstructionProject | undefined> {
    return projectRepository.getById(id);
  },

  async save(project: ConstructionProject): Promise<ConstructionProject> {
    return projectRepository.save(project);
  },

  async delete(id: string): Promise<boolean> {
    return projectRepository.delete(id);
  },

  async saveBlock(projectId: string, block: { id?: string; name: string; description?: string }): Promise<ProjectBlock> {
    return projectRepository.saveBlock(projectId, block);
  },

  async deleteBlock(projectId: string, blockId: string): Promise<boolean> {
    return projectRepository.deleteBlock(projectId, blockId);
  },

  async getUnits(projectId?: string): Promise<ProjectUnit[]> {
    return projectRepository.getUnits(projectId);
  },

  async saveUnit(projectId: string, unit: Partial<ProjectUnit>): Promise<ProjectUnit> {
    return projectRepository.saveUnit(projectId, unit);
  },

  async batchCreateUnits(projectId: string, units: Partial<ProjectUnit>[]): Promise<ProjectUnit[]> {
    return projectRepository.batchCreateUnits(projectId, units);
  },

  async deleteUnit(projectId: string, unitId: string): Promise<boolean> {
    return projectRepository.deleteUnit(projectId, unitId);
  }
};
