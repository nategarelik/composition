'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { CompositionNode as NodeType } from '@/types'
import { useCompositionStore } from '@/stores'
import {
  calculateNodeSize,
  calculateExplodedPosition,
  getNodeColor,
  typeMaterials,
} from '@/lib/three/composition-utils'

interface CompositionNodeMeshProps {
  node: NodeType
  depth: number
  index: number
  siblingCount: number
  isExploded: boolean
  parentPosition?: [number, number, number]
}

export function CompositionNodeMesh({
  node,
  depth,
  index,
  siblingCount,
  isExploded,
  parentPosition = [0, 0, 0],
}: CompositionNodeMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const selectNode = useCompositionStore((s) => s.selectNode)
  const setHoveredNode = useCompositionStore((s) => s.setHoveredNode)
  const setFocusedNode = useCompositionStore((s) => s.setFocusedNode)
  const toggleNodeExpansion = useCompositionStore((s) => s.toggleNodeExpansion)
  const expandToNode = useCompositionStore((s) => s.expandToNode)
  const selectedNode = useCompositionStore((s) => s.selectedNode)
  const isSelected = selectedNode?.id === node.id
  const hasChildren = node.children && node.children.length > 0

  const offset = useMemo(
    () => calculateExplodedPosition(index, siblingCount, depth, isExploded),
    [index, siblingCount, depth, isExploded]
  )

  const targetPosition: [number, number, number] = useMemo(() => [
    parentPosition[0] + offset[0],
    parentPosition[1] + offset[1],
    parentPosition[2] + offset[2],
  ], [parentPosition, offset])

  const size = calculateNodeSize(node.percentage, depth)
  const color = getNodeColor(node)
  const material = typeMaterials[node.type]
  const targetScale = hovered ? 1.15 : isSelected ? 1.1 : 1

  // Memoize geometry to prevent memory leaks
  const geometry = useMemo(() => new THREE.SphereGeometry(size, 32, 32), [size])

  // Cleanup geometry on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      geometry.dispose()
    }
  }, [geometry])

  // Cleanup cursor on unmount
  useEffect(() => {
    return () => {
      if (hovered) {
        document.body.style.cursor = 'auto'
      }
    }
  }, [hovered])

  useFrame(() => {
    // Smooth position animation
    if (groupRef.current) {
      groupRef.current.position.x += (targetPosition[0] - groupRef.current.position.x) * 0.1
      groupRef.current.position.y += (targetPosition[1] - groupRef.current.position.y) * 0.1
      groupRef.current.position.z += (targetPosition[2] - groupRef.current.position.z) * 0.1
    }

    // Smooth scale animation and rotation on hover
    if (meshRef.current) {
      const currentScale = meshRef.current.scale.x
      const newScale = currentScale + (targetScale - currentScale) * 0.1
      meshRef.current.scale.setScalar(newScale)

      if (hovered) {
        meshRef.current.rotation.y += 0.01
      }
    }
  })

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    setHoveredNode(node)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHovered(false)
    setHoveredNode(null)
    document.body.style.cursor = 'auto'
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    selectNode(node)
    // Also expand tree to this node for sync
    expandToNode(node.id)
  }

  const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    // Double-click: Focus camera on this node and toggle expansion
    setFocusedNode(node.id)
    if (hasChildren) {
      toggleNodeExpansion(node.id)
    }
  }

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        userData={{ nodeId: node.id }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <meshStandardMaterial
          color={color}
          metalness={material.metalness}
          roughness={material.roughness}
          emissive={hovered || isSelected ? color : '#000000'}
          emissiveIntensity={hovered ? 0.4 : isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Render children */}
      {node.children?.map((child, i) => (
        <CompositionNodeMesh
          key={child.id}
          node={child}
          depth={depth + 1}
          index={i}
          siblingCount={node.children?.length ?? 0}
          isExploded={isExploded}
          parentPosition={offset}
        />
      ))}
    </group>
  )
}
