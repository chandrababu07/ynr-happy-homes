import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';

export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, phone, role } = req.body;
  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Full name is required');
  }

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push('Valid email address is required');
  }

  if (!phone || typeof phone !== 'string' || phone.trim() === '') {
    errors.push('Phone number is required');
  }

  if (role && !['ADMIN', 'STAFF', 'CUSTOMER'].includes(role)) {
    errors.push('Role must be one of ADMIN, STAFF, or CUSTOMER');
  }

  if (errors.length > 0) {
    res.status(400).json(ApiResponse.error('Validation Error', errors));
    return;
  }

  return next();
};

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.body;
  const errors: string[] = [];

  if (role && !['ADMIN', 'STAFF', 'CUSTOMER'].includes(role)) {
    errors.push('Role must be one of ADMIN, STAFF, or CUSTOMER');
  }

  if (errors.length > 0) {
    res.status(400).json(ApiResponse.error('Validation Error', errors));
    return;
  }

  return next();
};
