import { describe, expect, it } from 'vitest';
import { allStats, mean, median, mode, parseNumbers, stdDev, variance } from '@/lib/tools/stats';

describe('parseNumbers', () => {
  it('accepts space, comma, and newline separators', () => {
    const { numbers, error } = parseNumbers('1, 2 3\n4');
    expect(error).toBeNull();
    expect(numbers).toEqual([1, 2, 3, 4]);
  });

  it('rejects invalid tokens', () => {
    expect(parseNumbers('1 two 3').error).not.toBeNull();
    expect(parseNumbers('abc').error).not.toBeNull();
  });

  it('rejects empty input', () => {
    expect(parseNumbers('').error).not.toBeNull();
    expect(parseNumbers('  ,  ').error).not.toBeNull();
  });
});

describe('mean', () => {
  it('averages values', () => {
    expect(mean([1, 2, 3, 4])).toBe(2.5);
  });

  it('returns NaN for an empty set', () => {
    expect(Number.isNaN(mean([]))).toBe(true);
  });
});

describe('median', () => {
  it('finds the middle of an odd count', () => {
    expect(median([3, 1, 2])).toBe(2);
  });

  it('averages the middle pair of an even count', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });
});

describe('mode', () => {
  it('returns the most frequent values', () => {
    expect(mode([1, 2, 2, 3, 3, 3])).toEqual([3]);
    expect(mode([1, 1, 2, 2])).toEqual([1, 2]);
  });

  it('returns an empty list when no value repeats', () => {
    expect(mode([1, 2, 3, 4])).toEqual([]);
  });
});

describe('variance and stdDev', () => {
  it('computes population variance', () => {
    expect(variance([2, 4, 4, 4, 5, 5, 7, 9], false)).toBeCloseTo(4, 6);
  });

  it('computes sample variance with n - 1', () => {
    expect(variance([2, 4, 4, 4, 5, 5, 7, 9], true)).toBeCloseTo(4.5714, 4);
  });

  it('returns NaN for samples smaller than two', () => {
    expect(Number.isNaN(variance([5], true))).toBe(true);
  });

  it('computes standard deviations', () => {
    expect(stdDev([2, 4, 4, 4, 5, 5, 7, 9], false)).toBeCloseTo(2, 6);
    expect(stdDev([2, 4, 4, 4, 5, 5, 7, 9], true)).toBeCloseTo(2.1381, 4);
  });
});

describe('allStats', () => {
  it('computes the full summary', () => {
    const stats = allStats('1, 2, 2, 3, 4');
    expect(stats.error).toBeNull();
    expect(stats.count).toBe(5);
    expect(stats.sum).toBe(12);
    expect(stats.min).toBe(1);
    expect(stats.max).toBe(4);
    expect(stats.mean).toBe(2.4);
    expect(stats.median).toBe(2);
    expect(stats.modes).toEqual([2]);
    expect(stats.range).toBe(3);
    expect(stats.variancePopulation).toBeCloseTo(1.04, 6);
    expect(stats.stdDevPopulation).toBeCloseTo(1.0198, 4);
    expect(stats.stdDevSample).toBeCloseTo(1.1402, 4);
  });

  it('reports an error for invalid input', () => {
    const stats = allStats('one, two');
    expect(stats.error).not.toBeNull();
    expect(stats.count).toBe(0);
  });
});
