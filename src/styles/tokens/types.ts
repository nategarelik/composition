export interface ThemeTokens {
  id: 'cern' | 'intel' | 'pharma' | 'materials';
  name: string;
  description: string;

  colors: {
    // Backgrounds
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    bgPanel: string;
    bgElevated: string;

    // Accents
    accentPrimary: string;
    accentPrimaryDim: string;
    accentPrimaryGlow: string;
    accentSecondary: string;
    accentSecondaryDim: string;
    accentSecondaryGlow: string;

    // Alerts
    warning: string;
    danger: string;

    // Text
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    textMono: string;
    textData: string;

    // Borders
    border: string;
    borderActive: string;
    borderFocus: string;

    // Node colors
    nodeProduct: string;
    nodeComponent: string;
    nodeMaterial: string;
    nodeChemical: string;
    nodeElement: string;
  };

  typography: {
    fontFamily: {
      ui: string;
      data: string;
      display: string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      bold: number;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
    };
    letterSpacing: {
      tight: string;
      normal: string;
      wide: string;
    };
    textTransform: {
      labels: string;
      headings: string;
    };
  };

  spacing: {
    unit: number;
    panelPadding: number;
    sectionGap: number;
    itemGap: number;
    borderWidth: number;
  };

  shapes: {
    borderRadius: {
      none: string;
      sm: string;
      md: string;
      lg: string;
      full: string;
    };
    buttonStyle: 'sharp' | 'rounded' | 'pill';
    inputStyle: 'underline' | 'bordered' | 'filled';
    panelStyle: 'flat' | 'elevated' | 'bordered' | 'floating';
  };

  shadows: {
    sm: string;
    md: string;
    lg: string;
    glow: string;
    glowStrong: string;
    inset: string;
  };

  layout: {
    treePanelWidth: number;
    detailPanelMinHeight: number;
    detailPanelMaxHeight: number;
    statusBarHeight: number;
    toolbarHeight: number;
    menuBarHeight: number;
    panelHeaderHeight: number;
  };

  animations: {
    duration: {
      instant: number;
      fast: number;
      normal: number;
      slow: number;
    };
    easing: {
      default: string;
      bounce: string;
      sharp: string;
    };
    style: 'snappy' | 'smooth' | 'mechanical' | 'organic';
    pulseSpeed: string;
    scanlineSpeed: string;
  };

  decorations: {
    gridVisible: boolean;
    gridStyle: 'dots' | 'lines' | 'none' | 'dashed';
    gridOpacity: number;
    gridSize: number;
    scanlines: boolean;
    scanlineOpacity: number;
    glowEffects: boolean;
    pulseEffects: boolean;
    cornerMarkers: boolean;
  };

  nodes: {
    shape: 'circle' | 'hexagon' | 'square' | 'rounded-square';
    glowIntensity: number;
    connectionStyle: 'curved' | 'straight' | 'orthogonal';
    strokeWidth: number;
    hoverScale: number;
  };
}
