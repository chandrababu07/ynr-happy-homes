import { Response } from 'express';
import { dashboardService } from '../services/dashboard.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getDashboardSummary = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const summary = await dashboardService.getSummary();
  return res.status(200).json(ApiResponse.success('Dashboard analytics summary retrieved successfully', summary));
});
