"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  SHORTCUTS,
  formatShortcutKey,
  type GizmoMode,
} from "@/hooks/use-keyboard-shortcuts";

interface KeyboardShortcutsOverlayProps {
  currentMode: GizmoMode;
  showHelp?: boolean;
}

/**
 * Overlay showing current keyboard mode and available shortcuts
 */
export function KeyboardShortcutsOverlay({
  currentMode,
  showHelp = false,
}: KeyboardShortcutsOverlayProps) {
  const [showModeIndicator, setShowModeIndicator] = useState(false);

  // Show mode indicator briefly when mode changes
  useEffect(() => {
    if (currentMode) {
      setShowModeIndicator(true);
      const timer = setTimeout(() => setShowModeIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentMode]);

  const modeLabels: Record<string, string> = {
    translate: "Move Mode",
    rotate: "Rotate Mode",
    scale: "Scale Mode",
  };

  return (
    <>
      {/* Current mode indicator - shows briefly when mode changes */}
      <AnimatePresence>
        {currentMode && showModeIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-30"
          >
            <div className="px-4 py-2 bg-bg-elevated border border-accent-primary/50 rounded-lg shadow-lg">
              <span className="font-mono text-sm text-accent-primary">
                {modeLabels[currentMode] || currentMode}
              </span>
              <span className="ml-2 text-xs text-text-secondary">
                (Esc to cancel)
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcuts help panel */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-4 right-4 z-30"
          >
            <div className="p-4 bg-bg-secondary/95 border border-border-subtle rounded-lg shadow-lg backdrop-blur-sm">
              <h4 className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-3">
                Keyboard Shortcuts
              </h4>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <ShortcutRow label="Move" shortcut={SHORTCUTS.TRANSLATE} />
                <ShortcutRow label="Rotate" shortcut={SHORTCUTS.ROTATE} />
                <ShortcutRow label="Scale" shortcut={SHORTCUTS.SCALE} />
                <ShortcutRow label="Deselect" shortcut={SHORTCUTS.DESELECT} />
                <ShortcutRow
                  label="Explode"
                  shortcut={SHORTCUTS.TOGGLE_EXPLODE}
                />
                <ShortcutRow
                  label="Focus"
                  shortcut={SHORTCUTS.FOCUS_SELECTED}
                />
                <ShortcutRow label="Home" shortcut={SHORTCUTS.RESET_VIEW} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface ShortcutRowProps {
  label: string;
  shortcut: string;
}

function ShortcutRow({ label, shortcut }: ShortcutRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-text-primary">{label}</span>
      <kbd
        className={cn(
          "px-2 py-0.5 bg-bg-tertiary border border-border-default rounded",
          "font-mono text-[10px] text-text-secondary",
        )}
      >
        {formatShortcutKey(shortcut)}
      </kbd>
    </div>
  );
}

/**
 * Small indicator showing the current mode in the corner
 */
export function ModeIndicator({ mode }: { mode: GizmoMode }) {
  if (!mode) return null;

  const config: Record<string, { icon: string; color: string }> = {
    translate: { icon: "\u2194", color: "text-accent-primary" },
    rotate: { icon: "\u27F3", color: "text-accent-warning" },
    scale: { icon: "\u229E", color: "text-accent-secondary" },
  };

  const { icon, color } = config[mode] || {
    icon: "?",
    color: "text-text-secondary",
  };

  return (
    <div
      className={cn(
        "absolute top-4 right-4 z-30",
        "flex items-center gap-2 px-3 py-1.5",
        "bg-bg-secondary/90 border border-border-subtle rounded",
        "backdrop-blur-sm",
      )}
    >
      <span className={cn("text-lg", color)}>{icon}</span>
      <span className="font-mono text-xs text-text-primary capitalize">
        {mode}
      </span>
      <kbd className="px-1.5 py-0.5 bg-bg-tertiary border border-border-default rounded font-mono text-[10px] text-text-secondary">
        Esc
      </kbd>
    </div>
  );
}
