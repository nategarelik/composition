"use client";

import { useCompositionStore } from "@/stores";

export function NodeTooltip() {
  const hoveredNode = useCompositionStore((s) => s.hoveredNode);

  if (!hoveredNode) return null;

  return (
    <div className="absolute top-4 left-4 pointer-events-none z-10">
      <div className="px-4 py-3 bg-black/90 backdrop-blur-sm rounded-lg text-white border border-gray-700 shadow-xl">
        <div className="font-semibold text-lg">{hoveredNode.name}</div>
        <div className="text-gray-400 text-sm mt-1">
          {hoveredNode.percentage.toFixed(1)}% - {hoveredNode.type}
        </div>
        {hoveredNode.symbol && (
          <div className="text-blue-400 text-sm mt-2">
            Element: {hoveredNode.symbol}
          </div>
        )}
        {hoveredNode.description && (
          <div className="text-gray-500 text-xs mt-2 max-w-xs">
            {hoveredNode.description}
          </div>
        )}
      </div>
    </div>
  );
}
