import { Response } from 'express';
import { authService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const login = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  return res.status(200).json(ApiResponse.success('Authentication successful', result));
});

export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json(ApiResponse.error('Unauthorized'));
  }
  const user = await authService.getCurrentUser(req.user.userId);
  return res.status(200).json(ApiResponse.success('Current user profile retrieved successfully', user));
});
