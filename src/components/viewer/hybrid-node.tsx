"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import * as THREE from "three";
import type { CompositionNode as NodeType } from "@/types";
import { useCompositionStore } from "@/stores";
import {
  calculateNodeSize,
  calculateExplodedPosition,
} from "@/lib/three/composition-utils";
import { MolecularNode } from "./molecular-node";
import { ProceduralNode } from "./procedural-node";

interface HybridNodeProps {
  node: NodeType;
  depth: number;
  index: number;
  siblingCount: number;
  parentPosition?: [number, number, number];
}

// Determine if a node should use molecular visualization
function shouldUseMolecular(node: NodeType): boolean {
  return node.type === "chemical" || node.type === "element";
}

export function HybridNode({
  node,
  depth,
  index,
  siblingCount,
  parentPosition = [0, 0, 0],
}: HybridNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Store selectors
  const selectNode = useCompositionStore((s) => s.selectNode);
  const setHoveredNode = useCompositionStore((s) => s.setHoveredNode);
  const setFocusedNode = useCompositionStore((s) => s.setFocusedNode);
  const toggleNodeExpansion = useCompositionStore((s) => s.toggleNodeExpansion);
  const expandToNode = useCompositionStore((s) => s.expandToNode);
  const selectedNode = useCompositionStore((s) => s.selectedNode);
  const expandedNodes = useCompositionStore((s) => s.expandedNodes);
  const isExplodedGlobal = useCompositionStore((s) => s.isExploded);

  const isSelected = selectedNode?.id === node.id;
  const hasChildren = node.children && node.children.length > 0;

  // Per-node explosion: check if THIS node is exploded
  const isNodeExploded = expandedNodes.has(node.id) || isExplodedGlobal;

  // Calculate target position for this node
  const offset = useMemo(
    () =>
      calculateExplodedPosition(
        index,
        siblingCount,
        depth,
        depth > 0 && (isExplodedGlobal || expandedNodes.has(node.id)),
      ),
    [index, siblingCount, depth, isExplodedGlobal, expandedNodes, node.id],
  );

  const targetPosition: [number, number, number] = useMemo(
    () => [
      parentPosition[0] + offset[0],
      parentPosition[1] + offset[1],
      parentPosition[2] + offset[2],
    ],
    [parentPosition, offset],
  );

  const size = calculateNodeSize(node.percentage, depth);

  // Spring animation for position
  const { position } = useSpring({
    position: targetPosition,
    config: {
      mass: 1,
      tension: 170,
      friction: 26,
    },
  });

  // Spring animation for scale (hover/select)
  const { scale } = useSpring({
    scale: hovered ? 1.15 : isSelected ? 1.1 : 1,
    config: {
      tension: 300,
      friction: 20,
    },
  });

  // Cleanup cursor on unmount
  useEffect(() => {
    return () => {
      if (hovered) {
        document.body.style.cursor = "auto";
      }
    };
  }, [hovered]);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    setHoveredNode(node);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    setHoveredNode(null);
    document.body.style.cursor = "auto";
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectNode(node);
    expandToNode(node.id);
  };

  const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setFocusedNode(node.id);
    if (hasChildren) {
      toggleNodeExpansion(node.id);
    }
  };

  const useMolecular = shouldUseMolecular(node);

  return (
    <animated.group
      ref={groupRef}
      position={position as unknown as THREE.Vector3}
      scale={scale}
    >
      {/* Invisible hit area for interaction */}
      <mesh
        userData={{ nodeId: node.id }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        visible={false}
      >
        <sphereGeometry args={[size * 1.5, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Render molecular or procedural based on type */}
      {useMolecular ? (
        <MolecularNode
          node={node}
          size={size}
          isHovered={hovered}
          isSelected={isSelected}
        />
      ) : (
        <ProceduralNode
          node={node}
          size={size}
          isHovered={hovered}
          isSelected={isSelected}
        />
      )}

      {/* Render children when node is exploded */}
      {isNodeExploded &&
        node.children?.map((child, i) => (
          <HybridNode
            key={child.id}
            node={child}
            depth={depth + 1}
            index={i}
            siblingCount={node.children?.length ?? 0}
            parentPosition={[0, 0, 0]} // Children position relative to parent group
          />
        ))}
    </animated.group>
  );
}
