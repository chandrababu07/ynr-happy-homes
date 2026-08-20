import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const defaultOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'];
const rawAllowedOrigins = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || '';

const parsedOrigins = rawAllowedOrigins
  .split(',')
  .map((o) => o.trim())
  .filter((o) => o.length > 0);

const corsOrigins = Array.from(new Set([...parsedOrigins, ...defaultOrigins]));

const jwtSecret = process.env.JWT_SECRET || 'ynr-happy-homes-jwt-secret-key-2025-secure';
const isProduction = (process.env.NODE_ENV || 'development') === 'production';

if (isProduction && jwtSecret === 'ynr-happy-homes-jwt-secret-key-2025-secure') {
  console.warn(
    '[SECURITY WARNING] Application is running in PRODUCTION mode with a default JWT_SECRET! Please configure a strong, unique JWT_SECRET in production environment variables.'
  );
}

export const config = {
  port: parseInt(process.env.PORT || '8000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  databaseUrl: process.env.DATABASE_URL || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  corsOrigins,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  apiPrefix: '/api/v1',
};

export default config;
