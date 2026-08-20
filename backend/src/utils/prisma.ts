import { PrismaClient } from '@prisma/client';
import { config } from '../config/index.js';

// Ensure environment variables are loaded
if (config.databaseUrl) {
  process.env.DATABASE_URL = config.databaseUrl;
}

// Shared PrismaClient singleton instance
export const prisma = new PrismaClient({
  log: config.nodeEnv === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export default prisma;
