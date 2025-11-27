import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { db } from '@/lib/db'
import type { ApiResponse, ShareResponse } from '@/types'

interface ShareRequestBody {
  compositionId: string
  depthLevel?: number
  viewMode?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<ShareResponse>>> {
  try {
    const body = await request.json() as ShareRequestBody
    const { compositionId, depthLevel = 4, viewMode = 'exploded' } = body

    if (!compositionId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'compositionId is required',
          },
        },
        { status: 400 }
      )
    }

    // Verify composition exists
    const composition = await db.composition.findUnique({
      where: { id: compositionId },
    })

    if (!composition) {
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

    // Create share link
    const shortCode = nanoid(8)
    await db.share.create({
      data: {
        shortCode,
        compositionId,
        depthLevel,
        viewMode,
      },
    })

    // Update share count
    await db.composition.update({
      where: { id: compositionId },
      data: { shareCount: { increment: 1 } },
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    return NextResponse.json({
      success: true,
      data: {
        shortCode,
        url: `${appUrl}/s/${shortCode}`,
        compositionId,
        depthLevel,
        viewMode,
      },
    })
  } catch (error) {
    console.error('Create share error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SHARE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create share link',
        },
      },
      { status: 500 }
    )
  }
}
