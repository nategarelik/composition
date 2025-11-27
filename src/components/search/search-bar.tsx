'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchStore } from '@/stores'

export function SearchBar() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const { isSearching, startSearch, setQuery } = useSearchStore()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSearching) return

    setQuery(input.trim())
    startSearch()
    router.push(`/composition/search?q=${encodeURIComponent(input.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you want to deconstruct?"
          className="w-full px-6 py-4 text-lg bg-gray-900 border border-gray-700 rounded-full text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          disabled={isSearching}
        />
        <button
          type="submit"
          disabled={!input.trim() || isSearching}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSearching ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Researching...
            </span>
          ) : (
            'Deconstruct'
          )}
        </button>
      </div>
    </form>
  )
}
