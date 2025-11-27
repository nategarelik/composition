'use client'

import { Suspense } from 'react'
import { useCompositionStore } from '@/stores'
import { CompositionTree } from './composition-tree'
import { CameraControls } from './camera-controls'
import { StarsBackground } from './stars-background'

interface CompositionSceneProps {
  debug?: boolean
}

export function CompositionScene({ debug = false }: CompositionSceneProps) {
  const composition = useCompositionStore((s) => s.composition)
  const depthLevel = useCompositionStore((s) => s.depthLevel)
  const isExploded = useCompositionStore((s) => s.isExploded)

  return (
    <>
      {/* Camera Controls (custom implementation) */}
      <CameraControls />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />

      {/* Simple environment lighting */}
      <hemisphereLight
        color="#ffffff"
        groundColor="#444444"
        intensity={0.6}
      />

      {/* Stars Background (custom implementation) */}
      <StarsBackground radius={100} depth={50} count={1000} factor={4} fade speed={1} />

      {/* Background */}
      <color attach="background" args={['#0a0a0a']} />

      {/* Composition visualization */}
      <Suspense fallback={null}>
        {composition && (
          <CompositionTree
            node={composition.root}
            maxDepth={depthLevel}
            isExploded={isExploded}
          />
        )}
      </Suspense>

      {/* Debug helpers */}
      {debug && (
        <>
          <axesHelper args={[5]} />
          <gridHelper args={[10, 10]} />
        </>
      )}
    </>
  )
}
