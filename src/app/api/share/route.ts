import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import type { ApiResponse, ShareResponse } from "@/types";
import { checkRateLimit } from "@/lib/rate-limit";

// Zod schema for request validation
const shareRequestSchema = z.object({
  compositionId: z.string().min(1, "compositionId is required").max(50),
  depthLevel: z.number().int().min(1).max(10).default(4),
  viewMode: z.enum(["exploded", "compact", "slice"]).default("exploded"),
});

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<ShareResponse>>> {
  try {
    // Check if database is configured
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SERVICE_UNAVAILABLE",
            message: "Database is not configured.",
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
    const rateLimitResponse = await checkRateLimit<ApiResponse<ShareResponse>>(
      request,
      "share",
    );
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();
    const parseResult = shareRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: parseResult.error.issues[0]?.message ?? "Invalid request",
          },
        },
        { status: 400 },
      );
    }

    const { compositionId, depthLevel, viewMode } = parseResult.data;

    // Verify composition exists
    const composition = await db.composition.findUnique({
      where: { id: compositionId },
    });

    if (!composition) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Composition not found",
          },
        },
        { status: 404 },
      );
    }

    // Create share link
    const shortCode = nanoid(8);
    await db.share.create({
      data: {
        shortCode,
        compositionId,
        depthLevel,
        viewMode,
      },
    });

    // Update share count
    await db.composition.update({
      where: { id: compositionId },
      data: { shareCount: { increment: 1 } },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    return NextResponse.json({
      success: true,
      data: {
        shortCode,
        url: `${appUrl}/s/${shortCode}`,
        compositionId,
        depthLevel,
        viewMode,
      },
    });
  } catch (error) {
    console.error("Create share error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SHARE_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to create share link",
        },
      },
      { status: 500 },
    );
  }
}
