import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { researchComposition } from '@/lib/agents'
import { db } from '@/lib/db'
import { getCached, setCache, cacheKeys } from '@/lib/redis'
import type { ApiResponse, SearchResponse } from '@/types'
import type { Composition as DbComposition } from '@prisma/client'

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, '-')
}

function dbToComposition(record: DbComposition) {
  return {
    id: record.id,
    query: record.query,
    name: record.name,
    category: record.category,
    description: record.description ?? undefined,
    root: record.rootData as ReturnType<typeof JSON.parse>,
    sources: record.sourcesData as ReturnType<typeof JSON.parse>,
    confidence: record.confidence as 'verified' | 'estimated' | 'speculative',
    researchedAt: record.researchedAt.toISOString(),
    viewCount: record.viewCount,
    shareCount: record.shareCount,
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<SearchResponse>>> {
  try {
    const body = await request.json() as { query?: string }
    const { query } = body

    // Validate
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_QUERY',
            message: 'Query must be at least 2 characters',
          },
        },
        { status: 400 }
      )
    }

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
