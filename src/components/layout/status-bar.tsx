'use client'

/**
 * Status Bar Component - Bottom status bar with mode and shortcuts
 */

import { cn } from '@/lib/utils'
import type { ViewMode } from '@/types/composition'

interface StatusBarProps {
  className?: string
  mode?: ViewMode
  zoomLevel?: number
  selectedCount?: number
  message?: string
}

export function StatusBar({
  className,
  mode = 'exploded',
  zoomLevel = 100,
  selectedCount = 0,
  message,
}: StatusBarProps) {
  const modeConfig: Record<ViewMode, { label: string; icon: string }> = {
    exploded: { label: 'Exploded View', icon: '⬌' },
    compact: { label: 'Compact View', icon: '⊞' },
    slice: { label: 'Cross Section', icon: '⊟' },
  }

  const shortcuts = [
    { key: 'V', label: 'Select' },
    { key: 'G', label: 'Move' },
    { key: 'R', label: 'Rotate' },
    { key: 'S', label: 'Scale' },
    { key: 'F', label: 'Focus' },
    { key: 'H', label: 'Hide' },
  ]

  return (
    <div
      className={cn(
        'flex items-center h-6 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]',
        'px-3 text-xs select-none',
        className
      )}
    >
      {/* Left Section - Mode and Status */}
      <div className="flex items-center gap-3">
        {/* View Mode */}
        <div className="flex items-center gap-1.5">
          <span className="text-[var(--text-tertiary)]">{modeConfig[mode].icon}</span>
          <span className="text-[var(--text-secondary)] font-mono">{modeConfig[mode].label}</span>
        </div>

        {/* Separator */}
        <div className="w-px h-3 bg-[var(--border-subtle)]" />

        {/* Zoom Level */}
        <div className="flex items-center gap-1.5">
          <span className="text-[var(--text-tertiary)]">🔍</span>
          <span className="text-[var(--text-secondary)] font-mono tabular-nums">
            {zoomLevel.toFixed(0)}%
          </span>
        </div>

        {/* Selected Count */}
        {selectedCount > 0 && (
          <>
            <div className="w-px h-3 bg-[var(--border-subtle)]" />
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--text-tertiary)]">◇</span>
              <span className="text-[var(--text-secondary)] font-mono">
                {selectedCount} selected
              </span>
            </div>
          </>
        )}
      </div>

      {/* Center Section - Message */}
      {message && (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-[var(--text-secondary)] font-mono italic">{message}</span>
        </div>
      )}

      {/* Right Section - Keyboard Shortcuts */}
      <div className="ml-auto flex items-center gap-3">
        {shortcuts.map((shortcut, index) => (
          <div key={shortcut.key} className="flex items-center gap-3">
            {index > 0 && <div className="w-px h-3 bg-[var(--border-subtle)]" />}
            <div className="flex items-center gap-1">
              <kbd className="inline-flex items-center justify-center w-4 h-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded text-[10px] font-mono text-[var(--text-primary)]">
                {shortcut.key}
              </kbd>
              <span className="text-[var(--text-tertiary)] text-[10px]">{shortcut.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
