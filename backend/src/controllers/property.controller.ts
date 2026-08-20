import { Request, Response } from 'express';
import { propertyService } from '../services/property.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllProperties = asyncHandler(async (req: Request, res: Response) => {
  const { search, category, status, city, sort, page, limit } = req.query;

  const result = await propertyService.getAllProperties({
    search: search ? String(search) : undefined,
    category: category ? String(category) : undefined,
    status: status ? String(status) : undefined,
    city: city ? String(city) : undefined,
    sort: sort ? String(sort) : undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  return res.status(200).json({
    success: true,
    message: 'Properties retrieved successfully',
    data: result.items,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    },
  });
});

export const getPropertyById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await propertyService.getPropertyById(id);
  return res.status(200).json(ApiResponse.success('Property details retrieved successfully', item));
});

export const createProperty = asyncHandler(async (req: Request, res: Response) => {
  const item = await propertyService.createProperty(req.body);
  return res.status(201).json(ApiResponse.success('Property record created successfully', item));
});

export const updateProperty = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await propertyService.updateProperty(id, req.body);
  return res.status(200).json(ApiResponse.success('Property record updated successfully', updated));
});

export const deleteProperty = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await propertyService.deleteProperty(id);
  return res.status(200).json(ApiResponse.success(`Property record with ID '${id}' deleted successfully`));
});
