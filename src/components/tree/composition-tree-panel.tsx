"use client";

import { useCompositionStore } from "@/stores";
import { TreeNode } from "./tree-node";
import { cn } from "@/lib/utils";

interface CompositionTreePanelProps {
  className?: string;
}

export function CompositionTreePanel({ className }: CompositionTreePanelProps) {
  const composition = useCompositionStore((s) => s.composition);
  const expandAllTree = useCompositionStore((s) => s.expandAllTree);
  const collapseAllTree = useCompositionStore((s) => s.collapseAllTree);

  // Count nodes for display
  const nodeCount = composition ? countNodes(composition.root) : 0;

  if (!composition) {
    return (
      <div className={cn("flex flex-col h-full bg-bg-panel", className)}>
        <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle">
          <span className="font-mono text-xs text-text-secondary uppercase tracking-wider">
            Hierarchy
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <span className="font-mono text-xs text-text-secondary">
            No composition loaded
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-bg-panel", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle">
        <span className="font-mono text-xs text-text-secondary uppercase tracking-wider">
          Hierarchy
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={expandAllTree}
            className="p-1 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded transition-colors"
            title="Expand all"
          >
            <ExpandAllIcon />
          </button>
          <button
            onClick={collapseAllTree}
            className="p-1 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded transition-colors"
            title="Collapse all"
          >
            <CollapseAllIcon />
          </button>
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-auto p-2">
        <TreeNode node={composition.root} depth={0} />
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-border-subtle bg-bg-secondary">
        <span className="font-mono text-[10px] text-text-secondary">
          {nodeCount} nodes
        </span>
        <span className="font-mono text-[10px] text-text-secondary">
          {composition.confidence}
        </span>
      </div>
    </div>
  );
}

// Helper to count total nodes
function countNodes(node: { children?: unknown[] }): number {
  let count = 1;
  if (node.children) {
    for (const child of node.children as { children?: unknown[] }[]) {
      count += countNodes(child);
    }
  }
  return count;
}

// Icon components
function ExpandAllIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 5l4 4 4-4" />
      <path d="M3 9l4 4 4-4" opacity="0.5" />
    </svg>
  );
}

function CollapseAllIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 9l4-4 4 4" />
      <path d="M3 5l4-4 4 4" opacity="0.5" />
    </svg>
  );
}
