import 'server-only';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as typeof globalThis & {
  northstarPrisma?: PrismaClient;
};

export const prisma = globalForPrisma.northstarPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.northstarPrisma = prisma;
}
