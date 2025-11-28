'use client'

import { useMemo } from 'react'
import type { CompositionNode } from '@/types'
import { HybridNode } from './hybrid-node'
import { filterByDepth } from '@/lib/three/composition-utils'

interface CompositionTreeProps {
  node: CompositionNode
  maxDepth: number
  isExploded: boolean
}

export function CompositionTree({ node, maxDepth }: CompositionTreeProps) {
  const filteredNode = useMemo(
    () => filterByDepth(node, maxDepth),
    [node, maxDepth]
  )

  return (
    <group>
      <HybridNode
        node={filteredNode}
        depth={0}
        index={0}
        siblingCount={1}
      />
    </group>
  )
}
