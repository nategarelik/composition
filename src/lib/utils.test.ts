import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("Utils", () => {
  describe("cn (classnames)", () => {
    it("merges class names", () => {
      const result = cn("foo", "bar");
      expect(result).toBe("foo bar");
    });

    it("handles conditional classes", () => {
      const shouldInclude = true;
      const shouldExclude = false;
      const result = cn("base", shouldInclude && "included", shouldExclude && "excluded");
      expect(result).toContain("base");
      expect(result).toContain("included");
      expect(result).not.toContain("excluded");
    });

    it("handles undefined and null", () => {
      const result = cn("base", undefined, null, "end");
      expect(result).toBe("base end");
    });

    it("handles false values", () => {
      const result = cn("base", false, "end");
      expect(result).toBe("base end");
    });

    it("handles empty strings", () => {
      const result = cn("base", "", "end");
      expect(result).toBe("base end");
    });

    it("returns empty string when all falsy", () => {
      const result = cn(undefined, null, false);
      expect(result).toBe("");
    });
  });
});
