import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';

const VALID_STATUSES = ['PLANNING', 'UNDER_CONSTRUCTION', 'COMPLETED'];
const VALID_UNIT_STATUSES = ['AVAILABLE', 'BOOKED', 'SOLD'];

export const validateCreateProject = (req: Request, res: Response, next: NextFunction) => {
  const { name, projectType, location, status, progressPercentage } = req.body;
  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Project name is required');
  }

  if (!projectType || typeof projectType !== 'string' || projectType.trim() === '') {
    errors.push('Project type is required');
  }

  if (!location || typeof location !== 'string' || location.trim() === '') {
    errors.push('Project location is required');
  }

  if (status && !VALID_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (progressPercentage !== undefined && (typeof progressPercentage !== 'number' || progressPercentage < 0 || progressPercentage > 100)) {
    errors.push('Progress percentage must be a number between 0 and 100');
  }

  if (errors.length > 0) {
    res.status(400).json(ApiResponse.error('Validation Error', errors));
    return;
  }

  return next();
};

export const validateUpdateProject = (req: Request, res: Response, next: NextFunction) => {
  const { status, progressPercentage } = req.body;
  const errors: string[] = [];

  if (status && !VALID_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (progressPercentage !== undefined && (typeof progressPercentage !== 'number' || progressPercentage < 0 || progressPercentage > 100)) {
    errors.push('Progress percentage must be a number between 0 and 100');
  }

  if (errors.length > 0) {
    res.status(400).json(ApiResponse.error('Validation Error', errors));
    return;
  }

  return next();
};

export const validateCreateBlock = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Block name is required (e.g. Block A, Tower 1)');
  }

  if (errors.length > 0) {
    res.status(400).json(ApiResponse.error('Validation Error', errors));
    return;
  }

  return next();
};

export const validateCreateUnit = (req: Request, res: Response, next: NextFunction) => {
  const { unitNumber, unitType, floor, area, price, status } = req.body;
  const errors: string[] = [];

  if (!unitNumber || typeof unitNumber !== 'string' || unitNumber.trim() === '') {
    errors.push('Unit number is required (e.g. Flat 101)');
  }

  if (!unitType || typeof unitType !== 'string' || unitType.trim() === '') {
    errors.push('Unit type is required (e.g. 2BHK, 3BHK)');
  }

  if (floor === undefined || isNaN(Number(floor))) {
    errors.push('Floor number is required and must be an integer');
  }

  if (area === undefined || isNaN(Number(area)) || Number(area) <= 0) {
    errors.push('Area is required and must be a positive number');
  }

  if (!price || typeof price !== 'string' || price.trim() === '') {
    errors.push('Price is required');
  }

  if (status && !VALID_UNIT_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${VALID_UNIT_STATUSES.join(', ')}`);
  }

  if (errors.length > 0) {
    res.status(400).json(ApiResponse.error('Validation Error', errors));
    return;
  }

  return next();
};

export const validateBatchCreateUnits = (req: Request, res: Response, next: NextFunction) => {
  const units = req.body;
  const errors: string[] = [];

  if (!Array.isArray(units) || units.length === 0) {
    errors.push('Request body must be a non-empty array of unit objects');
  } else {
    units.forEach((u: any, idx: number) => {
      if (!u.unitNumber || typeof u.unitNumber !== 'string' || u.unitNumber.trim() === '') {
        errors.push(`Item [${idx}]: Unit number is required`);
      }
      if (!u.unitType || typeof u.unitType !== 'string' || u.unitType.trim() === '') {
        errors.push(`Item [${idx}]: Unit type is required`);
      }
      if (u.floor === undefined || isNaN(Number(u.floor))) {
        errors.push(`Item [${idx}]: Floor number is required`);
      }
      if (u.area === undefined || isNaN(Number(u.area)) || Number(u.area) <= 0) {
        errors.push(`Item [${idx}]: Area must be a positive number`);
      }
      if (!u.price || typeof u.price !== 'string' || u.price.trim() === '') {
        errors.push(`Item [${idx}]: Price is required`);
      }
    });
  }

  if (errors.length > 0) {
    res.status(400).json(ApiResponse.error('Validation Error', errors));
    return;
  }

  return next();
};

export const validateUpdateUnit = (req: Request, res: Response, next: NextFunction) => {
  const { status, floor, area } = req.body;
  const errors: string[] = [];

  if (status && !VALID_UNIT_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${VALID_UNIT_STATUSES.join(', ')}`);
  }

  if (floor !== undefined && isNaN(Number(floor))) {
    errors.push('Floor must be a valid integer');
  }

  if (area !== undefined && (isNaN(Number(area)) || Number(area) <= 0)) {
    errors.push('Area must be a positive number');
  }

  if (errors.length > 0) {
    res.status(400).json(ApiResponse.error('Validation Error', errors));
    return;
  }

  return next();
};
