'use client'

/**
 * Chat Suggestions Component - Suggested questions based on context
 */

import { cn } from '@/lib/utils'
import type { SuggestedQuestion } from '@/stores/chat-store'

interface ChatSuggestionsProps {
  suggestions: SuggestedQuestion[]
  onSelect: (question: string) => void
  className?: string
}

export function ChatSuggestions({
  suggestions,
  onSelect,
  className,
}: ChatSuggestionsProps) {
  if (suggestions.length === 0) return null

  return (
    <div className={cn('px-3 py-2', className)}>
      <div className="text-xs font-mono text-[var(--text-tertiary)] mb-2 uppercase tracking-wider">
        Suggested Questions
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion.question)}
            className={cn(
              'px-3 py-1.5 rounded-full',
              'text-xs font-medium',
              'bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]',
              'text-[var(--text-secondary)]',
              'hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] hover:border-[var(--border-default)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30',
              'transition-all duration-150',
              'truncate max-w-[200px]'
            )}
            title={suggestion.question}
          >
            {suggestion.question}
          </button>
        ))}
      </div>
    </div>
  )
}
