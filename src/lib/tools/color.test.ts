import { describe, expect, it } from 'vitest';
import {
  computeContrastRatio,
  convertColor,
  detectColorFormats,
  generatePalette,
  hexToRgb,
  parseColor,
  randomColor,
} from '@/lib/tools/color';

describe('hexToRgb', () => {
  it('parses 3-digit hex', () => {
    expect(hexToRgb('#f00')).toEqual([255, 0, 0]);
  });

  it('parses 6-digit hex without the hash', () => {
    expect(hexToRgb('3366ff')).toEqual([51, 102, 255]);
  });

  it('parses 8-digit hex ignoring alpha', () => {
    expect(hexToRgb('#3366ff80')).toEqual([51, 102, 255]);
  });

  it('rejects invalid values', () => {
    expect(hexToRgb('#12345')).toBeNull();
    expect(hexToRgb('red')).toBeNull();
    expect(hexToRgb('')).toBeNull();
  });
});

describe('parseColor', () => {
  it('parses rgb() and rgba() syntax', () => {
    expect(parseColor('rgb(51, 102, 255)')).toEqual([51, 102, 255]);
    expect(parseColor('rgba(0, 0, 0, 0.5)')).toEqual([0, 0, 0]);
  });

  it('parses hsl() syntax', () => {
    const rgb = parseColor('hsl(0, 100%, 50%)');
    expect(rgb?.[0]).toBe(255);
    expect(rgb?.[1]).toBe(0);
  });

  it('parses named colors', () => {
    expect(parseColor('black')).toEqual([0, 0, 0]);
    expect(parseColor('white')).toEqual([255, 255, 255]);
  });

  it('returns null for garbage', () => {
    expect(parseColor('not-a-color')).toBeNull();
  });
});

describe('convertColor', () => {
  it('converts across all formats', () => {
    const result = convertColor('#3366ff', 'hex');
    expect(result).not.toBeNull();
    expect(result?.converted.hex).toBe('#3366ff');
    expect(result?.converted.hex8).toBe('#3366ff80'.replace('80', 'ff'));
    expect(result?.converted.rgb).toBe('rgb(51, 102, 255)');
    expect(result?.converted.hsl).toBe('hsl(225, 100%, 60%)');
    expect(result?.converted.hsv).toBe('hsv(225, 80%, 100%)');
  });

  it('round-trips rgb input to hex', () => {
    const result = convertColor('rgb(255, 0, 0)', 'rgb');
    expect(result?.converted.hex).toBe('#ff0000');
  });

  it('builds a palette of tints and shades', () => {
    const result = convertColor('#3366ff', 'hex');
    expect(result?.palette).toHaveLength(11);
    expect(result?.palette[5]?.name).toBe('Base');
  });

  it('returns null for invalid input', () => {
    expect(convertColor('zzz', 'hex')).toBeNull();
  });
});

describe('detectColorFormats', () => {
  it('detects hex and rgb', () => {
    const formats = detectColorFormats('#3366ff');
    expect(formats).toContain('HEX');
  });

  it('detects css functions', () => {
    expect(detectColorFormats('hsl(0, 0%, 0%)')).toContain('HSL');
    expect(detectColorFormats('rgb(1, 2, 3)')).toContain('RGB');
  });

  it('returns an empty list for unknown input', () => {
    expect(detectColorFormats('nonsense')).toEqual([]);
  });
});

describe('computeContrastRatio', () => {
  it('returns 21:1 for black on white', () => {
    expect(computeContrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 1);
  });

  it('returns 1:1 for identical colors', () => {
    expect(computeContrastRatio([100, 100, 100], [100, 100, 100])).toBeCloseTo(1, 5);
  });

  it('is symmetric', () => {
    const a = computeContrastRatio([51, 102, 255], [255, 255, 255]);
    const b = computeContrastRatio([255, 255, 255], [51, 102, 255]);
    expect(a).toBeCloseTo(b, 10);
  });
});

describe('generatePalette', () => {
  it('produces the requested number of colors', () => {
    const result = generatePalette('#6366f1', 10, 42);
    expect(result.colors).toHaveLength(10);
  });

  it('clamps extreme counts', () => {
    expect(generatePalette('#6366f1', 1, 1).colors).toHaveLength(2);
    expect(generatePalette('#6366f1', 100, 1).colors).toHaveLength(20);
  });

  it('assigns readable contrast text', () => {
    const result = generatePalette('#ffffff', 10, 1);
    expect(result.colors[0]?.contrastText).toBe('#000000');
    const dark = generatePalette('#000000', 10, 1);
    expect(dark.colors[9]?.contrastText).toBe('#ffffff');
  });

  it('is deterministic for a fixed seed', () => {
    const first = generatePalette('#3366ff', 8, 123);
    const second = generatePalette('#3366ff', 8, 123);
    expect(first.colors.map((c) => c.hex)).toEqual(second.colors.map((c) => c.hex));
  });
});

describe('randomColor', () => {
  it('returns a valid hex color', () => {
    for (let i = 0; i < 20; i += 1) {
      const color = randomColor();
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
