import { Request, Response } from 'express';
import { equipmentService } from '../services/equipment.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllEquipment = asyncHandler(async (_req: Request, res: Response) => {
  const equipment = await equipmentService.getAllEquipment();
  return res.status(200).json(ApiResponse.success('Equipment retrieved successfully', equipment));
});

export const getEquipmentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await equipmentService.getEquipmentById(id);
  return res.status(200).json(ApiResponse.success('Equipment details retrieved successfully', item));
});

export const createEquipment = asyncHandler(async (req: Request, res: Response) => {
  const item = await equipmentService.createEquipment(req.body);
  return res.status(201).json(ApiResponse.success('Equipment record created successfully', item));
});

export const updateEquipment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await equipmentService.updateEquipment(id, req.body);
  return res.status(200).json(ApiResponse.success('Equipment record updated successfully', updated));
});

export const deleteEquipment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await equipmentService.deleteEquipment(id);
  return res.status(200).json(ApiResponse.success(`Equipment record with ID '${id}' deleted successfully`));
});
