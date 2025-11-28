'use client'

import { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { CompositionNode } from '@/types'
import { useCompositionStore } from '@/stores'
import { cn } from '@/lib/utils'

interface VirtualTreeProps {
  root: CompositionNode
  className?: string
  itemHeight?: number
  overscan?: number
}

interface FlattenedNode {
  node: CompositionNode
  depth: number
  isExpanded: boolean
  hasChildren: boolean
}

// Type-specific colors
const TYPE_COLORS: Record<string, string> = {
  product: 'text-layer-product',
  component: 'text-layer-component',
  material: 'text-layer-material',
  chemical: 'text-layer-chemical',
  element: 'text-layer-element',
}

const TYPE_ICONS: Record<string, string> = {
  product: '\u25C6',
  component: '\u25C7',
  material: '\u25CB',
  chemical: '\u2B21',
  element: '\u25CF',
}

// Flatten tree into visible nodes list
function flattenTree(
  node: CompositionNode,
  expandedNodes: Set<string>,
  depth: number = 0
): FlattenedNode[] {
  const hasChildren = !!(node.children && node.children.length > 0)
  const isExpanded = expandedNodes.has(node.id)

  const result: FlattenedNode[] = [{
    node,
    depth,
    isExpanded,
    hasChildren,
  }]

  if (hasChildren && isExpanded) {
    for (const child of node.children!) {
      result.push(...flattenTree(child, expandedNodes, depth + 1))
    }
  }

  return result
}

export function VirtualTree({
  root,
  className,
  itemHeight = 28,
  overscan = 5,
}: VirtualTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  const treeExpandedNodes = useCompositionStore((s) => s.treeExpandedNodes)
  const selectedNode = useCompositionStore((s) => s.selectedNode)
  const hoveredNode = useCompositionStore((s) => s.hoveredNode)
  const selectNode = useCompositionStore((s) => s.selectNode)
  const setHoveredNode = useCompositionStore((s) => s.setHoveredNode)
  const toggleTreeNode = useCompositionStore((s) => s.toggleTreeNode)
  const toggleNodeExpansion = useCompositionStore((s) => s.toggleNodeExpansion)
  const setFocusedNode = useCompositionStore((s) => s.setFocusedNode)

  // Flatten tree based on expanded state
  const flatNodes = useMemo(
    () => flattenTree(root, treeExpandedNodes),
    [root, treeExpandedNodes]
  )

  const totalHeight = flatNodes.length * itemHeight

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    flatNodes.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleNodes = flatNodes.slice(startIndex, endIndex)
  const offsetY = startIndex * itemHeight

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  // Update container height on resize
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height)
      }
    })

    resizeObserver.observe(container)
    setContainerHeight(container.clientHeight)

    return () => resizeObserver.disconnect()
  }, [])

  // Scroll selected node into view
  useEffect(() => {
    if (!selectedNode || !containerRef.current) return

    const nodeIndex = flatNodes.findIndex(f => f.node.id === selectedNode.id)
    if (nodeIndex === -1) return

    const nodeTop = nodeIndex * itemHeight
    const nodeBottom = nodeTop + itemHeight
    const viewTop = scrollTop
    const viewBottom = scrollTop + containerHeight

    if (nodeTop < viewTop) {
      containerRef.current.scrollTop = nodeTop - itemHeight
    } else if (nodeBottom > viewBottom) {
      containerRef.current.scrollTop = nodeBottom - containerHeight + itemHeight
    }
  }, [selectedNode, flatNodes, itemHeight, scrollTop, containerHeight])

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleNodes.map(({ node, depth, isExpanded, hasChildren }) => {
            const isSelected = selectedNode?.id === node.id
            const isHovered = hoveredNode?.id === node.id

            return (
              <VirtualTreeNode
                key={node.id}
                node={node}
                depth={depth}
                isExpanded={isExpanded}
                hasChildren={hasChildren}
                isSelected={isSelected}
                isHovered={isHovered}
                itemHeight={itemHeight}
                onSelect={() => selectNode(node)}
                onHover={(hover) => setHoveredNode(hover ? node : null)}
                onToggleExpand={() => toggleTreeNode(node.id)}
                onDoubleClick={() => {
                  setFocusedNode(node.id)
                  if (hasChildren) {
                    toggleNodeExpansion(node.id)
                  }
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface VirtualTreeNodeProps {
  node: CompositionNode
  depth: number
  isExpanded: boolean
  hasChildren: boolean
  isSelected: boolean
  isHovered: boolean
  itemHeight: number
  onSelect: () => void
  onHover: (hover: boolean) => void
  onToggleExpand: () => void
  onDoubleClick: () => void
}

function VirtualTreeNode({
  node,
  depth,
  isExpanded,
  hasChildren,
  isSelected,
  isHovered,
  itemHeight,
  onSelect,
  onHover,
  onToggleExpand,
  onDoubleClick,
}: VirtualTreeNodeProps) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect()
  }, [onSelect])

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onDoubleClick()
  }, [onDoubleClick])

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleExpand()
  }, [onToggleExpand])

  // Confidence indicator
  const confidenceIndicator = useMemo(() => {
    switch (node.confidence) {
      case 'verified':
        return <span className="text-accent-secondary" title="Verified">\u25CF</span>
      case 'estimated':
        return <span className="text-accent-warning" title="Estimated">\u25CF</span>
      case 'speculative':
        return <span className="text-accent-danger" title="Speculative">\u25CF</span>
      default:
        return null
    }
  }, [node.confidence])

  return (
    <div
      className={cn(
        'flex items-center gap-1 px-1 rounded cursor-pointer transition-colors',
        'hover:bg-bg-tertiary',
        isSelected && 'bg-accent-primary/20 hover:bg-accent-primary/25',
        isHovered && !isSelected && 'bg-bg-tertiary'
      )}
      style={{
        height: itemHeight,
        paddingLeft: `${depth * 12 + 4}px`,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Expand/Collapse Toggle */}
      {hasChildren ? (
        <button
          onClick={handleToggle}
          className="flex items-center justify-center w-4 h-4 text-text-secondary hover:text-text-primary"
        >
          <motion.svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <path d="M3 2l4 3-4 3" />
          </motion.svg>
        </button>
      ) : (
        <span className="w-4 h-4" />
      )}

      {/* Type Icon */}
      <span className={cn('text-xs', TYPE_COLORS[node.type] || 'text-text-secondary')}>
        {TYPE_ICONS[node.type] || '\u25CB'}
      </span>

      {/* Node Name */}
      <span
        className={cn(
          'flex-1 font-mono text-xs truncate',
          isSelected ? 'text-text-primary font-medium' : 'text-text-primary'
        )}
      >
        {node.name}
      </span>

      {/* Percentage */}
      {node.percentage !== undefined && (
        <span className="font-mono text-[10px] text-text-secondary tabular-nums">
          {formatPercentage(node.percentage)}
        </span>
      )}

      {/* Confidence Indicator */}
      <span className="text-[8px]">{confidenceIndicator}</span>
    </div>
  )
}

// Format percentage for display
function formatPercentage(value: number): string {
  if (value >= 10) {
    return `${Math.round(value)}%`
  } else if (value >= 1) {
    return `${value.toFixed(1)}%`
  } else if (value >= 0.1) {
    return `${value.toFixed(2)}%`
  } else {
    return '<0.1%'
  }
}
