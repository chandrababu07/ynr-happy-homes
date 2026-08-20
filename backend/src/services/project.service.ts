import {
  projectRepository,
  CreateProjectData,
  UpdateProjectData,
  CreateProjectBlockData,
  UpdateProjectBlockData,
  CreateProjectUnitData,
  UpdateProjectUnitData,
} from '../repositories/project.repository.js';

export class ProjectService {
  async getAllProjects() {
    return projectRepository.findAll();
  }

  async getProjectById(id: string) {
    const item = await projectRepository.findById(id);
    if (!item) {
      const error: any = new Error(`Construction project with ID '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return item;
  }

  async createProject(data: CreateProjectData) {
    return projectRepository.create(data);
  }

  async updateProject(id: string, data: UpdateProjectData) {
    await this.getProjectById(id);
    return projectRepository.update(id, data);
  }

  async deleteProject(id: string) {
    await this.getProjectById(id);
    return projectRepository.delete(id);
  }

  // --- PROJECT BLOCK SERVICE METHODS ---

  async createBlock(projectId: string, data: CreateProjectBlockData) {
    await this.getProjectById(projectId);
    return projectRepository.createBlock(projectId, data);
  }

  async updateBlock(projectId: string, blockId: string, data: UpdateProjectBlockData) {
    await this.getProjectById(projectId);
    const block = await projectRepository.findBlockById(blockId);
    if (!block) {
      const error: any = new Error(`Project block with ID '${blockId}' not found`);
      error.statusCode = 404;
      throw error;
    }
    if (block.projectId !== projectId) {
      const error: any = new Error(`Relationship Error: Block '${blockId}' does not belong to project '${projectId}'`);
      error.statusCode = 400;
      throw error;
    }
    return projectRepository.updateBlock(blockId, data);
  }

  async deleteBlock(projectId: string, blockId: string) {
    await this.getProjectById(projectId);
    const block = await projectRepository.findBlockById(blockId);
    if (!block) {
      const error: any = new Error(`Project block with ID '${blockId}' not found`);
      error.statusCode = 404;
      throw error;
    }
    if (block.projectId !== projectId) {
      const error: any = new Error(`Relationship Error: Block '${blockId}' does not belong to project '${projectId}'`);
      error.statusCode = 400;
      throw error;
    }
    return projectRepository.deleteBlock(blockId);
  }

  // --- PROJECT UNIT / FLAT SERVICE METHODS ---

  async createUnit(projectId: string, data: CreateProjectUnitData) {
    const project = await this.getProjectById(projectId);

    // Relationship Validation: If blockId provided, check block belongs to project
    if (data.blockId) {
      const block = await projectRepository.findBlockById(data.blockId);
      if (!block) {
        const error: any = new Error(`Project block with ID '${data.blockId}' not found`);
        error.statusCode = 404;
        throw error;
      }
      if (block.projectId !== projectId) {
        const error: any = new Error(`Relationship Error: Block '${data.blockId}' does not belong to project '${projectId}'`);
        error.statusCode = 400;
        throw error;
      }
    }

    // Duplicate Flat Number Check in same block/project
    const existingUnits = project.units || [];
    const duplicate = existingUnits.find(
      (u: any) =>
        u.unitNumber.toLowerCase().trim() === data.unitNumber.toLowerCase().trim() &&
        (u.blockId === data.blockId || (!u.blockId && !data.blockId))
    );

    if (duplicate) {
      const error: any = new Error(`Duplicate Unit Error: Unit number '${data.unitNumber}' already exists in this block/project`);
      error.statusCode = 409;
      throw error;
    }

    return projectRepository.createUnit(projectId, data);
  }

  async batchCreateUnits(projectId: string, unitsData: CreateProjectUnitData[]) {
    const project = await this.getProjectById(projectId);

    // Validate all block relationships & duplicate flat numbers in payload
    const existingUnits = project.units || [];
    const seenUnitNumbers = new Set<string>();

    for (const u of unitsData) {
      if (u.blockId) {
        const block = await projectRepository.findBlockById(u.blockId);
        if (!block || block.projectId !== projectId) {
          const error: any = new Error(`Relationship Error: Block '${u.blockId}' does not belong to project '${projectId}'`);
          error.statusCode = 400;
          throw error;
        }
      }

      const key = `${u.blockId || 'none'}_${u.unitNumber.toLowerCase().trim()}`;
      if (seenUnitNumbers.has(key)) {
        const error: any = new Error(`Batch Payload Error: Duplicate unit number '${u.unitNumber}' in batch payload`);
        error.statusCode = 400;
        throw error;
      }
      seenUnitNumbers.add(key);

      const existingDup = existingUnits.find(
        (ex: any) =>
          ex.unitNumber.toLowerCase().trim() === u.unitNumber.toLowerCase().trim() &&
          (ex.blockId === u.blockId || (!ex.blockId && !u.blockId))
      );
      if (existingDup) {
        const error: any = new Error(`Duplicate Unit Error: Unit number '${u.unitNumber}' already exists in this project`);
        error.statusCode = 409;
        throw error;
      }
    }

    return projectRepository.batchCreateUnits(projectId, unitsData);
  }

  async updateUnit(projectId: string, unitId: string, data: UpdateProjectUnitData) {
    await this.getProjectById(projectId);
    const unit = await projectRepository.findUnitById(unitId);
    if (!unit) {
      const error: any = new Error(`Project unit with ID '${unitId}' not found`);
      error.statusCode = 404;
      throw error;
    }
    if (unit.projectId !== projectId) {
      const error: any = new Error(`Relationship Error: Unit '${unitId}' does not belong to project '${projectId}'`);
      error.statusCode = 400;
      throw error;
    }

    if (data.blockId) {
      const block = await projectRepository.findBlockById(data.blockId);
      if (!block || block.projectId !== projectId) {
        const error: any = new Error(`Relationship Error: Block '${data.blockId}' does not belong to project '${projectId}'`);
        error.statusCode = 400;
        throw error;
      }
    }

    return projectRepository.updateUnit(unitId, data);
  }

  async deleteUnit(projectId: string, unitId: string) {
    await this.getProjectById(projectId);
    const unit = await projectRepository.findUnitById(unitId);
    if (!unit) {
      const error: any = new Error(`Project unit with ID '${unitId}' not found`);
      error.statusCode = 404;
      throw error;
    }
    if (unit.projectId !== projectId) {
      const error: any = new Error(`Relationship Error: Unit '${unitId}' does not belong to project '${projectId}'`);
      error.statusCode = 400;
      throw error;
    }
    return projectRepository.deleteUnit(unitId);
  }
}

export const projectService = new ProjectService();
