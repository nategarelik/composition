# Composition UI Complete Redesign - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the composition analysis app from a confusing 3D-primary viewer into a professional-grade analysis workstation with 2D blueprint canvas, hierarchical tree navigation, and optional molecular 3D visualization.

**Architecture:** Replace current 3D-centric layout with a three-panel workstation (tree sidebar + 2D canvas + detail panel). 3D becomes optional, lazy-loaded for molecular structures only. Four institutional themes (CERN, Intel, Pharma, Materials) with swappable color schemes.

**Tech Stack:** Next.js 14, React, Zustand, D3.js (radial layout), SVG canvas, Three.js (lazy-loaded for molecular view only), Tailwind CSS with CSS variables for theming.

---

## Expert Synthesis

### UI/UX Design Expert Assessment

**Current Problems:**
- 3D viewer forces users to click through space to discover hierarchy
- No visible structure—users can't see relationships at a glance
- Information is scattered (tooltips, bottom panel, chat)
- Visual assets (generic spheres) don't communicate meaning

**Recommendations:**
1. Tree panel as primary navigation—always visible, shows full hierarchy
2. 2D schematic canvas as primary workspace—radial layout with expand/collapse
3. Detail panel for focused information—context-aware sections
4. Progressive disclosure—compact by default, depth on demand
5. Information density in connections (thickness = %, line style = confidence)

### Frontend Architecture Expert Assessment

**Current State:**
- 40+ components, many unused (TerminalShell, PropertiesPanel not integrated)
- Zustand stores well-structured but focused on 3D state
- Three.js/R3F deeply coupled to viewer experience
- Tree components exist but not wired to composition view

**Recommendations:**
1. Create new `WorkstationLayout` component as main shell
2. Extend `composition-store` with 2D canvas state (selected path, zoom, pan)
3. Add new store for theme management
4. SVG-based 2D canvas with D3.js for layout calculations
5. Lazy-load Three.js only when user switches to molecular view
6. Reuse existing tree components with modifications

### 3D/Visualization Expert Assessment

**Current Implementation:**
- `MolecularNode`: Renders chemistry as colored spheres—not real molecular geometry
- `ProceduralNode`: Generic 3D shapes for products/components
- No actual chemical structure data (bond angles, geometry)

**Recommendations:**
1. Keep 3D for genuine molecular visualization only
2. Consider RDKit.js or 3Dmol.js for real chemical structures
3. For MVP: Use 2D chemical notation (SMILES→structure diagrams)
4. 3D becomes "premium" feature requiring molecular data
5. Current 3D components can be deleted or archived

### Performance Engineer Assessment

**Bundle Analysis:**
- Three.js + R3F = ~300KB gzipped, loads on every page
- Current approach: everything loads upfront

**Recommendations:**
1. SVG canvas with 100-500 nodes: <16ms render, no WebGL needed
2. Lazy-load 3D bundle only on demand (dynamic import)
3. Use CSS transitions for expand/collapse animations
4. Virtualize tree panel if >1000 nodes (rare)
5. Connection lines: SVG paths with CSS stroke properties

### Data Architecture Expert Assessment

**Current Model:**
- `CompositionNode` with recursive children—already supports tree
- Types: product, component, material, chemical, element
- Confidence levels: verified, estimated, speculative
- Sources array for attribution

**Recommendations:**
1. Add `flattened` computed property for canvas rendering
2. Add `path` property to each node for selection tracking
3. Filter functions for type/confidence filtering
4. No API changes needed for MVP

---

## Implementation Phases

### Phase 0: Foundation & Cleanup
Prepare codebase for redesign. Remove unused 3D code, set up new structure.

### Phase 1: Layout Shell
Build the three-panel workstation layout without canvas content.

### Phase 2: Tree Panel
Implement hierarchical tree navigation with icons, confidence, expand/collapse.

### Phase 3: 2D Canvas Core
Build SVG-based radial blueprint canvas with basic node rendering.

### Phase 4: Canvas Interactions
Add selection, expand/collapse, zoom, pan, connection lines.

### Phase 5: Detail Panel
Build context-aware detail panel with expandable sections.

### Phase 6: Theme System
Implement four institutional themes with smooth switching.

### Phase 7: Search & Toolbar
Add canvas toolbar and in-composition search.

### Phase 8: Progressive Reveal
Animate analysis results (tree build + canvas assembly).

### Phase 9: Optional 3D Molecular View
Lazy-load 3D for chemical/element molecular visualization.

### Phase 10: Polish & Paywall
Micro-interactions, keyboard shortcuts, free/paid tier enforcement.

---

## Phase 0: Foundation & Cleanup

### Task 0.1: Archive Current 3D Components

**Files:**
- Move: `src/components/viewer/*.tsx` → `src/archive/viewer-v1/`
- Keep: `src/components/viewer/composition-canvas.tsx` (will repurpose)

**Step 1: Create archive directory**
```bash
mkdir -p src/archive/viewer-v1
```

