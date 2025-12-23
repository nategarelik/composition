'use client';
import { useRef, useState, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useCompositionStore } from '@/stores';
import { useUIStore } from '@/stores/ui-store';
import { useRadialLayout } from '@/hooks/use-radial-layout';
import { RadialNode } from './radial-node';
import { ConnectionLine } from './connection-line';
import { NodeTooltip } from './node-tooltip';

export interface BlueprintCanvasRef {
  fitToView: () => void;
  resetView: () => void;
}

export const BlueprintCanvas = forwardRef<BlueprintCanvasRef, Record<string, never>>(
  function BlueprintCanvas(_, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const composition = useCompositionStore((s) => s.composition);
  const expandedPaths = useCompositionStore((s) => s.expandedPaths);
  const hoveredNode = useCompositionStore((s) => s.hoveredNode);
  const transform = useUIStore((s) => s.canvasTransform);
  const setCanvasTransform = useUIStore((s) => s.setCanvasTransform);
  const visibleLayers = useUIStore((s) => s.visibleLayers);
  const registerFitToView = useUIStore((s) => s.registerFitToView);

  const layoutNodes = useRadialLayout(
    composition?.root || null,
    expandedPaths,
    dimensions.width,
    dimensions.height
  );

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Zoom handler - use native event to support non-passive listener
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(transform.scale * delta, 0.1), 5);
    setCanvasTransform({ ...transform, scale: newScale });
  }, [transform, setCanvasTransform]);

  // Attach wheel listener with passive: false to allow preventDefault
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.addEventListener('wheel', handleWheel, { passive: false });
    return () => svg.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || e.ctrlKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setCanvasTransform({
        ...transform,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  }, [isPanning, panStart, transform, setCanvasTransform]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Filter nodes by visible layers
  const visibleNodes = layoutNodes.filter((ln) => visibleLayers.has(ln.node.type));

  // Fit to view function
  const fitToView = useCallback(() => {
    if (visibleNodes.length === 0) return;

    // Calculate bounding box of all visible nodes
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    visibleNodes.forEach((ln) => {
      minX = Math.min(minX, ln.x);
      maxX = Math.max(maxX, ln.x);
      minY = Math.min(minY, ln.y);
      maxY = Math.max(maxY, ln.y);
    });

    // Add padding
    const padding = 100;
    const contentWidth = maxX - minX + padding * 2;
    const contentHeight = maxY - minY + padding * 2;

    // Calculate scale to fit
    const scaleX = dimensions.width / contentWidth;
    const scaleY = dimensions.height / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 1x

    // Calculate center position
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Calculate translation to center the content
    const x = dimensions.width / 2 - centerX * scale;
    const y = dimensions.height / 2 - centerY * scale;

    setCanvasTransform({ x, y, scale });
  }, [visibleNodes, dimensions, setCanvasTransform]);

  // Reset view to default
  const resetView = useCallback(() => {
    setCanvasTransform({ x: 0, y: 0, scale: 1 });
  }, [setCanvasTransform]);

  // Expose functions via ref
  useImperativeHandle(ref, () => ({
    fitToView,
    resetView,
  }), [fitToView, resetView]);

  // Register fit-to-view with UI store
  useEffect(() => {
    registerFitToView(fitToView);
    return () => registerFitToView(() => {});
  }, [fitToView, registerFitToView]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden"
      style={{ backgroundColor: 'var(--theme-bg-primary)' }}
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        {/* Grid pattern */}
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="var(--theme-border)"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Transform group */}
        <g
          transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
        >
          {/* Connection lines (render first, below nodes) */}
          {visibleNodes.map(
            (ln) =>
              ln.parentX !== undefined &&
              ln.parentY !== undefined && (
                <ConnectionLine
                  key={`line-${ln.id}`}
                  x1={ln.parentX}
                  y1={ln.parentY}
                  x2={ln.x}
                  y2={ln.y}
                  percentage={ln.node.percentage}
                  confidence={ln.node.confidence}
                />
              )
          )}

          {/* Nodes */}
          {visibleNodes.map((ln) => (
            <RadialNode key={ln.id} layoutNode={ln} />
          ))}

          {/* Tooltip for hovered node */}
          {hoveredNode && (() => {
            const hoveredLayout = visibleNodes.find((ln) => ln.node.id === hoveredNode.id);
            if (!hoveredLayout) return null;

            return (
              <NodeTooltip
                node={hoveredNode}
                x={hoveredLayout.x}
                y={hoveredLayout.y}
                containerWidth={dimensions.width / transform.scale}
                containerHeight={dimensions.height / transform.scale}
              />
            );
          })()}
        </g>

        {/* Empty state */}
        {visibleNodes.length === 0 && (
          <text
            x={dimensions.width / 2}
            y={dimensions.height / 2}
            textAnchor="middle"
            fill="var(--theme-text-secondary)"
            fontSize="14"
          >
            {layoutNodes.length === 0
              ? 'No composition loaded. Search for something to analyze.'
              : 'No visible layers. Toggle layers in the toolbar.'}
          </text>
        )}
      </svg>
    </div>
  );
});
