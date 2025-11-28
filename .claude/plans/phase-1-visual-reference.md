# Phase 1: Visual Reference Guide

## Complete Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│ FILE  EDIT  VIEW  ANALYSIS  HELP    iPhone 15 Pro      [⚙] [−] [□] [×]│ ← MenuBar
├────────┬───────────────────────────────────────────────────┬───────────┤
│ TOOLS  │                                                   │PROPERTIES │
│        │                                                   │           │
│  [◇]   │                  3D VIEWPORT                      │ SELECTED  │
│  [↔]   │                                                   │ Battery   │ ← Properties
│  [⟳]   │           ┌───────────────────┐                   │───────────│   Panel
│  [⊞]   │           │                   │                   │ Type:     │
│        │           │                   │                   │ component │
│ ────── │           │   [3D Canvas]     │                   │           │
│ LAYERS │           │                   │                   │ Mass:     │
│        │           │                   │                   │ 12.4%     │
│  [●]   │           └───────────────────┘                   │           │
│  [●]   │                                                   │ Conf:     │
│  [●]   │  ────────────────────────────────────             │ verified  │
│  [●]   │  Grid · Snap · Wireframe                          │           │
│  [●]   │                                                   │ READOUTS  │
│        │                                                   │───────────│
│ Toolbar│                                                   │ Depth: 3  │
│        │                                                   │ Nodes: 42 │
│        │                                                   │ Verified: │
│        │                                                   │ 78%       │
├────────┴───────────────────────────────────────────────────┴───────────┤
│ ⬌ Exploded View  │ 🔍 100%  │ ◇ 1 selected     V G R S F H │           │ ← StatusBar
└────────────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### MenuBar (32px height)
```
┌────────────────────────────────────────────────────────────────────────┐
│ [FILE] [EDIT] [VIEW] [ANALYSIS] [HELP]   iPhone 15 Pro   [⚙][−][□][×] │
└────────────────────────────────────────────────────────────────────────┘
  ↑                                           ↑                ↑
  Menus (hover to open)                  Composition      Window
                                            Name           Controls
```

**Menus:**
- FILE: New, Open, Save, Export
- EDIT: Undo, Redo, Preferences
- VIEW: Toolbar, Panels, Fullscreen
- ANALYSIS: Re-analyze, Depth, Sources
- HELP: Docs, Shortcuts, About

### Toolbar (48px width)
```
┌────────┐
│ TOOLS  │
│        │
│  [◇]   │ ← Select (V) - active
│  [↔]   │ ← Move (G)
│  [⟳]   │ ← Rotate (R)
│  [⊞]   │ ← Scale (S)
│        │
│ ────── │
│ LAYERS │
│        │
│  [●]   │ ← Product (blue)
│  [●]   │ ← Component (purple)
│  [●]   │ ← Material (orange)
│  [○]   │ ← Chemical (teal) - hidden
│  [●]   │ ← Element (yellow)
└────────┘
```

**Interactions:**
- Click tool to activate
- Click layer to toggle visibility
- Hover for tooltip with shortcut
- Keyboard shortcuts work globally

### Properties Panel (256px width)
```
┌───────────┐
│PROPERTIES │
│           │
│ SELECTED  │
│───────────│
│           │
│ Battery   │ ← Node name
│           │
│ Type:     │
│ component │ ← Colored badge
│           │
│ Mass:     │
│ 12.4%     │ ← Terminal green
│           │
│ Conf:     │
│ ✓ Verified│ ← Confidence badge
│           │
│───────────│
│ READOUTS  │
│───────────│
│           │
│ Depth: 3  │ ← Tree stats
│ Nodes: 42 │
│ Verified: │
│ 78%       │
│           │
│───────────│
│ SYSTEM    │
│───────────│
│           │
│ FPS: 60   │ ← Performance
│ Memory:   │
│ 124 MB    │
│ Render:   │
│ WebGL 2.0 │
└───────────┘
```

**Data Hierarchy:**
1. Selected Node (if any)
   - Name + description
   - Type badge (color-coded)
   - Mass percentage
   - Confidence level
   - Symbol (elements)
   - CAS # (chemicals)

2. Readouts (always visible)
   - Tree depth
   - Total nodes
   - Verified %
   - Children count

3. System Info (always visible)
   - FPS counter
   - Memory usage
   - Render mode

### Status Bar (24px height)
```
┌────────────────────────────────────────────────────────────────────────┐
│ ⬌ Exploded View  │ 🔍 100%  │ ◇ 1 selected     [V] [G] [R] [S] [F] [H] │
└────────────────────────────────────────────────────────────────────────┘
  ↑                  ↑          ↑                  ↑
  View Mode       Zoom %    Selection Count    Shortcuts
```

