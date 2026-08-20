import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const WINDOW_MS = 15 * 60 * 1000; // 15 Minutes
const MAX_REQUESTS = 5; // Max 5 submissions per window

const ipMap = new Map<string, RateLimitRecord>();

// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipMap.entries()) {
    if (now > record.resetTime) {
      ipMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

export const enquiryRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();

  const record = ipMap.get(clientIp);

  if (!record || now > record.resetTime) {
    ipMap.set(clientIp, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return next();
  }

  if (record.count >= MAX_REQUESTS) {
    res.status(429).json(
      ApiResponse.error(
        'Submission limit reached. You have submitted multiple enquiries recently. Please wait a few minutes before submitting another request.'
      )
    );
    return;
  }

  record.count += 1;
  return next();
};
