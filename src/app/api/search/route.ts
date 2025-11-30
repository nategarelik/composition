import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { researchComposition } from "@/lib/agents";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { getCached, setCache, cacheKeys } from "@/lib/redis";
import { CACHE_TTL, SIZE_LIMITS } from "@/lib/constants";
import { dbToComposition, normalizeQuery } from "@/lib/validators";
import type { ApiResponse, SearchResponse } from "@/types";
import { checkRateLimit } from "@/lib/rate-limit";

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// Zod schema for request validation
const searchRequestSchema = z.object({
  query: z
    .string()
    .min(
      SIZE_LIMITS.MIN_QUERY_LENGTH,
      `Query must be at least ${SIZE_LIMITS.MIN_QUERY_LENGTH} characters`,
    )
    .max(
      SIZE_LIMITS.MAX_QUERY_LENGTH,
      `Query must be less than ${SIZE_LIMITS.MAX_QUERY_LENGTH} characters`,
    )
    .transform((q) => q.trim().replace(/[<>{}]/g, "")), // Sanitize dangerous chars
});

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<SearchResponse>>> {
  try {
    // Check if database is configured
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SERVICE_UNAVAILABLE",
            message:
              "Database is not configured. Please set DATABASE_URL environment variable.",
          },
        },
        { status: 503 },
      );
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SERVICE_UNAVAILABLE",
            message: "Database connection failed.",
          },
        },
        { status: 503 },
      );
    }

    // Check rate limit
    const rateLimitResponse = await checkRateLimit<ApiResponse<SearchResponse>>(
      request,
      "search",
    );
    if (rateLimitResponse) return rateLimitResponse;

    // Parse and validate request body
    const body = await request.json();
    const parseResult = searchRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_QUERY",
            message: parseResult.error.issues[0]?.message ?? "Invalid query",
          },
        },
        { status: 400 },
      );
    }

    const { query } = parseResult.data;

    const normalized = normalizeQuery(query);

    // Check Redis cache first
    const cachedData = await getCached<ReturnType<typeof dbToComposition>>(
      cacheKeys.compositionByQuery(query),
    );
    if (cachedData) {
      return NextResponse.json({
        success: true,
        data: {
          composition: cachedData,
          cached: true,
        },
      });
    }

    // Check database
    const existing = await db.composition.findFirst({
      where: { queryNorm: normalized },
    });

    if (existing) {
      const composition = dbToComposition(existing);
      await setCache(
        cacheKeys.compositionByQuery(query),
        composition,
        CACHE_TTL.COMPOSITION_BY_QUERY,
      );
      return NextResponse.json({
        success: true,
        data: {
          composition,
          cached: true,
        },
      });
    }

    // Perform research
    const startTime = Date.now();
    const result = await researchComposition(query);

    // Save to database
    const record = await db.composition.create({
      data: {
        id: nanoid(),
        query,
        queryNorm: normalized,
        name: result.name,
        category: result.category,
        description: result.description,
        rootData: JSON.parse(JSON.stringify(result.root)),
        sourcesData: JSON.parse(JSON.stringify(result.sources)),
        confidence: result.confidence,
        researchedAt: new Date(),
      },
    });

    const composition = dbToComposition(record);
    await setCache(
      cacheKeys.compositionByQuery(query),
      composition,
      CACHE_TTL.COMPOSITION_BY_QUERY,
    );

    return NextResponse.json({
      success: true,
      data: {
        composition,
        cached: false,
        researchTime: Date.now() - startTime,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RESEARCH_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to research composition",
        },
      },
      { status: 500 },
    );
  }
}
