import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === "$connect" || prop === "$disconnect" || prop === "then") return undefined;
        throw new Error("Database not configured. Set DATABASE_URL environment variable.");
      },
    });
  }

  // Use Neon serverless adapter for PostgreSQL
  if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
    const adapter = new PrismaNeon({ connectionString: url });
    return new PrismaClient({ adapter });
  }

  // Fallback for local development with SQLite
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Backward-compatible aliases
export const db = prisma;
export default prisma;

// Helper to safely run db operations — returns null if DB unavailable
export async function withDb<T>(fn: (client: PrismaClient) => Promise<T>): Promise<T | null> {
  try {
    return await fn(prisma);
  } catch {
    return null;
  }
}
