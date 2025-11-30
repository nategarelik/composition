import { PrismaClient } from "@prisma/client";

// Cache for the Prisma client promise
let prismaPromise: Promise<PrismaClient> | null = null;
let prismaClient: PrismaClient | null = null;

/**
 * Check if database is configured (without throwing)
 */
export function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}

/**
 * Lazily creates the Prisma client when first accessed.
 * Uses dynamic imports to avoid module-load-time errors.
 * Uses Neon serverless driver for Vercel compatibility.
 */
async function createPrismaClientAsync(): Promise<PrismaClient> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Dynamic imports to avoid module-load-time issues
  const { PrismaNeon } = await import("@prisma/adapter-neon");
  const { neonConfig } = await import("@neondatabase/serverless");

  // Use native WebSocket if available (edge), otherwise use ws package (Node.js)
  if (typeof globalThis.WebSocket !== "undefined") {
    neonConfig.webSocketConstructor = globalThis.WebSocket;
  } else {
    const ws = await import("ws");
    neonConfig.webSocketConstructor = ws.default;
  }

  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

/**
 * Get the database client asynchronously.
 * Returns null if DATABASE_URL is not configured.
 * Throws on actual connection errors.
 */
export async function getDb(): Promise<PrismaClient | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  // Return cached client if available
  if (prismaClient) {
    return prismaClient;
  }

  // Create or return existing promise
  if (!prismaPromise) {
    prismaPromise = createPrismaClientAsync();
  }

  try {
    prismaClient = await prismaPromise;
    return prismaClient;
  } catch (error) {
    console.error("Failed to create Prisma client:", error);
    prismaPromise = null; // Reset on error so it can be retried
    throw error;
  }
}
