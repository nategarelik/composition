'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BottomDrawerProps {
  children: React.ReactNode
  defaultOpen?: boolean
  minHeight?: number
  maxHeight?: number
  className?: string
}

// Snap points for the drawer
const SNAP_POINTS = {
  closed: 48,    // Just the header visible
  partial: 200,  // Partial view
  full: 400,     // Full expanded view
}

export function BottomDrawer({
  children,
  defaultOpen = true,
  minHeight = SNAP_POINTS.closed,
  maxHeight = SNAP_POINTS.full,
  className,
}: BottomDrawerProps) {
  const [height, setHeight] = useState(defaultOpen ? SNAP_POINTS.partial : SNAP_POINTS.closed)
  const [isDragging, setIsDragging] = useState(false)
  const dragControls = useDragControls()
  const containerRef = useRef<HTMLDivElement>(null)

  const isOpen = height > SNAP_POINTS.closed

  // Handle drag end - snap to nearest point
  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    const velocity = info.velocity.y
    const currentHeight = height - info.offset.y

    // If dragging fast, snap in drag direction
    if (Math.abs(velocity) > 500) {
      if (velocity > 0) {
        // Dragging down
        setHeight(currentHeight > SNAP_POINTS.partial ? SNAP_POINTS.partial : SNAP_POINTS.closed)
      } else {
        // Dragging up
        setHeight(currentHeight < SNAP_POINTS.partial ? SNAP_POINTS.partial : SNAP_POINTS.full)
      }
      return
    }

    // Otherwise snap to nearest point
    const snapPoints = [SNAP_POINTS.closed, SNAP_POINTS.partial, SNAP_POINTS.full]
    let nearest = snapPoints[0] ?? SNAP_POINTS.closed
    let nearestDist = Math.abs(currentHeight - nearest)

    for (const point of snapPoints) {
      const dist = Math.abs(currentHeight - point)
      if (dist < nearestDist) {
        nearest = point
        nearestDist = dist
      }
    }

    setHeight(nearest ?? SNAP_POINTS.closed)
  }, [height])

  // Handle drag movement
  const handleDrag = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const newHeight = height - info.offset.y
    // Clamp between min and max
    const clampedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight))
    // Only update if significantly different to reduce re-renders
    if (Math.abs(clampedHeight - height) > 2) {
      setHeight(clampedHeight)
    }
  }, [height, minHeight, maxHeight])

  // Toggle drawer
  const toggleDrawer = useCallback(() => {
    if (height === SNAP_POINTS.closed) {
      setHeight(SNAP_POINTS.partial)
    } else if (height === SNAP_POINTS.partial) {
      setHeight(SNAP_POINTS.full)
    } else {
      setHeight(SNAP_POINTS.closed)
    }
  }, [height])

  // Handle double click to fully expand/collapse
  const handleDoubleClick = useCallback(() => {
    setHeight(height === SNAP_POINTS.full ? SNAP_POINTS.closed : SNAP_POINTS.full)
  }, [height])

  return (
    <motion.div
      ref={containerRef}
      initial={{ height: defaultOpen ? SNAP_POINTS.partial : SNAP_POINTS.closed }}
      animate={{ height }}
      transition={isDragging ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'absolute bottom-0 left-0 right-0 bg-bg-secondary border-t border-border-subtle',
        'flex flex-col overflow-hidden z-20',
        className
      )}
    >
      {/* Drag Handle */}
      <motion.div
        drag="y"
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0}
        onDragStart={() => setIsDragging(true)}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="flex-shrink-0 cursor-grab active:cursor-grabbing"
      >
        <div
          onClick={toggleDrawer}
          onDoubleClick={handleDoubleClick}
          className="flex items-center justify-center h-12 px-4 border-b border-border-subtle hover:bg-bg-tertiary/50 transition-colors"
        >
          {/* Drag indicator */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-border-default" />

          {/* Header content */}
          <div className="flex items-center justify-between w-full mt-2">
            <span className="font-mono text-xs text-text-secondary uppercase tracking-wider">
              Hierarchy
            </span>
            <div className="flex items-center gap-2">
              <ChevronIcon isOpen={isOpen} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content with fade animation */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Chevron icon with animation
function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <motion.svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.2 }}
      className="text-text-secondary"
    >
      <path d="M3 5l4 4 4-4" />
    </motion.svg>
  )
}
