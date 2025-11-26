# Track 3: Frontend UI

> **Agent:** fullstack-dev | **Branch:** `track/frontend` | **Base:** `develop`

**Goal:** Build search interface, Zustand stores, pages, and providers.

**Requires:** Foundation track merged to develop.

---

## Setup

```bash
git checkout develop
git pull origin develop
git checkout -b track/frontend develop

gh issue create --title "Track: Frontend UI" --label "track,frontend" --body "Search interface, stores, and pages"
```

---

## Task 1: Zustand Stores

Create `src/stores/search-store.ts`:

```typescript
import { create } from 'zustand'

interface SearchState {
  query: string
  isSearching: boolean
  progress: { stage: string; percentage: number; message: string }
  error: string | null
  setQuery: (q: string) => void
  startSearch: () => void
  updateProgress: (stage: string, pct: number, msg?: string) => void
  setError: (e: string) => void
  reset: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  isSearching: false,
  progress: { stage: 'idle', percentage: 0, message: '' },
  error: null,
  setQuery: (query) => set({ query }),
  startSearch: () => set({ isSearching: true, error: null, progress: { stage: 'identifying', percentage: 10, message: 'Starting...' }}),
  updateProgress: (stage, percentage, message = '') => set({ progress: { stage, percentage, message }, isSearching: stage !== 'complete' }),
  setError: (error) => set({ error, isSearching: false }),
  reset: () => set({ query: '', isSearching: false, progress: { stage: 'idle', percentage: 0, message: '' }, error: null }),
}))
```

Create `src/stores/composition-store.ts`:

```typescript
import { create } from 'zustand'
import type { Composition, ViewMode, CompositionNode } from '@/types'

interface CompositionState {
  composition: Composition | null
  selectedNode: CompositionNode | null
  viewMode: ViewMode
  depthLevel: number
  maxDepth: number
  isExploded: boolean
  setComposition: (c: Composition) => void
  selectNode: (n: CompositionNode | null) => void
  setViewMode: (m: ViewMode) => void
  setDepthLevel: (l: number) => void
  toggleExploded: () => void
  reset: () => void
}

export const useCompositionStore = create<CompositionState>((set) => ({
  composition: null,
  selectedNode: null,
  viewMode: 'exploded',
  depthLevel: 4,
  maxDepth: 5,
  isExploded: false,
  setComposition: (composition) => set({ composition, selectedNode: null, isExploded: false }),
  selectNode: (node) => set({ selectedNode: node }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setDepthLevel: (level) => set((s) => ({ depthLevel: Math.max(1, Math.min(level, s.maxDepth)) })),
  toggleExploded: () => set((s) => ({ isExploded: !s.isExploded })),
  reset: () => set({ composition: null, selectedNode: null, viewMode: 'exploded', depthLevel: 4, isExploded: false }),
}))
```

```bash
mkdir -p src/stores
# Write store files and index.ts
git add src/stores/
git commit -m "feat(stores): add Zustand stores for search and composition"
```

---

## Task 2: Search Components

Create `src/components/search/search-bar.tsx`:

```typescript
'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchStore } from '@/stores'

export function SearchBar() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const { isSearching, startSearch, setQuery } = useSearchStore()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSearching) return
    setQuery(input.trim())
    startSearch()
    router.push(`/composition/search?q=${encodeURIComponent(input.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you want to deconstruct?"
          className="w-full px-6 py-4 text-lg bg-gray-900 border border-gray-700 rounded-full text-white"
          disabled={isSearching}
        />
        <button type="submit" disabled={!input.trim() || isSearching}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-full">
          {isSearching ? 'Researching...' : 'Deconstruct'}
        </button>
      </div>
    </form>
  )
}
```

Create `src/components/search/search-progress.tsx` with progress bar.

```bash
mkdir -p src/components/search src/components/ui
# Write components and index.ts
git add src/components/search/
git commit -m "feat(ui): add search bar and progress components"
```

---

## Task 3: Home Page

Update `src/app/globals.css` with dark theme.

Update `src/app/layout.tsx` with metadata.

Update `src/app/page.tsx`:

```typescript
import { SearchBar, SearchProgress } from '@/components/search'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="p-6">
        <h1 className="text-2xl font-bold text-white">Composition</h1>
      </header>
      <section className="flex-1 flex flex-col items-center justify-center px-4">
        <h2 className="text-5xl font-bold text-white mb-4">
          Deconstruct <span className="text-blue-500">Anything</span>
        </h2>
        <SearchBar />
        <SearchProgress />
      </section>
    </main>
  )
}
```

```bash
git add src/app/
git commit -m "feat(pages): add home page with search interface"
```

---

## Task 4: React Query Provider

Create `src/components/providers/query-provider.tsx`:

```typescript
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, ReactNode } from 'react'

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient())
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
```

Update `src/app/layout.tsx` to wrap with QueryProvider.

```bash
mkdir -p src/components/providers
# Write provider and update layout
git add src/components/providers/ src/app/layout.tsx
git commit -m "feat(providers): add React Query provider"
```

---

## Task 5: Error Pages

Create `src/app/error.tsx` and `src/app/not-found.tsx`.

```bash
# Write error pages
git add src/app/error.tsx src/app/not-found.tsx
git commit -m "feat(pages): add error and 404 pages"
```

---

## Task 6: Search Results Page

Create `src/app/composition/search/page.tsx`:

```typescript
'use client'
import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSearchStore, useCompositionStore } from '@/stores'

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q')
  const { updateProgress, setError } = useSearchStore()
  const { setComposition } = useCompositionStore()

  useEffect(() => {
    if (!query) { router.push('/'); return }

    async function search() {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      if (data.success) {
        setComposition(data.data.composition)
        router.push(`/composition/${data.data.composition.id}`)
      } else {
        setError(data.error.message)
      }
    }
    search()
  }, [query])

  return <div>Researching: {query}</div>
}

export default function SearchPage() {
  return <Suspense fallback={null}><SearchResults /></Suspense>
}
```

```bash
mkdir -p "src/app/composition/search"
# Write page
git add src/app/composition/
git commit -m "feat(pages): add search results page"
```

---

## Finalize

```bash
pnpm tsc --noEmit
pnpm lint
git push -u origin track/frontend

gh pr create \
  --base develop \
  --title "feat: Frontend - Search UI and pages" \
  --body "$(cat <<'EOF'
## Summary
- Zustand stores for search and composition state
- Search bar with progress indicator
- Home page with hero section
- React Query provider
- Error and 404 pages
- Search results page

## Pages
| Route | Description |
|-------|-------------|
| / | Home with search |
| /composition/search | Research progress |

## Checklist
- [x] TypeScript compiles
- [x] ESLint passes
- [ ] UI tested

🤖 Generated with Claude Code
EOF
)"
```

---

## Handoff

PR ready for review. Requires visualization track for composition page.
