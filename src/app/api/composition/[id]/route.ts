import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCached, setCache, cacheKeys } from '@/lib/redis'
import { CACHE_TTL } from '@/lib/constants'
import { dbToComposition } from '@/lib/validators'
import type { ApiResponse, CompositionResponse } from '@/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<CompositionResponse>>> {
  try {
    const { id } = await params

    // Check cache
    const cached = await getCached<ReturnType<typeof dbToComposition>>(cacheKeys.compositionById(id))
    if (cached) {
      return NextResponse.json({
        success: true,
        data: { composition: cached },
      })
    }

    // Fetch from database
    const record = await db.composition.findUnique({
      where: { id },
    })

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Composition not found',
          },
        },
        { status: 404 }
      )
    }

    const composition = dbToComposition(record)

    // Cache first, then update view count async (fire and forget)
    // This prevents the race condition of caching stale view counts
    await setCache(cacheKeys.compositionById(id), composition, CACHE_TTL.COMPOSITION_BY_ID)

    // Update view count asynchronously - don't await
    db.composition
      .update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
      .catch((err) => console.error('Failed to increment view count:', err))

    return NextResponse.json({
      success: true,
      data: { composition },
    })
  } catch (error) {
    console.error('Fetch composition error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch composition',
        },
      },
      { status: 500 }
    )
  }
}
