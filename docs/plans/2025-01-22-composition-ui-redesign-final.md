# Composition UI Complete Redesign - Final Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the composition analysis app from a confusing 3D-primary viewer into a professional-grade analysis workstation with 2D blueprint canvas, hierarchical tree navigation, and optional molecular 3D visualization.

**Architecture:** Replace current 3D-centric layout with a three-panel workstation (tree sidebar + 2D canvas + detail panel). 3D becomes optional, lazy-loaded for molecular structures only. Four institutional themes (CERN, Intel, Pharma, Materials) with swappable color schemes.

**Tech Stack:** Next.js 14+, React 18+, Zustand 5, D3.js (d3-hierarchy, d3-force), SVG canvas, Three.js/R3F (lazy-loaded), Tailwind CSS 4 with CSS custom properties for theming.

---

## Research-Validated Technical Decisions

### 1. SVG vs Canvas2D Decision: **SVG**

**Research findings** ([PMC Study 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12061801/), [yWorks Analysis](https://www.yworks.com/blog/svg-canvas-webgl)):

| Element Count | Recommended Technology |
|---------------|------------------------|
| < 1,000 | **SVG** (easier interactivity, CSS styling, DOM events) |
| 1,000 - 10,000 | Canvas2D |
| > 10,000 | WebGL |

**Our decision:** SVG for primary 2D canvas
- Typical composition: 50-500 nodes (well under threshold)
- Native DOM events for click/hover (no hit detection code)
- CSS transitions for animations (GPU-accelerated)
- CSS custom properties for theming integration
- Resolution-independent (works on all screens)

---

### 2. D3.js + React Integration Pattern

**Research findings** ([Pluralsight](https://www.pluralsight.com/resources/blog/guides/using-d3js-inside-a-react-app), [Medium](https://medium.com/@jeffbutsch/using-d3-in-react-with-hooks-4a6c61f1d102)):

**Pattern:** "D3 for math, React for DOM" + custom `useD3` hook

```typescript
// src/hooks/use-d3.ts
import { useRef, useEffect, DependencyList } from 'react';
import * as d3 from 'd3-selection';

export function useD3<T extends SVGElement>(
  renderFn: (svg: d3.Selection<T, unknown, null, undefined>) => void,
  deps: DependencyList
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      renderFn(d3.select(ref.current));
    }
  }, deps);

  return ref;
}
```

**Key principles:**
- D3 calculates positions (d3.hierarchy, d3.tree, d3.forceRadial)
- React renders SVG elements (declarative, type-safe)
- useRef for SVG container reference
- useEffect for D3 side effects (transitions, interactions)
- useMemo for layout calculations (prevent recalc on every render)

---

### 3. Three.js Lazy Loading Pattern

**Research findings** ([Next.js Docs](https://nextjs.org/docs/app/guides/lazy-loading), [LogRocket](https://blog.logrocket.com/dynamic-imports-code-splitting-next-js/)):

**Pattern:** Dynamic import with `ssr: false` + loading fallback

```typescript
// src/components/canvas/molecular-view.tsx
import dynamic from 'next/dynamic';

const MolecularCanvas = dynamic(
  () => import('./molecular-canvas-3d'),
  {
    ssr: false, // Critical: WebGL requires browser APIs
    loading: () => <MolecularLoadingFallback />
  }
);

// Only renders when user switches to 3D mode
export function MolecularView({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return <MolecularCanvas />;
}
```

**Bundle impact:**
- Three.js + R3F + Drei: ~400KB gzipped
- With lazy loading: 0KB on initial load
- Loads only when user clicks "3D Molecular" tab

---

### 4. Zustand State Management Pattern

**Research findings** ([Context7 Zustand Docs](/pmndrs/zustand)):

**Pattern:** Slices + persist + subscribeWithSelector

```typescript
// src/stores/ui-store.ts
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

interface UIState {
  canvasMode: '2d' | '3d' | 'split';
  theme: 'cern' | 'intel' | 'pharma' | 'materials';
  panels: { tree: boolean; properties: boolean; detail: boolean };
  setCanvasMode: (mode: UIState['canvasMode']) => void;
  setTheme: (theme: UIState['theme']) => void;
  togglePanel: (panel: keyof UIState['panels']) => void;
}

export const useUIStore = create<UIState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        canvasMode: '2d',
        theme: 'cern',
        panels: { tree: true, properties: true, detail: false },
        setCanvasMode: (mode) => set({ canvasMode: mode }),
        setTheme: (theme) => set({ theme }),
        togglePanel: (panel) => set((state) => ({
          panels: { ...state.panels, [panel]: !state.panels[panel] }
        })),
      }),
      {
        name: 'composition-ui',
        partialize: (state) => ({ theme: state.theme, canvasMode: state.canvasMode })
      }
    )
  )
);
```

**Key patterns:**
- `subscribeWithSelector` for fine-grained subscriptions
- `persist` for theme/mode preferences
- `partialize` to only persist non-sensitive data
- Slices pattern for large stores (keep composition-store separate)

---

### 5. Tailwind CSS Theming Pattern

**Research findings** ([Context7 Tailwind Docs](/websites/tailwindcss)):

**Pattern:** CSS custom properties + data-theme attribute

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Base theme variables */
  --color-bg-primary: var(--theme-bg-primary);
  --color-bg-secondary: var(--theme-bg-secondary);
  --color-accent-primary: var(--theme-accent-primary);
  --color-text-primary: var(--theme-text-primary);
  --color-text-mono: var(--theme-text-mono);
}

/* CERN Theme (default) */
:root, [data-theme="cern"] {
  --theme-bg-primary: #0a0b0d;
  --theme-bg-secondary: #101214;
  --theme-accent-primary: #3b9eff;
  --theme-text-primary: #f0f2f5;
  --theme-text-mono: #00ff88;
}

/* Intel Theme */
[data-theme="intel"] {
  --theme-bg-primary: #0d0d0f;
  --theme-bg-secondary: #141418;
  --theme-accent-primary: #6366f1;
  --theme-text-primary: #e4e4e7;
  --theme-text-mono: #a5f3fc;
}

/* Pharma Theme (light) */
[data-theme="pharma"] {
  --theme-bg-primary: #fafafa;
  --theme-bg-secondary: #f4f4f5;
  --theme-accent-primary: #0891b2;
  --theme-text-primary: #18181b;
  --theme-text-mono: #0d9488;
}

/* Materials Theme */
[data-theme="materials"] {
  --theme-bg-primary: #09090b;
  --theme-bg-secondary: #18181b;
  --theme-accent-primary: #f97316;
  --theme-text-primary: #fafafa;
  --theme-text-mono: #bef264;
}
```

**Theme Provider:**
```typescript
// src/components/providers/theme-provider.tsx
'use client';
import { useEffect } from 'react';
import { useUIStore } from '@/stores/ui-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}
```

---

## Final Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│  STATUS BAR (32px)                                                  │
│  [System Status] [Agent Activity] [Theme Switcher] [Settings]       │
├──────────────┬─────────────────────────────────────────────────────┤
│              │                                                      │
│  TREE PANEL  │           CANVAS AREA                               │
│  (280px)     │           (flex: 1)                                 │
│              │                                                      │
│  ┌─────────┐ │     ┌─────────────────────────────┐                 │
│  │ Search  │ │     │                             │                 │
│  ├─────────┤ │     │    [2D] [3D] [Split]        │                 │
│  │         │ │     │                             │                 │
│  │ Tree    │ │     │    SVG Radial Canvas        │                 │
│  │ Nodes   │ │     │    (D3.js layout)           │                 │
│  │ with    │ │     │                             │                 │
│  │ Icons + │ │     │    OR                       │                 │
│  │ Badges  │ │     │                             │                 │
│  │         │ │     │    Three.js Molecular       │                 │
│  │         │ │     │    (lazy loaded)            │                 │
│  │         │ │     │                             │                 │
│  └─────────┘ │     └─────────────────────────────┘                 │
│              │                                                      │
│  ┌─────────┐ ├─────────────────────────────────────────────────────┤
│  │ Legend  │ │  TOOLBAR (44px)                                      │
│  └─────────┘ │  [Zoom+][Zoom-][Fit][Select][Layers][Measure][Export]│
├──────────────┴─────────────────────────────────────────────────────┤
│  DETAIL PANEL (180px collapsed / 400px expanded)                   │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐          │
│  │ Identity │ Compose  │Properties│ Sources  │ Structure│          │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘          │
│  [Context-aware sections based on selected node type]              │
└────────────────────────────────────────────────────────────────────┘
```

---

## Component Structure

```
src/
├── app/
│   ├── globals.css                    # Theme CSS variables
│   ├── layout.tsx                     # ThemeProvider wrapper
│   └── composition/[id]/
│       ├── page.tsx                   # Server component (data fetch)
│       └── composition-viewer.tsx     # Client component (workstation)
│
├── components/
│   ├── providers/
│   │   └── theme-provider.tsx         # data-theme attribute sync
│   │
│   ├── workstation/                   # Main layout
│   │   ├── workstation-layout.tsx     # 3-panel shell
│   │   ├── status-bar.tsx             # Top bar
│   │   └── toolbar.tsx                # Bottom toolbar
│   │
│   ├── panels/                        # Side panels
│   │   ├── tree-panel.tsx             # Left sidebar
│   │   ├── tree-node-row.tsx          # Recursive tree node
│   │   └── detail-panel.tsx           # Bottom panel
│   │
│   ├── canvas/                        # Visualization
│   │   ├── canvas-container.tsx       # Mode switcher
│   │   ├── blueprint-canvas.tsx       # SVG + D3 radial layout
│   │   ├── radial-node.tsx            # SVG node component
│   │   ├── connection-line.tsx        # SVG path component
│   │   └── molecular-view.tsx         # Lazy-loaded 3D wrapper
│   │
│   └── canvas-3d/                     # 3D (lazy loaded)
│       ├── molecular-canvas-3d.tsx    # R3F Canvas
│       ├── molecular-node.tsx         # Ball-and-stick
│       └── loading-fallback.tsx       # Loading state
│
├── hooks/
│   ├── use-d3.ts                      # D3 + React integration
│   ├── use-radial-layout.ts           # Radial tree calculation
│   └── use-composition-index.ts       # Flattened node lookup
│
├── stores/
│   ├── composition-store.ts           # Composition data + selection
│   ├── ui-store.ts                    # Theme, mode, panels
│   └── index.ts                       # Re-exports
│
├── lib/
│   ├── d3/
│   │   ├── radial-layout.ts           # D3 hierarchy → radial positions
│   │   └── node-utils.ts              # Color, size calculations
│   │
│   └── composition/
│       ├── flatten-tree.ts            # Tree → flat index
│       └── filter-nodes.ts            # Type/confidence filters
│
└── types/
    ├── composition.ts                 # CompositionNode, etc.
    └── ui.ts                          # Theme, ViewMode types
```

---

## Implementation Phases

### Phase 0: Foundation (4-6 hours)

**Tasks:**
1. Create `src/stores/ui-store.ts` with Zustand persist
2. Create `src/components/providers/theme-provider.tsx`
3. Update `src/app/globals.css` with 4 theme CSS variables
4. Update `src/app/layout.tsx` to wrap with ThemeProvider
5. Archive current 3D viewer to `src/archive/viewer-v1/`
6. Create new directory structure

**Files to create:**
- `src/stores/ui-store.ts`
- `src/components/providers/theme-provider.tsx`

**Files to modify:**
- `src/app/globals.css`
- `src/app/layout.tsx`

---

### Phase 1: Layout Shell (6-8 hours)

**Tasks:**
1. Create `WorkstationLayout` component with 3-panel structure
2. Create `StatusBar` with theme switcher
3. Create `Toolbar` with view mode toggle
4. Update composition viewer page to use new layout
5. Add collapsible panel functionality

**Key implementation:**

```typescript
// src/components/workstation/workstation-layout.tsx
'use client';
import { useState, ReactNode } from 'react';
import { StatusBar } from './status-bar';
import { Toolbar } from './toolbar';

interface Props {
  treePanel: ReactNode;
  canvas: ReactNode;
  detailPanel: ReactNode;
}

export function WorkstationLayout({ treePanel, canvas, detailPanel }: Props) {
  const [treePanelWidth, setTreePanelWidth] = useState(280);
  const [detailExpanded, setDetailExpanded] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-bg-primary text-text-primary">
      <StatusBar />
      <div className="flex-1 flex overflow-hidden">
        {/* Tree Panel - collapsible */}
        <aside
          className="h-full overflow-hidden transition-[width] duration-300"
          style={{ width: treePanelWidth }}
        >
          {treePanel}
        </aside>

        {/* Canvas + Detail */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden relative">
            {canvas}
          </div>
          <Toolbar />
          <div
            className="overflow-hidden transition-[height] duration-300"
            style={{ height: detailExpanded ? 400 : 180 }}
          >
            {detailPanel}
          </div>
        </main>
      </div>
    </div>
  );
}
```

---

### Phase 2: Tree Panel (8-10 hours)

**Tasks:**
1. Create `TreePanel` with search input
2. Create `TreeNodeRow` with expand/collapse
3. Add type icons (◆ ⚙ ◇ ⬡ ⚛)
4. Add confidence badges (solid/dashed/dotted borders)
5. Implement tree search filtering
6. Sync selection with store

**Key implementation:**

```typescript
// src/components/panels/tree-node-row.tsx
'use client';
import { useCompositionStore } from '@/stores';
import { CompositionNode } from '@/types';
import { cn } from '@/lib/utils';

const NODE_ICONS: Record<string, string> = {
  product: '▣',
  component: '⚙',
  material: '◆',
  chemical: '⬡',
  element: '⚛',
};

interface Props {
  node: CompositionNode;
  depth: number;
  path: string;
}

export function TreeNodeRow({ node, depth, path }: Props) {
  const selectedPath = useCompositionStore((s) => s.selectedPath);
  const setSelectedPath = useCompositionStore((s) => s.setSelectedPath);
  const expandedPaths = useCompositionStore((s) => s.expandedPaths);
  const toggleExpanded = useCompositionStore((s) => s.toggleExpandedPath);

  const isSelected = selectedPath === path;
  const isExpanded = expandedPaths.has(path);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <>
      <div
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 cursor-pointer',
          'hover:bg-bg-tertiary/50 transition-colors',
          isSelected && 'bg-accent-primary/20'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => setSelectedPath(path)}
        onDoubleClick={() => hasChildren && toggleExpanded(path)}
      >
        {/* Expand arrow */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleExpanded(path); }}
          className={cn(
            'w-4 h-4 flex items-center justify-center text-xs',
            'transition-transform duration-150',
            isExpanded && 'rotate-90'
          )}
        >
          {hasChildren ? '▶' : ''}
        </button>

        {/* Type icon */}
        <span className={`text-node-${node.type}`}>
          {NODE_ICONS[node.type]}
        </span>

        {/* Name */}
        <span className="flex-1 truncate text-sm">
          {node.name}
        </span>

        {/* Percentage */}
        {node.percentage !== undefined && (
          <span className="text-xs font-mono text-text-secondary">
            {node.percentage.toFixed(1)}%
          </span>
        )}

        {/* Confidence dot */}
        <span
          className={cn(
            'w-2 h-2 rounded-full',
            node.confidence === 'verified' && 'bg-confidence-verified',
            node.confidence === 'estimated' && 'bg-confidence-estimated',
            node.confidence === 'speculative' && 'bg-confidence-speculative'
          )}
          title={node.confidence}
        />
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div>
          {node.children!.map((child, i) => (
            <TreeNodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              path={`${path}.children[${i}]`}
            />
          ))}
        </div>
      )}
    </>
  );
}
```

---

### Phase 3: 2D Blueprint Canvas (12-16 hours)

**Tasks:**
1. Create `useRadialLayout` hook with D3 hierarchy
2. Create `BlueprintCanvas` SVG container
3. Create `RadialNode` SVG component
4. Create `ConnectionLine` with weighted strokes
5. Implement zoom/pan with SVG transforms
6. Sync selection with tree panel

**Key implementation:**

```typescript
// src/hooks/use-radial-layout.ts
import { useMemo } from 'react';
import * as d3 from 'd3-hierarchy';
import { CompositionNode } from '@/types';

interface LayoutNode {
  id: string;
  node: CompositionNode;
  x: number;
  y: number;
  parentX?: number;
  parentY?: number;
}

export function useRadialLayout(
  root: CompositionNode | null,
  expandedPaths: Set<string>,
  width: number,
  height: number
): LayoutNode[] {
  return useMemo(() => {
    if (!root) return [];

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 80;

    // Create D3 hierarchy
    const hierarchy = d3.hierarchy(root, (d) => {
      // Only include children if path is expanded
      return d.children;
    });

    // Create radial tree layout
    const treeLayout = d3.tree<CompositionNode>()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    const layoutRoot = treeLayout(hierarchy);

    // Convert to radial coordinates
    const nodes: LayoutNode[] = [];
    layoutRoot.each((d) => {
      const angle = d.x;
      const r = d.y;
      const x = centerX + r * Math.cos(angle - Math.PI / 2);
      const y = centerY + r * Math.sin(angle - Math.PI / 2);

      let parentX: number | undefined;
      let parentY: number | undefined;
      if (d.parent) {
        const pAngle = d.parent.x;
        const pR = d.parent.y;
        parentX = centerX + pR * Math.cos(pAngle - Math.PI / 2);
        parentY = centerY + pR * Math.sin(pAngle - Math.PI / 2);
      }

      nodes.push({
        id: d.data.id,
        node: d.data,
        x,
        y,
        parentX,
        parentY,
      });
    });

    return nodes;
  }, [root, expandedPaths, width, height]);
}
```

```typescript
// src/components/canvas/blueprint-canvas.tsx
'use client';
import { useRef, useState, useCallback, WheelEvent, MouseEvent } from 'react';
import { useCompositionStore, useUIStore } from '@/stores';
import { useRadialLayout } from '@/hooks/use-radial-layout';
import { RadialNode } from './radial-node';
import { ConnectionLine } from './connection-line';

export function BlueprintCanvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  const composition = useCompositionStore((s) => s.composition);
  const expandedPaths = useCompositionStore((s) => s.expandedPaths);

  const layoutNodes = useRadialLayout(
    composition?.rootNode || null,
    expandedPaths,
    dimensions.width,
    dimensions.height
  );

  // Zoom handler
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((t) => ({
      ...t,
      scale: Math.min(Math.max(t.scale * delta, 0.1), 5),
    }));
  }, []);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full bg-bg-primary"
      onWheel={handleWheel}
    >
      {/* Grid pattern */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="var(--color-bg-tertiary)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Transform group */}
      <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
        {/* Connections (render first, below nodes) */}
        {layoutNodes.map((ln) =>
          ln.parentX !== undefined && (
            <ConnectionLine
              key={`line-${ln.id}`}
              x1={ln.parentX}
              y1={ln.parentY!}
              x2={ln.x}
              y2={ln.y}
              percentage={ln.node.percentage || 0}
              confidence={ln.node.confidence}
            />
          )
        )}

        {/* Nodes */}
        {layoutNodes.map((ln) => (
          <RadialNode
            key={ln.id}
            node={ln.node}
            x={ln.x}
            y={ln.y}
          />
        ))}
      </g>
    </svg>
  );
}
```

---

### Phase 4: Canvas Interactions (6-8 hours)

**Tasks:**
1. Implement node click → select
2. Implement node double-click → expand
3. Add hover tooltip
4. Sync tree panel selection ↔ canvas selection
5. Add keyboard navigation (arrow keys in tree)
6. Implement fit-to-view button

---

### Phase 5: Detail Panel (6-8 hours)

**Tasks:**
1. Create expandable `DetailPanel` container
2. Create context-aware sections (Identity, Composition, Properties, Sources, Structure)
3. Show different sections based on node type
4. Add expand/collapse per section
5. Add copy-to-clipboard for data values

---

### Phase 6: Theme System (4-6 hours)

**Tasks:**
1. Add theme CSS variables for all 4 themes
2. Implement theme switcher dropdown
3. Add theme preview thumbnails
4. Persist theme preference
5. Add smooth CSS transition between themes

---

### Phase 7: Toolbar & Search (6-8 hours)

**Tasks:**
1. Implement zoom controls (+, -, fit)
2. Implement layer visibility toggles
3. Implement measurement tool
4. Implement export (PNG, SVG)
5. Add command palette (Cmd+K) for power users

---

### Phase 8: Progressive Reveal (8-10 hours)

**Tasks:**
1. Animate tree nodes appearing during analysis
2. Animate canvas nodes assembling
3. Show agent status in status bar
4. Add progress indicator during research
5. Implement streaming updates

---

### Phase 9: Optional 3D Molecular View (8-10 hours)

**Tasks:**
1. Create lazy-loaded `MolecularCanvas3D` wrapper
2. Move existing R3F code to `canvas-3d/`
3. Implement view mode toggle (2D/3D/Split)
4. Add loading fallback
5. Sync selection between 2D and 3D views

**Key implementation:**

```typescript
// src/components/canvas/molecular-view.tsx
'use client';
import dynamic from 'next/dynamic';
import { useUIStore } from '@/stores';

const MolecularCanvas3D = dynamic(
  () => import('../canvas-3d/molecular-canvas-3d'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-bg-primary">
        <div className="text-text-secondary">Loading molecular view...</div>
      </div>
    )
  }
);

export function MolecularView() {
  const canvasMode = useUIStore((s) => s.canvasMode);

  if (canvasMode === '2d') return null;

  return <MolecularCanvas3D />;
}
```

---

### Phase 10: Polish & Paywall (6-8 hours)

**Tasks:**
1. Add micro-interactions (hover scales, selection pulses)
2. Add keyboard shortcuts overlay (? key)
3. Implement usage tracking for free tier
4. Gate premium features (themes, export, API)
5. Add onboarding tooltips for new users

---

## Timeline Summary

| Phase | Focus | Hours |
|-------|-------|-------|
| 0 | Foundation | 4-6 |
| 1 | Layout Shell | 6-8 |
| 2 | Tree Panel | 8-10 |
| 3 | 2D Blueprint Canvas | 12-16 |
| 4 | Canvas Interactions | 6-8 |
| 5 | Detail Panel | 6-8 |
| 6 | Theme System | 4-6 |
| 7 | Toolbar & Search | 6-8 |
| 8 | Progressive Reveal | 8-10 |
| 9 | Optional 3D | 8-10 |
| 10 | Polish & Paywall | 6-8 |
| **Total** | | **75-98 hours** |

---

## Dependencies to Add

```bash
pnpm add d3-hierarchy d3-selection d3-force
pnpm add -D @types/d3-hierarchy @types/d3-selection @types/d3-force
```

**Bundle impact:** +20KB gzipped (D3 modules are tree-shakeable)

---

## Bundle Optimization Checklist

- [ ] Lazy-load 3D viewer with `dynamic(..., { ssr: false })`
- [ ] Remove Framer Motion, use CSS transitions (saves 85KB)
- [ ] Tree-shake D3 (only import needed modules)
- [ ] Use `next/dynamic` for chat drawer
- [ ] Run `pnpm build` and check bundle analyzer

---

## Sources

- [Next.js Lazy Loading Guide](https://nextjs.org/docs/app/guides/lazy-loading)
- [D3 Hierarchy Documentation](https://github.com/d3/d3-hierarchy)
- [React Three Fiber Performance](https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx)
- [Zustand Persist Middleware](https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md)
- [Tailwind CSS Theming](https://tailwindcss.com/docs/theme)
- [SVG vs Canvas Performance Study 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12061801/)

---

**Plan saved to:** `docs/plans/2025-01-22-composition-ui-redesign-final.md`
