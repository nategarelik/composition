"use client";

import { useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StarsBackgroundProps {
  count?: number;
  radius?: number;
  depth?: number;
  factor?: number;
  fade?: boolean;
  speed?: number;
}

// Seeded random number generator for deterministic results
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// Generate star positions outside of component render
function generateStarPositions(
  count: number,
  radius: number,
  depth: number,
  seed: number,
): Float32Array {
  const random = createSeededRandom(seed);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const r = radius + random() * depth;

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function generateStarSizes(
  count: number,
  factor: number,
  seed: number,
): Float32Array {
  const random = createSeededRandom(seed);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    sizes[i] = random() * factor;
  }
  return sizes;
}

// Cache for star data keyed by props
const starDataCache = new Map<
  string,
  { positions: Float32Array; sizes: Float32Array }
>();

function getStarData(
  count: number,
  radius: number,
  depth: number,
  factor: number,
) {
  const key = `${count}-${radius}-${depth}-${factor}`;
  let data = starDataCache.get(key);
  if (!data) {
    data = {
      positions: generateStarPositions(count, radius, depth, 12345),
      sizes: generateStarSizes(count, factor, 54321),
    };
    starDataCache.set(key, data);
  }
  return data;
}

// Simple stars implementation without drei
export function StarsBackground({
  count = 1000,
  radius = 100,
  depth = 50,
  factor = 4,
  fade = true,
  speed = 1,
}: StarsBackgroundProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Create a stable function to get star data
  const getStarDataMemoized = useCallback(
    () => getStarData(count, radius, depth, factor),
    [count, radius, depth, factor],
  );

  // Use lazy initializer - this only runs once and is not considered impure
  const [starData] = useState(getStarDataMemoized);

  useFrame((_, delta) => {
    if (groupRef.current && speed > 0) {
      groupRef.current.rotation.y += delta * speed * 0.01;
    }
  });

  // Don't render until star data is generated
  if (!starData) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[starData.sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          sizeAttenuation={true}
          color="#ffffff"
          transparent={fade}
          opacity={fade ? 0.6 : 1}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
