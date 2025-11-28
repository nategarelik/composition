'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Cylinder, Sphere, Capsule } from '@react-three/drei'
import * as THREE from 'three'
import type { CompositionNode, CompositionType } from '@/types'
import { getNodeColor, typeMaterials } from '@/lib/three/composition-utils'

// Shape mapping based on composition type
export type ShapeType = 'rounded-box' | 'cylinder' | 'capsule' | 'sphere'

export const TYPE_SHAPES: Record<CompositionType, ShapeType> = {
  product: 'rounded-box',
  component: 'cylinder',
  material: 'capsule',
  chemical: 'sphere',
  element: 'sphere',
}

interface ProceduralNodeProps {
  node: CompositionNode
  size: number
  isHovered: boolean
  isSelected: boolean
}

export function ProceduralNode({ node, size, isHovered, isSelected }: ProceduralNodeProps) {
  const meshRef = useRef<THREE.Mesh | THREE.Group>(null)

  const shape = TYPE_SHAPES[node.type]
  const color = getNodeColor(node)
  const material = typeMaterials[node.type]

  // Rotation animation on hover
  useFrame(() => {
    if (meshRef.current && isHovered) {
      meshRef.current.rotation.y += 0.01
    }
  })

  const materialProps = {
    color,
    metalness: material.metalness,
    roughness: material.roughness,
    emissive: isHovered || isSelected ? color : '#000000',
    emissiveIntensity: isHovered ? 0.4 : isSelected ? 0.2 : 0,
  }

  switch (shape) {
    case 'rounded-box':
      return (
        <RoundedBox
          ref={meshRef as React.RefObject<THREE.Mesh>}
          args={[size * 1.6, size * 1.6, size * 1.6]}
          radius={size * 0.15}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>
      )

    case 'cylinder':
      return (
        <Cylinder
          ref={meshRef as React.RefObject<THREE.Mesh>}
          args={[size * 0.7, size * 0.85, size * 1.8, 24]}
        >
          <meshStandardMaterial {...materialProps} />
        </Cylinder>
      )

    case 'capsule':
      return (
        <Capsule
          ref={meshRef as React.RefObject<THREE.Mesh>}
          args={[size * 0.5, size * 0.8, 8, 16]}
        >
          <meshStandardMaterial {...materialProps} />
        </Capsule>
      )

    case 'sphere':
    default:
      return (
        <Sphere
          ref={meshRef as React.RefObject<THREE.Mesh>}
          args={[size, 32, 32]}
        >
          <meshStandardMaterial {...materialProps} />
        </Sphere>
      )
  }
}
