import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

interface RecentAnalysisItem {
  id: string;
  name: string;
  nodeCount: number;
  timestamp: string;
}

function countNodes(node: unknown): number {
  if (!node || typeof node !== "object") return 0;
  const n = node as { children?: unknown[] };
  let count = 1;
  if (Array.isArray(n.children)) {
    for (const child of n.children) {
      count += countNodes(child);
    }
  }
  return count;
}

export async function GET() {
  try {
    const db = await getDb();
    if (!db) {
      // Return empty list if DB not configured
      return NextResponse.json({
        success: true,
        compositions: [],
      });
    }

    const compositions = await db.composition.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        rootData: true,
        createdAt: true,
      },
    });

    const items: RecentAnalysisItem[] = compositions.map((comp) => ({
      id: comp.id,
      name: comp.name,
      nodeCount: countNodes(comp.rootData),
      timestamp: comp.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      compositions: items,
    });
  } catch (error) {
    console.error("Recent analyses error:", error);
    // Return empty list on error (e.g., no DB configured)
    return NextResponse.json({
      success: true,
      compositions: [],
    });
  }
}
