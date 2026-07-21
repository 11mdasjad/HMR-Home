import { PrismaClient } from '@prisma/client';
import { db as memoryDb } from './memoryDb';

let prisma: PrismaClient | null = null;
let useRealDb = false;

try {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('mock')) {
    prisma = new PrismaClient();
    useRealDb = true;
    console.log('⚡ Prisma Client Initialized with database connection');
  } else {
    console.warn('⚠️ No real DATABASE_URL configured or mock detected. Falling back to persistent Memory DB!');
  }
} catch (e) {
  console.error('❌ Failed to initialize Prisma Client, falling back to Memory DB:', e);
}

export { prisma, useRealDb, memoryDb };
export default prisma;
