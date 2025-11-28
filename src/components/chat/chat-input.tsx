'use client'

/**
 * Chat Input Component - Terminal-style input for chat messages
 */

import { useState, useRef, useCallback, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSubmit: (message: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function ChatInput({
  onSubmit,
  disabled = false,
  placeholder = 'Ask about this composition...',
  className,
}: ChatInputProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim()
    if (trimmed && !disabled) {
      onSubmit(trimmed)
      setValue('')
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto'
      }
    }
  }, [value, disabled, onSubmit])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  // Auto-resize textarea
  const handleInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
    }
  }, [])

  return (
    <div
      className={cn(
        'flex items-end gap-2 p-3 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]',
        className
      )}
    >
      {/* Terminal prompt indicator */}
      <div className="flex-shrink-0 text-[var(--text-mono)] font-mono text-sm pb-2.5">
        &gt;
      </div>

      {/* Input area */}
      <div className="flex-1 relative">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className={cn(
            'w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-md',
            'px-3 py-2 text-sm text-[var(--text-primary)] font-mono',
            'placeholder:text-[var(--text-tertiary)]',
            'focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--border-active)]',
            'resize-none overflow-hidden',
            'transition-colors duration-150',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{ minHeight: '40px' }}
        />

        {/* Character count */}
        {value.length > 1500 && (
          <div
            className={cn(
              'absolute right-2 bottom-2 text-xs font-mono',
              value.length > 1900
                ? 'text-[var(--accent-danger)]'
                : 'text-[var(--text-tertiary)]'
            )}
          >
            {value.length}/2000
          </div>
        )}
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className={cn(
          'flex-shrink-0 px-4 py-2 rounded-md font-medium text-sm',
          'bg-[var(--accent-primary)] text-white',
          'hover:bg-[var(--accent-primary)]/80',
          'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)]',
          'transition-all duration-150',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--accent-primary)]'
        )}
        title="Send message (Enter)"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </button>
    </div>
  )
}
