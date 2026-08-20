import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';

const VALID_CATEGORIES = [
  'LAND',
  'SITES_PLOTS',
  'APARTMENTS',
  'INDIVIDUAL_HOUSES',
  'COMMERCIAL_LAND',
  'COMMERCIAL_PROPERTIES',
  'OTHER',
];

const VALID_STATUSES = ['AVAILABLE', 'UNDER_OFFER', 'SOLD', 'ARCHIVED'];

export const validateCreateProperty = (req: Request, res: Response, next: NextFunction) => {
  const { title, price, address, city, state, category, status } = req.body;

  const errors: string[] = [];

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push('Property title is required');
  }

  if (!price || typeof price !== 'string' || price.trim() === '') {
    errors.push('Property price is required');
  }

  if (!address || typeof address !== 'string' || address.trim() === '') {
    errors.push('Property address is required');
  }

  if (!city || typeof city !== 'string' || city.trim() === '') {
    errors.push('Property city is required');
  }

  if (!state || typeof state !== 'string' || state.trim() === '') {
    errors.push('Property state is required');
  }

  if (category && !VALID_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (status && !VALID_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (errors.length > 0) {
    res.status(400).json(ApiResponse.error('Validation Error', errors));
    return;
  }

  return next();
};

export const validateUpdateProperty = (req: Request, res: Response, next: NextFunction) => {
  const { category, status } = req.body;

  const errors: string[] = [];

  if (category && !VALID_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (status && !VALID_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (errors.length > 0) {
    res.status(400).json(ApiResponse.error('Validation Error', errors));
    return;
  }

  return next();
};
