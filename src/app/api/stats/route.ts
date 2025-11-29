import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let cacheItems = 0;
    let dbCompositions = 0;
    let redisConnected = false;
    let dbConnected = false;

    // Check Redis connection and get key count
    if (redis) {
      try {
        // Use DBSIZE to get approximate key count
        const dbSize = await redis.dbsize();
        cacheItems = dbSize;
        redisConnected = true;
      } catch (error) {
        console.error("Redis stats error:", error);
      }
    }

    // Check DB connection and get composition count
    try {
      dbCompositions = await db.composition.count();
      dbConnected = true;
    } catch (error) {
      console.error("DB stats error:", error);
    }

    return NextResponse.json({
      cacheItems,
      compositions: dbCompositions,
      redis: redisConnected,
      database: dbConnected,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        cacheItems: 0,
        compositions: 0,
        redis: false,
        database: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
