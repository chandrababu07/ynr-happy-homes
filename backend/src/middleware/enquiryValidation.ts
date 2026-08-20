import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';

const VALID_CATEGORIES = ['INFRA', 'REAL_ESTATE', 'CONSTRUCTION', 'GENERAL'];
const VALID_STATUSES = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED'];
const PHONE_REGEX = /^\+?[0-9\s\-]{10,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(input?: string): string | undefined {
  if (!input || typeof input !== 'string') return undefined;
  return input.replace(/<[^>]*>?/gm, '').trim();
}

export const validateCreateEnquiry = (req: Request, res: Response, next: NextFunction) => {
  let { customerName, customerPhone, customerEmail, customerLocation, message, category, status } = req.body;

  const errors: string[] = [];

  customerName = sanitize(customerName);
  customerPhone = sanitize(customerPhone);
  customerEmail = sanitize(customerEmail);
  customerLocation = sanitize(customerLocation);
  message = sanitize(message);

  if (!customerName || customerName === '') {
    errors.push('Customer name is required');
  }

  if (!customerPhone || customerPhone === '') {
    errors.push('Customer phone number is required');
  } else if (!PHONE_REGEX.test(customerPhone)) {
    errors.push('Customer phone number must contain 10 to 15 valid digits');
  }

  if (customerEmail && customerEmail !== '' && !EMAIL_REGEX.test(customerEmail)) {
    errors.push('Invalid email address format');
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

  // Mutate body with sanitized inputs
  req.body.customerName = customerName;
  req.body.customerPhone = customerPhone;
  if (customerEmail) req.body.customerEmail = customerEmail;
  if (customerLocation) req.body.customerLocation = customerLocation;
  if (message) req.body.message = message;

  return next();
};

export const validateUpdateEnquiry = (req: Request, res: Response, next: NextFunction) => {
  const { category, status, customerPhone, customerEmail } = req.body;

  const errors: string[] = [];

  if (customerPhone && !PHONE_REGEX.test(customerPhone)) {
    errors.push('Customer phone number must contain 10 to 15 valid digits');
  }

  if (customerEmail && customerEmail !== '' && !EMAIL_REGEX.test(customerEmail)) {
    errors.push('Invalid email address format');
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
