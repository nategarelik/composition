'use client';
import { useCompositionStore } from '@/stores';
import { LayoutNode } from '@/hooks/use-radial-layout';

const NODE_COLORS: Record<string, string> = {
  product: '#3b9eff',
  component: '#8b5cf6',
  material: '#f59e0b',
  chemical: '#10b981',
  element: '#ef4444',
};

const NODE_SIZES: Record<string, number> = {
  product: 30,
  component: 24,
  material: 20,
  chemical: 16,
  element: 12,
};

interface RadialNodeProps {
  layoutNode: LayoutNode;
}

export function RadialNode({ layoutNode }: RadialNodeProps) {
  const { node, x, y, path } = layoutNode;

  const selectedNode = useCompositionStore((s) => s.selectedNode);
  const selectNode = useCompositionStore((s) => s.selectNode);
  const setHoveredNode = useCompositionStore((s) => s.setHoveredNode);
  const toggleExpandedPath = useCompositionStore((s) => s.toggleExpandedPath);

  // Use the tree path from layout for expansion tracking
  const isSelected = selectedNode?.id === node.id;

  const color = NODE_COLORS[node.type] || '#888888';
  const size = NODE_SIZES[node.type] || 16;
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = () => {
    selectNode(node);
  };

  const handleDoubleClick = () => {
    if (hasChildren) {
      toggleExpandedPath(path);
    }
  };

  const handleMouseEnter = () => {
    setHoveredNode(node);
  };

  const handleMouseLeave = () => {
    setHoveredNode(null);
  };

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'pointer' }}
    >
      {/* Glow effect for selected */}
      {isSelected && (
        <circle
          r={size + 8}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.4"
        />
      )}

      {/* Main circle */}
      <circle
        r={size}
        fill="var(--theme-bg-secondary)"
        stroke={color}
        strokeWidth={isSelected ? 3 : 2}
      />

      {/* Inner fill based on percentage */}
      {node.percentage !== undefined && (
        <circle
          r={size * 0.7}
          fill={color}
          opacity={node.percentage / 100}
        />
      )}

      {/* Node label */}
      <text
        y={size + 14}
        textAnchor="middle"
        fill="var(--theme-text-primary)"
        fontSize="11"
        fontFamily="ui-monospace, monospace"
      >
        {node.name.length > 12 ? node.name.slice(0, 10) + '...' : node.name}
      </text>

      {/* Percentage label */}
      {node.percentage !== undefined && (
        <text
          y={size + 26}
          textAnchor="middle"
          fill="var(--theme-text-mono)"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
        >
          {node.percentage.toFixed(1)}%
        </text>
      )}

      {/* Expand indicator */}
      {hasChildren && (
        <circle
          cx={size * 0.7}
          cy={-size * 0.7}
          r="6"
          fill="var(--theme-bg-tertiary)"
          stroke={color}
          strokeWidth="1"
        />
      )}
    </g>
  );
}
