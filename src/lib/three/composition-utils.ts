import type { CompositionNode, CompositionType } from '@/types'

export const typeColors: Record<CompositionType, string> = {
  product: '#4ecdc4',
  component: '#45b7d1',
  material: '#96ceb4',
  chemical: '#ffeaa7',
  element: '#dfe6e9',
}

export const typeMaterials: Record<CompositionType, { metalness: number; roughness: number }> = {
  product: { metalness: 0.3, roughness: 0.5 },
  component: { metalness: 0.5, roughness: 0.3 },
  material: { metalness: 0.2, roughness: 0.7 },
  chemical: { metalness: 0.1, roughness: 0.4 },
  element: { metalness: 0.8, roughness: 0.2 },
}

// Common element colors based on CPK coloring
export const elementColors: Record<string, string> = {
  H: '#ffffff',
  C: '#909090',
  N: '#3050f8',
  O: '#ff0d0d',
  F: '#90e050',
  Cl: '#1ff01f',
  Br: '#a62929',
  I: '#940094',
  S: '#ffff30',
  P: '#ff8000',
  Fe: '#e06633',
  Au: '#ffd123',
  Ag: '#c0c0c0',
  Cu: '#c88033',
  Na: '#ab5cf2',
  K: '#8f40d4',
  Ca: '#3dff00',
  Mg: '#8aff00',
  Zn: '#7d80b0',
  Al: '#bfa6a6',
  Si: '#f0c8a0',
}

export function calculateNodeSize(percentage: number, depth: number): number {
  const baseSize = 0.5
  const depthFactor = Math.pow(0.6, depth)
  const percentageFactor = Math.max(0.2, Math.sqrt(percentage / 100))
  return baseSize * depthFactor * percentageFactor
}

export function calculateExplodedPosition(
  index: number,
  total: number,
  depth: number,
  isExploded: boolean
): [number, number, number] {
  if (!isExploded || total === 0) {
    return [0, 0, 0]
  }

  const angle = (index / total) * Math.PI * 2
  const radius = 1.5 + depth * 0.5

  return [
    Math.cos(angle) * radius,
    Math.sin(angle) * 0.3 * radius,
    Math.sin(angle) * radius,
  ]
}

export function getNodeColor(node: CompositionNode): string {
  // For elements, use element-specific colors if available
  if (node.type === 'element' && node.symbol) {
    return elementColors[node.symbol] ?? typeColors.element
  }

  // Use custom color from visual config if provided
  if (node.visualConfig?.color) {
    return node.visualConfig.color
  }

  // Default to type-based color
  return typeColors[node.type]
}

export function filterByDepth(
  node: CompositionNode,
  maxDepth: number,
  currentDepth = 0
): CompositionNode {
  if (currentDepth >= maxDepth) {
    return { ...node, children: undefined }
  }

  return {
    ...node,
    children: node.children?.map((child) => filterByDepth(child, maxDepth, currentDepth + 1)),
  }
}

export function countNodes(node: CompositionNode): number {
  let count = 1
  if (node.children) {
    for (const child of node.children) {
      count += countNodes(child)
    }
  }
  return count
}

export function getMaxDepth(node: CompositionNode, currentDepth = 0): number {
  if (!node.children || node.children.length === 0) {
    return currentDepth
  }

  let maxChildDepth = currentDepth
  for (const child of node.children) {
    const childDepth = getMaxDepth(child, currentDepth + 1)
    if (childDepth > maxChildDepth) {
      maxChildDepth = childDepth
    }
  }

  return maxChildDepth
}
