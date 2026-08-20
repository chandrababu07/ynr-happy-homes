import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtUserPayload } from '../utils/jwt.js';
import { ApiResponse } from '../utils/apiResponse.js';

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json(ApiResponse.error('Unauthorized: Authentication token is missing'));
    return;
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (error: any) {
    res.status(401).json(ApiResponse.error('Unauthorized: Token is invalid or has expired'));
    return;
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json(ApiResponse.error('Unauthorized: Authentication required'));
    return;
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json(ApiResponse.error('Forbidden: Access requires administrator privileges'));
    return;
  }

  return next();
};
