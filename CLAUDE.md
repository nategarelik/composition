# Composition - Project Context

## Project Overview

**Composition** is a web application that deconstructs anything into its constituent parts through AI-powered research, visualized in stunning interactive 3D. Users can search for any product, substance, or entity and see its complete composition broken down from finished product → components → raw materials → chemicals → elements.

## Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **3D Engine**: Three.js via React Three Fiber (@react-three/fiber, @react-three/drei)
- **Styling**: Tailwind CSS
- **State Management**: Zustand (for global state) + React Query (for server state)
- **Backend**: Next.js API Routes (serverless functions on Vercel)
- **AI Research**: Claude Agents SDK + Perplexity API for multi-source research
- **Database**: PostgreSQL (Vercel Postgres or Neon)
- **Cache**: Redis (Upstash) for hot caching popular queries
- **Vector DB**: Pinecone for semantic search across cached compositions
- **Deployment**: Vercel

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js + React Three Fiber + Three.js                     │
│  ├── Search Interface                                        │
│  ├── 3D Composition Viewer (explode/zoom/slice modes)       │
│  └── Share/Embed Components                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     VERCEL SERVERLESS                        │
│  API Routes                                                  │
│  ├── /api/search - Orchestrates AI research                 │
│  ├── /api/composition/[id] - Fetch cached compositions      │
│  └── /api/share - Generate share links                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   AI RESEARCH PIPELINE                       │
│  Claude Agents SDK + Perplexity API                         │
│  ├── Product Identifier Agent                               │
│  ├── Ingredient Researcher Agent                            │
│  ├── Chemical Breakdown Agent                               │
│  └── Element Mapper Agent                                   │
│  (Run in parallel, synthesize results)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
│  ├── PostgreSQL - Full composition storage, relationships   │
│  ├── Redis - Hot cache for popular queries                  │
│  └── Pinecone - Semantic search across compositions         │
└─────────────────────────────────────────────────────────────┘
```

## Data Model

### Composition Hierarchy
1. **Product Layer**: The searchable item (iPhone 15, Frosted Flakes, COVID-19)
2. **Component Layer**: Major parts/ingredients (screen, battery, sugar, spike protein)
3. **Material Layer**: Raw materials and chemicals (silicon dioxide, lithium cobalt oxide)
4. **Element Layer**: Periodic table elements with percentages (Si, Li, Co, O)

### Confidence Levels
- **Verified**: From official sources, ingredient labels, scientific papers
- **Estimated**: Calculated from known similar products
- **Speculative**: AI best-guess when data is limited

## Key Features

### MVP (Phase 1)
- [ ] Search any product/substance
- [ ] AI-powered composition research (15-60s with progress indicator)
- [ ] 3D visualization with exploded view
- [ ] User-controlled depth levels
- [ ] Shareable composition URLs

### Phase 2
- [ ] Drill-down zoom (infinite zoom into components)
- [ ] Cross-section view
- [ ] Toggle accurate vs balanced proportions
- [ ] User accounts and saved compositions

### Phase 3
- [ ] Comparison mode (iPhone 15 vs iPhone 14)
- [ ] API for third-party apps
- [ ] Premium depth levels (paywall)

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Functional components with hooks
- Server Components by default, Client Components when needed
- Colocate related files (component + styles + tests)

### File Structure
```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home/Search page
│   ├── composition/[id]/  # Composition view
│   └── api/               # API routes
├── components/
│   ├── search/            # Search UI components
│   ├── viewer/            # 3D viewer components
│   └── ui/                # Shared UI components
├── lib/
│   ├── agents/            # AI research agents
│   ├── db/                # Database utilities
│   └── three/             # Three.js utilities
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
└── types/                 # TypeScript types
```

### Performance Requirements
- Initial load < 3 seconds
- 3D viewer 60fps on modern hardware
- Research progress visible to user
- Graceful degradation on mobile

## Environment Variables Required

```env
# AI Services
ANTHROPIC_API_KEY=          # Claude API for agents
PERPLEXITY_API_KEY=         # Perplexity for web research

# Database
DATABASE_URL=               # PostgreSQL connection string
REDIS_URL=                  # Upstash Redis URL
PINECONE_API_KEY=           # Pinecone vector DB

# Vercel
VERCEL_URL=                 # Auto-set by Vercel
```

## AI Research Pipeline

When a user searches for something:

1. **Product Identification**: Identify exactly what the user is searching for
2. **Parallel Research**: Launch multiple agents simultaneously:
   - Ingredient/component researcher
   - Chemical composition researcher
   - Material science researcher
3. **Synthesis**: Combine results, resolve conflicts, assign confidence levels
4. **Caching**: Store in PostgreSQL, update Redis hot cache, index in Pinecone

## 3D Visualization Approach

- Start with realistic 3D model if available (via Sketchfab API or generated)
- Fall back to abstract scientific visualization (spheres, molecules)
- Exploded view: Click to separate layers
- Zoom mode: Infinite drill-down into components
- Slice mode: Cross-section through composition
- User toggle: Accurate proportions vs balanced display

## Working with This Project

### When implementing features:
1. Check existing components/utilities first
2. Follow the established patterns
3. Add TypeScript types for all new code
4. Test 3D components in isolation before integration
5. Consider mobile performance

### When debugging:
1. Check browser console for Three.js warnings
2. Use React DevTools for component tree
3. Check Network tab for API response times
4. Use `--debug` flag with Claude Code for verbose output

### When researching AI capabilities:
1. Use the `ai-researcher` subagent for composition data questions
2. Use the `3d-specialist` subagent for Three.js/R3F questions
3. Always cite sources in composition data
