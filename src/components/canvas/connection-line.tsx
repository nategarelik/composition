'use client';

interface ConnectionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  percentage?: number;
  confidence?: 'verified' | 'estimated' | 'speculative';
}

const CONFIDENCE_DASH: Record<string, string> = {
  verified: 'none',
  estimated: '5,3',
  speculative: '2,4',
};

export function ConnectionLine({
  x1,
  y1,
  x2,
  y2,
  percentage = 50,
  confidence = 'estimated',
}: ConnectionLineProps) {
  // Calculate stroke width based on percentage (1-6px range)
  const strokeWidth = Math.max(1, Math.min(6, percentage / 15));

  // Get dash pattern based on confidence
  const dashArray = CONFIDENCE_DASH[confidence] || CONFIDENCE_DASH.estimated;

  // Calculate curved path (quadratic bezier)
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Offset the control point perpendicular to the line
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);

  // Curve amount proportional to distance
  const curveOffset = len * 0.1;
  const cx = midX - (dy / len) * curveOffset;
  const cy = midY + (dx / len) * curveOffset;

  const pathD = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

  return (
    <g>
      {/* Shadow/glow effect */}
      <path
        d={pathD}
        fill="none"
        stroke="var(--theme-accent-primary)"
        strokeWidth={strokeWidth + 2}
        strokeLinecap="round"
        opacity="0.1"
      />

      {/* Main line */}
      <path
        d={pathD}
        fill="none"
        stroke="var(--theme-border)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dashArray}
      />

      {/* Animated flow indicator for high-percentage connections */}
      {percentage > 30 && (
        <circle r="3" fill="var(--theme-accent-primary)" opacity="0.6">
          <animateMotion
            dur={`${3 - percentage / 50}s`}
            repeatCount="indefinite"
            path={pathD}
          />
        </circle>
      )}
    </g>
  );
}
