import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaError: Error | undefined;
};

/**
 * Lazily creates the Prisma client when first accessed.
 * This prevents module-load-time errors when DATABASE_URL is not set.
 */
function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

/**
 * Check if database is configured (without throwing)
 */
export function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}

/**
 * Get the database client.
 * Returns null if DATABASE_URL is not configured.
 * Throws on actual connection errors.
 */
export function getDb(): PrismaClient | null {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  try {
    const client = createPrismaClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    }
    return client;
  } catch (error) {
    console.error("Failed to create Prisma client:", error);
    throw error;
  }
}

/**
 * Lazy proxy for backward compatibility.
 * Throws when accessed if DATABASE_URL is not set.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const client = getDb();
    if (!client) {
      throw new Error(
        "Database is not configured. Set DATABASE_URL environment variable."
      );
    }
    return client[prop as keyof PrismaClient];
  },
});
