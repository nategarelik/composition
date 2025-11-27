'use client'

import { useMemo } from 'react'
import type { CompositionNode } from '@/types'
import { CompositionNodeMesh } from './composition-node'
import { filterByDepth } from '@/lib/three/composition-utils'

interface CompositionTreeProps {
  node: CompositionNode
  maxDepth: number
  isExploded: boolean
}

export function CompositionTree({ node, maxDepth, isExploded }: CompositionTreeProps) {
  const filteredNode = useMemo(
    () => filterByDepth(node, maxDepth),
    [node, maxDepth]
  )

  return (
    <group>
      <CompositionNodeMesh
        node={filteredNode}
        depth={0}
        index={0}
        siblingCount={1}
        isExploded={isExploded}
      />
    </group>
  )
}
