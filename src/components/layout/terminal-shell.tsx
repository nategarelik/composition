"use client";

/**
 * Terminal Shell Component - Main app shell with 3D workstation layout
 * Wraps the composition viewer with menu bar, toolbar, properties panel, and status bar
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MenuBar } from "./menu-bar";
import { Toolbar } from "./toolbar";
import { PropertiesPanel } from "./properties-panel";
import { StatusBar } from "./status-bar";
import type {
  CompositionNode,
  ViewMode,
  CompositionType,
} from "@/types/composition";

interface TerminalShellProps {
  children: React.ReactNode;
  className?: string;
  compositionName?: string;
  selectedNode?: CompositionNode | null;
  totalNodes?: number;
  maxDepth?: number;
  verifiedPercentage?: number;
  onNodeSelect?: (node: CompositionNode | null) => void;
}

export function TerminalShell({
  children,
  className,
  compositionName,
  selectedNode,
  totalNodes = 0,
  maxDepth = 0,
  verifiedPercentage = 0,
}: TerminalShellProps) {
  // UI State
  const [activeTool, setActiveTool] = useState<
    "select" | "move" | "rotate" | "scale"
  >("select");
  const [viewMode] = useState<ViewMode>("exploded");
  const [zoomLevel] = useState(100);
  const [visibleLayers, setVisibleLayers] = useState<Set<CompositionType>>(
    new Set(["product", "component", "material", "chemical", "element"]),
  );
  const [showToolbar, setShowToolbar] = useState(true);
  const [showProperties, setShowProperties] = useState(true);

  const handleLayerToggle = (type: CompositionType) => {
    setVisibleLayers((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-[var(--bg-primary)] overflow-hidden",
        className,
      )}
    >
      {/* Menu Bar */}
      <MenuBar compositionName={compositionName} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar (Left) */}
        <AnimatePresence>
          {showToolbar && (
            <motion.div
              initial={{ x: -48, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -48, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Toolbar
                activeTool={activeTool}
                onToolChange={setActiveTool}
                visibleLayers={visibleLayers}
                onLayerToggle={handleLayerToggle}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Viewport */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 3D Viewport / Main Content */}
          <div className="flex-1 relative bg-[var(--bg-primary)] overflow-hidden">
            {children}

            {/* Viewport Overlay - Grid Lines */}
            <div className="absolute inset-0 pointer-events-none viewport-grid opacity-30" />

            {/* Viewport Controls Overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <button
                className="px-2 py-1 text-xs font-mono bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-default)] transition-colors"
                onClick={() => setShowToolbar(!showToolbar)}
              >
                {showToolbar ? "Hide" : "Show"} Toolbar
              </button>
              <button
                className="px-2 py-1 text-xs font-mono bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-default)] transition-colors"
                onClick={() => setShowProperties(!showProperties)}
              >
                {showProperties ? "Hide" : "Show"} Properties
              </button>
            </div>

            {/* Viewport Info Overlay */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-mono text-[var(--text-tertiary)]">
              <div className="px-2 py-1 bg-[var(--bg-secondary)]/80 border border-[var(--border-subtle)] rounded backdrop-blur-sm">
                Grid · Snap · Wireframe
              </div>
            </div>
          </div>

          {/* Bottom Panel (Hierarchy / Chat) */}
          {/* This will be implemented in Phase 2 */}
        </div>

        {/* Properties Panel (Right) */}
        <AnimatePresence>
          {showProperties && (
            <motion.div
              initial={{ x: 256, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 256, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <PropertiesPanel
                selectedNode={selectedNode}
                totalNodes={totalNodes}
                maxDepth={maxDepth}
                verifiedPercentage={verifiedPercentage}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Bar */}
      <StatusBar
        mode={viewMode}
        zoomLevel={zoomLevel}
        selectedCount={selectedNode ? 1 : 0}
        message={selectedNode ? undefined : "Click a node to inspect"}
      />
    </div>
  );
}
