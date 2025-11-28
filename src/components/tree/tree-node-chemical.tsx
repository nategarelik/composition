'use client'

import type { CompositionNode } from '@/types'
import { cn } from '@/lib/utils'

interface TreeNodeChemicalProps {
  node: CompositionNode
  isSelected: boolean
  isHovered: boolean
}

// Chemical-specific display with molecular formula
export function TreeNodeChemical({ node, isSelected, isHovered }: TreeNodeChemicalProps) {
  const formula = node.metadata?.formula as string | undefined
  const casNumber = node.metadata?.casNumber as string | undefined

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-2 py-1 rounded',
        isSelected && 'ring-1 ring-layer-chemical/50',
        isHovered && 'bg-layer-chemical/5'
      )}
    >
      {/* Chemical Icon */}
      <div className="flex items-center justify-center w-6 h-6">
        <span className="text-lg text-layer-chemical">⬡</span>
      </div>

      {/* Chemical Info */}
      <div className="flex-1 min-w-0">
        <div className="font-mono text-xs text-text-primary truncate">
          {node.name}
        </div>
        {formula && (
          <div className="font-mono text-[10px] text-layer-chemical truncate">
            {formatFormula(formula)}
          </div>
        )}
        {casNumber && (
          <div className="font-mono text-[9px] text-text-secondary truncate">
            CAS: {casNumber}
          </div>
        )}
      </div>

      {/* Percentage */}
      <div className="font-mono text-xs text-layer-chemical tabular-nums">
        {formatPercentage(node.percentage)}
      </div>
    </div>
  )
}

// Format chemical formula with subscripts (using Unicode)
function formatFormula(formula: string): string {
  // Replace numbers with subscript equivalents
  return formula.replace(/(\d+)/g, (match) => {
    const subscripts = '₀₁₂₃₄₅₆₇₈₉'
    return match.split('').map((d) => subscripts[parseInt(d)]).join('')
  })
}

function formatPercentage(value: number): string {
  if (value >= 10) return `${Math.round(value)}%`
  if (value >= 1) return `${value.toFixed(1)}%`
  if (value >= 0.1) return `${value.toFixed(2)}%`
  return '<0.1%'
}
