import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export interface JwtUserPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: JwtUserPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });
}

export function verifyToken(token: string): JwtUserPayload {
  return jwt.verify(token, config.jwtSecret) as JwtUserPayload;
}
