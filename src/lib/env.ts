import { z } from 'zod'

const envSchema = z.object({
  // AI Services
  ANTHROPIC_API_KEY: z.string().min(1, 'ANTHROPIC_API_KEY is required'),
  PERPLEXITY_API_KEY: z.string().optional(),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // Cache - Upstash Redis (supports both Vercel KV and standard Upstash env vars)
  // These are validated as optional because redis.ts handles the fallback logic
  KV_REST_API_URL: z.string().optional(), // Vercel KV integration
  KV_REST_API_TOKEN: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().optional(), // Standard Upstash
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Vector DB
  PINECONE_API_KEY: z.string().optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
})

export type Env = z.infer<typeof envSchema>

// Lazy evaluation to avoid build-time errors
let _env: Env | null = null

export function getEnv(): Env {
  if (_env) return _env

  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors)
    throw new Error('Invalid environment variables')
  }

  _env = parsed.data
  return _env
}

// For backward compatibility, but only accessed at runtime
export const env = new Proxy({} as Env, {
  get(_, prop: string) {
    return getEnv()[prop as keyof Env]
  },
})
