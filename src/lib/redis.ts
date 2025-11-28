import { Redis } from "@upstash/redis";
import { CACHE_TTL } from "./constants";
import { normalizeQuery } from "./validators";

// Check if Redis is properly configured for Upstash
// Supports both KV_REST_API_* (Vercel KV) and UPSTASH_REDIS_* env vars
const getUpstashConfig = () => {
  // Try Vercel KV env vars first (from Upstash integration)
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (kvUrl && kvToken) {
    return { url: kvUrl, token: kvToken };
  }

  // Fall back to standard Upstash env vars
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (upstashUrl && upstashToken) {
    return { url: upstashUrl, token: upstashToken };
  }

  return null;
};

const config = getUpstashConfig();

// Create Redis client - will be null if not properly configured
let redis: Redis | null = null;

if (config) {
  try {
    redis = new Redis({
      url: config.url,
      token: config.token,
    });
  } catch (error) {
    console.warn("Failed to initialize Redis:", error);
    redis = null;
  }
}

export const cacheKeys = {
  compositionByQuery: (query: string) =>
    `composition:query:${normalizeQuery(query)}`,
  compositionById: (id: string) => `composition:id:${id}`,
  share: (code: string) => `share:${code}`,
};

export async function getCached<T>(key: string): Promise<T | null> {
  if (!redis) return null;

  try {
    const cached = await redis.get<T>(key);
    return cached;
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number = CACHE_TTL.DEFAULT,
): Promise<void> {
  if (!redis) return;

  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch (error) {
    console.error("Redis set error:", error);
  }
}

export async function deleteCache(key: string): Promise<void> {
  if (!redis) return;

  try {
    await redis.del(key);
  } catch (error) {
    console.error("Redis delete error:", error);
  }
}

export { redis };
