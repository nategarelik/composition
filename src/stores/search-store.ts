'use client'

import { create } from 'zustand'
import type { ResearchProgress } from '@/types'

interface SearchState {
  query: string
  isSearching: boolean
  progress: ResearchProgress
  error: string | null
  setQuery: (query: string) => void
  startSearch: () => void
  updateProgress: (stage: ResearchProgress['stage'], percentage: number, message?: string) => void
  setError: (error: string) => void
  reset: () => void
}

const initialProgress: ResearchProgress = {
  stage: 'identifying',
  percentage: 0,
  message: '',
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  isSearching: false,
  progress: initialProgress,
  error: null,

  setQuery: (query) => set({ query }),

  startSearch: () =>
    set({
      isSearching: true,
      error: null,
      progress: {
        stage: 'identifying',
        percentage: 10,
        message: 'Starting research...',
      },
    }),

  updateProgress: (stage, percentage, message = '') =>
    set({
      progress: { stage, percentage, message },
      isSearching: stage !== 'complete' && stage !== 'error',
    }),

  setError: (error) =>
    set({
      error,
      isSearching: false,
      progress: {
        stage: 'error',
        percentage: 0,
        message: error,
      },
    }),

  reset: () =>
    set({
      query: '',
      isSearching: false,
      progress: initialProgress,
      error: null,
    }),
}))
