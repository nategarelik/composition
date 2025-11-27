/**
 * API response types
 */

import type { Composition } from './composition'

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
}

export interface SearchResponse {
  composition: Composition
  cached: boolean
  researchTime?: number
}

export interface ShareResponse {
  shortCode: string
  url: string
  compositionId: string
  depthLevel: number
  viewMode: string
}

export interface CompositionResponse {
  composition: Composition
}
