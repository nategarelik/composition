# Composition App - Transformation Plan

## Design Direction: CERN Particle Detector Console

**NOT a generic terminal.** Inspired by CERN control rooms, ATLAS/CMS detector cross-sections, and particle physics data visualization.

### Visual Identity
- **Circular/radial displays** - like particle detectors, not rectangular cards
- **Wire chamber aesthetic** - fine grid lines, track visualizations
- **Particle color coding** - Gold (stable), Cyan (active), Magenta (processing), Green (traces)
- **Scientific typography** - DM Sans for display, Space Mono for data

---

## Phase 1: Design System & Home Page [COMPLETED]

### Completed Tasks
- [x] New CSS design system with CERN aesthetic (`globals.css`)
- [x] Void color palette (deep blacks with purple undertones)
- [x] Particle accent colors (gold, cyan, magenta, green, orange)
- [x] Wire chamber decorative elements
- [x] Detector ring SVG visualization
- [x] Particle trace animations
- [x] Home page with circular detector input
- [x] System readouts sidebar
- [x] Quick specimens and recent analyses

### Key Files Modified
- `src/app/globals.css` - Complete design system
- `src/components/home/analysis-terminal.tsx` - Detector-style home page

---

## Phase 2: Viewer Page Redesign [NEXT]

Apply CERN aesthetic to the 3D composition viewer.

### Tasks
- [ ] Update `src/app/composition/[id]/composition-viewer.tsx` layout
- [ ] Apply detector panel styling to sidebar
- [ ] Update menu bar with new aesthetic
- [ ] Style toolbar with wire frame elements
- [ ] Update properties panel with readout styling
- [ ] Add detector grid overlay to 3D viewport

### Layout Target
```
┌────────────────────────────────────────────────────────────┐
│ ◉ COMPOSITION · iPhone 15 Pro                    SESSION 00:12:34 │
├────────┬───────────────────────────────────────┬───────────┤
│ TOOLS  │                                       │ READOUTS  │
│        │          3D VIEWPORT                  │           │
│ [◇]    │     (detector grid overlay)          │ Mass: 221g│
│ [↔]    │                                       │ Depth: 4  │
│ [⟳]    │         [Composition]                │ Nodes: 142│
│        │                                       │ Conf: 94% │
├────────┴───────────────────────────────────────┴───────────┤
│ HIERARCHY                    │ CHAT                        │
│ ▼ iPhone 15 Pro              │ Ask about this composition  │
└──────────────────────────────┴─────────────────────────────┘
```

---

## Phase 3: Tree Navigation Styling

Update tree panel to match detector aesthetic.

### Tasks
- [ ] Update `src/components/tree/tree-node.tsx` with particle colors
- [ ] Add wire line connectors between nodes
- [ ] Implement selection glow effects
- [ ] Add expand/collapse animations
- [ ] Style type-specific nodes (element, chemical, material, component)

### Node Styling
| Type | Color | Icon Style |
|------|-------|------------|
| Product | White | Solid circle |
| Component | Cyan | Hollow circle |
| Material | Orange | Diamond |
| Chemical | Green | Hexagon |
| Element | Gold | Atomic symbol |

---

## Phase 4: Enhanced 3D Visualization

Improve 3D nodes with molecular and procedural shapes.

### Tasks
- [ ] Create `molecular-node.tsx` for chemical/element visualization
- [ ] Add atomic orbital representations for elements
- [ ] Implement per-node explosion (not global)
- [ ] Add spring physics for explosion animations
- [ ] Camera focus animation on node selection
- [ ] LOD system for distant nodes

### Shape Mapping
```typescript
const TYPE_SHAPES = {
  product: 'rounded-box',
  component: 'cylinder',
  material: 'capsule',
  chemical: 'molecule-sphere',
  element: 'atomic-orbital',
}
```

---

## Phase 5: Chat Integration

Add conversational AI to the viewer.

### Tasks
- [ ] Create `src/stores/chat-store.ts`
- [ ] Create `src/app/api/chat/route.ts` with streaming
- [ ] Build chat drawer component with detector styling
- [ ] Implement message streaming UI
- [ ] Add node reference mentions (@Battery, @Lithium)
- [ ] Context-aware suggestions based on current selection

---

## Phase 6: Polish & Performance

Final optimization and mobile support.

### Tasks
- [ ] Tree expand/collapse spring animations
- [ ] Selection pulse effects
- [ ] Geometry instancing for repeated shapes
- [ ] Virtual scrolling for large trees (1000+ nodes)
- [ ] Mobile: Bottom sheet navigation with Vaul
- [ ] Keyboard shortcuts (G, R, S for gizmos)
- [ ] Accessibility audit (WCAG 2.1 AA)

---

## File Reference

### Must Modify
1. `src/app/composition/[id]/composition-viewer.tsx`
2. `src/components/tree/tree-node.tsx`
3. `src/components/viewer/composition-node.tsx`
4. `src/components/layout/*.tsx` (all layout components)

### Must Create
1. `src/components/viewer/molecular-node.tsx`
2. `src/components/viewer/atomic-orbital.tsx`
3. `src/stores/chat-store.ts`
4. `src/app/api/chat/route.ts`
5. `src/components/chat/*.tsx`

---

## Progress Summary

| Phase | Status | Key Deliverable |
|-------|--------|-----------------|
| 1. Design System | ✅ Complete | CERN aesthetic, home page |
| 2. Viewer Page | 🔄 Next | Detector-style viewer |
| 3. Tree Styling | ⏳ Pending | Particle-colored tree |
| 4. 3D Enhancement | ⏳ Pending | Molecular visualization |
| 5. Chat System | ⏳ Pending | Streaming chat drawer |
| 6. Polish | ⏳ Pending | Animations, mobile, perf |
