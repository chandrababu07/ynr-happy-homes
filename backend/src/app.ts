import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { rateLimit } from 'express-rate-limit';
import { config } from './config/index.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp(): Express {
  const app = express();

  // Global API Rate Limiting
  // Render health checks are excluded so the service
  // can always report its health status.
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,

    skip: (req) => {
      const userAgent = req.get('user-agent')?.toLowerCase() || '';

      // Never rate-limit Render health checks
      if (userAgent.includes('render')) {
        return true;
      }

      // Never rate-limit common health-check endpoints
      if (
        req.path === '/' ||
        req.path === '/health' ||
        req.path === '/api/health' ||
        req.path === '/api/v1/health'
      ) {
        return true;
      }

      return false;
    },

    message: {
      error: 'Too many requests',
      message: 'Please try again later.',
    },
  });

  app.use(apiLimiter);

  // Security Headers Middleware
  app.disable('x-powered-by');

  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader(
      'Referrer-Policy',
      'strict-origin-when-cross-origin'
    );
    next();
  });

  // CORS Configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);

        if (
          config.corsOrigins.indexOf(origin) !== -1 ||
          config.corsOrigins.includes('*')
        ) {
          return callback(null, true);
        }

        return callback(null, true); // Fallback allow in dev mode
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    })
  );

  // Body Parsing Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static File Serving for Uploaded Media & Documents
  app.use(
    '/uploads',
    express.static(path.join(process.cwd(), 'uploads'))
  );

  // Mount API Routes
  app.use(config.apiPrefix, apiRouter);

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
}

export default createApp;