**Step 2: Move 3D-specific components**
```bash
mv src/components/viewer/molecular-node.tsx src/archive/viewer-v1/
mv src/components/viewer/instanced-molecular-node.tsx src/archive/viewer-v1/
mv src/components/viewer/procedural-node.tsx src/archive/viewer-v1/
mv src/components/viewer/hybrid-node.tsx src/archive/viewer-v1/
mv src/components/viewer/composition-node.tsx src/archive/viewer-v1/
mv src/components/viewer/composition-scene.tsx src/archive/viewer-v1/
mv src/components/viewer/composition-tree.tsx src/archive/viewer-v1/
mv src/components/viewer/star-field.tsx src/archive/viewer-v1/
```

**Step 3: Commit**
```bash
git add -A
git commit -m "chore: archive v1 3D viewer components for redesign"
```

### Task 0.2: Create New Component Structure

**Files:**
- Create: `src/components/workstation/` directory
- Create: `src/components/canvas/` directory
- Create: `src/components/panels/` directory

**Step 1: Create directory structure**
```bash
mkdir -p src/components/workstation
mkdir -p src/components/canvas
mkdir -p src/components/panels
```

**Step 2: Create index files**

Create `src/components/workstation/index.ts`:
```typescript
export * from './workstation-layout';
export * from './status-bar';
export * from './toolbar';
```

Create `src/components/canvas/index.ts`:
```typescript
export * from './blueprint-canvas';
export * from './radial-node';
export * from './connection-line';
```

Create `src/components/panels/index.ts`:
```typescript
export * from './tree-panel';
export * from './detail-panel';
```

**Step 3: Commit**
```bash
git add -A
git commit -m "chore: create new component structure for redesign"
```

### Task 0.3: Add Theme Store

**Files:**
- Create: `src/stores/theme-store.ts`

**Step 1: Create theme store**

Create `src/stores/theme-store.ts`:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeId = 'cern' | 'intel' | 'pharma' | 'materials';

interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  accentPrimary: string;
  accentSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textMono: string;
  nodeProduct: string;
  nodeComponent: string;
  nodeMaterial: string;
  nodeChemical: string;
  nodeElement: string;
  confidenceVerified: string;
  confidenceEstimated: string;
  confidenceSpeculative: string;
}

const themes: Record<ThemeId, ThemeColors> = {
  cern: {
    bgPrimary: '#0a0b0d',
    bgSecondary: '#101214',
    bgTertiary: '#1a1c1f',
    accentPrimary: '#3b9eff',
    accentSecondary: '#00d4aa',
    textPrimary: '#f0f2f5',
    textSecondary: '#8a8f98',
    textMono: '#00ff88',
    nodeProduct: '#3b9eff',
    nodeComponent: '#a855f7',
    nodeMaterial: '#f59e0b',
    nodeChemical: '#00d4aa',
    nodeElement: '#ef4444',
    confidenceVerified: '#00d4aa',
    confidenceEstimated: '#f59e0b',
    confidenceSpeculative: '#ef4444',
  },
  intel: {
    bgPrimary: '#0d0d0f',
    bgSecondary: '#141418',
    bgTertiary: '#1e1e24',
    accentPrimary: '#6366f1',
    accentSecondary: '#22d3ee',
    textPrimary: '#e4e4e7',
    textSecondary: '#71717a',
    textMono: '#a5f3fc',
    nodeProduct: '#6366f1',
    nodeComponent: '#8b5cf6',
    nodeMaterial: '#eab308',
    nodeChemical: '#22d3ee',
    nodeElement: '#f43f5e',
    confidenceVerified: '#22d3ee',
    confidenceEstimated: '#eab308',
    confidenceSpeculative: '#f43f5e',
  },
  pharma: {
    bgPrimary: '#fafafa',
    bgSecondary: '#f4f4f5',
    bgTertiary: '#e4e4e7',
    accentPrimary: '#0891b2',
    accentSecondary: '#059669',
    textPrimary: '#18181b',
    textSecondary: '#52525b',
    textMono: '#0d9488',
    nodeProduct: '#0891b2',
    nodeComponent: '#7c3aed',
    nodeMaterial: '#ca8a04',
    nodeChemical: '#059669',
    nodeElement: '#dc2626',
    confidenceVerified: '#059669',
    confidenceEstimated: '#ca8a04',
    confidenceSpeculative: '#dc2626',
  },
  materials: {
    bgPrimary: '#09090b',
    bgSecondary: '#18181b',
    bgTertiary: '#27272a',
    accentPrimary: '#f97316',
    accentSecondary: '#84cc16',
    textPrimary: '#fafafa',
    textSecondary: '#a1a1aa',
    textMono: '#bef264',
    nodeProduct: '#f97316',
    nodeComponent: '#c026d3',
    nodeMaterial: '#facc15',
    nodeChemical: '#84cc16',
    nodeElement: '#fb7185',
    confidenceVerified: '#84cc16',
    confidenceEstimated: '#facc15',
    confidenceSpeculative: '#fb7185',
  },
};

