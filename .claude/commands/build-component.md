---
description: Build a new React component following the Clinical Lab Terminal design system
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(npx:*)
argument-hint: [component-path] [component-type]
---

# Build Component Task

You are creating a new React component for the Composition app following the **Clinical Lab Terminal** design system.

## Arguments
- `$1` - Component path (e.g., `layout/toolbar`, `home/system-status`)
- `$2` - Component type: `server` | `client` | `3d`

## Design System Reference

### Colors (use CSS variables)
```css
--bg-primary: #0a0b0d;        /* Near black */
--bg-secondary: #101214;      /* Panel backgrounds */
--bg-tertiary: #181a1e;       /* Cards */
--accent-primary: #3b9eff;    /* Clinical blue */
--accent-secondary: #00d4aa;  /* Teal - success */
--text-primary: #f0f2f5;      /* White */
--text-secondary: #8b919a;    /* Muted */
--text-mono: #00ff88;         /* Terminal green */
--border-subtle: #1e2228;     /* Borders */
```

### Typography
- UI text: `font-sans` (Inter)
- Data/code: `font-mono` (JetBrains Mono)

### Patterns
- Use `'use client'` only when needed (interactivity, hooks)
- Export named functions, not default
- Use TypeScript strict mode
- Colocate types at top of file

## Current Context
!`ls -la src/components/$1 2>/dev/null || echo "Creating new component directory"`

## Instructions

1. Create component at `src/components/$1.tsx`
2. Follow the Clinical Lab Terminal aesthetic
3. Add proper TypeScript interfaces
4. Use Tailwind CSS with design system variables
5. For `client` components, add `'use client'` directive
6. For `3d` components, use React Three Fiber patterns
7. Export from `src/components/$1/index.ts` if part of a feature

Build the component: `$ARGUMENTS`
