import { Response } from 'express';
import { mediaService } from '../services/media.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const uploadMedia = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json(ApiResponse.error('File upload parameter missing'));
  }

  const { title, category, type, equipmentId, propertyId, projectId, unitId } = req.body;

  const asset = await mediaService.uploadFile(file, {
    title,
    category,
    type,
    equipmentId,
    propertyId,
    projectId,
    unitId,
  });

  return res.status(201).json(ApiResponse.success('File uploaded successfully', asset));
});

export const deleteMedia = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  await mediaService.deleteAsset(id);
  return res.status(200).json(ApiResponse.success(`Media asset '${id}' deleted successfully`));
});

export const getEntityMedia = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { entityType, entityId } = req.params;
  const assets = await mediaService.getMediaByEntity(
    entityType as 'equipment' | 'property' | 'project' | 'unit',
    entityId
  );
  return res.status(200).json(ApiResponse.success('Entity media assets retrieved successfully', assets));
});

export const reorderMedia = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json(ApiResponse.error('Items array parameter required'));
  }
  await mediaService.reorderMedia(items);
  return res.status(200).json(ApiResponse.success('Media items reordered successfully'));
});
