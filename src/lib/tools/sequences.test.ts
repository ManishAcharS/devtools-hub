import { describe, expect, it } from 'vitest';
import { factorial, factorialTrailingZeros, fibonacciTerms } from '@/lib/tools/sequences';

describe('factorial', () => {
  it('returns 1 for small edge cases', () => {
    expect(factorial(0)).toBe(BigInt(1));
    expect(factorial(1)).toBe(BigInt(1));
  });

  it('computes exact values', () => {
    expect(factorial(5)).toBe(BigInt(120));
    expect(factorial(10)).toBe(BigInt(3_628_800));
  });

  it('stays exact beyond Number precision', () => {
    expect(factorial(21)).toBe(BigInt('51090942171709440000'));
    expect(factorial(25)).toBe(BigInt('15511210043330985984000000'));
  });
});

describe('factorialTrailingZeros', () => {
  it('counts trailing zeros', () => {
    expect(factorialTrailingZeros(factorial(5))).toBe(1);
    expect(factorialTrailingZeros(factorial(10))).toBe(2);
    expect(factorialTrailingZeros(factorial(25))).toBe(6);
    expect(factorialTrailingZeros(factorial(0))).toBe(0);
  });
});

describe('fibonacciTerms', () => {
  it('generates the first terms', () => {
    expect(fibonacciTerms(8).map(String)).toEqual(['0', '1', '1', '2', '3', '5', '8', '13']);
  });

  it('handles a single term and empty input', () => {
    expect(fibonacciTerms(1)).toEqual([BigInt(0)]);
    expect(fibonacciTerms(0)).toEqual([]);
    expect(fibonacciTerms(-3)).toEqual([]);
  });

  it('supports large term counts', () => {
    const terms = fibonacciTerms(100);
    expect(terms).toHaveLength(100);
    expect(terms[99]).toBe(BigInt('218922995834555169026'));
  });
});
