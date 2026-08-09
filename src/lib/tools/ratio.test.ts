import { describe, expect, it } from 'vitest';
import {
  gcd,
  parseRatioInput,
  scaleToHeight,
  scaleToWidth,
  simplifyRatio,
} from '@/lib/tools/ratio';

describe('gcd', () => {
  it('computes the greatest common divisor', () => {
    expect(gcd(1920, 1080)).toBe(120);
    expect(gcd(16, 9)).toBe(1);
    expect(gcd(0, 5)).toBe(5);
  });
});

describe('simplifyRatio', () => {
  it('reduces with the gcd', () => {
    expect(simplifyRatio(1920, 1080)).toEqual({ width: 16, height: 9 });
    expect(simplifyRatio(100, 75)).toEqual({ width: 4, height: 3 });
  });

  it('keeps already-simple ratios', () => {
    expect(simplifyRatio(16, 9)).toEqual({ width: 16, height: 9 });
  });

  it('handles decimal inputs', () => {
    expect(simplifyRatio(1.5, 1)).toEqual({ width: 3, height: 2 });
  });
});

describe('scaleToWidth', () => {
  it('derives the height for a new width', () => {
    expect(scaleToWidth(16, 9, 1920)).toBeCloseTo(1080, 6);
    expect(scaleToWidth(4, 3, 800)).toBe(600);
  });
});

describe('scaleToHeight', () => {
  it('derives the width for a new height', () => {
    expect(scaleToHeight(16, 9, 1080)).toBeCloseTo(1920, 6);
    expect(scaleToHeight(4, 3, 600)).toBe(800);
  });
});

describe('parseRatioInput', () => {
  it('parses colon notation', () => {
    expect(parseRatioInput('16:9')).toEqual({ width: 16, height: 9 });
    expect(parseRatioInput(' 4 : 3 ')).toEqual({ width: 4, height: 3 });
  });

  it('parses cross notation', () => {
    expect(parseRatioInput('1920x1080')).toEqual({ width: 1920, height: 1080 });
    expect(parseRatioInput('16x9')).toEqual({ width: 16, height: 9 });
  });

  it('rejects invalid input', () => {
    expect(parseRatioInput('banana')).toBeNull();
    expect(parseRatioInput('16:')).toBeNull();
    expect(parseRatioInput('0:9')).toBeNull();
    expect(parseRatioInput('')).toBeNull();
  });
});
