'use client';

import { useCompositionStore } from '@/stores';
import type { CompositionNode } from '@/types/composition';

const NODE_ICONS: Record<string, string> = {
  product: '▣',
  component: '⚙',
  material: '◆',
  chemical: '⬡',
  element: '⚛',
};

const NODE_COLORS: Record<string, string> = {
  product: '#3b9eff',
  component: '#8b5cf6',
  material: '#f59e0b',
  chemical: '#10b981',
  element: '#ef4444',
};

interface TreeNodeRowProps {
  node: CompositionNode;
  depth: number;
  searchQuery?: string;
}

export function TreeNodeRow({ node, depth, searchQuery }: TreeNodeRowProps) {
  const selectedNode = useCompositionStore((s) => s.selectedNode);
  const selectNode = useCompositionStore((s) => s.selectNode);
  const treeExpandedNodes = useCompositionStore((s) => s.treeExpandedNodes);
  const toggleTreeNode = useCompositionStore((s) => s.toggleTreeNode);

  const isSelected = selectedNode?.id === node.id;
  const isExpanded = treeExpandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  // Highlight search matches
  const matchesSearch = searchQuery &&
    node.name.toLowerCase().includes(searchQuery.toLowerCase());

  const handleClick = () => {
    selectNode(node);
  };

  const handleDoubleClick = () => {
    if (hasChildren) {
      toggleTreeNode(node.id);
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTreeNode(node.id);
  };

  const getConfidenceColor = () => {
    switch (node.confidence) {
      case 'verified':
        return 'var(--theme-confidence-verified)';
      case 'estimated':
        return 'var(--theme-confidence-estimated)';
      case 'speculative':
        return 'var(--theme-confidence-speculative)';
      default:
        return 'var(--theme-text-secondary)';
    }
  };

  return (
    <>
      <div
        className="flex items-center gap-2 px-2 py-1.5 cursor-pointer transition-colors"
        style={{
          paddingLeft: `${depth * 16 + 8}px`,
          backgroundColor: isSelected
            ? 'var(--theme-accent-primary)20'
            : 'transparent',
          borderLeft: matchesSearch
            ? '2px solid var(--theme-accent-primary)'
            : '2px solid transparent',
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor =
              'var(--theme-bg-tertiary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        {/* Expand arrow */}
        <button
          onClick={handleExpandClick}
          className="w-4 h-4 flex items-center justify-center text-xs transition-transform duration-150"
          style={{
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            color: 'var(--theme-text-secondary)',
            visibility: hasChildren ? 'visible' : 'hidden',
          }}
        >
          ▶
        </button>

        {/* Type icon */}
        <span
          style={{
            color: NODE_COLORS[node.type] || 'var(--theme-text-primary)',
          }}
        >
          {NODE_ICONS[node.type] || '○'}
        </span>

        {/* Name */}
        <span
          className="flex-1 truncate text-sm"
          style={{ color: 'var(--theme-text-primary)' }}
        >
          {node.name}
        </span>

        {/* Percentage */}
        {node.percentage !== undefined && (
          <span
            className="text-xs font-mono"
            style={{ color: 'var(--theme-text-mono)' }}
          >
            {node.percentage.toFixed(1)}%
          </span>
        )}

        {/* Confidence dot */}
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: getConfidenceColor() }}
          title={node.confidence || 'unknown'}
        />
      </div>

      {/* Children - render when expanded */}
      {isExpanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </>
  );
}
