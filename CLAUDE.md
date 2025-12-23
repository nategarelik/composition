# Composition - Project Context

## Project Overview

**Composition** is a web application that deconstructs anything into its constituent parts through AI-powered research, visualized in stunning interactive 3D. Users search for any product, substance, or entity and see its complete composition: finished product → components → materials → chemicals → elements.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React Three Fiber, Tailwind CSS
- **State**: Zustand (global) + React Query (server)
- **Backend**: Next.js API Routes on Vercel
- **AI**: Claude Agents SDK + Perplexity API
- **Database**: PostgreSQL + Redis (Upstash) + Pinecone

## Current Design: CERN Particle Detector Aesthetic

**NOT a generic terminal.** Inspired by CERN control rooms, ATLAS/CMS detector visualizations, and particle physics instrumentation.

### Color Palette (CSS Variables)
```css
/* Void - Backgrounds */
--void-deep: #030305;
--void-primary: #060609;
--void-secondary: #0a0a0f;
--void-tertiary: #0f0f16;
--void-elevated: #14141e;

/* Wire Chamber */
--wire-dim: #1a1a2e;
--wire-medium: #252540;
--wire-bright: #3d3d66;

/* Particle Colors */
--particle-gold: #ffd700;     /* Verified, stable, heavy particles */
--particle-cyan: #00d4ff;     /* Active tracking, live data */
--particle-magenta: #ff2d7e;  /* Collisions, processing */
--particle-green: #39ff14;    /* Element traces */
--particle-orange: #ff8c00;   /* Warnings, estimations */

/* Node Types */
--node-product: #ffffff;
--node-component: var(--particle-cyan);
--node-material: var(--particle-orange);
--node-chemical: var(--particle-green);
--node-element: var(--particle-gold);
```

### Typography
- **Display**: DM Sans
- **Mono/Data**: Space Mono, Overpass Mono

### Key CSS Classes
- `.detector-bg` - Radial ring background pattern
- `.detector-panel` - Panel with top glow accent
- `.btn-detector`, `.btn-detector-primary` - Button styles
- `.specimen-tag` - Quick access pills
- `.status-indicator`, `.status-active` - Status dots with pulse
- `.label-detector` - Uppercase tracking labels

## File Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home (detector input)
│   ├── composition/[id]/  # Viewer page
│   └── api/               # API routes
├── components/
│   ├── home/              # Home page components
│   ├── viewer/            # 3D viewer components
│   ├── tree/              # Hierarchy tree
│   ├── layout/            # App shell, panels
│   └── ui/                # Shared UI
├── lib/
│   ├── agents/            # AI research agents
│   └── db/                # Database utilities
├── stores/                # Zustand stores
└── types/                 # TypeScript types
```

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run type-check   # TypeScript check
npm run lint         # ESLint
npm run fix          # Auto-fix lint/format
```

## Slash Commands

| Command | Description |
|---------|-------------|
| `/verify` | Run type-check + lint + build |
| `/fix` | Auto-fix lint and formatting |
| `/status` | Show project health |
| `/research [query]` | Research composition data |
| `/build-component` | Create component from design system |
| `/design-review` | Check design system compliance |
| `/deploy` | Deploy to Vercel with checks |

## Implementation Status

### Completed
- [x] MVP core functionality (search, 3D viewer, API)
- [x] CERN Detector design system (globals.css)
- [x] Home page redesign (detector rings, particle traces)
- [x] Security fixes (Zod validation, memory leaks)

### In Progress
- [ ] Viewer page redesign with new aesthetic
- [ ] Tree navigation panel styling

### Upcoming
- [ ] Enhanced 3D visualization (molecular nodes)
- [ ] Chat system integration
- [ ] Mobile optimization
- [ ] Performance polish (LOD, instancing)

## Environment Variables

```env
ANTHROPIC_API_KEY=     # Claude API
DATABASE_URL=          # PostgreSQL
REDIS_URL=             # Upstash (optional)
PERPLEXITY_API_KEY=    # Web research (optional)
```

## Best Practices

- Run `/verify` before each commit
- Use "ultrathink" for complex architectural decisions
- Prefer `sonnet` subagents for faster iteration
- Use `/clear` every 8-12 tasks for context management
- Commit frequently to checkpoint progress
