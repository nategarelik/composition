"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import type { CompositionNode } from "@/types";
import {
  elementColors,
  typeColors,
  typeMaterials,
} from "@/lib/three/composition-utils";

interface MolecularNodeProps {
  node: CompositionNode;
  size: number;
  isHovered: boolean;
  isSelected: boolean;
}

// Generate pseudo-random atom positions for molecules
function generateAtomPositions(
  node: CompositionNode,
  baseSize: number,
): { position: [number, number, number]; element: string; radius: number }[] {
  const atoms: {
    position: [number, number, number];
    element: string;
    radius: number;
  }[] = [];

  // For elements, show a single atom
  if (node.type === "element") {
    atoms.push({
      position: [0, 0, 0],
      element: node.symbol || "C",
      radius: baseSize,
    });
    return atoms;
  }

  // For chemicals, create a small molecule structure
  // Use name hash to generate consistent positions
  const hash = node.name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const atomCount = Math.min(3 + (hash % 5), 7); // 3-7 atoms

  // Central atom
  const centralElement = node.symbol || "C";
  atoms.push({
    position: [0, 0, 0],
    element: centralElement,
    radius: baseSize * 0.6,
  });

  // Surrounding atoms in 3D arrangement
  const surroundingElements = ["O", "N", "H", "S", "Cl"];
  for (let i = 1; i < atomCount; i++) {
    const theta = ((i - 1) / (atomCount - 1)) * Math.PI * 2;
    const phi = Math.acos(1 - (2 * ((i + hash) % 10)) / 10);
    const r = baseSize * 0.8;

    atoms.push({
      position: [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ],
      element:
        surroundingElements[(i + hash) % surroundingElements.length] || "O",
      radius: baseSize * 0.35,
    });
  }

  return atoms;
}

// Generate bonds between atoms
function generateBonds(
  atoms: {
    position: [number, number, number];
    element: string;
    radius: number;
  }[],
): { start: [number, number, number]; end: [number, number, number] }[] {
  const bonds: {
    start: [number, number, number];
    end: [number, number, number];
  }[] = [];

  if (atoms.length < 2) return bonds;

  // Connect all atoms to the central atom (first one)
  const central = atoms[0];
  if (!central) return bonds;

  for (let i = 1; i < atoms.length; i++) {
    const atom = atoms[i];
    if (atom) {
      bonds.push({
        start: central.position,
        end: atom.position,
      });
    }
  }

  return bonds;
}

export function MolecularNode({
  node,
  size,
  isHovered,
  isSelected,
}: MolecularNodeProps) {
  const groupRef = useRef<THREE.Group>(null);

  const atoms = useMemo(() => generateAtomPositions(node, size), [node, size]);
  const bonds = useMemo(() => generateBonds(atoms), [atoms]);

  const material = typeMaterials[node.type];

  // Rotation animation on hover
  useFrame(() => {
    if (groupRef.current && isHovered) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Render atoms as spheres */}
      {atoms.map((atom, i) => {
        const color = elementColors[atom.element] ?? typeColors.chemical;
        return (
          <Sphere
            key={`atom-${i}`}
            args={[atom.radius, 16, 16]}
            position={atom.position}
          >
            <meshStandardMaterial
              color={color}
              metalness={material.metalness}
              roughness={material.roughness}
              emissive={isHovered || isSelected ? color : "#000000"}
              emissiveIntensity={isHovered ? 0.4 : isSelected ? 0.2 : 0}
            />
          </Sphere>
        );
      })}

      {/* Render bonds as cylinders */}
      {bonds.map((bond, i) => {
        const start = new THREE.Vector3(...bond.start);
        const end = new THREE.Vector3(...bond.end);
        const mid = new THREE.Vector3()
          .addVectors(start, end)
          .multiplyScalar(0.5);
        const length = start.distanceTo(end);
        const direction = new THREE.Vector3()
          .subVectors(end, start)
          .normalize();

        // Calculate rotation to align cylinder with bond direction
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

        return (
          <Cylinder
            key={`bond-${i}`}
            args={[size * 0.08, size * 0.08, length, 8]}
            position={[mid.x, mid.y, mid.z]}
            quaternion={quaternion}
          >
            <meshStandardMaterial
              color="#666666"
              metalness={0.3}
              roughness={0.7}
            />
          </Cylinder>
        );
      })}
    </group>
  );
}
