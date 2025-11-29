import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

// Mock dependencies
vi.mock("@/lib/db", () => ({
  db: {
    composition: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/redis", () => ({
  getCached: vi.fn(),
  setCache: vi.fn(),
  cacheKeys: {
    compositionByQuery: (query: string) => `comp:query:${query}`,
  },
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/lib/agents", () => ({
  researchComposition: vi.fn(),
}));

// Import mocked modules
import { db } from "@/lib/db";
import { getCached, setCache } from "@/lib/redis";
import { checkRateLimit } from "@/lib/rate-limit";
import { researchComposition } from "@/lib/agents";

// Helper to create mock request
function createRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/search", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Mock composition data
const mockDbRecord = {
  id: "comp-123",
  query: "iphone 15",
  queryNorm: "iphone-15",
  name: "iPhone 15",
  category: "electronics",
  description: "Apple smartphone",
  rootData: {
    id: "root-1",
    name: "iPhone 15",
    type: "product",
    percentage: 100,
    confidence: "verified",
  },
  sourcesData: [],
  confidence: "verified",
  researchedAt: new Date("2024-01-01"),
  viewCount: 0,
  shareCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockResearchResult = {
  name: "iPhone 15",
  category: "electronics",
  description: "Apple smartphone",
  root: {
    id: "root-1",
    name: "iPhone 15",
    type: "product",
    percentage: 100,
    confidence: "verified",
  },
  sources: [],
  confidence: "verified",
};

describe("/api/search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mocks
    vi.mocked(getCached).mockResolvedValue(null);
    vi.mocked(setCache).mockResolvedValue(undefined);
    vi.mocked(checkRateLimit).mockResolvedValue(null);
    vi.mocked(db.composition.findFirst).mockResolvedValue(null);
  });

  describe("Input validation", () => {
    it("rejects empty query", async () => {
      const request = createRequest({ query: "" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("INVALID_QUERY");
    });

    it("rejects query that is too short", async () => {
      const request = createRequest({ query: "a" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.message).toContain("at least");
    });

    it("rejects query that is too long", async () => {
      const request = createRequest({ query: "a".repeat(201) });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.message).toContain("less than");
    });

    it("sanitizes dangerous characters from query", async () => {
      vi.mocked(db.composition.findFirst).mockResolvedValue(mockDbRecord);

      const request = createRequest({ query: "<script>alert('xss')</script>test" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      // The query should be sanitized (< > { } removed)
      expect(data.success).toBe(true);
    });

    it("trims whitespace from query", async () => {
      vi.mocked(db.composition.findFirst).mockResolvedValue(mockDbRecord);

      const request = createRequest({ query: "  iphone 15  " });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("rejects missing query field", async () => {
      const request = createRequest({});
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe("Rate limiting", () => {
    it("returns rate limit response when exceeded", async () => {
      const rateLimitResponse = new Response(
        JSON.stringify({
          success: false,
          error: { code: "RATE_LIMITED", message: "Too many requests" },
        }),
        { status: 429 }
      );
      vi.mocked(checkRateLimit).mockResolvedValue(rateLimitResponse as never);

      const request = createRequest({ query: "test query" });
      const response = await POST(request);

      expect(response.status).toBe(429);
    });
  });

  describe("Caching", () => {
    it("returns cached result from Redis", async () => {
      const cachedComposition = {
        id: "cached-123",
        query: "test",
        name: "Test",
        category: "test",
        root: mockDbRecord.rootData,
        sources: [],
        confidence: "verified",
        researchedAt: "2024-01-01T00:00:00.000Z",
        viewCount: 0,
        shareCount: 0,
      };
      vi.mocked(getCached).mockResolvedValue(cachedComposition);

      const request = createRequest({ query: "test query" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.cached).toBe(true);
      expect(data.data.composition.id).toBe("cached-123");
      // Should not hit database
      expect(db.composition.findFirst).not.toHaveBeenCalled();
    });

    it("returns cached result from database when not in Redis", async () => {
      vi.mocked(getCached).mockResolvedValue(null);
      vi.mocked(db.composition.findFirst).mockResolvedValue(mockDbRecord);

      const request = createRequest({ query: "iphone 15" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.cached).toBe(true);
      // Should cache to Redis
      expect(setCache).toHaveBeenCalled();
    });
  });

  describe("Research flow", () => {
    it("performs research when not cached", async () => {
      vi.mocked(getCached).mockResolvedValue(null);
      vi.mocked(db.composition.findFirst).mockResolvedValue(null);
      vi.mocked(researchComposition).mockResolvedValue(mockResearchResult);
      vi.mocked(db.composition.create).mockResolvedValue(mockDbRecord);

      const request = createRequest({ query: "new product" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.cached).toBe(false);
      expect(data.data.researchTime).toBeDefined();
      expect(researchComposition).toHaveBeenCalledWith("new product");
      expect(db.composition.create).toHaveBeenCalled();
    });

    it("caches research result to Redis", async () => {
      vi.mocked(getCached).mockResolvedValue(null);
      vi.mocked(db.composition.findFirst).mockResolvedValue(null);
      vi.mocked(researchComposition).mockResolvedValue(mockResearchResult);
      vi.mocked(db.composition.create).mockResolvedValue(mockDbRecord);

      const request = createRequest({ query: "new product" });
      await POST(request);

      expect(setCache).toHaveBeenCalled();
    });
  });

  describe("Error handling", () => {
    it("returns 500 on research error", async () => {
      vi.mocked(getCached).mockResolvedValue(null);
      vi.mocked(db.composition.findFirst).mockResolvedValue(null);
      vi.mocked(researchComposition).mockRejectedValue(new Error("API error"));

      const request = createRequest({ query: "test query" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("RESEARCH_ERROR");
      expect(data.error.message).toBe("API error");
    });

    it("returns 500 on database error", async () => {
      vi.mocked(getCached).mockResolvedValue(null);
      vi.mocked(db.composition.findFirst).mockRejectedValue(new Error("DB connection failed"));

      const request = createRequest({ query: "test query" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("RESEARCH_ERROR");
    });

    it("handles non-Error exceptions", async () => {
      vi.mocked(getCached).mockResolvedValue(null);
      vi.mocked(db.composition.findFirst).mockRejectedValue("string error");

      const request = createRequest({ query: "test query" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error.message).toBe("Failed to research composition");
    });
  });
});
