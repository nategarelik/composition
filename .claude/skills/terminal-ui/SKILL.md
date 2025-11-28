---
name: Clinical Lab Terminal UI
description: Design system and patterns for the Clinical Lab Terminal aesthetic. Use when building UI components, styling elements, or implementing the terminal workstation interface.
allowed-tools: Read, Write, Edit, Grep, Glob
---

# Clinical Lab Terminal UI Design System

This skill provides the complete design system for the Composition app's "Clinical Lab Terminal" aesthetic.

## When to Use This Skill

- Building new UI components
- Styling existing components
- Implementing layout patterns
- Creating terminal-style interfaces
- Building 3D workstation controls

## Color Palette

### Core Colors
| Variable | Hex | Usage |
|----------|-----|-------|
| `--bg-primary` | `#0a0b0d` | Page background |
| `--bg-secondary` | `#101214` | Panel backgrounds |
| `--bg-tertiary` | `#181a1e` | Cards, elevated surfaces |
| `--bg-panel` | `#0d0e10` | Tool panels |

### Accent Colors
| Variable | Hex | Usage |
|----------|-----|-------|
| `--accent-primary` | `#3b9eff` | Primary actions, links |
| `--accent-secondary` | `#00d4aa` | Success, verified data |
| `--accent-warning` | `#ffb020` | Warnings, estimated data |
| `--accent-danger` | `#ff4757` | Errors, speculative data |

### Text Colors
| Variable | Hex | Usage |
|----------|-----|-------|
| `--text-primary` | `#f0f2f5` | Primary text |
| `--text-secondary` | `#8b919a` | Labels, muted text |
| `--text-mono` | `#00ff88` | Terminal output, data |

### Layer Colors (Composition Types)
| Variable | Hex | Type |
|----------|-----|------|
| `--layer-product` | `#ffffff` | Product nodes |
| `--layer-component` | `#4a9eff` | Component nodes |
| `--layer-material` | `#c4a35a` | Material nodes |
| `--layer-chemical` | `#50fa7b` | Chemical nodes |
| `--layer-element` | `#ff79c6` | Element nodes |

## Typography

```tsx
// Tailwind classes
const typography = {
  // UI Text (Inter)
  uiLarge: "font-sans text-lg font-medium text-text-primary",
  uiNormal: "font-sans text-sm text-text-primary",
  uiSmall: "font-sans text-xs text-text-secondary",
  uiLabel: "font-sans text-xs text-text-secondary uppercase tracking-wider",

  // Mono/Data (JetBrains Mono)
  monoLarge: "font-mono text-lg text-text-mono",
  monoNormal: "font-mono text-sm text-text-primary",
  monoSmall: "font-mono text-xs text-text-secondary",
  monoData: "font-mono text-xs text-text-mono tabular-nums",
}
```

## Component Patterns

### Panel
```tsx
function Panel({ title, icon, children }: PanelProps) {
  return (
    <div className="bg-bg-panel border border-border-subtle rounded-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border-subtle">
        {icon}
        <span className="font-mono text-xs text-text-secondary uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}
```

### Status Indicator
```tsx
function StatusIndicator({ status }: { status: 'online' | 'offline' | 'processing' }) {
  const colors = {
    online: 'bg-accent-secondary',
    offline: 'bg-accent-danger',
    processing: 'bg-accent-warning',
  }

  return (
    <span className="relative flex h-2 w-2">
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${colors[status]}`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${colors[status]}`} />
    </span>
  )
}
```

### Terminal Input
```tsx
function TerminalInput({ placeholder, value, onChange }: InputProps) {
  return (
    <div className="flex items-center gap-2 bg-bg-tertiary border border-border-subtle rounded px-3 py-2">
      <span className="text-accent-secondary font-mono">{">"}</span>
      <input
        className="flex-1 bg-transparent text-text-primary font-mono outline-none placeholder:text-text-secondary"
        placeholder={placeholder || "_"}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
```

### Menu Bar
```tsx
function MenuBar({ items }: { items: string[] }) {
  return (
    <div className="flex items-center gap-0 bg-bg-primary border-b border-border-subtle">
      {items.map(item => (
        <button
          key={item}
          className="px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
        >
          {item}
        </button>
      ))}
    </div>
  )
}
```

### Tool Button
```tsx
function ToolButton({ icon, label, shortcut, active }: ToolButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded",
        "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary",
        "transition-colors group relative",
        active && "bg-accent-primary/20 text-accent-primary"
      )}
      title={`${label} (${shortcut})`}
    >
      <span className="text-lg">{icon}</span>
    </button>
  )
}
```

### Data Readout
```tsx
function DataReadout({ label, value, unit }: ReadoutProps) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-border-subtle/50 last:border-0">
      <span className="font-mono text-xs text-text-secondary">{label}</span>
      <span className="font-mono text-xs text-text-mono tabular-nums">
        {value}{unit && <span className="text-text-secondary ml-1">{unit}</span>}
      </span>
    </div>
  )
}
```

## Layout Patterns

### App Shell
```
┌────────────────────────────────────────────────────────┐
│ MENU BAR                                               │
├───────┬────────────────────────────────────┬───────────┤
│TOOLBAR│         MAIN CONTENT               │PROPERTIES │
│       │                                    │           │
│  [◇]  │                                    │  PANEL    │
│  [↔]  │                                    │           │
│  [⟳]  │                                    │           │
├───────┴────────────────────────────────────┴───────────┤
│ BOTTOM PANEL (Tabs: Hierarchy | Chat)                  │
└────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints
- Desktop: Full 3-column layout (toolbar + main + properties)
- Tablet: 2-column (main + collapsible side panels)
- Mobile: Single column with bottom sheet navigation

## Animation Guidelines

### Transitions
```css
/* Default transition */
transition: all 150ms ease-out;

/* Panel open/close */
transition: transform 200ms ease-out, opacity 150ms ease-out;

/* Status pulse */
animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
```

### Motion Principles
1. Quick responses (150-200ms) for interactions
2. Smooth easing for panels and drawers
3. Subtle pulse for live status indicators
4. Spring physics for 3D camera movements

## Accessibility

- Maintain WCAG 2.1 AA contrast ratios
- All interactive elements must be keyboard accessible
- Focus indicators use `ring-2 ring-accent-primary ring-offset-2 ring-offset-bg-primary`
- Status changes announced to screen readers
