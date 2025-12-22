'use client';
import React, { useEffect, useRef } from 'react';
import { useUIStore } from '@/stores/ui-store';
import type { CompositionType } from '@/types';

const VIEW_MODES = [
  { id: '2d', label: '2D', icon: '▦' },
  { id: '3d', label: '3D', icon: '◇' },
  { id: 'split', label: 'Split', icon: '⊞' },
] as const;

const LAYER_TYPES: { type: CompositionType; label: string; icon: string }[] = [
  { type: 'product', label: 'Product', icon: '📦' },
  { type: 'component', label: 'Component', icon: '🔩' },
  { type: 'material', label: 'Material', icon: '🧱' },
  { type: 'chemical', label: 'Chemical', icon: '⚗️' },
  { type: 'element', label: 'Element', icon: '⚛️' },
];

interface ToolbarButtonProps {
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="h-8 px-3 flex items-center gap-1.5 rounded transition-colors disabled:opacity-50"
      style={{
        backgroundColor: active ? 'var(--theme-accent-primary)' : 'transparent',
        color: active ? 'var(--theme-bg-primary)' : 'var(--theme-text-primary)',
      }}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return (
    <div
      className="w-px h-6 mx-1"
      style={{ backgroundColor: 'var(--theme-border)' }}
    />
  );
}

interface LayersMenuProps {
  visibleLayers: Set<CompositionType>;
  toggleLayer: (layer: CompositionType) => void;
  onClose: () => void;
}

function LayersMenu({ visibleLayers, toggleLayer, onClose }: LayersMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute bottom-full mb-2 left-0 py-2 rounded shadow-lg min-w-[160px] z-50"
      style={{
        backgroundColor: 'var(--theme-bg-secondary)',
        border: '1px solid var(--theme-border)',
      }}
    >
      <div
        className="px-3 py-1 text-xs font-mono"
        style={{ color: 'var(--theme-text-secondary)' }}
      >
        LAYER VISIBILITY
      </div>
      {LAYER_TYPES.map((layer) => (
        <button
          key={layer.type}
          onClick={() => toggleLayer(layer.type)}
          className="w-full px-3 py-2 flex items-center gap-2 text-left transition-colors hover:bg-opacity-50"
          style={{
            backgroundColor: visibleLayers.has(layer.type)
              ? 'var(--theme-accent-primary)'
              : 'transparent',
            color: visibleLayers.has(layer.type)
              ? 'var(--theme-text-primary)'
              : 'var(--theme-text-secondary)',
          }}
        >
          <span>{layer.icon}</span>
          <span className="text-sm">{layer.label}</span>
          <span className="ml-auto text-xs">
            {visibleLayers.has(layer.type) ? '✓' : ''}
          </span>
        </button>
      ))}
    </div>
  );
}

export function Toolbar() {
  const canvasMode = useUIStore((s) => s.canvasMode);
  const setCanvasMode = useUIStore((s) => s.setCanvasMode);
  const zoomIn = useUIStore((s) => s.zoomIn);
  const zoomOut = useUIStore((s) => s.zoomOut);
  const fitToView = useUIStore((s) => s.fitToView);
  const visibleLayers = useUIStore((s) => s.visibleLayers);
  const toggleLayer = useUIStore((s) => s.toggleLayer);

  const [showLayersMenu, setShowLayersMenu] = React.useState(false);

  const handleExport = () => {
    alert('Export functionality coming soon!');
  };

  return (
    <div
      className="h-11 flex items-center justify-between px-3 text-sm font-mono relative"
      style={{
        backgroundColor: 'var(--theme-bg-secondary)',
        borderTop: '1px solid var(--theme-border)',
        borderBottom: '1px solid var(--theme-border)',
      }}
    >
      {/* Left: View Mode Toggle */}
      <div className="flex items-center gap-1">
        {VIEW_MODES.map((mode) => (
          <ToolbarButton
            key={mode.id}
            active={canvasMode === mode.id}
            onClick={() => setCanvasMode(mode.id)}
            title={`Switch to ${mode.label} view`}
          >
            <span>{mode.icon}</span>
            <span className="text-xs">{mode.label}</span>
          </ToolbarButton>
        ))}
      </div>

      {/* Center: Canvas Controls */}
      <div className="flex items-center gap-1">
        <ToolbarButton title="Zoom in (increase scale)" onClick={zoomIn}>
          <span>+</span>
        </ToolbarButton>
        <ToolbarButton title="Zoom out (decrease scale)" onClick={zoomOut}>
          <span>−</span>
        </ToolbarButton>
        <ToolbarButton title="Fit to view (reset zoom and center)" onClick={fitToView}>
          <span>⊡</span>
          <span className="text-xs">Fit</span>
        </ToolbarButton>

        <ToolbarDivider />

        <div className="relative">
          <ToolbarButton
            title="Toggle layer visibility"
            onClick={() => setShowLayersMenu(!showLayersMenu)}
            active={showLayersMenu}
          >
            <span>☰</span>
            <span className="text-xs">Layers</span>
          </ToolbarButton>

          {showLayersMenu && (
            <LayersMenu
              visibleLayers={visibleLayers}
              toggleLayer={toggleLayer}
              onClose={() => setShowLayersMenu(false)}
            />
          )}
        </div>
      </div>

      {/* Right: Export */}
      <div className="flex items-center gap-1">
        <ToolbarButton title="Export composition" onClick={handleExport}>
          <span>↓</span>
          <span className="text-xs">Export</span>
        </ToolbarButton>
      </div>
    </div>
  );
}
