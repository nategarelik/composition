import { describe, it, expect } from "vitest";
import {
  typeColors,
  typeMaterials,
  elementColors,
  calculateNodeSize,
  calculateExplodedPosition,
  getNodeColor,
  filterByDepth,
  countNodes,
  getMaxDepth,
} from "./composition-utils";
import type { CompositionNode } from "@/types";

describe("Composition Utils", () => {
  describe("typeColors", () => {
    it("has colors defined for all node types", () => {
      const expectedTypes = ["product", "component", "material", "chemical", "element"];
      expectedTypes.forEach((type) => {
        expect(typeColors[type as keyof typeof typeColors]).toBeDefined();
        expect(typeof typeColors[type as keyof typeof typeColors]).toBe("string");
      });
    });
  });

  describe("typeMaterials", () => {
    it("has materials defined for all node types", () => {
      const expectedTypes = ["product", "component", "material", "chemical", "element"];
      expectedTypes.forEach((type) => {
        const material = typeMaterials[type as keyof typeof typeMaterials];
        expect(material).toBeDefined();
        expect(typeof material.metalness).toBe("number");
        expect(typeof material.roughness).toBe("number");
      });
    });
  });

  describe("elementColors", () => {
    it("has colors for common elements", () => {
      expect(elementColors.C).toBeDefined(); // Carbon
      expect(elementColors.O).toBeDefined(); // Oxygen
      expect(elementColors.H).toBeDefined(); // Hydrogen
      expect(elementColors.Fe).toBeDefined(); // Iron
    });
  });

  describe("calculateNodeSize", () => {
    it("returns positive size for valid inputs", () => {
      const size = calculateNodeSize(50, 0);
      expect(size).toBeGreaterThan(0);
    });

    it("returns smaller size at deeper depth", () => {
      const sizeDepth0 = calculateNodeSize(50, 0);
      const sizeDepth2 = calculateNodeSize(50, 2);
      expect(sizeDepth2).toBeLessThan(sizeDepth0);
    });

    it("returns larger size for higher percentage", () => {
      const sizeLow = calculateNodeSize(10, 0);
      const sizeHigh = calculateNodeSize(90, 0);
      expect(sizeHigh).toBeGreaterThan(sizeLow);
    });
  });

  describe("calculateExplodedPosition", () => {
    it("returns [0,0,0] when not exploded", () => {
      const position = calculateExplodedPosition(0, 3, 1, false);
      expect(position).toEqual([0, 0, 0]);
    });

    it("returns [0,0,0] when total is 0", () => {
      const position = calculateExplodedPosition(0, 0, 1, true);
      expect(position).toEqual([0, 0, 0]);
    });

    it("returns non-zero position when exploded", () => {
      const position = calculateExplodedPosition(0, 3, 1, true);
      const [x, y, z] = position;
      expect(Math.abs(x) + Math.abs(y) + Math.abs(z)).toBeGreaterThan(0);
    });

    it("returns different positions for different indices", () => {
      const pos1 = calculateExplodedPosition(0, 4, 1, true);
      const pos2 = calculateExplodedPosition(1, 4, 1, true);
      expect(pos1).not.toEqual(pos2);
    });
  });

  describe("getNodeColor", () => {
    it("returns type color for non-element nodes", () => {
      const node: CompositionNode = {
        id: "1",
        name: "Component",
        type: "component",
        percentage: 50,
        confidence: "verified",
      };
      expect(getNodeColor(node)).toBe(typeColors.component);
    });

    it("returns element color for element with symbol", () => {
      const node: CompositionNode = {
        id: "1",
        name: "Carbon",
        type: "element",
        percentage: 50,
        confidence: "verified",
        symbol: "C",
      };
      expect(getNodeColor(node)).toBe(elementColors.C);
    });

    it("returns type color for element without known symbol", () => {
      const node: CompositionNode = {
        id: "1",
        name: "Unknown",
        type: "element",
        percentage: 50,
        confidence: "verified",
        symbol: "Xyz",
      };
      expect(getNodeColor(node)).toBe(typeColors.element);
    });
  });

  describe("filterByDepth", () => {
    const createTree = (): CompositionNode => ({
      id: "root",
      name: "Root",
      type: "product",
      percentage: 100,
      confidence: "verified",
      children: [
        {
          id: "child1",
          name: "Child 1",
          type: "component",
          percentage: 50,
          confidence: "verified",
          children: [
            {
              id: "grandchild",
              name: "Grandchild",
              type: "material",
              percentage: 25,
              confidence: "verified",
            },
          ],
        },
      ],
    });

    it("returns full tree at max depth", () => {
      const tree = createTree();
      const filtered = filterByDepth(tree, 10);
      expect(filtered.children?.[0]?.children?.[0]?.name).toBe("Grandchild");
    });

    it("removes children beyond depth limit", () => {
      const tree = createTree();
      const filtered = filterByDepth(tree, 1);
      expect(filtered.children?.[0]?.children).toBeUndefined();
    });

    it("returns node with no children at depth 0", () => {
      const tree = createTree();
      const filtered = filterByDepth(tree, 0);
      expect(filtered.children).toBeUndefined();
    });
  });

  describe("countNodes", () => {
    it("returns 1 for single node", () => {
      const node: CompositionNode = {
        id: "1",
        name: "Single",
        type: "element",
        percentage: 100,
        confidence: "verified",
      };
      expect(countNodes(node)).toBe(1);
    });

    it("counts all nodes in tree", () => {
      const node: CompositionNode = {
        id: "root",
        name: "Root",
        type: "product",
        percentage: 100,
        confidence: "verified",
        children: [
          {
            id: "child1",
            name: "Child 1",
            type: "component",
            percentage: 50,
            confidence: "verified",
          },
          {
            id: "child2",
            name: "Child 2",
            type: "component",
            percentage: 50,
            confidence: "verified",
          },
        ],
      };
      expect(countNodes(node)).toBe(3);
    });
  });

  describe("getMaxDepth", () => {
    it("returns 0 for single node", () => {
      const node: CompositionNode = {
        id: "1",
        name: "Single",
        type: "element",
        percentage: 100,
        confidence: "verified",
      };
      expect(getMaxDepth(node)).toBe(0);
    });

    it("returns correct depth for deep tree", () => {
      const node: CompositionNode = {
        id: "root",
        name: "Root",
        type: "product",
        percentage: 100,
        confidence: "verified",
        children: [
          {
            id: "child",
            name: "Child",
            type: "component",
            percentage: 50,
            confidence: "verified",
            children: [
              {
                id: "grandchild",
                name: "Grandchild",
                type: "material",
                percentage: 25,
                confidence: "verified",
              },
            ],
          },
        ],
      };
      expect(getMaxDepth(node)).toBe(2);
    });
  });
});
