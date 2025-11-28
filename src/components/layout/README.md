# Layout Components - Clinical Lab Terminal UI

Phase 1 layout components implementing the Clinical Lab Terminal aesthetic.

## Components

### TerminalShell

Main app shell that wraps the composition viewer with menu bar, toolbar, properties panel, and status bar.

**Usage:**

```tsx
import { TerminalShell } from '@/components/layout'
import { CompositionCanvas } from '@/components/viewer/composition-canvas'

export default function CompositionPage({ composition }) {
  const [selectedNode, setSelectedNode] = useState(null)

  return (
    <TerminalShell
      compositionName={composition.name}
      selectedNode={selectedNode}
      totalNodes={42}
      maxDepth={3}
      verifiedPercentage={78}
      onNodeSelect={setSelectedNode}
    >
      <CompositionCanvas
        composition={composition}
        onNodeClick={setSelectedNode}
      />
    </TerminalShell>
  )
}
```

**Props:**
- `children` - Main viewport content (3D canvas)
- `compositionName` - Name to display in menu bar
- `selectedNode` - Currently selected composition node
- `totalNodes` - Total node count for readouts
- `maxDepth` - Maximum depth level for readouts
- `verifiedPercentage` - Percentage of verified data
- `onNodeSelect` - Callback when node selection changes

### MenuBar

Top menu bar with FILE, EDIT, VIEW, ANALYSIS, HELP menus.

**Usage:**

```tsx
import { MenuBar } from '@/components/layout'

<MenuBar compositionName="iPhone 15 Pro" />
```

**Features:**
- Blender/Figma-style menus
- Window controls (minimize, maximize, close)
- Keyboard shortcut hints
- Radix UI for accessibility

### Toolbar

Left vertical toolbar with tool buttons and layer toggles.

**Usage:**

```tsx
import { Toolbar } from '@/components/layout'

const [activeTool, setActiveTool] = useState('select')
const [visibleLayers, setVisibleLayers] = useState(new Set(['product', 'component']))

<Toolbar
  activeTool={activeTool}
  onToolChange={setActiveTool}
  visibleLayers={visibleLayers}
  onLayerToggle={(type) => {
    const next = new Set(visibleLayers)
    next.has(type) ? next.delete(type) : next.add(type)
    setVisibleLayers(next)
  }}
/>
```

**Tools:**
- Select (V) - ◇
- Move (G) - ↔
- Rotate (R) - ⟳
- Scale (S) - ⊞

**Layers:**
- Product - Blue
- Component - Purple
- Material - Orange
- Chemical - Teal
- Element - Yellow

### PropertiesPanel

Right panel showing selected node properties and system readouts.

**Usage:**

```tsx
import { PropertiesPanel } from '@/components/layout'

<PropertiesPanel
  selectedNode={node}
  totalNodes={42}
  maxDepth={3}
  verifiedPercentage={78}
/>
```

**Sections:**
- Selected Node (name, type, percentage, confidence)
- Readouts (depth, nodes, verified %)
- System Info (FPS, memory, render mode)

### StatusBar

Bottom status bar with mode, zoom, and keyboard shortcuts.

**Usage:**

```tsx
import { StatusBar } from '@/components/layout'

<StatusBar
  mode="exploded"
  zoomLevel={100}
  selectedCount={1}
  message="Click a node to inspect"
/>
```

## Design Tokens

All components use CSS variables from `globals.css`:

```css
--bg-primary: #0a0b0d;        /* Page background */
--bg-secondary: #101214;      /* Panel backgrounds */
--bg-tertiary: #181a1e;       /* Cards */
--bg-panel: #0d0e10;          /* Tool panels */

--accent-primary: #3b9eff;    /* Primary actions */
--accent-secondary: #00d4aa;  /* Success */
--accent-warning: #ffb020;    /* Warnings */
--accent-danger: #ff4757;     /* Errors */

--text-primary: #f0f2f5;      /* Primary text */
--text-secondary: #8b919a;    /* Labels */
--text-mono: #00ff88;         /* Terminal data */

--border-subtle: #1e2228;     /* Panel borders */
```

## Animations

Uses Framer Motion for:
- Panel slide in/out
- Status indicator pulse
- Smooth transitions

## Accessibility

- Keyboard navigation via Radix UI
- Focus indicators (ring-2 ring-accent-primary)
- WCAG 2.1 AA contrast ratios
- Tooltips with keyboard shortcuts
- Screen reader support

## Responsive Behavior

- Desktop: Full 3-column layout (toolbar + main + properties)
- Tablet: Collapsible side panels
- Mobile: Single column (Phase 2 implementation)

## Next Steps (Phase 2)

- [ ] Bottom panel with tabs (Hierarchy | Chat)
- [ ] Tree view component for hierarchy
- [ ] Chat interface for AI assistant
- [ ] Mobile responsive layout
- [ ] Panel resize handles
- [ ] Keyboard shortcut system
