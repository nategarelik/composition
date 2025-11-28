"use client";

import { useRef, useMemo } from "react";
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

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Random spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius + Math.random() * depth;

      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, [count, radius, depth]);

  const sizes = useMemo(() => {
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      sizes[i] = Math.random() * factor;
    }
    return sizes;
  }, [count, factor]);

  useFrame((_, delta) => {
    if (groupRef.current && speed > 0) {
      groupRef.current.rotation.y += delta * speed * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
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
