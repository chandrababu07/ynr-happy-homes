import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  const errors: string[] = [];

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push('Email address is required');
  }

  if (errors.length > 0) {
    res.status(400).json(ApiResponse.error('Validation Error', errors));
    return;
  }

  return next();
};
