/**
 * Composition data types
 */

export type CompositionType = 'product' | 'component' | 'material' | 'chemical' | 'element'

export type ConfidenceLevel = 'verified' | 'estimated' | 'speculative'

export type ViewMode = 'exploded' | 'compact' | 'slice'

export interface VisualConfig {
  color?: string
  texture?: string
  opacity?: number
  shape?: 'sphere' | 'cube' | 'cylinder' | 'custom' | 'rounded-box' | 'capsule'
}

export interface CompositionNode {
  id: string
  name: string
  type: CompositionType
  percentage: number
  description?: string
  confidence: ConfidenceLevel
  symbol?: string // For elements (e.g., "Fe", "O")
  atomicNumber?: number // For elements
  casNumber?: string // Chemical Abstract Service number
  visualConfig?: VisualConfig
  children?: CompositionNode[]
  metadata?: Record<string, unknown> // Additional type-specific data
}

export interface Source {
  id: string
  type: 'official' | 'scientific' | 'database' | 'calculated' | 'estimated'
  name: string
  url?: string
  accessedAt: string
  confidence: ConfidenceLevel
  notes?: string
}

export interface Composition {
  id: string
  query: string
  name: string
  category: string
  description?: string
  root: CompositionNode
  sources: Source[]
  confidence: ConfidenceLevel
  researchedAt: string
  viewCount: number
  shareCount: number
}

export interface ResearchResult {
  name: string
  category: string
  description?: string
  root: CompositionNode
  sources: Source[]
  confidence: ConfidenceLevel
}

export interface ResearchProgress {
  stage: 'identifying' | 'researching' | 'analyzing' | 'synthesizing' | 'complete' | 'error'
  percentage: number
  message: string
}
