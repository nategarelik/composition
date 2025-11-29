import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// Cached Redis instance for rate limiting
let redisInstance: Redis | null = null;

function getRedisInstance(): Redis | null {
  if (redisInstance) return redisInstance;

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    console.warn("Rate limiting disabled: UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not configured");
    return null;
  }

  try {
    redisInstance = new Redis({
      url: redisUrl,
      token: redisToken,
    });
    return redisInstance;
  } catch (error) {
    console.error("Failed to initialize Redis:", error);
    return null;
  }
}

// Rate limit configurations for different endpoints
export const rateLimitConfigs = {
  // Expensive AI operations - strict limit
  search: { requests: 5, window: "1 m" as const },
  chat: { requests: 20, window: "1 m" as const },
  // Less expensive operations - more lenient
  share: { requests: 30, window: "1 m" as const },
  default: { requests: 60, window: "1 m" as const },
};

export type RateLimitEndpoint = keyof typeof rateLimitConfigs;

/**
 * Get client identifier for rate limiting
 * Uses IP address with fallback to a default for local development
 */
function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() ?? realIp ?? "127.0.0.1";
  return ip;
}

/**
 * Check rate limit for a request
 * Returns null if rate limiting is not configured or request is allowed
 * Returns a Response if rate limit is exceeded
 */
export async function checkRateLimit<T = unknown>(
  request: NextRequest,
  endpoint: RateLimitEndpoint = "default"
): Promise<NextResponse<T> | null> {
  const redis = getRedisInstance();

  // Skip rate limiting if not configured (development/missing env vars)
  if (!redis) {
    return null;
  }

  const identifier = getClientIdentifier(request);
  const config = rateLimitConfigs[endpoint];

  try {
    // Create endpoint-specific rate limiter
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.requests, config.window),
      prefix: `composition:ratelimit:${endpoint}`,
    });

    const { success, limit, remaining, reset } = await limiter.limit(identifier);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many requests. Please try again later.",
          },
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      ) as NextResponse<T>;
    }

    return null;
  } catch (error) {
    // Log error but don't block request if rate limiting fails
    console.error("Rate limit check failed:", error);
    return null;
  }
}

/**
 * Create rate limit headers for successful responses
 */
export function createRateLimitHeaders(
  limit: number,
  remaining: number,
  reset: number
): Record<string, string> {
  return {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": reset.toString(),
  };
}
