'use client'

import type { CompositionNode } from '@/types'
import { cn } from '@/lib/utils'

interface TreeNodeComponentProps {
  node: CompositionNode
  isSelected: boolean
  isHovered: boolean
  childCount: number
}

// Component-specific display with engineering details
export function TreeNodeComponent({
  node,
  isSelected,
  isHovered,
  childCount,
}: TreeNodeComponentProps) {
  const partNumber = node.metadata?.partNumber as string | undefined
  const manufacturer = node.metadata?.manufacturer as string | undefined

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-2 py-1 rounded',
        isSelected && 'ring-1 ring-layer-component/50',
        isHovered && 'bg-layer-component/5'
      )}
    >
      {/* Component Icon */}
      <div className="flex items-center justify-center w-6 h-6">
        <span className="text-base text-layer-component">◇</span>
      </div>

      {/* Component Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-mono text-xs text-text-primary truncate">
            {node.name}
          </span>
          {childCount > 0 && (
            <span className="font-mono text-[9px] text-text-secondary">
              ({childCount})
            </span>
          )}
        </div>
        {partNumber && (
          <div className="font-mono text-[10px] text-layer-component truncate">
            P/N: {partNumber}
          </div>
        )}
        {manufacturer && (
          <div className="font-mono text-[9px] text-text-secondary truncate">
            {manufacturer}
          </div>
        )}
      </div>

      {/* Mass Percentage */}
      <div className="flex flex-col items-end">
        <span className="font-mono text-xs text-layer-component tabular-nums">
          {formatPercentage(node.percentage)}
        </span>
        {typeof node.metadata?.mass === 'number' && (
          <span className="font-mono text-[9px] text-text-secondary tabular-nums">
            {formatMass(node.metadata.mass)}
          </span>
        )}
      </div>
    </div>
  )
}

function formatPercentage(value: number): string {
  if (value >= 10) return `${Math.round(value)}%`
  if (value >= 1) return `${value.toFixed(1)}%`
  if (value >= 0.1) return `${value.toFixed(2)}%`
  return '<0.1%'
}

function formatMass(grams: number): string {
  if (grams >= 1000) return `${(grams / 1000).toFixed(1)}kg`
  if (grams >= 1) return `${grams.toFixed(1)}g`
  return `${(grams * 1000).toFixed(0)}mg`
}
