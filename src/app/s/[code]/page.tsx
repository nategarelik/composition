import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";

// Force dynamic rendering to avoid SSG issues
export const dynamic = "force-dynamic";

interface SharePageProps {
  params: Promise<{ code: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { code } = await params;

  const share = await db.share.findUnique({
    where: { shortCode: code },
  });

  if (!share) {
    notFound();
  }

  // Update view count
  await db.share.update({
    where: { id: share.id },
    data: { viewCount: { increment: 1 } },
  });

  // Redirect to composition page with share settings
  redirect(
    `/composition/${share.compositionId}?depth=${share.depthLevel}&mode=${share.viewMode}`,
  );
}

export async function generateMetadata({ params }: SharePageProps) {
  const { code } = await params;

  const share = await db.share.findUnique({
    where: { shortCode: code },
    include: {
      composition: {
        select: { name: true, description: true },
      },
    },
  });

  if (!share) {
    return { title: "Share Not Found" };
  }

  return {
    title: `${share.composition.name} - Shared Composition`,
    description:
      share.composition.description ??
      `Discover what ${share.composition.name} is made of`,
  };
}