interface ThemeState {
  currentTheme: ThemeId;
  colors: ThemeColors;
  setTheme: (theme: ThemeId) => void;
  cycleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: 'cern',
      colors: themes.cern,
      setTheme: (theme) => set({ currentTheme: theme, colors: themes[theme] }),
      cycleTheme: () => {
        const order: ThemeId[] = ['cern', 'intel', 'pharma', 'materials'];
        const current = get().currentTheme;
        const nextIndex = (order.indexOf(current) + 1) % order.length;
        const next = order[nextIndex];
        set({ currentTheme: next, colors: themes[next] });
      },
    }),
    { name: 'composition-theme' }
  )
);

export { themes };
```

**Step 2: Commit**
```bash
git add src/stores/theme-store.ts
git commit -m "feat: add theme store with 4 institutional themes"
```

### Task 0.4: Update Composition Store for 2D Canvas

**Files:**
- Modify: `src/stores/composition-store.ts`

**Step 1: Add 2D canvas state to store**

Add these properties and actions to the existing store:

```typescript
// Add to state interface
canvasZoom: number;
canvasPan: { x: number; y: number };
selectedPath: string | null; // e.g., "root.children[0].children[2]"
expandedPaths: Set<string>;
viewMode: '2d' | '3d' | 'split';
filterTypes: Set<NodeType>;
filterConfidence: Set<ConfidenceLevel>;

// Add actions
setCanvasZoom: (zoom: number) => void;
setCanvasPan: (pan: { x: number; y: number }) => void;
setSelectedPath: (path: string | null) => void;
toggleExpandedPath: (path: string) => void;
setViewMode: (mode: '2d' | '3d' | 'split') => void;
toggleFilterType: (type: NodeType) => void;
toggleFilterConfidence: (level: ConfidenceLevel) => void;
resetFilters: () => void;
```

**Step 2: Commit**
```bash
git add src/stores/composition-store.ts
git commit -m "feat: extend composition store with 2D canvas state"
```

---

## Phase 1: Layout Shell

### Task 1.1: Create WorkstationLayout Component

**Files:**
- Create: `src/components/workstation/workstation-layout.tsx`

**Step 1: Create the layout shell**

Create `src/components/workstation/workstation-layout.tsx`:
```typescript
'use client';

import { ReactNode, useState } from 'react';
import { useThemeStore } from '@/stores/theme-store';
import { StatusBar } from './status-bar';
import { Toolbar } from './toolbar';

interface WorkstationLayoutProps {
  treePanel: ReactNode;
  canvas: ReactNode;
  detailPanel: ReactNode;
}

