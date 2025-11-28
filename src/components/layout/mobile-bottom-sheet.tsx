'use client'

import { useState, useCallback } from 'react'
import { Drawer } from 'vaul'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-is-mobile'

interface MobileBottomSheetProps {
  children: React.ReactNode
  trigger?: React.ReactNode
  title?: string
  className?: string
  defaultOpen?: boolean
  snapPoints?: (number | string)[]
}

// Default snap points for mobile drawer
const DEFAULT_SNAP_POINTS = [0.25, 0.5, 1] as const

export function MobileBottomSheet({
  children,
  trigger,
  title = 'Details',
  className,
  defaultOpen = false,
  snapPoints = [...DEFAULT_SNAP_POINTS],
}: MobileBottomSheetProps) {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0] ?? 0.25)
  const [open, setOpen] = useState(defaultOpen)

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen)
  }, [])

  return (
    <Drawer.Root
      open={open}
      onOpenChange={handleOpenChange}
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={false}
    >
      {trigger && (
        <Drawer.Trigger asChild>
          {trigger}
        </Drawer.Trigger>
      )}

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />

        <Drawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50',
            'flex flex-col rounded-t-[10px]',
            'bg-bg-secondary border-t border-border-subtle',
            'max-h-[96vh]',
            className
          )}
        >
          {/* Drag handle */}
          <div className="flex items-center justify-center py-3">
            <div className="w-12 h-1.5 rounded-full bg-border-default" />
          </div>

          {/* Header */}
          <Drawer.Title className="px-4 pb-3 border-b border-border-subtle">
            <span className="font-mono text-xs text-text-secondary uppercase tracking-wider">
              {title}
            </span>
          </Drawer.Title>

          {/* Scrollable content */}
          <div
            className={cn(
              'flex-1 overflow-auto',
              // Only allow scrolling at top snap point
              snap === 1 ? 'overflow-y-auto' : 'overflow-y-hidden'
            )}
          >
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

// Re-export the hook for convenience
export { useIsMobile } from '@/hooks/use-is-mobile'

// Responsive wrapper that switches between desktop drawer and mobile sheet
interface ResponsiveDrawerProps {
  children: React.ReactNode
  desktopComponent: React.ReactNode
  title?: string
}

export function ResponsiveDrawer({
  children,
  desktopComponent,
  title,
}: ResponsiveDrawerProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <MobileBottomSheet title={title} defaultOpen>
        {children}
      </MobileBottomSheet>
    )
  }

  return <>{desktopComponent}</>
}
