import { useMemo } from 'react';
import * as d3 from 'd3-hierarchy';
import { CompositionNode } from '@/types/composition';

export interface LayoutNode {
  id: string;
  node: CompositionNode;
  x: number;
  y: number;
  parentX?: number;
  parentY?: number;
  depth: number;
  path: string; // Tree path for expansion tracking (e.g., 'root', 'root.children[0]')
  hasChildren: boolean; // Whether original node has children (for expand/collapse UI)
  isExpanded: boolean; // Whether this node's children are currently shown
}

/**
 * Hook that calculates radial tree layout positions for composition nodes.
 * Uses D3's hierarchy and tree layout algorithms.
 *
 * @param root - Root composition node
 * @param expandedPaths - Set of paths that are expanded
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns Array of nodes with calculated x, y positions
 */
export function useRadialLayout(
  root: CompositionNode | null,
  expandedPaths: Set<string>,
  width: number,
  height: number
): LayoutNode[] {
  return useMemo(() => {
    if (!root || width === 0 || height === 0) return [];

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 100;

    // Build hierarchy with only expanded nodes, tracking path and original children info
    interface NodeWithPath extends CompositionNode {
      __path?: string;
      __hasOriginalChildren?: boolean;
      __isExpanded?: boolean;
    }

    const filterChildren = (node: CompositionNode, path: string): NodeWithPath => {
      const hasOriginalChildren = !!(node.children && node.children.length > 0);
      const isExpanded = hasOriginalChildren && expandedPaths.has(path);

      const nodeWithPath: NodeWithPath = {
        ...node,
        __path: path,
        __hasOriginalChildren: hasOriginalChildren,
        __isExpanded: isExpanded,
      };

      if (!hasOriginalChildren || !isExpanded) {
        return { ...nodeWithPath, children: undefined };
      }
      return {
        ...nodeWithPath,
        children: node.children!.map((child, i) =>
          filterChildren(child, `${path}.children[${i}]`)
        ),
      };
    };

    const filteredRoot = filterChildren(root, 'root');

    // Create D3 hierarchy
    const hierarchy = d3.hierarchy(filteredRoot, (d) => d.children);

    // Create radial tree layout
    const treeLayout = d3
      .tree<CompositionNode>()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / Math.max(1, a.depth));

    const layoutRoot = treeLayout(hierarchy);

    // Convert to radial coordinates
    const nodes: LayoutNode[] = [];

    layoutRoot.each((d) => {
      const angle = d.x;
      const r = d.y;

      // Convert polar to cartesian
      const x = centerX + r * Math.cos(angle - Math.PI / 2);
      const y = centerY + r * Math.sin(angle - Math.PI / 2);

      let parentX: number | undefined;
      let parentY: number | undefined;

      if (d.parent) {
        const pAngle = d.parent.x;
        const pR = d.parent.y;
        parentX = centerX + pR * Math.cos(pAngle - Math.PI / 2);
        parentY = centerY + pR * Math.sin(pAngle - Math.PI / 2);
      }

      const nodeData = d.data as NodeWithPath;
      nodes.push({
        id: d.data.id,
        node: d.data,
        x,
        y,
        parentX,
        parentY,
        depth: d.depth,
        path: nodeData.__path || 'root',
        hasChildren: nodeData.__hasOriginalChildren || false,
        isExpanded: nodeData.__isExpanded || false,
      });
    });

    return nodes;
  }, [root, expandedPaths, width, height]);
}

export default useRadialLayout;
