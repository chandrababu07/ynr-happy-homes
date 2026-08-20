import { Response } from 'express';
import { userService } from '../services/user.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getAllUsers = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const users = await userService.getAllUsers();
  return res.status(200).json(ApiResponse.success('Users directory retrieved successfully', users));
});

export const getUserById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  return res.status(200).json(ApiResponse.success('User details retrieved successfully', user));
});

export const createUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const newUser = await userService.createUser(req.body);
  return res.status(201).json(ApiResponse.success('User created successfully', newUser));
});

export const updateUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const currentUserId = req.user?.userId || '';
  const updated = await userService.updateUser(currentUserId, id, req.body);
  return res.status(200).json(ApiResponse.success('User profile updated successfully', updated));
});

export const deleteUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const currentUserId = req.user?.userId || '';
  await userService.deleteUser(currentUserId, id);
  return res.status(200).json(ApiResponse.success(`User with ID '${id}' deleted successfully`));
});