**Sections:**
- Left: Mode, Zoom, Selection
- Center: Status message (optional)
- Right: Keyboard shortcuts

### Viewport Area (flex-1)
```
┌───────────────────────────────────────────────────┐
│                                                   │
│  [Hide Toolbar] [Hide Properties]                │ ← Toggle buttons
│                                                   │
│                                                   │
│               [3D Canvas Area]                    │
│                                                   │
│                                                   │
│                                                   │
│  Grid · Snap · Wireframe                          │ ← View options
└───────────────────────────────────────────────────┘
```

**Overlays:**
- Top-left: Panel toggle buttons
- Bottom-left: View mode indicators
- Background: Grid pattern (optional)

## Color States

### Tool Button States
```
Normal:   [◇]  text-[var(--text-secondary)]     #8b919a
Hover:    [◇]  text-[var(--text-primary)]       #f0f2f5
Active:   [◇]  bg-[var(--accent-primary)]       #3b9eff
          ↑
          White text on blue background
```

### Layer Toggle States
```
Visible:  [●]  color: var(--node-{type})
Hidden:   [○]  color: var(--text-tertiary)

Product:    #3b9eff (blue)
Component:  #a855f7 (purple)
Material:   #f97316 (orange)
Chemical:   #00d4aa (teal)
Element:    #eab308 (yellow)
```

### Confidence Badges
```
✓ Verified      #00d4aa (teal)   [solid background]
≈ Estimated     #ffb020 (amber)  [translucent bg]
? Speculative   #ff4757 (red)    [translucent bg]
```

### Type Badges
```
product     #3b9eff (blue)
component   #a855f7 (purple)
material    #f97316 (orange)
chemical    #00d4aa (teal)
element     #eab308 (yellow)
```

## Spacing Grid

```
Panel Header:     px-3 py-2 (12px 8px)
Panel Content:    p-3 (12px)
Tool Button:      w-8 h-8 (32px square)
Button Gap:       gap-1 (4px)
Section Gap:      gap-3 (12px)
Border Radius:    rounded (4px)
                  rounded-md (6px)
```

## Typography Scale

```
Menu Items:       12px  (text-xs)
Labels:           12px  uppercase tracking-wider
Body:             13px  (text-sm)
Data:             12px  font-mono tabular-nums
Large Data:       18px  font-mono
Shortcuts:        10px  font-mono
```

## Animation Timings

```
Panel Slide:      200ms ease-out
Button Hover:     150ms ease
Focus Ring:       instant (no transition)
Status Pulse:     2s infinite
```

## Responsive Breakpoints

```
Desktop (lg+):    Full 3-column layout
Tablet (md):      2-column, collapsible panels
Mobile (sm):      Single column, bottom sheets
```

## Z-Index Layers

```
z-0   Base viewport
z-10  Grid overlay
z-20  Viewport controls
z-30  Panels
z-40  Tooltips
z-50  Dropdown menus
z-60  Modals (future)
```

## Keyboard Shortcuts

```
Tools:
  V - Select
  G - Move (Grab)
  R - Rotate
  S - Scale

View:
  F - Focus selected
  H - Hide/Show
  ? - Shortcuts help
  F11 - Fullscreen

File:
  Ctrl+N - New analysis
  Ctrl+O - Open
  Ctrl+S - Save
  Ctrl+E - Export

Edit:
  Ctrl+Z - Undo
  Ctrl+Y - Redo
```

## Component Hierarchy

```
TerminalShell
├── MenuBar
├── Toolbar
├── Viewport (children prop)
│   ├── Grid Overlay
│   └── Control Overlays
├── PropertiesPanel
└── StatusBar
```

## State Flow

```
Parent Component
    │
    ├─ [selectedNode] ──────┐
    │                        ↓
    ├─ TerminalShell ───> PropertiesPanel
    │      │                 (displays node)
    │      │
    │      ├─ activeTool ──> Toolbar
    │      │                 (highlights tool)
    │      │
    │      ├─ viewMode ────> StatusBar
    │      │                 (shows mode)
    │      │
    │      └─ visibleLayers > Toolbar
    │                         (layer toggles)
    │
    └─ CompositionCanvas
           │
           └─ onNodeClick ──> setSelectedNode
```

## File Sizes

```
menu-bar.tsx           219 lines   ~6.5 KB
toolbar.tsx            194 lines   ~6.0 KB
properties-panel.tsx   271 lines   ~8.5 KB
status-bar.tsx          98 lines   ~3.0 KB
terminal-shell.tsx     143 lines   ~4.5 KB
utils.ts                11 lines   ~0.2 KB
index.ts                 7 lines   ~0.1 KB
                      ─────────────────────
Total:                 943 lines  ~29 KB
```

---

This visual reference provides a complete overview of the Phase 1 layout implementation.
