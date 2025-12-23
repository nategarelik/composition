import type { ThemeTokens } from './types';

export const cernTokens: ThemeTokens = {
  id: 'cern',
  name: 'CERN',
  description: 'Particle Physics Lab - Dark, data-dense, scientific instrumentation',

  colors: {
    // Deep space blacks
    bgPrimary: '#050608',
    bgSecondary: '#0a0c0e',
    bgTertiary: '#101316',
    bgPanel: '#080a0c',
    bgElevated: '#141820',

    // Electric blues (primary accent)
    accentPrimary: '#3b9eff',
    accentPrimaryDim: '#2a7acc',
    accentPrimaryGlow: 'rgba(59, 158, 255, 0.15)',

    // Phosphor greens (secondary/success)
    accentSecondary: '#00ff88',
    accentSecondaryDim: '#00cc6a',
    accentSecondaryGlow: 'rgba(0, 255, 136, 0.15)',

    // Warning/danger
    warning: '#ffb020',
    danger: '#ff4757',

    // Text
    textPrimary: '#e8eaed',
    textSecondary: '#8b919a',
    textTertiary: '#5a6270',
    textMono: '#00ff88',
    textData: '#3b9eff',

    // Borders
    border: '#1a1e24',
    borderActive: 'rgba(59, 158, 255, 0.3)',
    borderFocus: 'rgba(59, 158, 255, 0.5)',

    // Node colors
    nodeProduct: '#3b9eff',
    nodeComponent: '#8b5cf6',
    nodeMaterial: '#f59e0b',
    nodeChemical: '#00ff88',
    nodeElement: '#ef4444',
  },

  typography: {
    fontFamily: {
      ui: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
      data: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
      display: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700,
    },
    fontSize: {
      xs: '10px',
      sm: '11px',
      base: '12px',
      lg: '13px',
      xl: '14px',
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.1em',
    },
    textTransform: {
      labels: 'uppercase',
      headings: 'uppercase',
    },
  },

  spacing: {
    unit: 8,
    panelPadding: 10,
    sectionGap: 12,
    itemGap: 4,
    borderWidth: 1,
  },

  shapes: {
    borderRadius: {
      none: '0',
      sm: '2px',
      md: '3px',
      lg: '4px',
      full: '9999px',
    },
    buttonStyle: 'sharp',
    inputStyle: 'bordered',
    panelStyle: 'bordered',
  },

  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.9)',
    md: '0 2px 8px rgba(0,0,0,0.9)',
    lg: '0 4px 16px rgba(0,0,0,0.95)',
    glow: '0 0 12px rgba(59, 158, 255, 0.4)',
    glowStrong: '0 0 20px rgba(59, 158, 255, 0.6), 0 0 40px rgba(59, 158, 255, 0.3)',
    inset: 'inset 0 1px 3px rgba(0,0,0,0.6)',
  },

  layout: {
    treePanelWidth: 240,
    detailPanelMinHeight: 140,
    detailPanelMaxHeight: 350,
    statusBarHeight: 24,
    toolbarHeight: 36,
    menuBarHeight: 28,
    panelHeaderHeight: 24,
  },

  animations: {
    duration: {
      instant: 0,
      fast: 80,
      normal: 150,
      slow: 300,
    },
    easing: {
      default: 'linear',
      bounce: 'cubic-bezier(0.68,-0.55,0.27,1.55)',
      sharp: 'steps(4)',
    },
    style: 'snappy',
    pulseSpeed: '2s',
    scanlineSpeed: '8s',
  },

  decorations: {
    gridVisible: true,
    gridStyle: 'lines',
    gridOpacity: 0.08,
    gridSize: 40,
    scanlines: true,
    scanlineOpacity: 0.02,
    glowEffects: true,
    pulseEffects: true,
    cornerMarkers: true,
  },

  nodes: {
    shape: 'circle',
    glowIntensity: 0.5,
    connectionStyle: 'curved',
    strokeWidth: 1.5,
    hoverScale: 1.05,
  },
};
