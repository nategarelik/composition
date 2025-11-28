"use client";

import { useEffect, useCallback } from "react";
import { useCompositionStore } from "@/stores";

/**
 * Gizmo mode for 3D manipulation
 */
export type GizmoMode = "translate" | "rotate" | "scale" | null;

/**
 * Keyboard shortcut definitions
 */
export const SHORTCUTS = {
  // Gizmo mode shortcuts
  TRANSLATE: "g", // G for grab/move (Blender style)
  ROTATE: "r", // R for rotate
  SCALE: "s", // S for scale

  // Selection shortcuts
  DESELECT: "Escape",
  SELECT_ALL: "a",

  // View shortcuts
  TOGGLE_EXPLODE: "e",
  FOCUS_SELECTED: "f",
  RESET_VIEW: "h", // H for home

  // Navigation
  ZOOM_IN: "+",
  ZOOM_OUT: "-",
} as const;

interface UseKeyboardShortcutsOptions {
  onGizmoModeChange?: (mode: GizmoMode) => void;
  enabled?: boolean;
}

/**
 * Hook to handle keyboard shortcuts for the 3D viewer
 */
export function useKeyboardShortcuts({
  onGizmoModeChange,
  enabled = true,
}: UseKeyboardShortcutsOptions = {}) {
  const selectNode = useCompositionStore((s) => s.selectNode);
  const toggleExploded = useCompositionStore((s) => s.toggleExploded);
  const selectedNode = useCompositionStore((s) => s.selectedNode);
  const setFocusedNode = useCompositionStore((s) => s.setFocusedNode);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't handle shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      switch (key) {
        // Gizmo modes
        case SHORTCUTS.TRANSLATE:
          event.preventDefault();
          onGizmoModeChange?.("translate");
          break;

        case SHORTCUTS.ROTATE:
          event.preventDefault();
          onGizmoModeChange?.("rotate");
          break;

        case SHORTCUTS.SCALE:
          event.preventDefault();
          onGizmoModeChange?.("scale");
          break;

        // Deselect
        case "escape":
          event.preventDefault();
          selectNode(null);
          onGizmoModeChange?.(null);
          break;

        // Toggle explode view
        case SHORTCUTS.TOGGLE_EXPLODE:
          event.preventDefault();
          toggleExploded();
          break;

        // Focus on selected node
        case SHORTCUTS.FOCUS_SELECTED:
          if (selectedNode) {
            event.preventDefault();
            setFocusedNode(selectedNode.id);
          }
          break;

        // Reset view
        case SHORTCUTS.RESET_VIEW:
          event.preventDefault();
          setFocusedNode(null);
          break;
      }
    },
    [
      onGizmoModeChange,
      selectNode,
      toggleExploded,
      selectedNode,
      setFocusedNode,
    ],
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, handleKeyDown]);
}

/**
 * Format shortcut key for display
 */
export function formatShortcutKey(key: string): string {
  const keyMap: Record<string, string> = {
    escape: "Esc",
    " ": "Space",
    arrowup: "\u2191",
    arrowdown: "\u2193",
    arrowleft: "\u2190",
    arrowright: "\u2192",
  };

  return keyMap[key.toLowerCase()] || key.toUpperCase();
}

/**
 * Get shortcut hint text for tooltips
 */
export function getShortcutHint(action: keyof typeof SHORTCUTS): string {
  const key = SHORTCUTS[action];
  return formatShortcutKey(key);
}
