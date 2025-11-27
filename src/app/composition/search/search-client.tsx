'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSearchStore, useCompositionStore } from '@/stores'
import { SearchProgress } from '@/components/search'
import type { ApiResponse, SearchResponse } from '@/types'

export function SearchPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams?.get('q') ?? null
  const { updateProgress, setError, isSearching, startSearch } = useSearchStore()
  const { setComposition } = useCompositionStore()

  useEffect(() => {
    if (!query) {
      router.push('/')
      return
    }

    async function performSearch() {
      if (!isSearching) {
        startSearch()
      }

      updateProgress('researching', 20, `Researching "${query}"...`)

      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        })

        const data = await response.json() as ApiResponse<SearchResponse>

        if (data.success && data.data) {
          updateProgress('complete', 100, 'Research complete!')
          setComposition(data.data.composition)
          router.push(`/composition/${data.data.composition.id}`)
        } else {
          setError(data.error?.message ?? 'Failed to research composition')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Network error')
      }
    }

    performSearch()
  }, [query, router, updateProgress, setError, setComposition, isSearching, startSearch])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-white text-center mb-8">
          Researching: {query}
        </h1>
        <SearchProgress />
        <p className="text-center text-gray-400 mt-4">
          This may take 15-60 seconds depending on complexity...
        </p>
      </div>
    </main>
  )
}
