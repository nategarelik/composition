import { z } from "zod";
import type { CompositionNode, Source, ConfidenceLevel } from "@/types";
import type { Composition as DbComposition } from "@prisma/client";

// Zod schema for CompositionNode - recursive type for tree structure
export const compositionNodeSchema: z.ZodType<CompositionNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["product", "component", "material", "chemical", "element"]),
    percentage: z.number(),
    confidence: z.enum(["verified", "estimated", "speculative"]),
    description: z.string().optional(),
    symbol: z.string().optional(),
    atomicNumber: z.number().optional(),
    casNumber: z.string().optional(),
    children: z.array(compositionNodeSchema).optional(),
  }),
);

// Zod schema for Source
export const sourceSchema: z.ZodType<Source> = z.object({
  id: z.string(),
  type: z.enum([
    "official",
    "scientific",
    "database",
    "calculated",
    "estimated",
  ]),
  name: z.string(),
  url: z.string().optional(),
  accessedAt: z.string(),
  confidence: z.enum(["verified", "estimated", "speculative"]),
  notes: z.string().optional(),
});

// Transform database record to Composition type with runtime validation
export function dbToComposition(record: DbComposition) {
  // Parse and validate JSON fields at runtime for type safety
  const root = compositionNodeSchema.parse(record.rootData);
  const sources = z.array(sourceSchema).parse(record.sourcesData);

  return {
    id: record.id,
    query: record.query,
    name: record.name,
    category: record.category,
    description: record.description ?? undefined,
    root,
    sources,
    confidence: record.confidence as ConfidenceLevel,
    researchedAt: record.researchedAt.toISOString(),
    viewCount: record.viewCount,
    shareCount: record.shareCount,
  };
}

// Normalize query for consistent caching and database lookup
export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, "-");
}
