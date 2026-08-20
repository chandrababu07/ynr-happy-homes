import { Request, Response } from 'express';
import { projectService } from '../services/project.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllProjects = asyncHandler(async (_req: Request, res: Response) => {
  const projects = await projectService.getAllProjects();
  return res.status(200).json(ApiResponse.success('Construction projects retrieved successfully', projects));
});

export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await projectService.getProjectById(id);
  return res.status(200).json(ApiResponse.success('Construction project details retrieved successfully', item));
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const item = await projectService.createProject(req.body);
  return res.status(201).json(ApiResponse.success('Construction project created successfully', item));
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await projectService.updateProject(id, req.body);
  return res.status(200).json(ApiResponse.success('Construction project updated successfully', updated));
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await projectService.deleteProject(id);
  return res.status(200).json(ApiResponse.success(`Construction project with ID '${id}' deleted successfully`));
});

// --- PROJECT BLOCK CONTROLLERS ---

export const createBlock = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const block = await projectService.createBlock(projectId, req.body);
  return res.status(201).json(ApiResponse.success('Project block created successfully', block));
});

export const updateBlock = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, blockId } = req.params;
  const updated = await projectService.updateBlock(projectId, blockId, req.body);
  return res.status(200).json(ApiResponse.success('Project block updated successfully', updated));
});

export const deleteBlock = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, blockId } = req.params;
  await projectService.deleteBlock(projectId, blockId);
  return res.status(200).json(ApiResponse.success(`Project block '${blockId}' deleted successfully`));
});

// --- PROJECT UNIT / FLAT CONTROLLERS ---

export const createUnit = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const unit = await projectService.createUnit(projectId, req.body);
  return res.status(201).json(ApiResponse.success('Project unit created successfully', unit));
});

export const batchCreateUnits = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const units = await projectService.batchCreateUnits(projectId, req.body);
  return res.status(201).json(ApiResponse.success(`Successfully batch created ${units.length} units`, units));
});

export const updateUnit = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, unitId } = req.params;
  const updated = await projectService.updateUnit(projectId, unitId, req.body);
  return res.status(200).json(ApiResponse.success('Project unit updated successfully', updated));
});

export const deleteUnit = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, unitId } = req.params;
  await projectService.deleteUnit(projectId, unitId);
  return res.status(200).json(ApiResponse.success(`Project unit '${unitId}' deleted successfully`));
});
