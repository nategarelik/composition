import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { researchComposition } from '@/lib/agents'
import { db } from '@/lib/db'
import { getCached, setCache, cacheKeys } from '@/lib/redis'
import type { ApiResponse, SearchResponse, CompositionNode, Source, ConfidenceLevel } from '@/types'
import type { Composition as DbComposition } from '@prisma/client'

// Zod schema for request validation
const searchRequestSchema = z.object({
  query: z
    .string()
    .min(2, 'Query must be at least 2 characters')
    .max(200, 'Query must be less than 200 characters')
    .transform((q) => q.trim().replace(/[<>{}]/g, '')), // Sanitize dangerous chars
})

// Zod schema for database JSON fields
const compositionNodeSchema: z.ZodType<CompositionNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['product', 'component', 'material', 'chemical', 'element']),
    percentage: z.number(),
    confidence: z.enum(['verified', 'estimated', 'speculative']),
    description: z.string().optional(),
    symbol: z.string().optional(),
    atomicNumber: z.number().optional(),
    casNumber: z.string().optional(),
    children: z.array(compositionNodeSchema).optional(),
  })
)

const sourceSchema: z.ZodType<Source> = z.object({
  id: z.string(),
  type: z.enum(['official', 'scientific', 'database', 'calculated', 'estimated']),
  name: z.string(),
  url: z.string().optional(),
  accessedAt: z.string(),
  confidence: z.enum(['verified', 'estimated', 'speculative']),
  notes: z.string().optional(),
})

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, '-')
}

function dbToComposition(record: DbComposition) {
  // Parse and validate JSON fields
  const root = compositionNodeSchema.parse(record.rootData)
  const sources = z.array(sourceSchema).parse(record.sourcesData)

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
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<SearchResponse>>> {
  try {
    // Parse and validate request body
    const body = await request.json()
    const parseResult = searchRequestSchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_QUERY',
            message: parseResult.error.errors[0]?.message ?? 'Invalid query',
          },
        },
        { status: 400 }
      )
    }

    const { query } = parseResult.data

    const normalized = normalizeQuery(query)

    // Check Redis cache first
    const cachedData = await getCached<ReturnType<typeof dbToComposition>>(cacheKeys.compositionByQuery(query))
    if (cachedData) {
      return NextResponse.json({
        success: true,
        data: {
          composition: cachedData,
          cached: true,
        },
      })
    }

    // Check database
    const existing = await db.composition.findFirst({
      where: { queryNorm: normalized },
    })

    if (existing) {
      const composition = dbToComposition(existing)
      await setCache(cacheKeys.compositionByQuery(query), composition, 3600)
      return NextResponse.json({
        success: true,
        data: {
          composition,
          cached: true,
        },
      })
    }

    // Perform research
    const startTime = Date.now()
    const result = await researchComposition(query)

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
    })

    const composition = dbToComposition(record)
    await setCache(cacheKeys.compositionByQuery(query), composition, 3600)

    return NextResponse.json({
      success: true,
      data: {
        composition,
        cached: false,
        researchTime: Date.now() - startTime,
      },
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RESEARCH_ERROR',
          message: error instanceof Error ? error.message : 'Failed to research composition',
        },
      },
      { status: 500 }
    )
  }
}
