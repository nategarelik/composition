'use client'

import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { CompositionNode } from '@/types'
import { elementColors, typeColors, typeMaterials } from '@/lib/three/composition-utils'

interface InstancedMolecularNodeProps {
  node: CompositionNode
  size: number
  isHovered: boolean
  isSelected: boolean
}

interface AtomData {
  position: THREE.Vector3
  element: string
  radius: number
  color: THREE.Color
}

// Pre-created shared geometries for instancing
const ATOM_SEGMENTS = 16
const sharedSphereGeometry = new THREE.SphereGeometry(1, ATOM_SEGMENTS, ATOM_SEGMENTS)

// Generate pseudo-random atom positions for molecules
function generateAtomData(
  node: CompositionNode,
  baseSize: number
): AtomData[] {
  const atoms: AtomData[] = []

  // For elements, show a single atom
  if (node.type === 'element') {
    const element = node.symbol || 'C'
    const colorHex = elementColors[element] ?? typeColors.element
    atoms.push({
      position: new THREE.Vector3(0, 0, 0),
      element,
      radius: baseSize,
      color: new THREE.Color(colorHex),
    })
    return atoms
  }

  // For chemicals, create a small molecule structure
  const hash = node.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const atomCount = Math.min(3 + (hash % 5), 7)

  // Central atom
  const centralElement = node.symbol || 'C'
  const centralColor = elementColors[centralElement] ?? typeColors.chemical
  atoms.push({
    position: new THREE.Vector3(0, 0, 0),
    element: centralElement,
    radius: baseSize * 0.6,
    color: new THREE.Color(centralColor),
  })

  // Surrounding atoms
  const surroundingElements = ['O', 'N', 'H', 'S', 'Cl']
  for (let i = 1; i < atomCount; i++) {
    const theta = ((i - 1) / (atomCount - 1)) * Math.PI * 2
    const phi = Math.acos(1 - 2 * ((i + hash) % 10) / 10)
    const r = baseSize * 0.8

    const element = surroundingElements[(i + hash) % surroundingElements.length] || 'O'
    const colorHex = elementColors[element] ?? typeColors.chemical

    atoms.push({
      position: new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ),
      element,
      radius: baseSize * 0.35,
      color: new THREE.Color(colorHex),
    })
  }

  return atoms
}

// Group atoms by color for instancing efficiency
function groupAtomsByColor(atoms: AtomData[]): Map<string, AtomData[]> {
  const groups = new Map<string, AtomData[]>()

  for (const atom of atoms) {
    const colorKey = atom.color.getHexString()
    if (!groups.has(colorKey)) {
      groups.set(colorKey, [])
    }
    groups.get(colorKey)!.push(atom)
  }

  return groups
}

export function InstancedMolecularNode({
  node,
  size,
  isHovered,
  isSelected
}: InstancedMolecularNodeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const instancedMeshRefs = useRef<Map<string, THREE.InstancedMesh>>(new Map())

  const atoms = useMemo(() => generateAtomData(node, size), [node, size])
  const atomGroups = useMemo(() => groupAtomsByColor(atoms), [atoms])
  const material = typeMaterials[node.type]

  // Create instance matrices for each atom group
  const instanceData = useMemo(() => {
    const data: Array<{ colorKey: string; color: THREE.Color; matrices: THREE.Matrix4[]; count: number }> = []

    atomGroups.forEach((groupAtoms, colorKey) => {
      const matrices = groupAtoms.map(atom => {
        const matrix = new THREE.Matrix4()
        matrix.compose(
          atom.position,
          new THREE.Quaternion(),
          new THREE.Vector3(atom.radius, atom.radius, atom.radius)
        )
        return matrix
      })

      data.push({
        colorKey,
        color: groupAtoms[0]!.color,
        matrices,
        count: groupAtoms.length,
      })
    })

    return data
  }, [atomGroups])

  // Update instance matrices
  useEffect(() => {
    instanceData.forEach(({ colorKey, matrices }) => {
      const mesh = instancedMeshRefs.current.get(colorKey)
      if (mesh) {
        matrices.forEach((matrix, i) => {
          mesh.setMatrixAt(i, matrix)
        })
        mesh.instanceMatrix.needsUpdate = true
      }
    })
  }, [instanceData])

  // Rotation animation on hover
  useFrame(() => {
    if (groupRef.current && isHovered) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {instanceData.map(({ colorKey, color, count }) => (
        <instancedMesh
          key={colorKey}
          ref={(mesh) => {
            if (mesh) {
              instancedMeshRefs.current.set(colorKey, mesh)
            }
          }}
          args={[sharedSphereGeometry, undefined, count]}
          frustumCulled={false}
        >
          <meshStandardMaterial
            color={color}
            metalness={material.metalness}
            roughness={material.roughness}
            emissive={isHovered || isSelected ? color : new THREE.Color('#000000')}
            emissiveIntensity={isHovered ? 0.4 : isSelected ? 0.2 : 0}
          />
        </instancedMesh>
      ))}

      {/* Bonds - keep as regular cylinders since they're few */}
      {atoms.length > 1 && atoms.slice(1).map((atom, i) => {
        const central = atoms[0]!
        const start = central.position
        const end = atom.position
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
        const length = start.distanceTo(end)
        const direction = new THREE.Vector3().subVectors(end, start).normalize()

        const quaternion = new THREE.Quaternion()
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)

        return (
          <mesh
            key={`bond-${i}`}
            position={mid}
            quaternion={quaternion}
          >
            <cylinderGeometry args={[size * 0.08, size * 0.08, length, 8]} />
            <meshStandardMaterial
              color="#666666"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// Cleanup shared geometry on module unload (for HMR)
if (typeof window !== 'undefined') {
  // @ts-expect-error - HMR cleanup
  if (import.meta.hot) {
    // @ts-expect-error - HMR cleanup
    import.meta.hot.dispose(() => {
      sharedSphereGeometry.dispose()
    })
  }
}
