'use client';
import { CompositionNode } from '@/types/composition';

interface NodeTooltipProps {
  node: CompositionNode;
  x: number;
  y: number;
  containerWidth: number;
  containerHeight: number;
}

const CONFIDENCE_LABELS: Record<string, string> = {
  verified: 'Verified',
  estimated: 'Estimated',
  speculative: 'Speculative',
};

const CONFIDENCE_COLORS: Record<string, string> = {
  verified: 'var(--theme-confidence-verified)',
  estimated: 'var(--theme-confidence-estimated)',
  speculative: 'var(--theme-confidence-speculative)',
};

export function NodeTooltip({ node, x, y, containerWidth, containerHeight }: NodeTooltipProps) {
  // Tooltip dimensions (approximate)
  const tooltipWidth = 200;
  const tooltipHeight = 100;
  const offset = 15;

  // Calculate position to keep tooltip in view
  let tooltipX = x + offset;
  let tooltipY = y + offset;

  // Flip horizontally if too close to right edge
  if (tooltipX + tooltipWidth > containerWidth) {
    tooltipX = x - tooltipWidth - offset;
  }

  // Flip vertically if too close to bottom edge
  if (tooltipY + tooltipHeight > containerHeight) {
    tooltipY = y - tooltipHeight - offset;
  }

  // Ensure tooltip stays in bounds
  tooltipX = Math.max(10, Math.min(tooltipX, containerWidth - tooltipWidth - 10));
  tooltipY = Math.max(10, Math.min(tooltipY, containerHeight - tooltipHeight - 10));

  return (
    <g
      style={{
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {/* Tooltip background */}
      <rect
        x={tooltipX}
        y={tooltipY}
        width={tooltipWidth}
        height="auto"
        rx="4"
        fill="var(--theme-bg-secondary)"
        stroke="var(--theme-border)"
        strokeWidth="1"
        opacity="0.95"
      />

      {/* Content */}
      <foreignObject
        x={tooltipX}
        y={tooltipY}
        width={tooltipWidth}
        height={tooltipHeight}
      >
        <div
          className="p-3 text-xs font-mono"
          style={{ color: 'var(--theme-text-primary)' }}
        >
          {/* Name */}
          <div className="font-semibold mb-2 truncate" title={node.name}>
            {node.name}
          </div>

          {/* Type */}
          <div className="flex items-center gap-2 mb-1">
            <span style={{ color: 'var(--theme-text-secondary)' }}>Type:</span>
            <span className="capitalize">{node.type}</span>
          </div>

          {/* Percentage */}
          {node.percentage !== undefined && (
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: 'var(--theme-text-secondary)' }}>Amount:</span>
              <span style={{ color: 'var(--theme-text-mono)' }}>
                {node.percentage.toFixed(2)}%
              </span>
            </div>
          )}

          {/* Confidence */}
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--theme-text-secondary)' }}>Confidence:</span>
            <div className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: CONFIDENCE_COLORS[node.confidence] || 'var(--theme-text-secondary)',
                }}
              />
              <span>{CONFIDENCE_LABELS[node.confidence] || 'Unknown'}</span>
            </div>
          </div>

          {/* Symbol for elements */}
          {node.symbol && (
            <div className="flex items-center gap-2 mt-1">
              <span style={{ color: 'var(--theme-text-secondary)' }}>Symbol:</span>
              <span className="font-bold">{node.symbol}</span>
              {node.atomicNumber && (
                <span style={{ color: 'var(--theme-text-secondary)' }}>
                  (#{node.atomicNumber})
                </span>
              )}
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  );
}
