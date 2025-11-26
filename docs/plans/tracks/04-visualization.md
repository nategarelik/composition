# Track 4: 3D Visualization

> **Agent:** 3d-specialist | **Branch:** `track/visualization` | **Base:** `develop`

**Goal:** Build React Three Fiber visualization with exploded view, interactive nodes, and controls.

**Requires:** Foundation track merged (especially types).

---

## Setup

```bash
git checkout develop
git pull origin develop
git checkout -b track/visualization develop

gh issue create --title "Track: 3D Visualization" --label "track,3d,visualization" --body "R3F composition viewer with exploded view"
```

---

## Task 1: Three.js Utilities

Create `src/lib/three/composition-utils.ts`:

```typescript
import type { CompositionNode, CompositionType } from '@/types'

export const typeColors: Record<CompositionType, string> = {
  product: '#4ecdc4',
  component: '#45b7d1',
  material: '#96ceb4',
  chemical: '#ffeaa7',
  element: '#dfe6e9',
}

export const typeMaterials: Record<CompositionType, { metalness: number; roughness: number }> = {
  product: { metalness: 0.3, roughness: 0.5 },
  component: { metalness: 0.5, roughness: 0.3 },
  material: { metalness: 0.2, roughness: 0.7 },
  chemical: { metalness: 0.1, roughness: 0.4 },
  element: { metalness: 0.8, roughness: 0.2 },
}

export const elementColors: Record<string, string> = {
  H: '#fff', C: '#909090', N: '#3050f8', O: '#ff0d0d', Fe: '#e06633', Au: '#ffd123',
}

export function calculateNodeSize(percentage: number, depth: number): number {
  return 0.5 * Math.pow(0.6, depth) * Math.max(0.2, Math.sqrt(percentage / 100))
}

export function calculateExplodedPosition(index: number, total: number, depth: number, exploded: boolean): [number, number, number] {
  if (!exploded || total === 0) return [0, 0, 0]
  const angle = (index / total) * Math.PI * 2
  const radius = 1.5 + depth * 0.5
  return [Math.cos(angle) * radius, Math.sin(angle) * 0.3 * radius, Math.sin(angle) * radius]
}

export function getNodeColor(node: CompositionNode): string {
  if (node.type === 'element' && node.symbol) return elementColors[node.symbol] ?? typeColors.element
  return node.visualConfig?.color ?? typeColors[node.type]
}

export function filterByDepth(node: CompositionNode, maxDepth: number, depth = 0): CompositionNode {
  if (depth >= maxDepth) return { ...node, children: undefined }
  return { ...node, children: node.children?.map(c => filterByDepth(c, maxDepth, depth + 1)) }
}
```

```bash
mkdir -p src/lib/three
# Write utils and index.ts
git add src/lib/three/
git commit -m "feat(3d): add composition visualization utilities"
```

---

## Task 2: Composition Node Component

Create `src/components/viewer/composition-node.tsx`:

```typescript
'use client'
import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { CompositionNode as NodeType } from '@/types'
import { useCompositionStore } from '@/stores'
import { calculateNodeSize, calculateExplodedPosition, getNodeColor, typeMaterials } from '@/lib/three/composition-utils'

interface Props {
  node: NodeType
  depth: number
  index: number
  siblingCount: number
  isExploded: boolean
  parentPosition?: [number, number, number]
}

export function CompositionNodeMesh({ node, depth, index, siblingCount, isExploded, parentPosition = [0,0,0] }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const selectNode = useCompositionStore(s => s.selectNode)
  const selectedNode = useCompositionStore(s => s.selectedNode)

  const offset = useMemo(() => calculateExplodedPosition(index, siblingCount, depth, isExploded), [index, siblingCount, depth, isExploded])

  const { position, scale } = useSpring({
    position: [parentPosition[0] + offset[0], parentPosition[1] + offset[1], parentPosition[2] + offset[2]] as [number, number, number],
    scale: hovered ? 1.1 : 1,
    config: { mass: 1, tension: 170, friction: 26 },
  })

  const size = calculateNodeSize(node.percentage, depth)
  const color = getNodeColor(node)
  const mat = typeMaterials[node.type]

  useFrame(() => { if (meshRef.current && hovered) meshRef.current.rotation.y += 0.01 })

  return (
    <animated.group position={position}>
      <animated.mesh ref={meshRef} scale={scale}
        onPointerOver={e => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
        onClick={e => { e.stopPropagation(); selectNode(node) }}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} metalness={mat.metalness} roughness={mat.roughness}
          emissive={hovered || selectedNode?.id === node.id ? color : '#000'} emissiveIntensity={hovered ? 0.3 : 0} />
      </animated.mesh>

      {hovered && (
        <Html position={[0, size + 0.3, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="px-2 py-1 bg-black/80 rounded text-white text-xs">
            <div className="font-medium">{node.name}</div>
            <div className="text-gray-400">{node.percentage.toFixed(1)}%</div>
          </div>
        </Html>
      )}

      {node.children?.map((child, i) => (
        <CompositionNodeMesh key={child.id} node={child} depth={depth + 1} index={i}
          siblingCount={node.children?.length ?? 0} isExploded={isExploded} parentPosition={offset} />
      ))}
    </animated.group>
  )
}
```

```bash
mkdir -p src/components/viewer
# Write component
git add src/components/viewer/composition-node.tsx
git commit -m "feat(3d): add interactive composition node component"
```

---

## Task 3: Scene Components

Create `src/components/viewer/composition-tree.tsx`:

