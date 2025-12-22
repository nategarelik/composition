"use client";

import { create } from "zustand";
import type { Composition, CompositionNode, ViewMode } from "@/types";

interface CompositionState {
  composition: Composition | null;
  selectedNode: CompositionNode | null;
  hoveredNode: CompositionNode | null;
  viewMode: ViewMode;
  depthLevel: number;
  maxDepth: number;
  isExploded: boolean;

  // Tree navigation state (Phase 2)
  expandedNodes: Set<string>; // Nodes whose children are exploded in 3D
  treeExpandedNodes: Set<string>; // Nodes expanded in tree UI
  focusedNodeId: string | null; // Camera focus target

  // New 2D canvas state (UI redesign)
  expandedPaths: Set<string>; // Paths expanded in 2D radial canvas
  selectedPath: string | null; // Currently selected path in canvas

  // Actions
  setComposition: (composition: Composition) => void;
  selectNode: (node: CompositionNode | null) => void;
  setHoveredNode: (node: CompositionNode | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setDepthLevel: (level: number) => void;
  toggleExploded: () => void;
  reset: () => void;

  // Tree navigation actions
  toggleNodeExpansion: (nodeId: string) => void; // Toggle 3D explosion for a node
  toggleTreeNode: (nodeId: string) => void; // Toggle tree UI expansion
  expandToNode: (nodeId: string) => void; // Expand tree path to a node
  setFocusedNode: (nodeId: string | null) => void; // Set camera focus target
  collapseAllTree: () => void; // Collapse all tree nodes
  expandAllTree: () => void; // Expand all tree nodes

  // 2D canvas actions
  toggleExpandedPath: (path: string) => void;
  setSelectedPath: (path: string | null) => void;
}

// Helper to get all node IDs in a composition tree
function getAllNodeIds(node: CompositionNode): string[] {
  const ids = [node.id];
  if (node.children) {
    for (const child of node.children) {
      ids.push(...getAllNodeIds(child));
    }
  }
  return ids;
}

// Helper to find path to a node
function findPathToNode(
  root: CompositionNode,
  targetId: string,
  path: string[] = [],
): string[] | null {
  if (root.id === targetId) {
    return [...path, root.id];
  }
  if (root.children) {
    for (const child of root.children) {
      const result = findPathToNode(child, targetId, [...path, root.id]);
      if (result) return result;
    }
  }
  return null;
}

export const useCompositionStore = create<CompositionState>((set) => ({
  composition: null,
  selectedNode: null,
  hoveredNode: null,
  viewMode: "exploded",
  depthLevel: 4,
  maxDepth: 5,
  isExploded: false,

  // Tree navigation state
  expandedNodes: new Set<string>(),
  treeExpandedNodes: new Set<string>(),
  focusedNodeId: null,

  // 2D canvas state
  expandedPaths: new Set<string>(['root']),
  selectedPath: null,

  setComposition: (composition) =>
    set({
      composition,
      selectedNode: null,
      hoveredNode: null,
      isExploded: false,
      expandedNodes: new Set<string>(),
      treeExpandedNodes: new Set<string>([composition.root.id]), // Auto-expand root
      focusedNodeId: null,
    }),

  selectNode: (selectedNode) => set({
    selectedNode,
    selectedPath: selectedNode ? `node-${selectedNode.id}` : null,
  }),

  setHoveredNode: (hoveredNode) => set({ hoveredNode }),

  setViewMode: (viewMode) => set({ viewMode }),

  setDepthLevel: (level) =>
    set((state) => ({
      depthLevel: Math.max(1, Math.min(level, state.maxDepth)),
    })),

  toggleExploded: () => set((state) => ({ isExploded: !state.isExploded })),

  reset: () =>
    set({
      composition: null,
      selectedNode: null,
      hoveredNode: null,
      viewMode: "exploded",
      depthLevel: 4,
      isExploded: false,
      expandedNodes: new Set<string>(),
      treeExpandedNodes: new Set<string>(),
      focusedNodeId: null,
    }),

  // Toggle 3D explosion for a specific node
  toggleNodeExpansion: (nodeId) =>
    set((state) => {
      const newExpanded = new Set(state.expandedNodes);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return { expandedNodes: newExpanded };
    }),

  // Toggle tree UI expansion
  toggleTreeNode: (nodeId) =>
    set((state) => {
      const newExpanded = new Set(state.treeExpandedNodes);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return { treeExpandedNodes: newExpanded };
    }),

  // Expand tree path to reveal a specific node
  expandToNode: (nodeId) =>
    set((state) => {
      if (!state.composition) return state;

      const path = findPathToNode(state.composition.root, nodeId);
      if (!path) return state;

      const newExpanded = new Set(state.treeExpandedNodes);
      // Expand all parent nodes (not the target itself)
      for (let i = 0; i < path.length - 1; i++) {
        const nodeId = path[i];
        if (nodeId) {
          newExpanded.add(nodeId);
        }
      }
      return { treeExpandedNodes: newExpanded };
    }),

  // Set camera focus target
  setFocusedNode: (focusedNodeId) => set({ focusedNodeId }),

  // Collapse all tree nodes
  collapseAllTree: () =>
    set((state) => ({
      treeExpandedNodes: state.composition
        ? new Set<string>([state.composition.root.id]) // Keep root expanded
        : new Set<string>(),
    })),

  // Expand all tree nodes
  expandAllTree: () =>
    set((state) => {
      if (!state.composition) return state;
      const allIds = getAllNodeIds(state.composition.root);
      return { treeExpandedNodes: new Set(allIds) };
    }),

  // 2D canvas path actions
  toggleExpandedPath: (path) =>
    set((state) => {
      const newPaths = new Set(state.expandedPaths);
      if (newPaths.has(path)) {
        newPaths.delete(path);
      } else {
        newPaths.add(path);
      }
      return { expandedPaths: newPaths };
    }),

  setSelectedPath: (selectedPath) =>
    set((state) => {
      // Extract node ID from path (e.g., "node-123" -> "123")
      if (!selectedPath) return { selectedPath: null, selectedNode: null };

      const nodeId = selectedPath.replace('node-', '');

      // Find the node in the composition tree
      const findNode = (node: CompositionNode, targetId: string): CompositionNode | null => {
        if (node.id === targetId) return node;
        if (node.children) {
          for (const child of node.children) {
            const found = findNode(child, targetId);
            if (found) return found;
          }
        }
        return null;
      };

      const selectedNode = state.composition ? findNode(state.composition.root, nodeId) : null;
      return { selectedPath, selectedNode };
    }),
}));
