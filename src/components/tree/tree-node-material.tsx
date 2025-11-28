"use client";

import type { CompositionNode } from "@/types";
import { cn } from "@/lib/utils";

interface TreeNodeMaterialProps {
  node: CompositionNode;
  isSelected: boolean;
  isHovered: boolean;
}

// Material-specific display with material properties
export function TreeNodeMaterial({
  node,
  isSelected,
  isHovered,
}: TreeNodeMaterialProps) {
  const materialType = node.metadata?.materialType as string | undefined;
  const source = node.metadata?.source as string | undefined;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1 rounded",
        isSelected && "ring-1 ring-layer-material/50",
        isHovered && "bg-layer-material/5",
      )}
    >
      {/* Material Icon */}
      <div className="flex items-center justify-center w-6 h-6">
        <span className="text-base text-layer-material">○</span>
      </div>

      {/* Material Info */}
      <div className="flex-1 min-w-0">
        <div className="font-mono text-xs text-text-primary truncate">
          {node.name}
        </div>
        {materialType && (
          <div className="font-mono text-[10px] text-layer-material truncate capitalize">
            {materialType}
          </div>
        )}
        {source && (
          <div className="font-mono text-[9px] text-text-secondary truncate">
            Source: {source}
          </div>
        )}
      </div>

      {/* Percentage */}
      <div className="font-mono text-xs text-layer-material tabular-nums">
        {formatPercentage(node.percentage)}
      </div>
    </div>
  );
}

function formatPercentage(value: number): string {
  if (value >= 10) return `${Math.round(value)}%`;
  if (value >= 1) return `${value.toFixed(1)}%`;
  if (value >= 0.1) return `${value.toFixed(2)}%`;
  return "<0.1%";
}