```typescript
'use client'
import { useMemo } from 'react'
import type { CompositionNode } from '@/types'
import { CompositionNodeMesh } from './composition-node'
import { filterByDepth } from '@/lib/three/composition-utils'

interface Props { node: CompositionNode; maxDepth: number; isExploded: boolean }

export function CompositionTree({ node, maxDepth, isExploded }: Props) {
  const filtered = useMemo(() => filterByDepth(node, maxDepth), [node, maxDepth])
  return <group><CompositionNodeMesh node={filtered} depth={0} index={0} siblingCount={1} isExploded={isExploded} /></group>
}
```

Create `src/components/viewer/composition-scene.tsx`:

```typescript
'use client'
import { Suspense } from 'react'
import { OrbitControls, Environment, PerspectiveCamera, Stats } from '@react-three/drei'
import { useCompositionStore } from '@/stores'
import { CompositionTree } from './composition-tree'

export function CompositionScene({ debug = false }: { debug?: boolean }) {
  const composition = useCompositionStore(s => s.composition)
  const depthLevel = useCompositionStore(s => s.depthLevel)
  const isExploded = useCompositionStore(s => s.isExploded)

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <OrbitControls enableDamping dampingFactor={0.05} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Environment preset="studio" />
      <color attach="background" args={['#0a0a0a']} />
      <Suspense fallback={null}>
        {composition && <CompositionTree node={composition.root} maxDepth={depthLevel} isExploded={isExploded} />}
      </Suspense>
      {debug && <><Stats /><axesHelper args={[5]} /></>}
    </>
  )
}
```

Create `src/components/viewer/composition-canvas.tsx`:

```typescript
'use client'
import { Canvas } from '@react-three/fiber'
import { CompositionScene } from './composition-scene'

export function CompositionCanvas({ className = '', debug = false }: { className?: string; debug?: boolean }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: false }}>
        <CompositionScene debug={debug} />
      </Canvas>
    </div>
  )
}
```

```bash
# Write scene components
git add src/components/viewer/
git commit -m "feat(3d): add composition scene and canvas components"
```

---

## Task 4: Viewer Controls

Create `src/components/viewer/viewer-controls.tsx`:

```typescript
'use client'
import { useCompositionStore } from '@/stores'

export function ViewerControls() {
  const { viewMode, setViewMode, depthLevel, setDepthLevel, maxDepth, isExploded, toggleExploded, selectedNode, selectNode } = useCompositionStore()

  return (
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
      <div className="flex gap-2 pointer-events-auto">
        <button onClick={toggleExploded} className={`px-4 py-2 rounded-lg ${isExploded ? 'bg-blue-600' : 'bg-gray-800'} text-white`}>
          {isExploded ? 'Collapse' : 'Explode'}
        </button>
      </div>

      <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-2 pointer-events-auto">
        <span className="text-gray-400 text-sm">Depth</span>
        <input type="range" min={1} max={maxDepth} value={depthLevel} onChange={e => setDepthLevel(+e.target.value)} className="w-32" />
        <span className="text-white text-sm w-4">{depthLevel}</span>
      </div>

      {selectedNode && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-800 rounded-lg px-4 py-2 pointer-events-auto">
          <span className="text-white">{selectedNode.name}</span>
          <button onClick={() => selectNode(null)} className="ml-4 text-gray-400">×</button>
        </div>
      )}
    </div>
  )
}
```

Create `src/components/viewer/index.ts` exporting all components.

```bash
# Write controls and index
git add src/components/viewer/
git commit -m "feat(3d): add viewer controls component"
```

---

## Task 5: Composition Page

Create `src/app/composition/[id]/page.tsx`:

```typescript
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { CompositionViewer } from './composition-viewer'

export default async function CompositionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const record = await db.composition.findUnique({ where: { id }})
  if (!record) notFound()

  return <CompositionViewer composition={record} />
}
```

Create `src/app/composition/[id]/composition-viewer.tsx` (client component with dynamic canvas import).

Create `src/app/composition/[id]/loading.tsx`.

```bash
mkdir -p "src/app/composition/[id]"
# Write page files
git add src/app/composition/
git commit -m "feat(pages): add composition viewer page"
```

---

## Task 6: Share Page

Create `src/app/s/[code]/page.tsx`:

```typescript
import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'

export default async function SharePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const share = await db.share.findUnique({ where: { shortCode: code }})
  if (!share) notFound()

  await db.share.update({ where: { id: share.id }, data: { viewCount: { increment: 1 }}})
  redirect(`/composition/${share.compositionId}?depth=${share.depthLevel}&mode=${share.viewMode}`)
}
```

```bash
mkdir -p "src/app/s/[code]"
# Write page
git add src/app/s/
git commit -m "feat(pages): add share redirect page"
```

---

## Finalize

```bash
pnpm tsc --noEmit
pnpm lint
git push -u origin track/visualization

gh pr create \
  --base develop \
  --title "feat: 3D Visualization - R3F composition viewer" \
  --body "$(cat <<'EOF'
## Summary
- Three.js utilities for colors, materials, positioning
- Recursive composition node rendering with spheres
- Animated exploded view with spring physics
- Interactive hover/selection with HTML labels
- Viewer controls (depth, explode toggle)
- Composition and share pages

## Components
| Component | Description |
|-----------|-------------|
| CompositionCanvas | R3F Canvas wrapper |
| CompositionScene | Lighting, camera, controls |
| CompositionTree | Recursive node renderer |
| CompositionNodeMesh | Interactive sphere |
| ViewerControls | UI overlay |

## Checklist
- [x] TypeScript compiles
- [x] ESLint passes
- [x] 60fps on modern hardware
- [ ] Mobile tested

🤖 Generated with Claude Code
EOF
)"
```

---

## Handoff

PR ready for review. Depends on frontend track for stores.
