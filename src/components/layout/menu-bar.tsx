'use client'

/**
 * Menu Bar Component - Blender/Figma-style top menu
 */

import * as Menubar from '@radix-ui/react-menubar'
import { cn } from '@/lib/utils'

interface MenuBarProps {
  className?: string
  compositionName?: string
}

export function MenuBar({ className, compositionName }: MenuBarProps) {
  return (
    <Menubar.Root
      className={cn(
        'flex items-center h-8 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]',
        'px-2 select-none',
        className
      )}
    >
      {/* File Menu */}
      <Menubar.Menu>
        <Menubar.Trigger className="px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] rounded transition-colors cursor-pointer outline-none data-[state=open]:bg-[var(--bg-tertiary)] data-[state=open]:text-[var(--text-primary)]">
          FILE
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content
            className="min-w-[180px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md p-1 shadow-[var(--shadow-lg)] z-50"
            align="start"
            sideOffset={4}
          >
            <Menubar.Item className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer">
              New Analysis
              <span className="ml-auto text-[var(--text-tertiary)]">Ctrl+N</span>
            </Menubar.Item>
            <Menubar.Item className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer">
              Open...
              <span className="ml-auto text-[var(--text-tertiary)]">Ctrl+O</span>
            </Menubar.Item>
            <Menubar.Separator className="h-px bg-[var(--border-subtle)] my-1" />
            <Menubar.Item className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer">
              Save
              <span className="ml-auto text-[var(--text-tertiary)]">Ctrl+S</span>
            </Menubar.Item>
            <Menubar.Item className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer">
              Export...
              <span className="ml-auto text-[var(--text-tertiary)]">Ctrl+E</span>
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      {/* Edit Menu */}
      <Menubar.Menu>
        <Menubar.Trigger className="px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] rounded transition-colors cursor-pointer outline-none data-[state=open]:bg-[var(--bg-tertiary)] data-[state=open]:text-[var(--text-primary)]">
          EDIT
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content
            className="min-w-[180px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md p-1 shadow-[var(--shadow-lg)] z-50"
            align="start"
            sideOffset={4}
          >
            <Menubar.Item className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer">
              Undo
              <span className="ml-auto text-[var(--text-tertiary)]">Ctrl+Z</span>
            </Menubar.Item>
            <Menubar.Item className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer">
              Redo
              <span className="ml-auto text-[var(--text-tertiary)]">Ctrl+Y</span>
            </Menubar.Item>
            <Menubar.Separator className="h-px bg-[var(--border-subtle)] my-1" />
            <Menubar.Item className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer">
              Preferences
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      {/* View Menu */}
      <Menubar.Menu>
        <Menubar.Trigger className="px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] rounded transition-colors cursor-pointer outline-none data-[state=open]:bg-[var(--bg-tertiary)] data-[state=open]:text-[var(--text-primary)]">
          VIEW
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content
            className="min-w-[180px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md p-1 shadow-[var(--shadow-lg)] z-50"
            align="start"
            sideOffset={4}
          >
            <Menubar.CheckboxItem className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer">
              <Menubar.ItemIndicator className="absolute left-1">✓</Menubar.ItemIndicator>
              Toolbar
            </Menubar.CheckboxItem>
            <Menubar.CheckboxItem className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer" defaultChecked>
              <Menubar.ItemIndicator className="absolute left-1">✓</Menubar.ItemIndicator>
              Properties Panel
            </Menubar.CheckboxItem>
            <Menubar.CheckboxItem className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer" defaultChecked>
              <Menubar.ItemIndicator className="absolute left-1">✓</Menubar.ItemIndicator>
              Bottom Panel
            </Menubar.CheckboxItem>
            <Menubar.Separator className="h-px bg-[var(--border-subtle)] my-1" />
            <Menubar.Item className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer">
              Toggle Fullscreen
              <span className="ml-auto text-[var(--text-tertiary)]">F11</span>
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      {/* Analysis Menu */}
      <Menubar.Menu>
        <Menubar.Trigger className="px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] rounded transition-colors cursor-pointer outline-none data-[state=open]:bg-[var(--bg-tertiary)] data-[state=open]:text-[var(--text-primary)]">
          ANALYSIS
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content
            className="min-w-[180px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md p-1 shadow-[var(--shadow-lg)] z-50"
            align="start"
            sideOffset={4}
          >
            <Menubar.Item className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer">
              Re-analyze
            </Menubar.Item>
            <Menubar.Item className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer">
              Increase Depth
            </Menubar.Item>
            <Menubar.Separator className="h-px bg-[var(--border-subtle)] my-1" />
            <Menubar.Item className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer">
              View Sources
            </Menubar.Item>
            <Menubar.Item className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer">
              Download Data
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      {/* Help Menu */}
      <Menubar.Menu>
        <Menubar.Trigger className="px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] rounded transition-colors cursor-pointer outline-none data-[state=open]:bg-[var(--bg-tertiary)] data-[state=open]:text-[var(--text-primary)]">
          HELP
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content
            className="min-w-[180px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-md p-1 shadow-[var(--shadow-lg)] z-50"
            align="start"
            sideOffset={4}
          >
            <Menubar.Item className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer">
              Documentation
            </Menubar.Item>
            <Menubar.Item className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer">
              Keyboard Shortcuts
              <span className="ml-auto text-[var(--text-tertiary)]">?</span>
            </Menubar.Item>
            <Menubar.Separator className="h-px bg-[var(--border-subtle)] my-1" />
            <Menubar.Item className="text-xs text-[var(--text-primary)] px-3 py-2 rounded hover:bg-[var(--bg-tertiary)] outline-none cursor-pointer">
              About
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      {/* Composition Name (centered) */}
      {compositionName && (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs text-[var(--text-primary)] font-medium">
            {compositionName}
          </span>
        </div>
      )}

      {/* Window Controls (right) */}
      <div className="flex items-center gap-1 ml-auto">
        <button
          className="w-6 h-6 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded transition-colors"
          title="Settings"
        >
          ⚙
        </button>
        <button
          className="w-6 h-6 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded transition-colors"
          title="Minimize"
        >
          −
        </button>
        <button
          className="w-6 h-6 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded transition-colors"
          title="Maximize"
        >
          □
        </button>
        <button
          className="w-6 h-6 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-danger)] hover:bg-[var(--bg-tertiary)] rounded transition-colors"
          title="Close"
        >
          ×
        </button>
      </div>
    </Menubar.Root>
  )
}
