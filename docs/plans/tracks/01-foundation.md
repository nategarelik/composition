# Track 1: Foundation

> **Agent:** fullstack-dev | **Branch:** `track/foundation` | **Base:** `develop`

**Goal:** Initialize Next.js project with all dependencies, TypeScript config, Prisma schema, and core utilities.

---

## Setup

```bash
# Create develop branch if needed
git checkout -b develop main 2>/dev/null || git checkout develop

# Create feature branch
git checkout -b track/foundation develop

# Create tracking issue
gh issue create --title "Track: Foundation Setup" --label "track,foundation" --body "Initialize project with core dependencies and utilities"
```

---

## Task 1: Initialize Next.js

```bash
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --yes
```

Create `.env.example`:
```env
ANTHROPIC_API_KEY=
PERPLEXITY_API_KEY=
DATABASE_URL=postgresql://user:pass@localhost:5432/composition
REDIS_URL=redis://localhost:6379
PINECONE_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
git add -A
git commit -m "feat(init): initialize Next.js 14 with TypeScript and Tailwind"
```

---

## Task 2: Install Dependencies

```bash
# 3D
pnpm add three @react-three/fiber @react-three/drei @react-spring/three
pnpm add -D @types/three

# State
pnpm add zustand @tanstack/react-query

# Database
pnpm add @prisma/client @upstash/redis
pnpm add -D prisma

# AI
pnpm add @anthropic-ai/sdk ai

# Utils
pnpm add zod nanoid date-fns

git add package.json pnpm-lock.yaml
git commit -m "feat(deps): install core dependencies"
```

---

## Task 3: TypeScript Strict Mode

Update `tsconfig.json` compilerOptions:
```json
{
  "strict": true,
  "strictNullChecks": true,
  "noImplicitAny": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noUncheckedIndexedAccess": true
}
```

```bash
pnpm tsc --noEmit
git add tsconfig.json
git commit -m "feat(ts): enable strict TypeScript mode"
```

---

## Task 4: Prisma Schema

```bash
pnpm prisma init
```

Write `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Composition {
  id            String   @id @default(cuid())
  query         String   @db.Text
  queryNorm     String   @map("query_norm")
  name          String
  category      String
  description   String?  @db.Text
  rootData      Json     @map("root_data")
  sourcesData   Json     @map("sources_data")
  confidence    String
  viewCount     Int      @default(0) @map("view_count")
  shareCount    Int      @default(0) @map("share_count")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  researchedAt  DateTime @map("researched_at")
  shares        Share[]
  @@index([queryNorm])
  @@index([category])
  @@map("compositions")
}

model Share {
  id            String      @id @default(cuid())
  shortCode     String      @unique @map("short_code")
  compositionId String      @map("composition_id")
  composition   Composition @relation(fields: [compositionId], references: [id], onDelete: Cascade)
  depthLevel    Int         @default(4) @map("depth_level")
  viewMode      String      @default("exploded") @map("view_mode")
  viewCount     Int         @default(0) @map("view_count")
  createdAt     DateTime    @default(now()) @map("created_at")
  @@index([shortCode])
  @@map("shares")
}
```

```bash
pnpm prisma generate
git add prisma/
git commit -m "feat(db): add Prisma schema for compositions"
```

---

## Task 5: TypeScript Types

Create `src/types/composition.ts` and `src/types/index.ts`.

Key types: `CompositionNode`, `Composition`, `Source`, `ViewMode`, `ApiResponse`, `ApiError`.

```bash
mkdir -p src/types
# Write types files
pnpm tsc --noEmit
git add src/types/
git commit -m "feat(types): add composition data model types"
```

---

## Task 6: Core Utilities

Create:
- `src/lib/env.ts` - Zod environment validation
- `src/lib/db.ts` - Prisma client singleton
- `src/lib/redis.ts` - Redis client with cache utilities

```bash
mkdir -p src/lib
# Write utility files
pnpm tsc --noEmit
git add src/lib/
git commit -m "feat(lib): add database and cache utilities"
```

---

## Finalize

```bash
# Verify everything compiles
pnpm tsc --noEmit
pnpm lint

# Push branch
git push -u origin track/foundation

# Create PR
gh pr create \
  --base develop \
  --title "feat: Foundation - Project initialization" \
  --body "$(cat <<'EOF'
## Summary
- Next.js 14 with TypeScript strict mode
- All core dependencies installed
- Prisma schema for compositions
- TypeScript types for data model
- Database and Redis utilities

## Checklist
- [x] TypeScript compiles
- [x] ESLint passes
- [ ] Ready for parallel tracks

Closes #1

🤖 Generated with Claude Code
EOF
)"
```

---

## Handoff

After PR merged to develop, parallel tracks can begin:
- Track 2: Backend (API routes)
- Track 3: Frontend (UI components)
- Track 4: Visualization (3D viewer)
