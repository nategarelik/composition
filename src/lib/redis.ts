import { Redis } from '@upstash/redis'

// Check if Redis is properly configured for Upstash
// Upstash requires https:// URLs and a token
const isValidUpstashConfig = (() => {
  const url = process.env.REDIS_URL
  const token = process.env.REDIS_TOKEN
  return url?.startsWith('https://') && token && token.length > 0
})()

// Create Redis client - will be null if not properly configured
let redis: Redis | null = null

if (isValidUpstashConfig) {
  try {
    redis = new Redis({
      url: process.env.REDIS_URL!,
      token: process.env.REDIS_TOKEN!,
    })
  } catch (error) {
    console.warn('Failed to initialize Redis:', error)
    redis = null
  }
}

export const cacheKeys = {
  compositionByQuery: (query: string) => `composition:query:${query.toLowerCase().trim()}`,
  compositionById: (id: string) => `composition:id:${id}`,
  share: (code: string) => `share:${code}`,
}

export async function getCached<T>(key: string): Promise<T | null> {
  if (!redis) return null

  try {
    const cached = await redis.get<T>(key)
    return cached
  } catch (error) {
    console.error('Redis get error:', error)
    return null
  }
}

export async function setCache<T>(key: string, value: T, ttlSeconds: number = 3600): Promise<void> {
  if (!redis) return

  try {
    await redis.set(key, value, { ex: ttlSeconds })
  } catch (error) {
    console.error('Redis set error:', error)
  }
}

export async function deleteCache(key: string): Promise<void> {
  if (!redis) return

  try {
    await redis.del(key)
  } catch (error) {
    console.error('Redis delete error:', error)
  }
}

export { redis }
