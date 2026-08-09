export interface GradientStop {
  color: string;
  position: number;
}

export interface GradientOptions {
  type: 'linear' | 'radial' | 'conic';
  angle: number;
  stops: GradientStop[];
}

export function gradientToCss(options: GradientOptions): string {
  const { type, angle, stops } = options;
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopStrings = sorted.map((stop) => `${stop.color} ${stop.position}%`).join(', ');

  if (type === 'linear') {
    return `linear-gradient(${angle}deg, ${stopStrings})`;
  }
  if (type === 'radial') {
    return `radial-gradient(circle, ${stopStrings})`;
  }
  return `conic-gradient(from ${angle}deg, ${stopStrings})`;
}

export const DEFAULT_GRADIENT_STOPS: GradientStop[] = [
  { color: '#3b82f6', position: 0 },
  { color: '#8b5cf6', position: 50 },
  { color: '#ec4899', position: 100 },
];

export interface BoxShadowOptions {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
}

export function boxShadowToCss(options: BoxShadowOptions): string {
  const { offsetX, offsetY, blur, spread, color, inset } = options;
  const insetStr = inset ? 'inset ' : '';
  return `${insetStr}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`;
}

export const DEFAULT_BOX_SHADOW: BoxShadowOptions = {
  offsetX: 0,
  offsetY: 4,
  blur: 6,
  spread: -1,
  color: 'rgba(0, 0, 0, 0.1)',
  inset: false,
};

export interface BorderRadiusOptions {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

export function borderRadiusToCss(options: BorderRadiusOptions): string {
  const { topLeft, topRight, bottomRight, bottomLeft } = options;
  const values = [topLeft, topRight, bottomRight, bottomLeft];
  const unique = [...new Set(values)];
  if (unique.length === 1) {
    return `${unique[0]}px`;
  }
  return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
}

export const DEFAULT_BORDER_RADIUS: BorderRadiusOptions = {
  topLeft: 8,
  topRight: 8,
  bottomRight: 8,
  bottomLeft: 8,
};

export interface ClipPathOptions {
  type: 'polygon' | 'circle' | 'ellipse' | 'inset';
  polygonPoints: { x: number; y: number }[];
  circleRadius: number;
  circleCenterX: number;
  circleCenterY: number;
  ellipseRadiusX: number;
  ellipseRadiusY: number;
  ellipseCenterX: number;
  ellipseCenterY: number;
  insetTop: number;
  insetRight: number;
  insetBottom: number;
  insetLeft: number;
  insetBorderRadius: number;
}

export function clipPathToCss(options: ClipPathOptions): string {
  const { type } = options;
  if (type === 'polygon') {
    const points = options.polygonPoints.map((p) => `${p.x}% ${p.y}%`).join(', ');
    return `polygon(${points})`;
  }
  if (type === 'circle') {
    return `circle(${options.circleRadius}% at ${options.circleCenterX}% ${options.circleCenterY}%)`;
  }
  if (type === 'ellipse') {
    return `ellipse(${options.ellipseRadiusX}% ${options.ellipseRadiusY}% at ${options.ellipseCenterX}% ${options.ellipseCenterY}%)`;
  }
  const { insetTop, insetRight, insetBottom, insetLeft, insetBorderRadius } = options;
  return `inset(${insetTop}% ${insetRight}% ${insetBottom}% ${insetLeft}% round ${insetBorderRadius}%)`;
}

export const DEFAULT_CLIP_PATH: ClipPathOptions = {
  type: 'polygon',
  polygonPoints: [
    { x: 50, y: 0 },
    { x: 100, y: 50 },
    { x: 50, y: 100 },
    { x: 0, y: 50 },
  ],
  circleRadius: 50,
  circleCenterX: 50,
  circleCenterY: 50,
  ellipseRadiusX: 50,
  ellipseRadiusY: 30,
  ellipseCenterX: 50,
  ellipseCenterY: 50,
  insetTop: 0,
  insetRight: 0,
  insetBottom: 0,
  insetLeft: 0,
  insetBorderRadius: 0,
};

export const POLYGON_PRESETS: { label: string; points: { x: number; y: number }[] }[] = [
  {
    label: 'Triangle',
    points: [
      { x: 50, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
    ],
  },
  {
    label: 'Diamond',
    points: [
      { x: 50, y: 0 },
      { x: 100, y: 50 },
      { x: 50, y: 100 },
      { x: 0, y: 50 },
    ],
  },
  {
    label: 'Pentagon',
    points: [
      { x: 50, y: 0 },
      { x: 100, y: 38 },
      { x: 82, y: 100 },
      { x: 18, y: 100 },
      { x: 0, y: 38 },
    ],
  },
  {
    label: 'Hexagon',
    points: [
      { x: 50, y: 0 },
      { x: 100, y: 25 },
      { x: 100, y: 75 },
      { x: 50, y: 100 },
      { x: 0, y: 75 },
      { x: 0, y: 25 },
    ],
  },
  {
    label: 'Star',
    points: [
      { x: 50, y: 0 },
      { x: 61, y: 35 },
      { x: 98, y: 35 },
      { x: 68, y: 57 },
      { x: 79, y: 91 },
      { x: 50, y: 70 },
      { x: 21, y: 91 },
      { x: 32, y: 57 },
      { x: 2, y: 35 },
      { x: 39, y: 35 },
    ],
  },
];

export interface PxRemOptions {
  baseFontSize: number;
  value: number;
  direction: 'px-to-rem' | 'rem-to-px';
}

export function convertPxRem(options: PxRemOptions): number {
  const { baseFontSize, value, direction } = options;
  if (direction === 'px-to-rem') {
    return value / baseFontSize;
  }
  return value * baseFontSize;
}

export function formatRem(value: number): string {
  return `${value.toFixed(4).replace(/\.?0+$/, '')}rem`;
}

export function formatPx(value: number): string {
  return `${Math.round(value)}px`;
}

// Color blindness simulation matrices (Source: Brettel et al. / Vienot et al.)
export const CB_MATRICES: Record<string, number[][]> = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
};

export function simulateColorBlindness(
  r: number,
  g: number,
  b: number,
  matrix: number[][]
): { r: number; g: number; b: number } {
  const sr = r / 255;
  const sg = g / 255;
  const sb = b / 255;
  const nr = Math.min(1, matrix[0][0] * sr + matrix[0][1] * sg + matrix[0][2] * sb);
  const ng = Math.min(1, matrix[1][0] * sr + matrix[1][1] * sg + matrix[1][2] * sb);
  const nb = Math.min(1, matrix[2][0] * sr + matrix[2][1] * sg + matrix[2][2] * sb);
  return {
    r: Math.round(nr * 255),
    g: Math.round(ng * 255),
    b: Math.round(nb * 255),
  };
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }
  return null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
