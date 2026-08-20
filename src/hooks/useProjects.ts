import { useState, useEffect, useCallback } from 'react';
import { ConstructionProject, ProjectUnit } from '../types';
import { projectService } from '../services/projectService';

export function useProjects() {
  const [projects, setProjects] = useState<ConstructionProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const projData = await projectService.getAll();
      setProjects(projData);
    } catch (err: any) {
      console.error('Failed to load projects from API:', err);
      setError(err.message || 'Failed to load construction project data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveProject = async (project: ConstructionProject) => {
    const saved = await projectService.save(project);
    await refresh();
    return saved;
  };

  const deleteProject = async (id: string) => {
    const success = await projectService.delete(id);
    await refresh();
    return success;
  };

  const saveBlock = async (projectId: string, block: { id?: string; name: string; description?: string }) => {
    const saved = await projectService.saveBlock(projectId, block);
    await refresh();
    return saved;
  };

  const deleteBlock = async (projectId: string, blockId: string) => {
    const success = await projectService.deleteBlock(projectId, blockId);
    await refresh();
    return success;
  };

  const saveUnit = async (projectId: string, unit: Partial<ProjectUnit>) => {
    const saved = await projectService.saveUnit(projectId, unit);
    await refresh();
    return saved;
  };

  const batchCreateUnits = async (projectId: string, unitList: Partial<ProjectUnit>[]) => {
    const saved = await projectService.batchCreateUnits(projectId, unitList);
    await refresh();
    return saved;
  };

  const deleteUnit = async (projectId: string, unitId: string) => {
    const success = await projectService.deleteUnit(projectId, unitId);
    await refresh();
    return success;
  };

  const units = projects.flatMap((p) => p.units || []);

  return {
    projects,
    units,
    loading,
    error,
    refresh,
    saveProject,
    deleteProject,
    saveBlock,
    deleteBlock,
    saveUnit,
    batchCreateUnits,
    deleteUnit,
  };
}
