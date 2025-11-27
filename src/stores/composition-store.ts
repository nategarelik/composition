'use client'

import { create } from 'zustand'
import type { Composition, CompositionNode, ViewMode } from '@/types'

interface CompositionState {
  composition: Composition | null
  selectedNode: CompositionNode | null
  hoveredNode: CompositionNode | null
  viewMode: ViewMode
  depthLevel: number
  maxDepth: number
  isExploded: boolean
  setComposition: (composition: Composition) => void
  selectNode: (node: CompositionNode | null) => void
  setHoveredNode: (node: CompositionNode | null) => void
  setViewMode: (mode: ViewMode) => void
  setDepthLevel: (level: number) => void
  toggleExploded: () => void
  reset: () => void
}

export const useCompositionStore = create<CompositionState>((set) => ({
  composition: null,
  selectedNode: null,
  hoveredNode: null,
  viewMode: 'exploded',
  depthLevel: 4,
  maxDepth: 5,
  isExploded: false,

  setComposition: (composition) =>
    set({
      composition,
      selectedNode: null,
      hoveredNode: null,
      isExploded: false,
    }),

  selectNode: (selectedNode) => set({ selectedNode }),

  setHoveredNode: (hoveredNode) => set({ hoveredNode }),

  setViewMode: (viewMode) => set({ viewMode }),

  setDepthLevel: (level) =>
    set((state) => ({
      depthLevel: Math.max(1, Math.min(level, state.maxDepth)),
    })),

  toggleExploded: () => set((state) => ({ isExploded: !state.isExploded })),

  reset: () =>
    set({
      composition: null,
      selectedNode: null,
      hoveredNode: null,
      viewMode: 'exploded',
      depthLevel: 4,
      isExploded: false,
    }),
}))
