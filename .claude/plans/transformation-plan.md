# Composition App - Full Transformation Plan

## Vision
Transform the MVP into a stunning, unique application with:
- **Bottom panel tree navigation** for exploring composition hierarchy
- **Conversational AI chatbot** in bottom drawer (shares space with tree)
- **Beautiful molecular visualization** for chemicals/elements + enhanced procedural shapes
- **Unique visual identity** - science/chemistry inspired, NOT generic AI aesthetic
- **Simplified mobile** - Core viewing + tree navigation, desktop-optimized chat

---

## Architecture Overview

### Home Page - Analysis Terminal
```
┌─────────────────────────────────────────────────────────────────────────┐
│  COMPOSITION ANALYSIS TERMINAL                              [●] ONLINE  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─ SYSTEM STATUS ──┐    ┌─────────────────────────────────────────┐   │
│  │ API: ● READY     │    │                                         │   │
│  │ MODEL: Claude    │    │     ENTER SPECIMEN FOR ANALYSIS         │   │
│  │ CACHE: 2.8K      │    │     ┌─────────────────────────────┐     │   │
│  └──────────────────┘    │     │ > _                         │     │   │
│                          │     └─────────────────────────────┘     │   │
│  ┌─ RECENT ─────────┐    │            [ANALYZE]                    │   │
│  │ iPhone 15 Pro    │    └─────────────────────────────────────────┘   │
│  │ Human Blood      │                                                   │
│  │ Concrete Mix     │    ┌─ QUICK SPECIMENS ───────────────────────┐   │
│  └──────────────────┘    │ [iPhone] [Coca-Cola] [Blood] [Concrete] │   │
│                          └─────────────────────────────────────────┘   │
│  ┌─ QUEUE ──────────┐                                                   │
│  │ (empty)          │    ┌─ SYSTEM LOG ────────────────────────────┐   │
│  └──────────────────┘    │ 12:34:56 Analysis complete: iPhone 15   │   │
│                          │ 12:34:12 Researching components...      │   │
│                          └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Analysis View - 3D Workstation
```
┌─────────────────────────────────────────────────────────────────────────┐
│ FILE  EDIT  VIEW  ANALYSIS  HELP          iPhone 15 Pro     [⚙] [□] [×]│
├───────┬─────────────────────────────────────────────────────┬───────────┤
│ TOOLS │                                                     │PROPERTIES │
│       │                                                     │           │
│ [◇]   │                  3D VIEWPORT                        │ SELECTED  │
│ [↔]   │                                                     │ Battery   │
│ [⟳]   │            ┌───────────────────┐                    │───────────│
│ [⊞]   │            │                   │                    │ Type:     │
│───────│            │   [Composition]   │                    │ component │
│LAYERS │            │                   │                    │ Mass: 12% │
│ [●]   │            └───────────────────┘                    │ Conf: ●   │
│ [○]   │                                                     │───────────│
│ [○]   │        Grid · Snap · Wireframe                      │ READOUTS  │
│ [○]   │                                                     │ Depth: 3  │
│ [○]   │                                                     │ Nodes: 42 │
├───────┴─────────────────────────────────────────────────────┤ Veri: 78% │
│ HIERARCHY                    │ CHAT                         │           │
│ ▼ iPhone 15 Pro              │ Ask about this composition   │           │
│   ▼ Display Assembly (23%)   │ ┌─────────────────────────┐  │           │
│     ► OLED Panel             │ │ > _                     │  │           │
│   ▼ Battery (12%)            │ └─────────────────────────┘  │           │
└──────────────────────────────┴──────────────────────────────┴───────────┘
```

---

## Phase 1: UI Foundation & Design System (4-5 days)

### 1.1 Visual Identity - "Clinical Lab Terminal"

**Design Philosophy:**
A professional research analysis terminal - sterile, precise, scientific. Combines:
- **Mission control** elements (data streams, system status, live readouts)
- **Research terminal** aesthetic (monospace fonts, command-line inspired)
- **Lab workstation** feel (specimen slots, analysis queue, instrument panels)

**Color Palette:**
```css
/* Clinical Lab - Dark with white/blue accents */
--bg-primary: #0a0b0d;        /* Near black */
--bg-secondary: #101214;      /* Panel backgrounds */
--bg-tertiary: #181a1e;       /* Cards, elevated surfaces */
--bg-panel: #0d0e10;          /* Tool panels */

--accent-primary: #3b9eff;    /* Clinical blue - primary actions */
--accent-secondary: #00d4aa;  /* Teal - success, verified */
--accent-warning: #ffb020;    /* Amber - estimated data */
--accent-danger: #ff4757;     /* Red - speculative, errors */

--text-primary: #f0f2f5;      /* High contrast white */
--text-secondary: #8b919a;    /* Muted labels */
--text-mono: #00ff88;         /* Terminal green for data */

--border-subtle: #1e2228;     /* Panel borders */
--border-active: #3b9eff33;   /* Focused elements */

