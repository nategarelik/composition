// API Configuration
export const ANTHROPIC_MAX_TOKENS = 8192;

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  /** Default cache TTL: 1 hour */
  DEFAULT: 3600,
  /** Composition by query cache: 1 hour */
  COMPOSITION_BY_QUERY: 3600,
  /** Composition by ID cache: 24 hours */
  COMPOSITION_BY_ID: 86400,
} as const;

// Size limits
export const SIZE_LIMITS = {
  /** Maximum AI response size in bytes (500KB) */
  MAX_AI_RESPONSE: 500_000,
  /** Minimum search query length */
  MIN_QUERY_LENGTH: 2,
  /** Maximum search query length */
  MAX_QUERY_LENGTH: 200,
} as const;
