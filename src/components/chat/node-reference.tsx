'use client'

/**
 * Node Reference Component - Clickable reference to a composition node
 * Used in chat messages to link to specific nodes in the 3D view
 */

import { cn } from '@/lib/utils'
import type { CompositionType } from '@/types'

interface NodeReferenceProps {
  nodeName: string
  nodeType?: CompositionType
  onClick?: () => void
  className?: string
}

// Get color class based on node type
function getNodeTypeColor(type?: CompositionType): string {
  switch (type) {
    case 'product':
      return 'text-[var(--node-product)] border-[var(--node-product)]/30 bg-[var(--node-product)]/10 hover:bg-[var(--node-product)]/20'
    case 'component':
      return 'text-[var(--node-component)] border-[var(--node-component)]/30 bg-[var(--node-component)]/10 hover:bg-[var(--node-component)]/20'
    case 'material':
      return 'text-[var(--node-material)] border-[var(--node-material)]/30 bg-[var(--node-material)]/10 hover:bg-[var(--node-material)]/20'
    case 'chemical':
      return 'text-[var(--node-chemical)] border-[var(--node-chemical)]/30 bg-[var(--node-chemical)]/10 hover:bg-[var(--node-chemical)]/20'
    case 'element':
      return 'text-[var(--node-element)] border-[var(--node-element)]/30 bg-[var(--node-element)]/10 hover:bg-[var(--node-element)]/20'
    default:
      return 'text-[var(--accent-primary)] border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20'
  }
}

// Get icon based on node type
function getNodeIcon(type?: CompositionType): string {
  switch (type) {
    case 'product':
      return ''
    case 'component':
      return ''
    case 'material':
      return ''
    case 'chemical':
      return ''
    case 'element':
      return ''
    default:
      return ''
  }
}

export function NodeReference({
  nodeName,
  nodeType,
  onClick,
  className,
}: NodeReferenceProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded border',
        'font-mono text-xs transition-colors cursor-pointer',
        getNodeTypeColor(nodeType),
        className
      )}
      title={`Click to focus on ${nodeName}`}
    >
      <span className="text-[10px]">{getNodeIcon(nodeType)}</span>
      <span>{nodeName}</span>
      <svg
        className="w-3 h-3 opacity-60"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
    </button>
  )
}
