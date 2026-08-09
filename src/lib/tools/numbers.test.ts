import { describe, expect, it } from 'vitest';
import {
  convertBase,
  fromRoman,
  isWhatPercent,
  percentChange,
  percentOf,
  toRoman,
  validateBaseInput,
} from '@/lib/tools/numbers';

describe('validateBaseInput', () => {
  it('accepts valid digits for the base', () => {
    expect(validateBaseInput('101', 2).error).toBeNull();
    expect(validateBaseInput('abc', 16).error).toBeNull();
  });

  it('splits integer and fractional parts', () => {
    const result = validateBaseInput('101.01', 2);
    expect(result.error).toBeNull();
    expect(result.integer).toBe('101');
    expect(result.fraction).toBe('01');
  });

  it('rejects invalid digits', () => {
    expect(validateBaseInput('2', 2).error).toBeTruthy();
    expect(validateBaseInput('g', 16).error).toBeTruthy();
  });

  it('rejects empty input', () => {
    expect(validateBaseInput('', 10).error).toBeTruthy();
  });
});

describe('convertBase', () => {
  it('converts between bases', () => {
    const result = convertBase('255', 10, 16);
    expect(result.error).toBeNull();
    expect(result.value).toBe('FF');
  });

  it('handles binary and hex', () => {
    expect(convertBase('1010', 2, 10).value).toBe('10');
    expect(convertBase('ff', 16, 10).value).toBe('255');
  });

  it('rejects invalid digits', () => {
    const result = convertBase('12', 2, 10);
    expect(result.error).toBeTruthy();
    expect(result.value).toBe('');
  });
});

describe('percentOf', () => {
  it('computes a percentage of a value', () => {
    const result = percentOf(20, 50);
    expect(result.error).toBeNull();
    expect(result.value).toBe('10');
  });

  it('supports negative percents', () => {
    const result = percentOf(-5, 100);
    expect(result.error).toBeNull();
    expect(result.value).toBe('-5');
  });
});

describe('isWhatPercent', () => {
  it('computes the share', () => {
    const result = isWhatPercent(25, 100);
    expect(result.error).toBeNull();
    expect(result.value).toBe('25%');
  });

  it('rejects a zero whole', () => {
    expect(isWhatPercent(10, 0).error).toBeTruthy();
  });
});

describe('percentChange', () => {
  it('computes increase', () => {
    const result = percentChange(50, 75);
    expect(result.error).toBeNull();
    expect(result.value).toBe('+50%');
  });

  it('computes decrease', () => {
    expect(percentChange(100, 80).value).toBe('-20%');
  });

  it('rejects a zero from-value', () => {
    expect(percentChange(0, 10).error).toBeTruthy();
  });
});

describe('roman numerals', () => {
  it('converts to roman', () => {
    expect(toRoman(1994).value).toBe('MCMXCIV');
    expect(toRoman(58).value).toBe('LVIII');
  });

  it('rejects out-of-range input', () => {
    expect(toRoman(0).error).toBeTruthy();
    expect(toRoman(4000).error).toBeTruthy();
  });

  it('converts from roman', () => {
    expect(fromRoman('MCMXCIV').value).toBe('1994');
    expect(fromRoman('LVIII').value).toBe('58');
  });

  it('rejects invalid roman numerals', () => {
    expect(fromRoman('XXXX').error).toBeTruthy();
  });
});
