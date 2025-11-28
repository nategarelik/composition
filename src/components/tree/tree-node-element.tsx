"use client";

import type { CompositionNode } from "@/types";
import { cn } from "@/lib/utils";

interface TreeNodeElementProps {
  node: CompositionNode;
  isSelected: boolean;
  isHovered: boolean;
}

// Element-specific display with atomic information
export function TreeNodeElement({
  node,
  isSelected,
  isHovered,
}: TreeNodeElementProps) {
  // Elements have metadata with atomic number, symbol, etc.
  const atomicSymbol = node.metadata?.symbol as string | undefined;
  const atomicNumber = node.metadata?.atomicNumber as number | undefined;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1 rounded",
        isSelected && "ring-1 ring-layer-element/50",
        isHovered && "bg-layer-element/5",
      )}
    >
      {/* Atomic Badge */}
      <div className="flex flex-col items-center justify-center w-8 h-8 bg-layer-element/20 rounded text-layer-element">
        {atomicNumber && (
          <span className="text-[8px] font-mono leading-none">
            {atomicNumber}
          </span>
        )}
        <span className="text-xs font-bold font-mono leading-none">
          {atomicSymbol || node.name.slice(0, 2)}
        </span>
      </div>

      {/* Element Name */}
      <div className="flex-1 min-w-0">
        <div className="font-mono text-xs text-text-primary truncate">
          {node.name}
        </div>
        {typeof node.metadata?.category === "string" && (
          <div className="font-mono text-[10px] text-text-secondary truncate">
            {node.metadata.category}
          </div>
        )}
      </div>

      {/* Percentage */}
      <div className="font-mono text-xs text-layer-element tabular-nums">
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
