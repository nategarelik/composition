# Composition - Complete Documentation

> **AI-powered composition analysis that deconstructs anything into its constituent parts with interactive 3D visualization.**

---

## Table of Contents

### For Users
- [What is Composition?](#what-is-composition)
- [Getting Started](#getting-started)
- [Features Guide](#features-guide)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Understanding Results](#understanding-results)
- [Sharing & Embedding](#sharing--embedding)
- [FAQ](#faq)

### For Developers
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [State Management](#state-management)
- [3D Visualization System](#3d-visualization-system)
- [AI Research Pipeline](#ai-research-pipeline)
- [Security Implementation](#security-implementation)
- [Environment Setup](#environment-setup)
- [Development Workflow](#development-workflow)
- [Deployment Guide](#deployment-guide)
- [Testing](#testing)
- [Contributing](#contributing)

---

# For Users

## What is Composition?

Composition is a web application that uses artificial intelligence to break down any product, substance, or entity into its fundamental components. Whether you want to know what's inside your smartphone, the ingredients in your favorite snack, or the molecular structure of a medication, Composition provides detailed hierarchical breakdowns visualized in stunning interactive 3D.

### How It Works

1. **Search** - Enter any item (e.g., "iPhone 15", "chocolate bar", "aspirin")
2. **Research** - Our AI researches official sources, scientific papers, and databases
3. **Visualize** - See the complete composition as an interactive 3D model
4. **Explore** - Drill down from finished product to individual elements

### Composition Hierarchy

Every item is broken down into five layers:

| Layer | Description | Example |
|-------|-------------|---------|
| **Product** | The complete item you searched for | iPhone 15 |
| **Component** | Major parts or ingredients | Battery, Screen, Processor |
| **Material** | Raw materials that make up components | Lithium Cobalt Oxide, Glass |
| **Chemical** | Chemical compounds in materials | LiCoO₂, SiO₂ |
| **Element** | Periodic table elements | Li, Co, O, Si |

---

## Getting Started

### Basic Search

1. Navigate to the home page
2. Enter your query in the **"SPECIMEN INPUT"** terminal
3. Click **"ANALYZE"** or press Enter
4. Wait 15-60 seconds while AI researches your query
5. Explore your results in the 3D viewer

### Interface Overview

The interface is designed as a **Clinical Lab Terminal** with these main areas:

```
┌─────────────────────────────────────────────────────────────┐
│  MENU BAR  │  File  Edit  View  Analysis  Help              │
├────────────┬────────────────────────────────────────────────┤
│            │                                                 │
│  HIERARCHY │              3D VIEWPORT                        │
│    TREE    │                                                 │
│            │         [Interactive 3D Model]                  │
│            │                                                 │
├────────────┴────────────────────────────────────────────────┤
│  CHAT / PROPERTIES PANEL                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Features Guide

### 3D Viewer Controls

| Action | Mouse | Touch |
|--------|-------|-------|
| Rotate view | Left-click + drag | One finger drag |
| Zoom | Scroll wheel | Pinch |
| Pan | Right-click + drag | Two finger drag |
| Select node | Click on sphere | Tap |

### View Modes

- **Exploded View** - Nodes spread out radially for easy inspection
- **Compact View** - Nested hierarchical layout
- **Slice View** - Cross-section visualization (coming soon)

### Depth Control

Use the depth slider (1-5) to control how deep into the composition you can see:

| Depth | Shows |
|-------|-------|
| 1 | Product only |
| 2 | Product + Components |
| 3 | + Materials |
| 4 | + Chemicals |
| 5 | + Elements (full depth) |

### Tree Navigation

The left panel shows a hierarchical tree view:
- Click **▶** to expand/collapse nodes
- Click a node name to select it in 3D view
- Double-click to focus camera on node
- Use "Expand All" / "Collapse All" buttons

### Chat Feature

Ask questions about any part of the composition:
1. Select a node in the 3D view or tree
2. Open the chat panel (bottom of screen)
3. Ask questions like:
   - "What is this used for?"
   - "Is this safe?"
   - "Where does this come from?"
   - "What are alternatives?"

---

## Keyboard Shortcuts

### Navigation
| Key | Action |
|-----|--------|
| `H` | Reset camera to home position |
| `F` | Focus camera on selected node |
| `Esc` | Deselect current node |

### Transform Modes
| Key | Action |
|-----|--------|
| `G` | Move mode (translate) |
| `R` | Rotate mode |
| `S` | Scale mode |

### View Controls
| Key | Action |
|-----|--------|
| `E` | Toggle exploded view |
| `?` | Show keyboard shortcuts help |

---

## Understanding Results

### Confidence Levels

Each piece of data has a confidence level:

| Level | Icon | Meaning |
|-------|------|---------|
| **Verified** | ✓ | From official sources, ingredient labels, scientific papers |
| **Estimated** | ~ | Calculated from known similar products |
| **Speculative** | ? | AI best-guess when data is limited |

### Node Colors

Different composition types have distinct colors:

| Type | Color | Description |
|------|-------|-------------|
| Product | Cyan | The item you searched for |
| Component | Blue | Major parts/ingredients |
| Material | Orange | Raw materials |
| Chemical | Green | Chemical compounds |
| Element | Yellow | Periodic table elements |

### Sources

Every composition includes sources showing where information came from:
- Official manufacturer specifications
- Scientific publications
- Industry databases
- Regulatory filings

---

## Sharing & Embedding

### Create a Share Link

1. Open any composition
2. Click **Share** in the menu bar
3. Configure options:
   - **Depth Level** - How much detail to show
   - **View Mode** - Exploded, compact, or slice
4. Copy the generated short link

### Share Link Format

```
https://composition.app/s/abc12345
```

Share links preserve:
- The specific composition
- Your chosen depth level
- Your preferred view mode

---

## FAQ

**Q: How long does analysis take?**
A: Initial analysis takes 15-60 seconds depending on complexity. Previously analyzed items load instantly from cache.

**Q: How accurate is the data?**
A: We use AI to research official sources, but always check the confidence level. "Verified" data comes from official sources; "Speculative" data should be independently verified.

**Q: Can I analyze anything?**
A: Yes! Products, foods, medications, chemicals, materials, biological entities, and more. If it has a composition, we can analyze it.

**Q: Is my search history saved?**
A: Compositions are cached to serve other users, but we don't track individual user searches. Chat conversations are stored locally in your browser.

**Q: Why are some elements missing?**
A: The depth level may be limiting visibility. Try increasing it to 5 for the full breakdown.

---

# For Developers

## Architecture Overview

Composition is a full-stack Next.js application with AI-powered research capabilities and real-time 3D visualization.

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js 16 + React 19 + React Three Fiber                  │
│  ├── Search Interface (Terminal UI)                         │
│  ├── 3D Composition Viewer (Three.js)                       │
│  ├── Tree Navigation (Virtualized)                          │
│  └── Chat System (Streaming SSE)                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     VERCEL SERVERLESS                        │
│  API Routes (Edge + Node.js runtimes)                       │
│  ├── /api/search      - AI research orchestration           │
│  ├── /api/composition - Fetch cached compositions           │
│  ├── /api/chat        - Streaming AI chat                   │
│  ├── /api/share       - Generate share links                │
│  ├── /api/recent      - Recent analyses                     │
│  ├── /api/stats       - System health                       │
│  └── /api/health      - Health check (Edge)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   AI RESEARCH PIPELINE                       │
│  Claude API (Anthropic SDK)                                 │
│  ├── Query validation & sanitization                        │
│  ├── Structured prompt engineering                          │
│  ├── JSON response parsing                                  │
│  └── Tree structure generation                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
│  ├── PostgreSQL (Prisma 7) - Persistent storage             │
│  ├── Redis (Upstash) - Hot cache, rate limiting             │
│  └── LocalStorage - Chat conversation persistence           │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.5 | React framework with App Router |
| React | 19 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Three.js | 0.181.2 | 3D graphics engine |
| React Three Fiber | 9.4.0 | React renderer for Three.js |
| React Three Drei | 10.7.7 | Useful helpers for R3F |
| Tailwind CSS | 4.x | Utility-first styling |
| Zustand | 5.0.2 | Client state management |
| TanStack Query | 5.62.0 | Server state management |
| Framer Motion | 12.23.24 | Animations |
| Radix UI | Various | Accessible UI primitives |
| Zod | 4.1.13 | Runtime type validation |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 16.x | Serverless functions |
| Prisma | 7.0.1 | Database ORM |
| PostgreSQL | - | Primary database |
| Upstash Redis | - | Caching & rate limiting |
| Anthropic SDK | 0.71.0 | Claude AI integration |

### DevOps

| Technology | Purpose |
|------------|---------|
| Vercel | Hosting & deployment |
| GitHub Actions | CI/CD |
| pnpm | Package management |
| Vitest | Testing framework |
| ESLint | Code linting |

---

## Project Structure

```
composition/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
├── prisma/
│   └── schema.prisma           # Database schema
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── chat/           # Streaming chat endpoint
│   │   │   ├── composition/    # Composition CRUD
│   │   │   ├── health/         # Health check (Edge)
│   │   │   ├── recent/         # Recent analyses
│   │   │   ├── search/         # AI research endpoint
│   │   │   ├── share/          # Share link generation
│   │   │   └── stats/          # System statistics
│   │   ├── composition/[id]/   # Composition viewer page
│   │   ├── s/[code]/           # Share link redirect
│   │   ├── globals.css         # Global styles & design tokens
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── chat/               # Chat UI components
│   │   ├── home/               # Home page components
│   │   ├── layout/             # Layout components
│   │   ├── search/             # Search components
│   │   ├── tree/               # Tree navigation
│   │   ├── ui/                 # Shared UI components
│   │   └── viewer/             # 3D viewer components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/
│   │   ├── agents/             # AI research agent
│   │   ├── cache/              # Redis caching utilities
│   │   ├── three/              # Three.js utilities
│   │   ├── validators/         # Zod validation schemas
│   │   ├── db.ts               # Database connection
│   │   ├── env.ts              # Environment validation
│   │   ├── rate-limit.ts       # Rate limiting
│   │   └── utils.ts            # General utilities
│   ├── stores/                 # Zustand stores
│   │   ├── chat-store.ts
│   │   ├── composition-store.ts
│   │   └── search-store.ts
│   ├── test/                   # Test setup & utilities
│   └── types/                  # TypeScript type definitions
├── .env.example                # Environment template
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies & scripts
├── prisma.config.ts            # Prisma configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── vercel.json                 # Vercel deployment config
└── vitest.config.ts            # Vitest configuration
```

---

## API Reference

### POST /api/search

Triggers AI research for a composition query.

**Request:**
```typescript
{
  query: string  // 2-200 characters, sanitized
}
```

**Response:**
```typescript
{
  composition: {
    id: string
    name: string
    category: string
    description: string
    confidence: "verified" | "estimated" | "speculative"
    root: CompositionNode
    sources: Source[]
    createdAt: string
    researchedAt: string
  }
  cached: boolean
  researchTime?: number  // milliseconds
}
```

**Rate Limit:** 5 requests/minute per IP

**Errors:**
| Status | Meaning |
|--------|---------|
| 400 | Invalid query (too short/long) |
| 429 | Rate limit exceeded |
| 500 | Research or database error |

---

### GET /api/composition/[id]

Fetches a specific composition by ID.

**Response:**
```typescript
{
  composition: Composition
  cached: boolean
}
```

**Caching:** 24-hour Redis TTL

---

### POST /api/chat

Streaming chat endpoint using Server-Sent Events.

**Request:**
```typescript
{
  compositionId: string
  message: string         // 1-2000 characters
  conversationId?: string
  selectedNodeId?: string
}
```

**Response:** SSE stream
```
data: {"text": "chunk of response"}
data: {"text": "more text"}
data: [DONE]
```

**Rate Limit:** 20 requests/minute per IP

---

### POST /api/share

Creates a shareable link for a composition.

**Request:**
```typescript
{
  compositionId: string
  depthLevel?: number    // 1-10, default: 4
  viewMode?: string      // "exploded" | "compact" | "slice"
}
```

**Response:**
```typescript
{
  shortCode: string      // 8 characters
  shareUrl: string       // Full URL
}
```

**Rate Limit:** 30 requests/minute per IP

---

### GET /api/recent

Returns the 10 most recent compositions.

**Response:**
```typescript
{
  compositions: Array<{
    id: string
    name: string
    category: string
    confidence: string
    nodeCount: number
    createdAt: string
  }>
}
```

---

### GET /api/stats

Returns system health statistics.

**Response:**
```typescript
{
  cacheItems: number
  totalCompositions: number
  redisConnected: boolean
  databaseConnected: boolean
  timestamp: string
}
```

---

### GET /api/health

Lightweight health check (Edge runtime).

**Response:**
```typescript
{ status: "ok" }
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│   Composition   │───────│     Share       │
├─────────────────┤  1:N  ├─────────────────┤
│ id              │       │ id              │
│ query           │       │ shortCode       │
│ queryNorm       │       │ compositionId   │
│ name            │       │ depthLevel      │
│ category        │       │ viewMode        │
│ description     │       │ viewCount       │
│ rootData (JSON) │       │ createdAt       │
│ sourcesData     │       └─────────────────┘
│ confidence      │
│ viewCount       │       ┌─────────────────┐
│ shareCount      │       │  Conversation   │
│ createdAt       │       ├─────────────────┤
│ updatedAt       │       │ id              │
│ researchedAt    │       │ compositionId   │
└─────────────────┘       │ sessionId       │
                          │ userId          │
                          │ createdAt       │
┌─────────────────┐       │ updatedAt       │
│    PopularQA    │       └────────┬────────┘
├─────────────────┤                │
│ id              │                │ 1:N
│ compositionId   │                │
│ question        │       ┌────────▼────────┐
│ answer          │       │    Message      │
│ askCount        │       ├─────────────────┤
│ helpfulCount    │       │ id              │
│ createdAt       │       │ conversationId  │
│ updatedAt       │       │ role            │
└─────────────────┘       │ content         │
                          │ nodeReferences  │
                          │ tokens          │
                          │ createdAt       │
                          └─────────────────┘
```

### Prisma Schema

```prisma
model Composition {
  id           String   @id @default(cuid())
  query        String   @db.Text
  queryNorm    String   @map("query_norm")
  name         String
  category     String
  description  String?  @db.Text
  rootData     Json     @map("root_data")
  sourcesData  Json     @map("sources_data")
  confidence   String
  viewCount    Int      @default(0) @map("view_count")
  shareCount   Int      @default(0) @map("share_count")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  researchedAt DateTime @map("researched_at")
  shares       Share[]

  @@index([queryNorm])
  @@index([category])
  @@map("compositions")
}

model Share {
  id            String      @id @default(cuid())
  shortCode     String      @unique @map("short_code")
  compositionId String      @map("composition_id")
  composition   Composition @relation(...)
  depthLevel    Int         @default(4) @map("depth_level")
  viewMode      String      @default("exploded") @map("view_mode")
  viewCount     Int         @default(0) @map("view_count")
  createdAt     DateTime    @default(now()) @map("created_at")

  @@index([shortCode])
  @@map("shares")
}
```

---

## State Management

### Zustand Stores

#### Composition Store
Manages the current composition and viewer state.

```typescript
interface CompositionStore {
  // Data
  composition: Composition | null
  selectedNode: CompositionNode | null
  hoveredNode: CompositionNode | null

  // View settings
  viewMode: "exploded" | "compact" | "slice"
  depthLevel: number
  maxDepth: number
  isExploded: boolean

  // Tree state
  expandedNodes: Set<string>      // 3D explosion
  treeExpandedNodes: Set<string>  // Tree UI
  focusedNodeId: string | null

  // Actions
  setComposition(composition: Composition): void
  selectNode(node: CompositionNode | null): void
  setViewMode(mode: ViewMode): void
  setDepthLevel(level: number): void
  toggleNodeExpansion(nodeId: string): void
  // ... more actions
}
```

#### Search Store
Manages search state and progress.

```typescript
interface SearchStore {
  query: string
  isSearching: boolean
  progress: {
    stage: string
    percentage: number
  }
  error: string | null

  // Actions
  setQuery(query: string): void
  startSearch(): void
  updateProgress(stage: string, percentage: number): void
  setError(error: string): void
  reset(): void
}
```

#### Chat Store
Manages chat conversations with localStorage persistence.

```typescript
interface ChatStore {
  conversation: Conversation | null
  conversations: Record<string, Conversation>  // Persisted
  isOpen: boolean
  isLoading: boolean
  suggestions: SuggestedQuestion[]

  // Actions
  openChat(): void
  closeChat(): void
  initConversation(compositionId: string): void
  addMessage(message: Message): void
  appendToLastMessage(text: string): void
  generateSuggestions(node: CompositionNode): void
}
```

### Data Flow

```
User Interaction
       │
       ▼
┌──────────────┐     ┌──────────────┐
│ Zustand      │────▶│ React        │
│ Store Action │     │ Components   │
└──────────────┘     └──────────────┘
       │                    │
       ▼                    ▼
┌──────────────┐     ┌──────────────┐
│ React Query  │────▶│ API Routes   │
│ (Server)     │     │              │
└──────────────┘     └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Database /   │
                    │ Cache        │
                    └──────────────┘
```

---

## 3D Visualization System

### Architecture

```
CompositionCanvas (Error Boundary + Canvas)
    │
    ├── CompositionScene (Lighting + Environment)
    │       │
    │       ├── ambientLight
    │       ├── directionalLight (x2)
    │       ├── pointLight
    │       └── hemisphereLight
    │
    ├── CompositionTree (Recursive Node Rendering)
    │       │
    │       └── MolecularNode / ProceduralNode / HybridNode
    │               │
    │               ├── SphereGeometry (memoized)
    │               ├── meshStandardMaterial
    │               └── Click/Hover handlers
    │
    ├── StarsBackground (Animated particle system)
    │
    └── CameraControls (Custom implementation)
```

### Node Positioning

**Exploded View Algorithm:**
```typescript
const angle = (index / siblings.length) * Math.PI * 2
const radius = 1.5 + depth * 0.5
const x = Math.cos(angle) * radius
const z = Math.sin(angle) * radius
const y = -depth * 0.3
```

**Node Size Calculation:**
```typescript
const size = baseSize * Math.pow(0.6, depth) * Math.sqrt(percentage / 100)
```

### Color System

**Type Colors:**
```typescript
const typeColors = {
  product: "#4ecdc4",
  component: "#45b7d1",
  material: "#96ceb4",
  chemical: "#ffeaa7",
  element: "#dfe6e9"
}
```

**Element Colors (CPK Standard):**
```typescript
const elementColors = {
  H: "#ffffff",
  C: "#909090",
  N: "#3050f8",
  O: "#ff0d0d",
  // ... periodic table
}
```

### Performance Optimizations

1. **Memoized Geometry** - SphereGeometry created once per component
2. **Instanced Rendering** - For nodes with many similar children
3. **Depth Culling** - Only render nodes within depthLevel
4. **Lazy Scene Loading** - Dynamic import of 3D components
5. **Geometry Disposal** - Cleanup on unmount

---

## AI Research Pipeline

### Flow Diagram

```
Query Input
    │
    ▼
┌───────────────────┐
│ Validation        │ Zod schema, 2-200 chars
│ & Sanitization    │ Remove <>{} characters
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Cache Check       │ Redis → Database
│                   │ Return if found
└─────────┬─────────┘
          │ Miss
          ▼
┌───────────────────┐
│ AI Research       │ Claude API call
│ (15-60 seconds)   │ Structured prompt
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Response Parse    │ Extract JSON
│ & Validation      │ Max 500KB
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ ID Generation     │ nanoid for all nodes
│ & Tree Building   │ Add timestamps
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Persist           │ Database + Redis
│                   │ 1h / 24h TTL
└─────────┬─────────┘
          │
          ▼
      Response
```

### Claude Prompt Structure

```typescript
const systemPrompt = `You are an expert research agent...

OUTPUT FORMAT (JSON):
{
  "name": "Product Name",
  "category": "electronics|food|medicine|...",
  "description": "Brief description",
  "confidence": "verified|estimated|speculative",
  "sources": [...],
  "root": {
    "name": "...",
    "type": "product",
    "percentage": 100,
    "children": [...]
  }
}

HIERARCHY RULES:
1. Product (top level)
2. Component (major parts)
3. Material (raw materials)
4. Chemical (compounds)
5. Element (periodic table)
...
`
```

### Progress Stages

| Stage | Percentage | Description |
|-------|------------|-------------|
| Identifying | 10% | Query validation |
| Researching | 30% | API call in progress |
| Analyzing | 60% | Parsing response |
| Synthesizing | 80% | Building tree |
| Complete | 100% | Ready to display |

---

## Security Implementation

### Input Validation

All inputs validated with Zod schemas:

```typescript
// Search query
const searchSchema = z.object({
  query: z.string()
    .min(2, "Query too short")
    .max(200, "Query too long")
    .transform(sanitize)
})

// Share request
const shareSchema = z.object({
  compositionId: z.string().max(50),
  depthLevel: z.number().min(1).max(10).optional(),
  viewMode: z.enum(["exploded", "compact", "slice"]).optional()
})
```

### Sanitization

```typescript
function sanitize(input: string): string {
  return input.replace(/[<>{}]/g, "")
}
```

### Rate Limiting

```typescript
const rateLimits = {
  search: { requests: 5, window: "1m" },   // Expensive AI
  chat: { requests: 20, window: "1m" },
  share: { requests: 30, window: "1m" }
}
```

### Security Headers (next.config.ts)

```typescript
headers: [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "Content-Security-Policy", value: "..." }
]
```

---

## Environment Setup

### Required Variables

```env
# AI Services (Required)
ANTHROPIC_API_KEY=sk-ant-...

# Database (Required)
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Cache (Optional - either Vercel KV or Upstash)
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
# OR
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Application (Optional)
NEXT_PUBLIC_APP_URL=https://composition.app
```

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/nategarelik/composition.git
cd composition

# 2. Install dependencies
pnpm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Generate Prisma client
pnpm prisma generate

# 5. Push schema to database (if new database)
pnpm prisma db push

# 6. Start development server
pnpm dev
```

---

## Development Workflow

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Production build (Webpack)
pnpm start            # Start production server

# Quality
pnpm type-check       # TypeScript checking
pnpm lint             # ESLint
pnpm test             # Run tests
pnpm test:watch       # Watch mode
pnpm test:coverage    # With coverage report

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Prisma Studio
```

### Code Style

- **TypeScript Strict Mode** - No implicit any, unused variables
- **ESLint** - React hooks rules, Next.js recommended
- **Functional Components** - Hooks-based React
- **Server Components Default** - Client components only when needed

### Git Workflow

```bash
# Feature branch
git checkout -b feature/my-feature

# Make changes, then verify
pnpm type-check && pnpm lint && pnpm test

# Commit with conventional commits
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "chore: update dependencies"

# Push and create PR
git push -u origin feature/my-feature
```

---

## Deployment Guide

### Vercel Deployment

1. **Connect Repository**
   - Import from GitHub in Vercel dashboard

2. **Set Environment Variables**
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   DATABASE_URL=postgresql://...
   ```

3. **Configure Build**
   - Framework: Next.js (auto-detected)
   - Build command: `pnpm prisma generate && pnpm build`
   - Install command: `pnpm install`

4. **Deploy**
   - Automatic on push to main
   - Preview deployments for PRs

### Vercel Configuration (vercel.json)

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm prisma generate && pnpm build",
  "installCommand": "pnpm install",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/search/route.ts": { "maxDuration": 300 },
    "src/app/api/**/*": { "maxDuration": 60 }
  }
}
```

### Database Setup (Neon/Vercel Postgres)

1. Create a Neon project or Vercel Postgres
2. Copy connection string to `DATABASE_URL`
3. Run `pnpm prisma db push` to create tables

---

## Testing

### Test Structure

```
src/
├── test/
│   └── setup.ts          # Global test setup
├── lib/
│   ├── utils.test.ts
│   └── validators/
│       └── composition.test.ts
├── stores/
│   ├── chat-store.test.ts
│   ├── composition-store.test.ts
│   └── search-store.test.ts
└── app/
    └── api/
        └── search/
            └── route.test.ts
```

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test:coverage
```

### Test Configuration (vitest.config.ts)

```typescript
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"]
    }
  }
})
```

---

## Contributing

### Getting Started

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run verification: `pnpm type-check && pnpm lint && pnpm test`
5. Submit a pull request

### Code Guidelines

- Follow existing patterns and conventions
- Add TypeScript types for all new code
- Write tests for new features
- Update documentation as needed

### Pull Request Checklist

- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no warnings
- [ ] All tests pass
- [ ] New features have tests
- [ ] Documentation updated if needed

---

## License

MIT License - see LICENSE file for details.

---

## Support

- **Issues:** [GitHub Issues](https://github.com/nategarelik/composition/issues)
- **Documentation:** This file + inline code comments
- **API Reference:** See [API Reference](#api-reference) section

---

*Last updated: December 2024*
