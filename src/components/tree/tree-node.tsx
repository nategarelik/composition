"use client";

import { useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CompositionNode } from "@/types";
import { useCompositionStore } from "@/stores";
import { cn } from "@/lib/utils";

interface TreeNodeProps {
  node: CompositionNode;
  depth: number;
}

// Animation variants for tree expand/collapse
const childrenVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1] as const, // easeInOut bezier curve
    },
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

// Type-specific colors matching the design system
const TYPE_COLORS: Record<string, string> = {
  product: "text-layer-product",
  component: "text-layer-component",
  material: "text-layer-material",
  chemical: "text-layer-chemical",
  element: "text-layer-element",
};

// Background colors available for future use
// const TYPE_BG_COLORS: Record<string, string> = {
//   product: 'bg-layer-product/10',
//   component: 'bg-layer-component/10',
//   material: 'bg-layer-material/10',
//   chemical: 'bg-layer-chemical/10',
//   element: 'bg-layer-element/10',
// }

const TYPE_ICONS: Record<string, string> = {
  product: "◆",
  component: "◇",
  material: "○",
  chemical: "⬡",
  element: "●",
};

export function TreeNode({ node, depth }: TreeNodeProps) {
  const selectedNode = useCompositionStore((s) => s.selectedNode);
  const hoveredNode = useCompositionStore((s) => s.hoveredNode);
  const treeExpandedNodes = useCompositionStore((s) => s.treeExpandedNodes);
  const selectNode = useCompositionStore((s) => s.selectNode);
  const setHoveredNode = useCompositionStore((s) => s.setHoveredNode);
  const toggleTreeNode = useCompositionStore((s) => s.toggleTreeNode);
  const toggleNodeExpansion = useCompositionStore((s) => s.toggleNodeExpansion);
  const setFocusedNode = useCompositionStore((s) => s.setFocusedNode);

  const isSelected = selectedNode?.id === node.id;
  const isHovered = hoveredNode?.id === node.id;
  const isExpanded = treeExpandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      selectNode(node);
    },
    [node, selectNode],
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // Double-click: Focus camera on node and toggle 3D expansion
      setFocusedNode(node.id);
      if (hasChildren) {
        toggleNodeExpansion(node.id);
      }
    },
    [node.id, hasChildren, setFocusedNode, toggleNodeExpansion],
  );

  const handleToggleExpand = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleTreeNode(node.id);
    },
    [node.id, toggleTreeNode],
  );

  const handleMouseEnter = useCallback(() => {
    setHoveredNode(node);
  }, [node, setHoveredNode]);

  const handleMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, [setHoveredNode]);

  // Memoize confidence indicator
  const confidenceIndicator = useMemo(() => {
    switch (node.confidence) {
      case "verified":
        return (
          <span className="text-accent-secondary" title="Verified">
            ●
          </span>
        );
      case "estimated":
        return (
          <span className="text-accent-warning" title="Estimated">
            ●
          </span>
        );
      case "speculative":
        return (
          <span className="text-accent-danger" title="Speculative">
            ●
          </span>
        );
      default:
        return null;
    }
  }, [node.confidence]);

  return (
    <div className="select-none">
      {/* Node Row */}
      <div
        className={cn(
          "flex items-center gap-1 px-1 py-0.5 rounded cursor-pointer transition-colors",
          "hover:bg-bg-tertiary",
          isSelected && "bg-accent-primary/20 hover:bg-accent-primary/25",
          isHovered && !isSelected && "bg-bg-tertiary",
        )}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Expand/Collapse Toggle */}
        {hasChildren ? (
          <button
            onClick={handleToggleExpand}
            className="flex items-center justify-center w-4 h-4 text-text-secondary hover:text-text-primary"
          >
            <ChevronIcon isExpanded={isExpanded} />
          </button>
        ) : (
          <span className="w-4 h-4" />
        )}

        {/* Type Icon */}
        <span
          className={cn(
            "text-xs",
            TYPE_COLORS[node.type] || "text-text-secondary",
          )}
        >
          {TYPE_ICONS[node.type] || "○"}
        </span>

        {/* Node Name */}
        <span
          className={cn(
            "flex-1 font-mono text-xs truncate",
            isSelected ? "text-text-primary font-medium" : "text-text-primary",
          )}
        >
          {node.name}
        </span>

        {/* Percentage */}
        {node.percentage !== undefined && (
          <span className="font-mono text-[10px] text-text-secondary tabular-nums">
            {formatPercentage(node.percentage)}
          </span>
        )}

        {/* Confidence Indicator */}
        <span className="text-[8px]">{confidenceIndicator}</span>
      </div>

      {/* Children with animation */}
      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.div
            key="children"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={childrenVariants}
            className="relative overflow-hidden"
          >
            {/* Vertical line connecting children */}
            <div
              className="absolute left-0 top-0 bottom-0 border-l border-border-subtle"
              style={{ marginLeft: `${depth * 12 + 11}px` }}
            />
            {node.children!.map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Chevron icon component with framer-motion animation
function ChevronIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <motion.svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      animate={{ rotate: isExpanded ? 90 : 0 }}
      transition={{ duration: 0.15, ease: "easeInOut" }}
    >
      <path d="M3 2l4 3-4 3" />
    </motion.svg>
  );
}

// Format percentage for display
function formatPercentage(value: number): string {
  if (value >= 10) {
    return `${Math.round(value)}%`;
  } else if (value >= 1) {
    return `${value.toFixed(1)}%`;
  } else if (value >= 0.1) {
    return `${value.toFixed(2)}%`;
  } else {
    return "<0.1%";
  }
}
