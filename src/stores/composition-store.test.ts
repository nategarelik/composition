import { describe, it, expect, beforeEach } from "vitest";
import { useCompositionStore } from "./composition-store";
import type { Composition, CompositionNode } from "@/types";

describe("Composition Store", () => {
  beforeEach(() => {
    // Reset store state before each test
    useCompositionStore.setState({
      composition: null,
      selectedNode: null,
      hoveredNode: null,
      viewMode: "exploded",
      depthLevel: 4,
      maxDepth: 5,
      isExploded: false,
      expandedNodes: new Set<string>(),
      treeExpandedNodes: new Set<string>(),
      focusedNodeId: null,
    });
  });

  const mockNode: CompositionNode = {
    id: "node-1",
    name: "Test Node",
    type: "component",
    percentage: 50,
    confidence: "verified",
    children: [
      {
        id: "node-2",
        name: "Child Node",
        type: "element",
        percentage: 25,
        confidence: "estimated",
      },
    ],
  };

  const mockComposition: Composition = {
    id: "comp-1",
    query: "test query",
    name: "Test Composition",
    category: "test",
    root: mockNode,
    sources: [],
    confidence: "verified",
    researchedAt: "2024-01-01T00:00:00Z",
    viewCount: 0,
    shareCount: 0,
  };

  describe("setComposition", () => {
    it("sets the composition", () => {
      const store = useCompositionStore.getState();
      store.setComposition(mockComposition);

      expect(useCompositionStore.getState().composition).toEqual(mockComposition);
    });

    it("resets selection state", () => {
      useCompositionStore.setState({ selectedNode: mockNode });
      const store = useCompositionStore.getState();
      store.setComposition(mockComposition);

      expect(useCompositionStore.getState().selectedNode).toBeNull();
      expect(useCompositionStore.getState().hoveredNode).toBeNull();
    });

    it("auto-expands root in tree", () => {
      const store = useCompositionStore.getState();
      store.setComposition(mockComposition);

      const treeExpanded = useCompositionStore.getState().treeExpandedNodes;
      expect(treeExpanded.has(mockComposition.root.id)).toBe(true);
    });
  });

  describe("selectNode", () => {
    it("sets selected node", () => {
      const store = useCompositionStore.getState();
      store.selectNode(mockNode);

      expect(useCompositionStore.getState().selectedNode).toEqual(mockNode);
    });

    it("clears selected node when null", () => {
      useCompositionStore.setState({ selectedNode: mockNode });
      const store = useCompositionStore.getState();
      store.selectNode(null);

      expect(useCompositionStore.getState().selectedNode).toBeNull();
    });
  });

  describe("setHoveredNode", () => {
    it("sets hovered node", () => {
      const store = useCompositionStore.getState();
      store.setHoveredNode(mockNode);

      expect(useCompositionStore.getState().hoveredNode).toEqual(mockNode);
    });
  });

  describe("setViewMode", () => {
    it("sets view mode", () => {
      const store = useCompositionStore.getState();
      store.setViewMode("compact");

      expect(useCompositionStore.getState().viewMode).toBe("compact");
    });
  });

  describe("setDepthLevel", () => {
    it("sets depth level", () => {
      const store = useCompositionStore.getState();
      store.setDepthLevel(3);

      expect(useCompositionStore.getState().depthLevel).toBe(3);
    });

    it("clamps to minimum of 1", () => {
      const store = useCompositionStore.getState();
      store.setDepthLevel(0);

      expect(useCompositionStore.getState().depthLevel).toBe(1);
    });

    it("clamps to max depth", () => {
      const store = useCompositionStore.getState();
      store.setDepthLevel(100);

      expect(useCompositionStore.getState().depthLevel).toBe(5); // maxDepth
    });
  });

  describe("toggleExploded", () => {
    it("toggles isExploded from false to true", () => {
      const store = useCompositionStore.getState();
      store.toggleExploded();

      expect(useCompositionStore.getState().isExploded).toBe(true);
    });

    it("toggles isExploded from true to false", () => {
      useCompositionStore.setState({ isExploded: true });
      const store = useCompositionStore.getState();
      store.toggleExploded();

      expect(useCompositionStore.getState().isExploded).toBe(false);
    });
  });

  describe("Tree Navigation", () => {
    describe("toggleNodeExpansion", () => {
      it("adds node to expandedNodes", () => {
        const store = useCompositionStore.getState();
        store.toggleNodeExpansion("node-1");

        expect(useCompositionStore.getState().expandedNodes.has("node-1")).toBe(true);
      });

      it("removes node from expandedNodes if already expanded", () => {
        useCompositionStore.setState({ expandedNodes: new Set(["node-1"]) });
        const store = useCompositionStore.getState();
        store.toggleNodeExpansion("node-1");

        expect(useCompositionStore.getState().expandedNodes.has("node-1")).toBe(false);
      });
    });

    describe("toggleTreeNode", () => {
      it("adds node to treeExpandedNodes", () => {
        const store = useCompositionStore.getState();
        store.toggleTreeNode("node-1");

        expect(useCompositionStore.getState().treeExpandedNodes.has("node-1")).toBe(true);
      });

      it("removes node from treeExpandedNodes if already expanded", () => {
        useCompositionStore.setState({ treeExpandedNodes: new Set(["node-1"]) });
        const store = useCompositionStore.getState();
        store.toggleTreeNode("node-1");

        expect(useCompositionStore.getState().treeExpandedNodes.has("node-1")).toBe(false);
      });
    });

    describe("expandToNode", () => {
      it("expands path to target node", () => {
        const store = useCompositionStore.getState();
        store.setComposition(mockComposition);
        store.expandToNode("node-2"); // Child node

        const expanded = useCompositionStore.getState().treeExpandedNodes;
        expect(expanded.has("node-1")).toBe(true); // Parent expanded
      });
    });

    describe("setFocusedNode", () => {
      it("sets focused node ID", () => {
        const store = useCompositionStore.getState();
        store.setFocusedNode("node-1");

        expect(useCompositionStore.getState().focusedNodeId).toBe("node-1");
      });

      it("clears focused node ID", () => {
        useCompositionStore.setState({ focusedNodeId: "node-1" });
        const store = useCompositionStore.getState();
        store.setFocusedNode(null);

        expect(useCompositionStore.getState().focusedNodeId).toBeNull();
      });
    });

    describe("collapseAllTree", () => {
      it("collapses all except root", () => {
        const store = useCompositionStore.getState();
        store.setComposition(mockComposition);
        store.toggleTreeNode("node-2");
        store.collapseAllTree();

        const expanded = useCompositionStore.getState().treeExpandedNodes;
        expect(expanded.size).toBe(1);
        expect(expanded.has(mockComposition.root.id)).toBe(true);
      });
    });

    describe("expandAllTree", () => {
      it("expands all nodes", () => {
        const store = useCompositionStore.getState();
        store.setComposition(mockComposition);
        store.expandAllTree();

        const expanded = useCompositionStore.getState().treeExpandedNodes;
        expect(expanded.has("node-1")).toBe(true);
        expect(expanded.has("node-2")).toBe(true);
      });
    });
  });

  describe("reset", () => {
    it("resets all state", () => {
      const store = useCompositionStore.getState();
      store.setComposition(mockComposition);
      store.selectNode(mockNode);
      store.setViewMode("compact");
      store.reset();

      const state = useCompositionStore.getState();
      expect(state.composition).toBeNull();
      expect(state.selectedNode).toBeNull();
      expect(state.viewMode).toBe("exploded");
      expect(state.expandedNodes.size).toBe(0);
    });
  });
});
