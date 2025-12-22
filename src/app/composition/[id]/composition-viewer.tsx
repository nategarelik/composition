"use client";

import { useEffect } from "react";
import { useCompositionStore } from "@/stores";
import { WorkstationLayout } from "@/components/workstation/workstation-layout";
import { TreePanel } from "@/components/panels/tree-panel";
import { DetailPanel } from "@/components/panels/detail-panel";
import { BlueprintCanvas } from "@/components/canvas/blueprint-canvas";
import type { Composition } from "@/types";

interface CompositionViewerClientProps {
  composition: Composition;
}

export function CompositionViewerClient({
  composition,
}: CompositionViewerClientProps) {
  const setComposition = useCompositionStore((s) => s.setComposition);

  useEffect(() => {
    setComposition(composition);
  }, [composition, setComposition]);

  return (
    <WorkstationLayout
      treePanel={<TreePanel />}
      canvas={<BlueprintCanvas />}
      detailPanel={<DetailPanel />}
    />
  );
}
