"use client";

/**
 * Properties Panel Component - Right panel showing selected node data
 */

import { cn } from "@/lib/utils";
import type { CompositionNode } from "@/types/composition";

interface DataReadoutProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
}

function DataReadout({ label, value, unit, color }: DataReadoutProps) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-[var(--border-subtle)]/50 last:border-0">
      <span className="font-mono text-xs text-[var(--text-secondary)]">
        {label}
      </span>
      <span
        className="font-mono text-xs tabular-nums"
        style={{ color: color || "var(--text-mono)" }}
      >
        {value}
        {unit && (
          <span className="text-[var(--text-secondary)] ml-1">{unit}</span>
        )}
      </span>
    </div>
  );
}

interface ConfidenceBadgeProps {
  level: "verified" | "estimated" | "speculative";
}

function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  const config = {
    verified: {
      label: "Verified",
      color: "var(--confidence-verified)",
      icon: "✓",
    },
    estimated: {
      label: "Estimated",
      color: "var(--confidence-estimated)",
      icon: "≈",
    },
    speculative: {
      label: "Speculative",
      color: "var(--confidence-speculative)",
      icon: "?",
    },
  };

  const { label, color, icon } = config[level];

  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono"
      style={{
        color,
        backgroundColor: `${color}20`,
        border: `1px solid ${color}40`,
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

interface PropertiesPanelProps {
  className?: string;
  selectedNode?: CompositionNode | null;
  totalNodes?: number;
  maxDepth?: number;
  verifiedPercentage?: number;
}

export function PropertiesPanel({
  className,
  selectedNode,
  totalNodes = 0,
  maxDepth = 0,
  verifiedPercentage = 0,
}: PropertiesPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-[var(--bg-panel)] border-l border-[var(--border-subtle)]",
        "w-64 h-full overflow-y-auto",
        className,
      )}
    >
      {/* Selected Node Section */}
      <div className="border-b border-[var(--border-subtle)]">
        <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
          <h3 className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider">
            Selected
          </h3>
        </div>

        <div className="p-3">
          {selectedNode ? (
            <div className="space-y-3">
              {/* Node Name */}
              <div>
                <h4 className="text-sm font-medium text-[var(--text-primary)] mb-1">
                  {selectedNode.name}
                </h4>
                {selectedNode.description && (
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {selectedNode.description}
                  </p>
                )}
              </div>

              {/* Separator */}
              <div className="h-px bg-[var(--border-subtle)]" />

              {/* Properties */}
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
                    Type
                  </span>
                  <div className="mt-1">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-mono capitalize"
                      style={{
                        color: `var(--node-${selectedNode.type})`,
                        backgroundColor: `var(--node-${selectedNode.type})20`,
                      }}
                    >
                      {selectedNode.type}
                    </span>
                  </div>
                </div>

                {selectedNode.percentage > 0 && (
                  <div>
                    <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
                      Mass %
                    </span>
                    <div className="mt-1 text-lg font-mono text-[var(--text-mono)] tabular-nums">
                      {selectedNode.percentage.toFixed(2)}%
                    </div>
                  </div>
                )}

                {selectedNode.symbol && (
                  <div>
                    <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
                      Symbol
                    </span>
                    <div className="mt-1 text-lg font-mono text-[var(--text-primary)]">
                      {selectedNode.symbol}
                      {selectedNode.atomicNumber && (
                        <sub className="text-sm text-[var(--text-secondary)]">
                          {selectedNode.atomicNumber}
                        </sub>
                      )}
                    </div>
                  </div>
                )}

                {selectedNode.casNumber && (
                  <div>
                    <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
                      CAS #
                    </span>
                    <div className="mt-1 text-xs font-mono text-[var(--text-secondary)]">
                      {selectedNode.casNumber}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
                    Confidence
                  </span>
                  <div className="mt-1">
                    <ConfidenceBadge level={selectedNode.confidence} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-[var(--text-tertiary)] text-center py-8">
              No node selected
              <div className="mt-1 text-[10px]">
                Click a node to view properties
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Readouts Section */}
      <div className="flex-1">
        <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
          <h3 className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider">
            Readouts
          </h3>
        </div>

        <div className="p-3">
          <div className="space-y-0">
            <DataReadout label="Depth" value={maxDepth} unit="levels" />
            <DataReadout label="Nodes" value={totalNodes} unit="total" />
            <DataReadout
              label="Verified"
              value={verifiedPercentage.toFixed(0)}
              unit="%"
              color={
                verifiedPercentage >= 75
                  ? "var(--confidence-verified)"
                  : verifiedPercentage >= 50
                    ? "var(--confidence-estimated)"
                    : "var(--confidence-speculative)"
              }
            />
            {selectedNode?.children && (
              <DataReadout
                label="Children"
                value={selectedNode.children.length}
                unit="nodes"
              />
            )}
          </div>
        </div>
      </div>

      {/* System Info Section */}
      <div className="border-t border-[var(--border-subtle)]">
        <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
          <h3 className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider">
            System
          </h3>
        </div>

        <div className="p-3">
          <div className="space-y-0">
            <DataReadout
              label="FPS"
              value={60}
              unit="fps"
              color="var(--accent-secondary)"
            />
            <DataReadout label="Memory" value={124} unit="MB" />
            <DataReadout label="Render" value="WebGL 2.0" />
          </div>
        </div>
      </div>
    </div>
  );
}
