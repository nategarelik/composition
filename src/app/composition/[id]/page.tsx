import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CompositionViewerClient } from "./composition-viewer";
import type { Composition as DbComposition } from "@prisma/client";
import type { Composition, CompositionNode, Source } from "@/types";

// Force dynamic rendering to avoid SSG issues
export const dynamic = "force-dynamic";

function dbToComposition(record: DbComposition): Composition {
  return {
    id: record.id,
    query: record.query,
    name: record.name,
    category: record.category,
    description: record.description ?? undefined,
    root: record.rootData as unknown as CompositionNode,
    sources: record.sourcesData as unknown as Source[],
    confidence: record.confidence as "verified" | "estimated" | "speculative",
    researchedAt: record.researchedAt.toISOString(),
    viewCount: record.viewCount,
    shareCount: record.shareCount,
  };
}

interface CompositionPageProps {
  params: Promise<{ id: string }>;
}

export default async function CompositionPage({
  params,
}: CompositionPageProps) {
  const { id } = await params;

  const record = await db.composition.findUnique({
    where: { id },
  });

  if (!record) {
    notFound();
  }

  const composition = dbToComposition(record);

  return <CompositionViewerClient composition={composition} />;
}

export async function generateMetadata({ params }: CompositionPageProps) {
  const { id } = await params;
  const record = await db.composition.findUnique({
    where: { id },
    select: { name: true, description: true },
  });

  if (!record) {
    return { title: "Composition Not Found" };
  }

  return {
    title: `${record.name} - Composition`,
    description:
      record.description ?? `Discover what ${record.name} is made of`,
  };
}
