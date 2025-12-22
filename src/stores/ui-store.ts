import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import type { CompositionType } from '@/types';

interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
}

interface UIState {
  canvasMode: '2d' | '3d' | 'split';
  theme: 'cern' | 'intel' | 'pharma' | 'materials';
  panels: { tree: boolean; properties: boolean; detail: boolean };
  canvasTransform: CanvasTransform;
  visibleLayers: Set<CompositionType>;
  fitToViewCallback: (() => void) | null;

  setCanvasMode: (mode: UIState['canvasMode']) => void;
  setTheme: (theme: UIState['theme']) => void;
  togglePanel: (panel: keyof UIState['panels']) => void;
  setCanvasTransform: (transform: CanvasTransform) => void;
  updateCanvasTransform: (partial: Partial<CanvasTransform>) => void;
  resetCanvasTransform: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToView: () => void;
  registerFitToView: (callback: () => void) => void;
  toggleLayer: (layer: CompositionType) => void;
  setVisibleLayers: (layers: Set<CompositionType>) => void;
}

const DEFAULT_TRANSFORM: CanvasTransform = { x: 0, y: 0, scale: 1 };
const MIN_SCALE = 0.1;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.2;

export const useUIStore = create<UIState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        canvasMode: '2d',
        theme: 'cern',
        panels: { tree: true, properties: true, detail: false },
        canvasTransform: DEFAULT_TRANSFORM,
        visibleLayers: new Set<CompositionType>(['product', 'component', 'material', 'chemical', 'element']),
        fitToViewCallback: null,

        setCanvasMode: (mode) => set({ canvasMode: mode }),
        setTheme: (theme) => set({ theme }),
        togglePanel: (panel) => set((state) => ({
          panels: { ...state.panels, [panel]: !state.panels[panel] }
        })),

        setCanvasTransform: (transform) => set({ canvasTransform: transform }),

        updateCanvasTransform: (partial) => set((state) => ({
          canvasTransform: { ...state.canvasTransform, ...partial }
        })),

        resetCanvasTransform: () => set({ canvasTransform: DEFAULT_TRANSFORM }),

        zoomIn: () => set((state) => ({
          canvasTransform: {
            ...state.canvasTransform,
            scale: Math.min(state.canvasTransform.scale + ZOOM_STEP, MAX_SCALE)
          }
        })),

        zoomOut: () => set((state) => ({
          canvasTransform: {
            ...state.canvasTransform,
            scale: Math.max(state.canvasTransform.scale - ZOOM_STEP, MIN_SCALE)
          }
        })),

        fitToView: () => {
          const state = useUIStore.getState();
          if (state.fitToViewCallback) {
            state.fitToViewCallback();
          } else {
            // Fallback to reset if no callback registered
            set({ canvasTransform: { x: 0, y: 0, scale: 1 } });
          }
        },

        registerFitToView: (callback) => set({ fitToViewCallback: callback }),

        toggleLayer: (layer) => set((state) => {
          const newLayers = new Set(state.visibleLayers);
          if (newLayers.has(layer)) {
            newLayers.delete(layer);
          } else {
            newLayers.add(layer);
          }
          return { visibleLayers: newLayers };
        }),

        setVisibleLayers: (layers) => set({ visibleLayers: layers }),
      }),
      {
        name: 'composition-ui',
        partialize: (state) => ({ theme: state.theme, canvasMode: state.canvasMode })
      }
    )
  )
);
