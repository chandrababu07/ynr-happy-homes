import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';

const VALID_STATUSES = ['AVAILABLE', 'ON_RENT', 'MAINTENANCE', 'INACTIVE'];

export const validateCreateEquipment = (req: Request, res: Response, next: NextFunction) => {
  const { name, category, brand, model, availabilityStatus } = req.body;

  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Equipment name is required');
  }

  if (!category || typeof category !== 'string' || category.trim() === '') {
    errors.push('Equipment category is required');
  }

  if (!brand || typeof brand !== 'string' || brand.trim() === '') {
    errors.push('Equipment brand is required');
  }

  if (!model || typeof model !== 'string' || model.trim() === '') {
    errors.push('Equipment model is required');
  }

  if (availabilityStatus && !VALID_STATUSES.includes(availabilityStatus)) {
    errors.push(`Availability status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (errors.length > 0) {
    res.status(400).json(ApiResponse.error('Validation Error', errors));
    return;
  }

  return next();
};

export const validateUpdateEquipment = (req: Request, res: Response, next: NextFunction) => {
  const { availabilityStatus } = req.body;

  if (availabilityStatus && !VALID_STATUSES.includes(availabilityStatus)) {
    res.status(400).json(ApiResponse.error('Validation Error', [`Availability status must be one of: ${VALID_STATUSES.join(', ')}`]));
    return;
  }

  return next();
};
