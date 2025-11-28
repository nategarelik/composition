'use client'

/**
 * Toolbar Component - Left vertical tool palette with keyboard shortcuts
 */

import { cn } from '@/lib/utils'
import type { CompositionType } from '@/types/composition'

interface ToolButtonProps {
  icon: string
  label: string
  shortcut: string
  active?: boolean
  onClick?: () => void
}

function ToolButton({ icon, label, shortcut, active, onClick }: ToolButtonProps) {
  return (
    <button
      className={cn(
        'relative flex items-center justify-center w-8 h-8 rounded text-lg',
        'text-[var(--text-secondary)] transition-colors group',
        'hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]',
        'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-panel)]',
        active && 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary)]'
      )}
      onClick={onClick}
      title={`${label} (${shortcut})`}
    >
      <span>{icon}</span>

      {/* Tooltip */}
      <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
        <span className="text-[var(--text-primary)]">{label}</span>
        <span className="ml-2 text-[var(--text-tertiary)]">{shortcut}</span>
      </div>
    </button>
  )
}

interface LayerToggleProps {
  type: CompositionType
  visible?: boolean
  onClick?: () => void
}

function LayerToggle({ type, visible = true, onClick }: LayerToggleProps) {
  const config: Record<CompositionType, { label: string; color: string }> = {
    product: { label: 'Product', color: 'var(--accent-primary)' },
    component: { label: 'Component', color: '#a855f7' },
    material: { label: 'Material', color: '#f97316' },
    chemical: { label: 'Chemical', color: '#00d4aa' },
    element: { label: 'Element', color: '#eab308' },
  }

  const { label, color } = config[type]

  return (
    <button
      className={cn(
        'relative flex items-center justify-center w-8 h-8 rounded text-sm',
        'transition-colors group',
        'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-panel)]',
        visible
          ? 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
          : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)]'
      )}
      onClick={onClick}
      title={label}
      style={{
        color: visible ? color : undefined,
      }}
    >
      <span>{visible ? '●' : '○'}</span>

      {/* Tooltip */}
      <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
        <span className="text-[var(--text-primary)]">{label} Layer</span>
        <span className="ml-2 text-[var(--text-tertiary)]">
          {visible ? 'Visible' : 'Hidden'}
        </span>
      </div>
    </button>
  )
}

interface ToolbarProps {
  className?: string
  activeTool?: 'select' | 'move' | 'rotate' | 'scale'
  onToolChange?: (tool: 'select' | 'move' | 'rotate' | 'scale') => void
  visibleLayers?: Set<CompositionType>
  onLayerToggle?: (type: CompositionType) => void
}

export function Toolbar({
  className,
  activeTool = 'select',
  onToolChange,
  visibleLayers = new Set(['product', 'component', 'material', 'chemical', 'element']),
  onLayerToggle,
}: ToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 p-2 bg-[var(--bg-panel)] border-r border-[var(--border-subtle)]',
        'w-12 h-full',
        className
      )}
    >
      {/* Tool Buttons */}
      <div className="flex flex-col gap-1">
        <ToolButton
          icon="◇"
          label="Select"
          shortcut="V"
          active={activeTool === 'select'}
          onClick={() => onToolChange?.('select')}
        />
        <ToolButton
          icon="↔"
          label="Move"
          shortcut="G"
          active={activeTool === 'move'}
          onClick={() => onToolChange?.('move')}
        />
        <ToolButton
          icon="⟳"
          label="Rotate"
          shortcut="R"
          active={activeTool === 'rotate'}
          onClick={() => onToolChange?.('rotate')}
        />
        <ToolButton
          icon="⊞"
          label="Scale"
          shortcut="S"
          active={activeTool === 'scale'}
          onClick={() => onToolChange?.('scale')}
        />
      </div>

      {/* Separator */}
      <div className="h-px bg-[var(--border-subtle)] my-2" />

      {/* Layer Toggles */}
      <div className="flex flex-col gap-1">
        <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider px-1 mb-1 font-mono">
          Layers
        </div>
        <LayerToggle
          type="product"
          visible={visibleLayers.has('product')}
          onClick={() => onLayerToggle?.('product')}
        />
        <LayerToggle
          type="component"
          visible={visibleLayers.has('component')}
          onClick={() => onLayerToggle?.('component')}
        />
        <LayerToggle
          type="material"
          visible={visibleLayers.has('material')}
          onClick={() => onLayerToggle?.('material')}
        />
        <LayerToggle
          type="chemical"
          visible={visibleLayers.has('chemical')}
          onClick={() => onLayerToggle?.('chemical')}
        />
        <LayerToggle
          type="element"
          visible={visibleLayers.has('element')}
          onClick={() => onLayerToggle?.('element')}
        />
      </div>
    </div>
  )
}
