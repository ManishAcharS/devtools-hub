export type RgbTuple = [number, number, number];

export interface HslTuple {
  h: number;
  s: number;
  l: number;
}

export interface HsvTuple {
  h: number;
  s: number;
  v: number;
}

export type ColorFormat = 'hex' | 'hex8' | 'rgb' | 'hsl' | 'hsv';

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface ColorResult {
  converted: Record<ColorFormat, string>;
  palette: ColorSwatch[];
}

export interface PaletteColor {
  hex: string;
  contrastText: string;
  rgb: RgbTuple;
}

export interface PaletteResult {
  colors: PaletteColor[];
}

const NAMED_HEX: Record<string, string> = {
  black: '#000000',
  white: '#ffffff',
  red: '#ff0000',
  green: '#008000',
  blue: '#0000ff',
  yellow: '#ffff00',
  cyan: '#00ffff',
  magenta: '#ff00ff',
  orange: '#ffa500',
  purple: '#800080',
  gray: '#808080',
  grey: '#808080',
  silver: '#c0c0c0',
  maroon: '#800000',
  olive: '#808000',
  navy: '#000080',
  teal: '#008080',
  lime: '#00ff00',
  aqua: '#00ffff',
  fuchsia: '#ff00ff',
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function hexToRgb(input: string): RgbTuple | null {
  const hex = input.trim().replace(/^#/, '');
  if (/^[0-9a-f]{3,4}$/i.test(hex)) {
    return [
      parseInt(hex[0] + hex[0], 16),
      parseInt(hex[1] + hex[1], 16),
      parseInt(hex[2] + hex[2], 16),
    ];
  }
  if (/^[0-9a-f]{6,8}$/i.test(hex)) {
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  return null;
}

export function rgbToHex([r, g, b]: RgbTuple, includeAlpha = false, alpha = 255): string {
  const channel = (value: number): string =>
    Math.round(clamp(value, 0, 255))
      .toString(16)
      .padStart(2, '0');
  const hex = `#${channel(r)}${channel(g)}${channel(b)}`;
  return includeAlpha ? hex + channel(alpha) : hex;
}

export function rgbToHsl([r, g, b]: RgbTuple): HslTuple {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    if (max === red) {
      h = 60 * (((green - blue) / delta) % 6);
    } else if (max === green) {
      h = 60 * ((blue - red) / delta + 2);
    } else {
      h = 60 * ((red - green) / delta + 4);
    }
    if (h < 0) h += 360;
  }
  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: HslTuple): RgbTuple {
  const hue = (((h % 360) + 360) % 360) / 360;
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;
  if (saturation === 0) {
    const gray = Math.round(lightness * 255);
    return [gray, gray, gray];
  }
  const q =
    lightness < 0.5
      ? lightness * (1 + saturation)
      : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;
  const channel = (offset: number): number => {
    let t = hue + offset;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [
    Math.round(channel(1 / 3) * 255),
    Math.round(channel(0) * 255),
    Math.round(channel(2 / 3) * 255),
  ];
}

export function rgbToHsv([r, g, b]: RgbTuple): HsvTuple {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === red) {
      h = 60 * (((green - blue) / delta) % 6);
    } else if (max === green) {
      h = 60 * ((blue - red) / delta + 2);
    } else {
      h = 60 * ((red - green) / delta + 4);
    }
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : (delta / max) * 100, v: max * 100 };
}

export function hsvToRgb({ h, s, v }: HsvTuple): RgbTuple {
  const hue = ((h % 360) + 360) % 360;
  const saturation = clamp(s, 0, 100) / 100;
  const value = clamp(v, 0, 100) / 100;
  const c = value * saturation;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = value - c;
  let rgb: RgbTuple;
  if (hue < 60) rgb = [c, x, 0];
  else if (hue < 120) rgb = [x, c, 0];
  else if (hue < 180) rgb = [0, c, x];
  else if (hue < 240) rgb = [0, x, c];
  else if (hue < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return [
    Math.round((rgb[0] + m) * 255),
    Math.round((rgb[1] + m) * 255),
    Math.round((rgb[2] + m) * 255),
  ];
}

export function parseColor(input: string): RgbTuple | null {
  const trimmed = input.trim();
  if (trimmed.length === 0) return null;
  const hex = hexToRgb(trimmed);
  if (hex !== null) return hex;
  const named = NAMED_HEX[trimmed.toLowerCase()];
  if (named !== undefined) {
    return hexToRgb(named);
  }
  const rgbMatch = trimmed.match(
    /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/i
  );
  if (rgbMatch !== null) {
    return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
  }
  const hslMatch = trimmed.match(
    /^hsla?\(\s*([\d.]+)(?:deg)?[,\s]+([\d.]+)%[,\s]+([\d.]+)%(?:[,\s/]+([\d.]+%?))?\s*\)$/i
  );
  if (hslMatch !== null) {
    return hslToRgb({ h: Number(hslMatch[1]), s: Number(hslMatch[2]), l: Number(hslMatch[3]) });
  }
  const hsvMatch = trimmed.match(
    /^hsva?\(\s*([\d.]+)(?:deg)?[,\s]+([\d.]+)%[,\s]+([\d.]+)%(?:[,\s/]+([\d.]+%?))?\s*\)$/i
  );
  if (hsvMatch !== null) {
    return hsvToRgb({ h: Number(hsvMatch[1]), s: Number(hsvMatch[2]), v: Number(hsvMatch[3]) });
  }
  return null;
}

export function detectColorFormats(input: string): string[] {
  const trimmed = input.trim();
  const formats: string[] = [];
  if (/^#[0-9a-f]{3}$/i.test(trimmed) || /^#[0-9a-f]{6}$/i.test(trimmed)) formats.push('HEX');
  if (/^#[0-9a-f]{4}$/i.test(trimmed) || /^#[0-9a-f]{8}$/i.test(trimmed)) formats.push('HEX8');
  if (/^rgba?\(/i.test(trimmed)) formats.push('RGB');
  if (/^hsla?\(/i.test(trimmed)) formats.push('HSL');
  if (/^hsva?\(/i.test(trimmed)) formats.push('HSV');
  if (NAMED_HEX[trimmed.toLowerCase()] !== undefined) formats.push('named');
  return formats;
}

function buildSwatches(rgb: RgbTuple): ColorSwatch[] {
  const { h, s } = rgbToHsl(rgb);
  const swatches: ColorSwatch[] = [];
  for (let step = 5; step >= 1; step -= 1) {
    const lightness = 90 - (step - 1) * 8;
    swatches.push({ name: `Tint ${6 - step}`, hex: rgbToHex(hslToRgb({ h, s, l: lightness })) });
  }
  swatches.push({ name: 'Base', hex: rgbToHex(rgb) });
  for (let step = 1; step <= 5; step += 1) {
    const lightness = 40 - (step - 1) * 8;
    swatches.push({ name: `Shade ${step}`, hex: rgbToHex(hslToRgb({ h, s, l: lightness })) });
  }
  return swatches;
}

export function convertColor(input: string, format: ColorFormat): ColorResult | null {
  const rgb = parseColor(input);
  if (rgb === null) return null;
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const css = (r: number, g: number, b: number): string =>
    `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  const converted: Record<ColorFormat, string> = {
    hex: rgbToHex(rgb).toLowerCase(),
    hex8: rgbToHex(rgb, true).toLowerCase(),
    rgb: css(rgb[0], rgb[1], rgb[2]),
    hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`,
    hsv: `hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%)`,
  };
  void format;
  return { converted, palette: buildSwatches(rgb) };
}

export function generatePalette(baseColor: string, shades: number, seed: number): PaletteResult {
  const base = parseColor(baseColor) ?? [99, 102, 241];
  const { h: baseHue, s: baseSaturation } = rgbToHsl(base);
  const seedAngle = ((seed % 1000) / 1000) * 360;
  const hueShift = (seedAngle % 60) - 30;
  const colors: PaletteColor[] = [];
  const count = Math.max(2, Math.min(20, shades));
  for (let index = 0; index < count; index += 1) {
    const t = count === 1 ? 0.5 : index / (count - 1);
    const lightness = 94 - t * 78;
    const saturation = baseSaturation * (0.75 + 0.25 * (1 - t));
    const hue = (baseHue + hueShift * (1 - Math.abs(t - 0.5) * 2)) % 360;
    const rgb = hslToRgb({ h: hue, s: saturation, l: lightness });
    colors.push({
      hex: rgbToHex(rgb),
      contrastText: luminance(rgb) > 0.179 ? '#000000' : '#ffffff',
      rgb,
    });
  }
  return { colors };
}

export function randomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 50 + Math.random() * 50;
  const lightness = 45 + Math.random() * 20;
  return rgbToHex(hslToRgb({ h: hue, s: saturation, l: lightness }));
}

function luminance([r, g, b]: RgbTuple): number {
  const channel = (value: number): number => {
    const normalized = value / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function computeContrastRatio(foreground: RgbTuple, background: RgbTuple): number {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}