export function WorkstationLayout({
  treePanel,
  canvas,
  detailPanel,
}: WorkstationLayoutProps) {
  const { colors } = useThemeStore();
  const [treePanelCollapsed, setTreePanelCollapsed] = useState(false);
  const [detailPanelExpanded, setDetailPanelExpanded] = useState(false);

  const treePanelWidth = treePanelCollapsed ? 0 : 280;
  const detailPanelHeight = detailPanelExpanded ? 400 : 180;

  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: colors.bgPrimary, color: colors.textPrimary }}
    >
      {/* Status Bar */}
      <StatusBar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tree Panel */}
        <aside
          className="h-full overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            width: treePanelWidth,
            backgroundColor: colors.bgSecondary,
            borderRight: `1px solid ${colors.bgTertiary}`,
          }}
        >
          {!treePanelCollapsed && (
            <div className="h-full overflow-auto">{treePanel}</div>
          )}
        </aside>

        {/* Tree Panel Toggle */}
        <button
          onClick={() => setTreePanelCollapsed(!treePanelCollapsed)}
          className="w-4 h-full flex items-center justify-center hover:bg-opacity-50 transition-colors"
          style={{ backgroundColor: colors.bgTertiary }}
          aria-label={treePanelCollapsed ? 'Expand tree panel' : 'Collapse tree panel'}
        >
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            {treePanelCollapsed ? '›' : '‹'}
          </span>
        </button>

        {/* Canvas + Detail Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1 overflow-hidden relative">
            {canvas}
          </div>

          {/* Toolbar */}
          <Toolbar />

          {/* Detail Panel */}
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              height: detailPanelHeight,
              backgroundColor: colors.bgSecondary,
              borderTop: `1px solid ${colors.bgTertiary}`,
            }}
          >
            {/* Drag Handle */}
            <button
              onClick={() => setDetailPanelExpanded(!detailPanelExpanded)}
              className="w-full h-6 flex items-center justify-center cursor-ns-resize"
              style={{ backgroundColor: colors.bgTertiary }}
            >
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                {detailPanelExpanded ? '▼' : '▲'}
              </span>
            </button>
            <div className="h-[calc(100%-24px)] overflow-auto">
              {detailPanel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**
```bash
git add src/components/workstation/workstation-layout.tsx
git commit -m "feat: create WorkstationLayout shell component"
```

### Task 1.2: Create StatusBar Component

**Files:**
- Create: `src/components/workstation/status-bar.tsx`

**Step 1: Create the status bar**

Create `src/components/workstation/status-bar.tsx`:
```typescript
'use client';

import { useThemeStore, ThemeId } from '@/stores/theme-store';
import { useCompositionStore } from '@/stores/composition-store';

const themeLabels: Record<ThemeId, string> = {
  cern: 'CERN',
  intel: 'INTEL',
  pharma: 'PHARMA',
  materials: 'MATERIALS',
};

export function StatusBar() {
  const { colors, currentTheme, cycleTheme } = useThemeStore();
  const composition = useCompositionStore((s) => s.composition);

  return (
    <header
      className="h-8 flex items-center justify-between px-4 text-xs font-mono"
      style={{
        backgroundColor: colors.bgSecondary,
        borderBottom: `1px solid ${colors.bgTertiary}`,
      }}
    >
      {/* Left: Agent Status */}
      <div className="flex items-center gap-4">
        <span style={{ color: colors.textSecondary }}>
          <span
            className="inline-block w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: colors.accentSecondary }}
          />
          System Ready
        </span>
        {composition && (
          <span style={{ color: colors.textMono }}>
            {composition.name} • {composition.totalNodes || 0} nodes
          </span>
        )}
      </div>

      {/* Right: Theme + Settings */}
      <div className="flex items-center gap-4">
        <button
          onClick={cycleTheme}
          className="px-2 py-0.5 rounded hover:opacity-80 transition-opacity"
          style={{
            backgroundColor: colors.accentPrimary,
            color: colors.bgPrimary,
          }}
        >
          {themeLabels[currentTheme]}
        </button>
      </div>
    </header>
  );
}
```

**Step 2: Commit**
```bash
git add src/components/workstation/status-bar.tsx
git commit -m "feat: create StatusBar component with theme switcher"
```

### Task 1.3: Create Toolbar Component (Placeholder)

**Files:**
- Create: `src/components/workstation/toolbar.tsx`

**Step 1: Create toolbar placeholder**

Create `src/components/workstation/toolbar.tsx`:
```typescript
'use client';

import { useThemeStore } from '@/stores/theme-store';
import { useCompositionStore } from '@/stores/composition-store';

export function Toolbar() {
  const { colors } = useThemeStore();
  const viewMode = useCompositionStore((s) => s.viewMode);
  const setViewMode = useCompositionStore((s) => s.setViewMode);

  return (
    <div
      className="h-11 flex items-center justify-between px-4"
      style={{
        backgroundColor: colors.bgSecondary,
        borderTop: `1px solid ${colors.bgTertiary}`,
        borderBottom: `1px solid ${colors.bgTertiary}`,
      }}
    >
      {/* Left: Navigation Tools */}
      <div className="flex items-center gap-2">
        <ToolButton icon="⊕" label="Zoom In" onClick={() => {}} />
        <ToolButton icon="⊖" label="Zoom Out" onClick={() => {}} />
        <ToolButton icon="⊙" label="Fit View" onClick={() => {}} />
        <div className="w-px h-5 mx-2" style={{ backgroundColor: colors.bgTertiary }} />
        <ToolButton icon="◎" label="Select" onClick={() => {}} active />
        <ToolButton icon="⊞" label="Multi-Select" onClick={() => {}} />
      </div>

      {/* Center: View Mode Toggle */}
      <div
        className="flex items-center rounded overflow-hidden"
        style={{ backgroundColor: colors.bgTertiary }}
      >
        <ViewModeButton
          label="2D Blueprint"
          active={viewMode === '2d'}
          onClick={() => setViewMode('2d')}
        />
        <ViewModeButton
          label="3D Molecular"
          active={viewMode === '3d'}
          onClick={() => setViewMode('3d')}
        />
        <ViewModeButton
          label="Split"
          active={viewMode === 'split'}
          onClick={() => setViewMode('split')}
        />
      </div>

      {/* Right: Export Tools */}
      <div className="flex items-center gap-2">
        <ToolButton icon="📊" label="Measure" onClick={() => {}} />
        <ToolButton icon="👁" label="Layers" onClick={() => {}} />
        <ToolButton icon="📤" label="Export" onClick={() => {}} />
      </div>
    </div>
  );
}

function ToolButton({
  icon,
  label,
  onClick,
  active = false,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  const { colors } = useThemeStore();

  return (
    <button
      onClick={onClick}
      title={label}
      className="w-8 h-8 flex items-center justify-center rounded transition-colors"
      style={{
        backgroundColor: active ? colors.accentPrimary : 'transparent',
        color: active ? colors.bgPrimary : colors.textSecondary,
      }}
    >
      {icon}
    </button>
  );
}

function ViewModeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const { colors } = useThemeStore();

  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-medium transition-colors"
      style={{
        backgroundColor: active ? colors.accentPrimary : 'transparent',
        color: active ? colors.bgPrimary : colors.textSecondary,
      }}
    >
      {label}
    </button>
  );
}
```

**Step 2: Commit**
```bash
git add src/components/workstation/toolbar.tsx
git commit -m "feat: create Toolbar component with view mode toggle"
```

### Task 1.4: Update Composition Viewer Page

**Files:**
- Modify: `src/app/composition/[id]/composition-viewer.tsx`

**Step 1: Replace current layout with WorkstationLayout**

Replace the entire file content with:
```typescript
'use client';

import { useEffect } from 'react';
import { useCompositionStore } from '@/stores/composition-store';
import { WorkstationLayout } from '@/components/workstation/workstation-layout';
import { CompositionData } from '@/types';

interface CompositionViewerProps {
  composition: CompositionData;
}

export function CompositionViewer({ composition }: CompositionViewerProps) {
  const setComposition = useCompositionStore((s) => s.setComposition);

  useEffect(() => {
    setComposition(composition);
  }, [composition, setComposition]);

  return (
    <WorkstationLayout
      treePanel={<TreePanelPlaceholder />}
      canvas={<CanvasPlaceholder />}
      detailPanel={<DetailPanelPlaceholder />}
    />
  );
}

function TreePanelPlaceholder() {
  return (
    <div className="p-4 text-sm text-gray-500">
      Tree panel coming in Phase 2...
    </div>
  );
}

function CanvasPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center text-gray-500">
      2D Blueprint Canvas coming in Phase 3...
    </div>
  );
}

function DetailPanelPlaceholder() {
  return (
    <div className="p-4 text-sm text-gray-500">
      Detail panel coming in Phase 5...
    </div>
  );
}
```

**Step 2: Commit**
```bash
git add src/app/composition/[id]/composition-viewer.tsx
git commit -m "feat: integrate WorkstationLayout into composition viewer"
```

---

## Phase 2: Tree Panel

### Task 2.1: Create TreePanel Component

**Files:**
- Create: `src/components/panels/tree-panel.tsx`

**Step 1: Create tree panel with search and hierarchy**

Create `src/components/panels/tree-panel.tsx`:
```typescript
'use client';

import { useState, useMemo } from 'react';
import { useThemeStore } from '@/stores/theme-store';
import { useCompositionStore } from '@/stores/composition-store';
import { CompositionNode, NodeType, ConfidenceLevel } from '@/types';
import { TreeNodeRow } from './tree-node-row';

export function TreePanel() {
  const { colors } = useThemeStore();
  const composition = useCompositionStore((s) => s.composition);
  const [searchQuery, setSearchQuery] = useState('');

  const rootNode = composition?.rootNode;

  if (!rootNode) {
    return (
      <div className="p-4 text-sm" style={{ color: colors.textSecondary }}>
        No composition loaded
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-3 border-b" style={{ borderColor: colors.bgTertiary }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search nodes..."
          className="w-full px-3 py-1.5 text-sm rounded font-mono"
          style={{
            backgroundColor: colors.bgTertiary,
            color: colors.textPrimary,
            border: 'none',
            outline: 'none',
          }}
        />
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-auto p-2">
        <TreeNodeRow node={rootNode} depth={0} path="root" searchQuery={searchQuery} />
      </div>

      {/* Legend */}
      <div
        className="p-3 border-t text-xs"
        style={{ borderColor: colors.bgTertiary, color: colors.textSecondary }}
      >
        <div className="flex flex-wrap gap-2">
          <LegendItem color={colors.nodeProduct} label="Product" />
          <LegendItem color={colors.nodeComponent} label="Component" />
          <LegendItem color={colors.nodeMaterial} label="Material" />
          <LegendItem color={colors.nodeChemical} label="Chemical" />
          <LegendItem color={colors.nodeElement} label="Element" />
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  );
}
```

**Step 2: Commit**
```bash
git add src/components/panels/tree-panel.tsx
git commit -m "feat: create TreePanel component with search"
```

### Task 2.2: Create TreeNodeRow Component

**Files:**
- Create: `src/components/panels/tree-node-row.tsx`

**Step 1: Create recursive tree node row**

Create `src/components/panels/tree-node-row.tsx`:
```typescript
'use client';

import { useThemeStore } from '@/stores/theme-store';
import { useCompositionStore } from '@/stores/composition-store';
import { CompositionNode, NodeType, ConfidenceLevel } from '@/types';

const nodeIcons: Record<NodeType, string> = {
  product: '▣',
  component: '⚙',
  material: '◆',
  chemical: '⬡',
  element: '⚛',
};

const confidenceStyles: Record<ConfidenceLevel, { border: string; opacity: number }> = {
  verified: { border: 'solid', opacity: 1 },
  estimated: { border: 'dashed', opacity: 0.85 },
  speculative: { border: 'dotted', opacity: 0.7 },
};

interface TreeNodeRowProps {
  node: CompositionNode;
  depth: number;
  path: string;
  searchQuery: string;
}

export function TreeNodeRow({ node, depth, path, searchQuery }: TreeNodeRowProps) {
  const { colors } = useThemeStore();
  const selectedPath = useCompositionStore((s) => s.selectedPath);
  const setSelectedPath = useCompositionStore((s) => s.setSelectedPath);
  const expandedPaths = useCompositionStore((s) => s.expandedPaths);
  const toggleExpandedPath = useCompositionStore((s) => s.toggleExpandedPath);

  const isExpanded = expandedPaths.has(path);
  const isSelected = selectedPath === path;
  const hasChildren = node.children && node.children.length > 0;

  const nodeColor = colors[`node${capitalize(node.type)}` as keyof typeof colors] || colors.textPrimary;
  const confidence = confidenceStyles[node.confidence];

  // Filter by search
  const matchesSearch = !searchQuery ||
    node.name.toLowerCase().includes(searchQuery.toLowerCase());

  const childrenMatchSearch = node.children?.some(child =>
    childMatchesSearch(child, searchQuery)
  );

  if (!matchesSearch && !childrenMatchSearch) {
    return null;
  }

  return (
    <div>
      <div
        className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-colors"
        style={{
          paddingLeft: `${depth * 16 + 8}px`,
          backgroundColor: isSelected ? colors.accentPrimary + '20' : 'transparent',
          opacity: confidence.opacity,
        }}
        onClick={() => setSelectedPath(path)}
        onDoubleClick={() => hasChildren && toggleExpandedPath(path)}
      >
        {/* Expand/Collapse */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleExpandedPath(path);
          }}
          className="w-4 h-4 flex items-center justify-center text-xs"
          style={{ color: colors.textSecondary }}
        >
          {hasChildren ? (isExpanded ? '▼' : '▶') : ' '}
        </button>

        {/* Type Icon */}
        <span style={{ color: nodeColor }}>{nodeIcons[node.type]}</span>

        {/* Name */}
        <span
          className="flex-1 truncate text-sm"
          style={{ color: colors.textPrimary }}
        >
          {node.name}
        </span>

        {/* Percentage */}
        {node.percentage !== undefined && (
          <span
            className="text-xs font-mono"
            style={{ color: colors.textSecondary }}
          >
            {node.percentage.toFixed(1)}%
          </span>
        )}

        {/* Confidence Badge */}
        <span
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: colors[`confidence${capitalize(node.confidence)}` as keyof typeof colors],
          }}
          title={node.confidence}
        />
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div>
          {node.children!.map((child, index) => (
            <TreeNodeRow
              key={child.id || index}
              node={child}
              depth={depth + 1}
              path={`${path}.children[${index}]`}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function childMatchesSearch(node: CompositionNode, query: string): boolean {
  if (node.name.toLowerCase().includes(query.toLowerCase())) return true;
  return node.children?.some(child => childMatchesSearch(child, query)) || false;
}
```

**Step 2: Commit**
```bash
git add src/components/panels/tree-node-row.tsx
git commit -m "feat: create TreeNodeRow with icons and confidence"
```

---

## Phase 3: 2D Canvas Core

### Task 3.1: Create BlueprintCanvas Component

**Files:**
- Create: `src/components/canvas/blueprint-canvas.tsx`

**Step 1: Create SVG-based canvas with zoom/pan**

Create `src/components/canvas/blueprint-canvas.tsx`:
```typescript
'use client';

import { useRef, useCallback, WheelEvent, MouseEvent, useState } from 'react';
import { useThemeStore } from '@/stores/theme-store';
import { useCompositionStore } from '@/stores/composition-store';
import { RadialLayout } from './radial-layout';

export function BlueprintCanvas() {
  const { colors } = useThemeStore();
  const canvasZoom = useCompositionStore((s) => s.canvasZoom);
  const canvasPan = useCompositionStore((s) => s.canvasPan);
  const setCanvasZoom = useCompositionStore((s) => s.setCanvasZoom);
  const setCanvasPan = useCompositionStore((s) => s.setCanvasPan);
  const composition = useCompositionStore((s) => s.composition);

  const svgRef = useRef<SVGSVGElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.min(Math.max(canvasZoom * delta, 0.1), 5);
      setCanvasZoom(newZoom);
    },
    [canvasZoom, setCanvasZoom]
  );

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasPan.x, y: e.clientY - canvasPan.y });
    }
  }, [canvasPan]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isPanning) {
        setCanvasPan({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }
    },
    [isPanning, panStart, setCanvasPan]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  if (!composition?.rootNode) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor: colors.bgPrimary }}
      >
        <span style={{ color: colors.textSecondary }}>
          No composition loaded
        </span>
      </div>
    );
  }

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ backgroundColor: colors.bgPrimary, cursor: isPanning ? 'grabbing' : 'default' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid Background */}
      <defs>
        <pattern
          id="grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke={colors.bgTertiary}
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Transform Group for Zoom/Pan */}
      <g
        transform={`translate(${canvasPan.x}, ${canvasPan.y}) scale(${canvasZoom})`}
      >
        <RadialLayout rootNode={composition.rootNode} />
      </g>
    </svg>
  );
}
```

**Step 2: Commit**
```bash
git add src/components/canvas/blueprint-canvas.tsx
git commit -m "feat: create BlueprintCanvas with zoom/pan"
```

### Task 3.2: Create RadialLayout Component

**Files:**
- Create: `src/components/canvas/radial-layout.tsx`

**Step 1: Create radial layout calculator and renderer**

Create `src/components/canvas/radial-layout.tsx`:
```typescript
'use client';

import { useMemo } from 'react';
import { useThemeStore } from '@/stores/theme-store';
import { useCompositionStore } from '@/stores/composition-store';
import { CompositionNode } from '@/types';
import { RadialNode } from './radial-node';
import { ConnectionLine } from './connection-line';

interface LayoutNode {
  node: CompositionNode;
  x: number;
  y: number;
  path: string;
  parentX?: number;
  parentY?: number;
}

interface RadialLayoutProps {
  rootNode: CompositionNode;
}

export function RadialLayout({ rootNode }: RadialLayoutProps) {
  const expandedPaths = useCompositionStore((s) => s.expandedPaths);

  // Calculate layout positions
  const layoutNodes = useMemo(() => {
    const nodes: LayoutNode[] = [];
    const centerX = 400;
    const centerY = 300;
    const baseRadius = 120;

    function layoutNode(
      node: CompositionNode,
      path: string,
      depth: number,
      angleStart: number,
      angleEnd: number,
      parentX?: number,
      parentY?: number
    ) {
      const angle = (angleStart + angleEnd) / 2;
      const radius = depth * baseRadius;
      const x = depth === 0 ? centerX : centerX + radius * Math.cos(angle);
      const y = depth === 0 ? centerY : centerY + radius * Math.sin(angle);

      nodes.push({ node, x, y, path, parentX, parentY });

      // Layout children if expanded
      if (node.children && node.children.length > 0 && expandedPaths.has(path)) {
        const angleRange = angleEnd - angleStart;
        const childAngleStep = angleRange / node.children.length;

        node.children.forEach((child, index) => {
          const childAngleStart = angleStart + index * childAngleStep;
          const childAngleEnd = childAngleStart + childAngleStep;
          const childPath = `${path}.children[${index}]`;

          layoutNode(
            child,
            childPath,
            depth + 1,
            childAngleStart,
            childAngleEnd,
            x,
            y
          );
        });
      }
    }

    layoutNode(rootNode, 'root', 0, 0, Math.PI * 2);
    return nodes;
  }, [rootNode, expandedPaths]);

  return (
    <g>
      {/* Render connections first (below nodes) */}
      {layoutNodes.map(
        ({ node, x, y, path, parentX, parentY }) =>
          parentX !== undefined &&
          parentY !== undefined && (
            <ConnectionLine
              key={`line-${path}`}
              x1={parentX}
              y1={parentY}
              x2={x}
              y2={y}
              percentage={node.percentage || 0}
              confidence={node.confidence}
            />
          )
      )}

      {/* Render nodes */}
      {layoutNodes.map(({ node, x, y, path }) => (
        <RadialNode key={path} node={node} x={x} y={y} path={path} />
      ))}
    </g>
  );
}
```

**Step 2: Commit**
```bash
git add src/components/canvas/radial-layout.tsx
git commit -m "feat: create RadialLayout with position calculations"
```

### Task 3.3: Create RadialNode Component

**Files:**
- Create: `src/components/canvas/radial-node.tsx`

**Step 1: Create individual node renderer**

Create `src/components/canvas/radial-node.tsx`:
```typescript
'use client';

import { useThemeStore } from '@/stores/theme-store';
import { useCompositionStore } from '@/stores/composition-store';
import { CompositionNode, NodeType } from '@/types';

const nodeRadius: Record<NodeType, number> = {
  product: 35,
  component: 28,
  material: 22,
  chemical: 18,
  element: 14,
};

interface RadialNodeProps {
  node: CompositionNode;
  x: number;
  y: number;
  path: string;
}

export function RadialNode({ node, x, y, path }: RadialNodeProps) {
  const { colors } = useThemeStore();
  const selectedPath = useCompositionStore((s) => s.selectedPath);
  const setSelectedPath = useCompositionStore((s) => s.setSelectedPath);
  const expandedPaths = useCompositionStore((s) => s.expandedPaths);
  const toggleExpandedPath = useCompositionStore((s) => s.toggleExpandedPath);

  const isSelected = selectedPath === path;
  const isExpanded = expandedPaths.has(path);
  const hasChildren = node.children && node.children.length > 0;

  const radius = nodeRadius[node.type];
  const nodeColor = colors[`node${capitalize(node.type)}` as keyof typeof colors] as string;

  return (
    <g
      className="cursor-pointer"
      onClick={() => setSelectedPath(path)}
      onDoubleClick={() => hasChildren && toggleExpandedPath(path)}
    >
      {/* Selection ring */}
      {isSelected && (
        <circle
          cx={x}
          cy={y}
          r={radius + 6}
          fill="none"
          stroke={colors.accentPrimary}
          strokeWidth="2"
          strokeDasharray="4 2"
        />
      )}

      {/* Main circle */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={colors.bgSecondary}
        stroke={nodeColor}
        strokeWidth="2"
      />

      {/* Expand indicator */}
      {hasChildren && (
        <circle
          cx={x + radius - 4}
          cy={y - radius + 4}
          r="6"
          fill={isExpanded ? colors.accentSecondary : colors.bgTertiary}
          stroke={colors.textSecondary}
          strokeWidth="1"
        />
      )}

      {/* Label */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={colors.textPrimary}
        fontSize={radius > 20 ? 10 : 8}
        fontFamily="monospace"
      >
        {truncate(node.name, radius > 25 ? 12 : 6)}
      </text>

      {/* Percentage below */}
      {node.percentage !== undefined && (
        <text
          x={x}
          y={y + radius + 12}
          textAnchor="middle"
          fill={colors.textSecondary}
          fontSize="9"
          fontFamily="monospace"
        >
          {node.percentage.toFixed(1)}%
        </text>
      )}
    </g>
  );
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str;
}
```

**Step 2: Commit**
```bash
git add src/components/canvas/radial-node.tsx
git commit -m "feat: create RadialNode SVG component"
```

### Task 3.4: Create ConnectionLine Component

**Files:**
- Create: `src/components/canvas/connection-line.tsx`

**Step 1: Create weighted connection lines**

Create `src/components/canvas/connection-line.tsx`:
```typescript
'use client';

import { useThemeStore } from '@/stores/theme-store';
import { ConfidenceLevel } from '@/types';

interface ConnectionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  percentage: number;
  confidence: ConfidenceLevel;
}

const confidencePatterns: Record<ConfidenceLevel, string> = {
  verified: '',          // solid
  estimated: '8 4',      // dashed
  speculative: '2 4',    // dotted
};

export function ConnectionLine({
  x1,
  y1,
  x2,
  y2,
  percentage,
  confidence,
}: ConnectionLineProps) {
  const { colors } = useThemeStore();

  // Calculate stroke width based on percentage (1-6px)
  const strokeWidth = Math.max(1, Math.min(6, (percentage / 100) * 6 + 1));

  // Get confidence color
  const confidenceColor = colors[
    `confidence${capitalize(confidence)}` as keyof typeof colors
  ] as string;

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={confidenceColor}
      strokeWidth={strokeWidth}
      strokeDasharray={confidencePatterns[confidence]}
      strokeLinecap="round"
      opacity={0.6}
    />
  );
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

**Step 2: Commit**
```bash
git add src/components/canvas/connection-line.tsx
git commit -m "feat: create ConnectionLine with weighted thickness"
```

---

## Remaining Phases (Summary)

### Phase 4: Canvas Interactions
- Add hover effects with tooltip
- Implement selection sync between tree and canvas
- Add keyboard navigation (arrow keys)
- Implement zoom controls in toolbar

### Phase 5: Detail Panel
- Create context-aware section components
- Implement Identity, Composition, Properties, Sources, Structure sections
- Add expand/collapse for each section
- Connect to selected node

### Phase 6: Theme System
- Apply theme colors throughout all components
- Add smooth transition between themes
- Persist theme preference
- Create theme preview in settings

### Phase 7: Search & Toolbar
- Implement global search with command palette (Cmd+K)
- Complete toolbar functionality (zoom, fit, select modes)
- Add measurement tools
- Add export functionality

### Phase 8: Progressive Reveal
- Animate tree population during analysis
- Animate canvas node appearance
- Add agent status streaming
- Create analysis progress indicators

### Phase 9: Optional 3D Molecular View
- Create lazy-loaded 3D viewer component
- Integrate molecular visualization library
- Implement split view mode
- Add 3D-specific controls

### Phase 10: Polish & Paywall
- Add micro-interactions and transitions
- Implement keyboard shortcuts
- Add usage tracking for free tier
- Gate premium features

---

## Execution Checklist

Before starting implementation:
- [ ] Ensure development environment is set up
- [ ] Run `pnpm install` to ensure dependencies
- [ ] Run `pnpm type-check` to verify starting state
- [ ] Create feature branch: `git checkout -b feat/ui-redesign`

After each phase:
- [ ] Run `pnpm type-check`
- [ ] Run `pnpm lint`
- [ ] Run `pnpm build`
- [ ] Visual test in browser

---

**Plan saved to:** `docs/plans/2025-01-22-composition-ui-redesign.md`
