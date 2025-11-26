# Track 2: Backend API

> **Agent:** fullstack-dev | **Branch:** `track/backend` | **Base:** `develop`

**Goal:** Build AI research pipeline and API routes for search, composition retrieval, and sharing.

**Requires:** Foundation track merged to develop.

---

## Setup

```bash
git checkout develop
git pull origin develop
git checkout -b track/backend develop

gh issue create --title "Track: Backend API" --label "track,backend" --body "AI research pipeline and API routes"
```

---

## Task 1: Research Agent

Create `src/lib/agents/research-agent.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { nanoid } from 'nanoid'
import type { CompositionNode, Source, ConfidenceLevel } from '@/types'

const anthropic = new Anthropic()

const SYSTEM_PROMPT = `You are an expert research agent specializing in discovering what things are made of. Return valid JSON matching the composition schema with hierarchical breakdown: product → components → materials → chemicals → elements.`

export async function researchComposition(
  query: string,
  onProgress?: (stage: string, pct: number, msg: string) => void
): Promise<ResearchResult> {
  onProgress?.('identifying', 10, `Identifying "${query}"...`)

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: `Research composition of: ${query}` }],
  })

  onProgress?.('synthesizing', 80, 'Processing results...')

  // Parse and validate JSON response
  const result = parseResponse(message)
  result.root = addNodeIds(result.root)

  onProgress?.('complete', 100, 'Done!')
  return result
}
```

```bash
mkdir -p src/lib/agents
# Write research-agent.ts
git add src/lib/agents/
git commit -m "feat(agents): add Claude research agent"
```

---

## Task 2: Search API Route

Create `src/app/api/search/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { researchComposition } from '@/lib/agents'
import { db } from '@/lib/db'
import { getCached, setCache, cacheKeys } from '@/lib/redis'

export async function POST(request: NextRequest) {
  const { query } = await request.json()

  // Validate
  if (!query || query.trim().length < 2) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_QUERY', message: 'Too short' }}, { status: 400 })
  }

  const normalized = query.trim().toLowerCase().replace(/\s+/g, '-')

  // Check cache
  const cached = await getCached(cacheKeys.compositionByQuery(query))
  if (cached) return NextResponse.json({ success: true, data: { composition: cached, cached: true }})

  // Check DB
  const existing = await db.composition.findFirst({ where: { queryNorm: normalized }})
  if (existing) {
    await setCache(cacheKeys.compositionByQuery(query), existing, 3600)
    return NextResponse.json({ success: true, data: { composition: existing, cached: true }})
  }

  // Research
  const startTime = Date.now()
  const result = await researchComposition(query)

  // Save
  const composition = await db.composition.create({
    data: { id: nanoid(), query, queryNorm: normalized, ...result, researchedAt: new Date() }
  })

  await setCache(cacheKeys.compositionByQuery(query), composition, 3600)

  return NextResponse.json({ success: true, data: { composition, cached: false, researchTime: Date.now() - startTime }})
}
```

```bash
mkdir -p src/app/api/search
# Write route.ts
git add src/app/api/search/
git commit -m "feat(api): add search endpoint with caching"
```

---

## Task 3: Composition API Route

Create `src/app/api/composition/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCached, setCache, cacheKeys } from '@/lib/redis'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Check cache
  const cached = await getCached(cacheKeys.compositionById(id))
  if (cached) return NextResponse.json({ success: true, data: cached })

  // Fetch from DB
  const record = await db.composition.findUnique({ where: { id }})
  if (!record) {
    return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' }}, { status: 404 })
  }

  await setCache(cacheKeys.compositionById(id), record, 86400)
  await db.composition.update({ where: { id }, data: { viewCount: { increment: 1 }}})

  return NextResponse.json({ success: true, data: record })
}
```

```bash
mkdir -p "src/app/api/composition/[id]"
# Write route.ts
git add src/app/api/composition/
git commit -m "feat(api): add composition fetch endpoint"
```

---

## Task 4: Share API Route

Create `src/app/api/share/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const { compositionId, depthLevel = 4, viewMode = 'exploded' } = await request.json()

  const composition = await db.composition.findUnique({ where: { id: compositionId }})
  if (!composition) {
    return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' }}, { status: 404 })
  }

  const shortCode = nanoid(8)
  const share = await db.share.create({
    data: { shortCode, compositionId, depthLevel, viewMode }
  })

  await db.composition.update({ where: { id: compositionId }, data: { shareCount: { increment: 1 }}})

  return NextResponse.json({
    success: true,
    data: { share, url: `${process.env.NEXT_PUBLIC_APP_URL}/s/${shortCode}` }
  })
}
```

```bash
mkdir -p src/app/api/share
# Write route.ts
git add src/app/api/share/
git commit -m "feat(api): add share link creation endpoint"
```

---

## Finalize

```bash
pnpm tsc --noEmit
pnpm lint
git push -u origin track/backend

gh pr create \
  --base develop \
  --title "feat: Backend - AI research pipeline and API routes" \
  --body "$(cat <<'EOF'
## Summary
- Claude-powered research agent with structured output
- POST /api/search - Research with Redis/DB caching
- GET /api/composition/[id] - Fetch saved compositions
- POST /api/share - Create shareable links

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/search | Research composition |
| GET | /api/composition/[id] | Get by ID |
| POST | /api/share | Create share link |

## Checklist
- [x] TypeScript compiles
- [x] ESLint passes
- [ ] Integration tested

🤖 Generated with Claude Code
EOF
)"
```

---

## Handoff

PR ready for code-reviewer agent to review.
Can be merged after frontend track if no conflicts.
