import { describe, it, expect } from "vitest";
import {
  compositionNodeSchema,
  sourceSchema,
  normalizeQuery,
} from "./composition";

describe("Composition Validators", () => {
  describe("compositionNodeSchema", () => {
    it("validates a simple node", () => {
      const node = {
        id: "node-1",
        name: "Carbon",
        type: "element",
        percentage: 25.5,
        confidence: "verified",
      };

      const result = compositionNodeSchema.safeParse(node);
      expect(result.success).toBe(true);
    });

    it("validates a node with children", () => {
      const node = {
        id: "node-1",
        name: "Battery",
        type: "component",
        percentage: 30,
        confidence: "estimated",
        children: [
          {
            id: "node-2",
            name: "Lithium",
            type: "element",
            percentage: 5,
            confidence: "verified",
            symbol: "Li",
            atomicNumber: 3,
          },
        ],
      };

      const result = compositionNodeSchema.safeParse(node);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.children).toHaveLength(1);
      }
    });

    it("validates all node types", () => {
      const types = ["product", "component", "material", "chemical", "element"] as const;

      types.forEach((type) => {
        const node = {
          id: `node-${type}`,
          name: `Test ${type}`,
          type,
          percentage: 10,
          confidence: "verified" as const,
        };

        const result = compositionNodeSchema.safeParse(node);
        expect(result.success).toBe(true);
      });
    });

    it("validates all confidence levels", () => {
      const levels = ["verified", "estimated", "speculative"] as const;

      levels.forEach((confidence) => {
        const node = {
          id: `node-${confidence}`,
          name: "Test",
          type: "element" as const,
          percentage: 10,
          confidence,
        };

        const result = compositionNodeSchema.safeParse(node);
        expect(result.success).toBe(true);
      });
    });

    it("validates optional fields", () => {
      const node = {
        id: "node-1",
        name: "Sodium Chloride",
        type: "chemical",
        percentage: 15,
        confidence: "verified",
        description: "Table salt",
        casNumber: "7647-14-5",
      };

      const result = compositionNodeSchema.safeParse(node);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBe("Table salt");
        expect(result.data.casNumber).toBe("7647-14-5");
      }
    });

    it("rejects node without required id", () => {
      const node = {
        name: "Test",
        type: "element",
        percentage: 10,
        confidence: "verified",
      };

      const result = compositionNodeSchema.safeParse(node);
      expect(result.success).toBe(false);
    });

    it("rejects invalid type", () => {
      const node = {
        id: "node-1",
        name: "Test",
        type: "invalid_type",
        percentage: 10,
        confidence: "verified",
      };

      const result = compositionNodeSchema.safeParse(node);
      expect(result.success).toBe(false);
    });

    it("rejects invalid confidence", () => {
      const node = {
        id: "node-1",
        name: "Test",
        type: "element",
        percentage: 10,
        confidence: "invalid_confidence",
      };

      const result = compositionNodeSchema.safeParse(node);
      expect(result.success).toBe(false);
    });
  });

  describe("sourceSchema", () => {
    it("validates a complete source", () => {
      const source = {
        id: "src-1",
        type: "official",
        name: "Apple Inc.",
        url: "https://apple.com",
        accessedAt: "2024-01-01T00:00:00Z",
        confidence: "verified",
        notes: "Official product specs",
      };

      const result = sourceSchema.safeParse(source);
      expect(result.success).toBe(true);
    });

    it("validates source without optional fields", () => {
      const source = {
        id: "src-1",
        type: "scientific",
        name: "Research Paper",
        accessedAt: "2024-01-01T00:00:00Z",
        confidence: "verified",
      };

      const result = sourceSchema.safeParse(source);
      expect(result.success).toBe(true);
    });

    it("validates all source types", () => {
      const types = ["official", "scientific", "database", "calculated", "estimated"] as const;

      types.forEach((type) => {
        const source = {
          id: `src-${type}`,
          type,
          name: `Test ${type}`,
          accessedAt: "2024-01-01T00:00:00Z",
          confidence: "verified" as const,
        };

        const result = sourceSchema.safeParse(source);
        expect(result.success).toBe(true);
      });
    });

    it("rejects source without required fields", () => {
      const source = {
        name: "Test",
        type: "official",
        // missing id, accessedAt, confidence
      };

      const result = sourceSchema.safeParse(source);
      expect(result.success).toBe(false);
    });

    it("rejects invalid source type", () => {
      const source = {
        id: "src-1",
        type: "invalid_type",
        name: "Test",
        accessedAt: "2024-01-01T00:00:00Z",
        confidence: "verified",
      };

      const result = sourceSchema.safeParse(source);
      expect(result.success).toBe(false);
    });
  });

  describe("normalizeQuery", () => {
    it("converts to lowercase", () => {
      expect(normalizeQuery("IPHONE")).toBe("iphone");
    });

    it("replaces spaces with hyphens", () => {
      expect(normalizeQuery("iPhone 15 Pro")).toBe("iphone-15-pro");
    });

    it("handles multiple spaces", () => {
      expect(normalizeQuery("iPhone   15")).toBe("iphone-15");
    });

    it("trims whitespace", () => {
      expect(normalizeQuery("  iPhone 15  ")).toBe("iphone-15");
    });

    it("handles already normalized query", () => {
      expect(normalizeQuery("iphone-15")).toBe("iphone-15");
    });
  });
});
