import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { ApiResponse } from '../utils/apiResponse.js';

const router = Router();
const startTime = Date.now();

/**
 * @route   GET /api/v1/health
 * @desc    System health & live database diagnostic check
 * @access  Public
 */
router.get('/', async (_req: Request, res: Response) => {
  let dbStatus = 'DISCONNECTED';
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
    dbStatus = 'CONNECTED';
  } catch (error) {
    console.warn('[HealthCheck] Live PostgreSQL ping failed:', error);
    dbStatus = 'OFFLINE_FALLBACK';
  }

  const memoryUsage = process.memoryUsage();
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  return res.status(200).json(
    ApiResponse.success('YNR Happy Homes API Health Status', {
      status: 'UP',
      environment: process.env.NODE_ENV || 'development',
      uptimeSeconds,
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryRssMb: Math.round(memoryUsage.rss / 1024 / 1024),
      },
    })
  );
});

export default router;