/* Grid/guides (like design software) */
--grid-line: #ffffff08;
--grid-major: #ffffff12;
```

**Typography:**
```css
--font-ui: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
--font-data: 'IBM Plex Mono', monospace;  /* For readouts */
```

### 1.2 Tasks

- [ ] Update `src/app/globals.css` with design system CSS variables
- [ ] Add Google Fonts for Inter and JetBrains Mono
- [ ] Create `src/components/layout/terminal-shell.tsx`
- [ ] Create `src/components/layout/toolbar.tsx`
- [ ] Create `src/components/layout/properties-panel.tsx`
- [ ] Create `src/components/layout/menu-bar.tsx`
- [ ] Create `src/components/layout/status-bar.tsx`
- [ ] Create `src/components/home/analysis-terminal.tsx`
- [ ] Create `src/components/home/system-status.tsx`
- [ ] Create `src/components/home/recent-analyses.tsx`
- [ ] Create `src/components/home/specimen-input.tsx`
- [ ] Create `src/components/home/system-log.tsx`
- [ ] Install dependencies: framer-motion, @radix-ui/*, vaul

### 1.3 Dependencies to Add
```json
{
  "framer-motion": "^11.x",
  "@radix-ui/react-collapsible": "^1.x",
  "@radix-ui/react-tabs": "^1.x",
  "@radix-ui/react-menubar": "^1.x",
  "vaul": "^0.9.x",
  "react-markdown": "^9.x"
}
```

---

## Phase 2: Tree Navigation (3-4 days)

### 2.1 Tasks

- [ ] Create `src/components/tree/composition-tree-panel.tsx`
- [ ] Create `src/components/tree/tree-node.tsx`
- [ ] Create `src/components/tree/tree-node-element.tsx`
- [ ] Create `src/components/tree/tree-node-chemical.tsx`
- [ ] Create `src/components/tree/tree-node-material.tsx`
- [ ] Create `src/components/tree/tree-node-component.tsx`
- [ ] Update `src/stores/composition-store.ts` with expansion/focus state
- [ ] Implement tree-to-3D synchronization
- [ ] Add click/double-click handlers for node selection

### 2.2 Store Updates

Add to `src/stores/composition-store.ts`:
```typescript
expandedNodes: Set<string>       // Nodes whose children are exploded in 3D
treeExpandedNodes: Set<string>   // Nodes expanded in tree UI
focusedNodeId: string | null     // Camera focus target

toggleNodeExpansion: (nodeId: string) => void
expandTreeNode: (nodeId: string) => void
expandToNode: (nodeId: string) => void
setFocusedNode: (nodeId: string | null) => void
```

---

## Phase 3: Enhanced 3D Visualization (4-5 days)

### 3.1 Tasks

- [ ] Create `src/components/viewer/hybrid-node.tsx`
- [ ] Create `src/components/viewer/molecular-node.tsx`
- [ ] Create `src/components/viewer/procedural-node.tsx`
- [ ] Update `src/components/viewer/composition-node.tsx` with double-click
- [ ] Update `src/components/viewer/camera-controls.tsx` with focus animation
- [ ] Implement per-node explosion (not global)
- [ ] Add spring animations for explosions

### 3.2 Shape Mapping
```typescript
const TYPE_SHAPES = {
  product: 'rounded-box',
  component: 'cylinder',
  material: 'capsule',
  chemical: 'sphere',
  element: 'sphere',
}
```

---

## Phase 4: Conversational Chat (4-5 days)

### 4.1 Tasks

- [ ] Create `src/stores/chat-store.ts`
- [ ] Create `src/app/api/chat/route.ts` with streaming
- [ ] Create `src/components/chat/chat-drawer.tsx`
- [ ] Create `src/components/chat/chat-messages.tsx`
- [ ] Create `src/components/chat/chat-message.tsx`
- [ ] Create `src/components/chat/chat-input.tsx`
- [ ] Create `src/components/chat/node-reference.tsx`
- [ ] Create `src/components/chat/chat-suggestions.tsx`
- [ ] Add Prisma models for Conversation, Message, PopularQA
- [ ] Implement localStorage persistence

---

## Phase 5: Polish & Performance (2-3 days)

### 5.1 Tasks

- [ ] Add tree expand/collapse animations
- [ ] Add selection pulse animation
- [ ] Add drawer slide transitions
- [ ] Implement LOD for distant 3D nodes
- [ ] Add geometry instancing for molecules
- [ ] Add virtual scrolling for large trees
- [ ] Mobile optimization with Vaul bottom sheet
- [ ] Keyboard shortcuts (G, R, S for gizmos)

---

## Critical Files Summary

### Must Create
1. `src/components/layout/app-shell.tsx`
2. `src/components/layout/bottom-panel.tsx`
3. `src/components/tree/composition-tree-panel.tsx`
4. `src/components/tree/tree-node.tsx` + variants
5. `src/components/viewer/hybrid-node.tsx`
6. `src/components/viewer/molecular-node.tsx`
7. `src/components/chat/chat-drawer.tsx`
8. `src/stores/chat-store.ts`
9. `src/lib/models/model-resolver.ts`
10. `src/app/api/chat/route.ts`

### Must Modify
1. `src/stores/composition-store.ts` - Add explosion/focus state
2. `src/components/viewer/composition-node.tsx` - Double-click handler
3. `src/components/viewer/camera-controls.tsx` - Focus animation
4. `src/app/composition/[id]/composition-viewer.tsx` - New layout
5. `src/app/globals.css` - Design system variables
6. `prisma/schema.prisma` - Model3D, Conversation, Message tables

---

## Implementation Timeline

| Week | Phase | Deliverables |
|------|-------|--------------|
| 1 | UI Foundation | Design system, terminal shell, home page components |
| 2 | Analysis Workstation | Menu bar, toolbar, properties panel, 3D viewport layout |
| 3 | Tree + 3D Sync | Hierarchy panel, selection sync, per-node explosion |
| 4 | 3D Enhancement | Molecular viz, procedural shapes, transform controls |
| 5 | Chat System | Chat panel, streaming API, context management |
| 6 | Polish | Animations, keyboard shortcuts, performance |

**Total estimated time: 5-6 weeks**
