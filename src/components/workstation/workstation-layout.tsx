'use client';
import { useState, ReactNode } from 'react';
import { StatusBar } from './status-bar';
import { Toolbar } from './toolbar';

interface WorkstationLayoutProps {
  treePanel: ReactNode;
  canvas: ReactNode;
  detailPanel: ReactNode;
}

export function WorkstationLayout({ treePanel, canvas, detailPanel }: WorkstationLayoutProps) {
  const [treePanelCollapsed, setTreePanelCollapsed] = useState(false);
  const [detailExpanded, setDetailExpanded] = useState(false);

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--theme-bg-primary)', color: 'var(--theme-text-primary)' }}>
      <StatusBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Tree Panel - collapsible sidebar */}
        <aside
          className="h-full overflow-hidden transition-[width] duration-300 ease-in-out"
          style={{
            width: treePanelCollapsed ? 0 : 280,
            borderRight: '1px solid var(--theme-border)',
            backgroundColor: 'var(--theme-bg-secondary)'
          }}
        >
          <div className="h-full overflow-y-auto">
            {treePanel}
          </div>
        </aside>

        {/* Toggle button for tree panel */}
        <button
          onClick={() => setTreePanelCollapsed(!treePanelCollapsed)}
          className="w-4 h-full flex items-center justify-center hover:bg-opacity-10 hover:bg-white transition-colors"
          style={{ backgroundColor: 'var(--theme-bg-secondary)' }}
          aria-label={treePanelCollapsed ? 'Expand tree panel' : 'Collapse tree panel'}
        >
          <span className="text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
            {treePanelCollapsed ? '▶' : '◀'}
          </span>
        </button>

        {/* Main content area: Canvas + Toolbar + Detail */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas area */}
          <div className="flex-1 overflow-hidden relative">
            {canvas}
          </div>

          {/* Toolbar */}
          <Toolbar />

          {/* Detail Panel - expandable bottom panel */}
          <div
            className="overflow-hidden transition-[height] duration-300 ease-in-out"
            style={{
              height: detailExpanded ? 400 : 180,
              borderTop: '1px solid var(--theme-border)',
              backgroundColor: 'var(--theme-bg-secondary)'
            }}
          >
            {/* Expand/collapse handle */}
            <button
              onClick={() => setDetailExpanded(!detailExpanded)}
              className="w-full h-6 flex items-center justify-center cursor-row-resize hover:bg-opacity-10 hover:bg-white"
              style={{ borderBottom: '1px solid var(--theme-border)' }}
            >
              <span className="text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
                {detailExpanded ? '▼' : '▲'} Details
              </span>
            </button>
            <div className="h-[calc(100%-24px)] overflow-y-auto">
              {detailPanel}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
