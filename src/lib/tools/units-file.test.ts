import { describe, expect, it } from 'vitest';
import {
  convertFileSize,
  formatFileSizeValue,
  listFileSizes,
  normalizeUnit,
  unitMultiplier,
} from '@/lib/tools/units-file';

describe('unitMultiplier', () => {
  it('uses 1 for bytes', () => {
    expect(unitMultiplier('B')).toBe(1);
  });

  it('uses decimal powers of 1000', () => {
    expect(unitMultiplier('KB')).toBe(1000);
    expect(unitMultiplier('MB')).toBe(1000 ** 2);
    expect(unitMultiplier('GB')).toBe(1000 ** 3);
    expect(unitMultiplier('TB')).toBe(1000 ** 4);
    expect(unitMultiplier('PB')).toBe(1000 ** 5);
  });

  it('uses binary powers of 1024', () => {
    expect(unitMultiplier('KiB')).toBe(1024);
    expect(unitMultiplier('MiB')).toBe(1024 ** 2);
    expect(unitMultiplier('GiB')).toBe(1024 ** 3);
    expect(unitMultiplier('TiB')).toBe(1024 ** 4);
    expect(unitMultiplier('PiB')).toBe(1024 ** 5);
  });
});

describe('normalizeUnit', () => {
  it('is case-insensitive', () => {
    expect(normalizeUnit('mb')).toBe('MB');
    expect(normalizeUnit('gib')).toBe('GiB');
    expect(normalizeUnit('  KB  ')).toBe('KB');
  });

  it('rejects unknown units', () => {
    expect(normalizeUnit('XB')).toBeNull();
    expect(normalizeUnit('')).toBeNull();
  });
});

describe('convertFileSize', () => {
  it('converts across decimal units', () => {
    expect(convertFileSize(1, 'GB', 'MB')).toBe(1000);
    expect(convertFileSize(2, 'GB', 'KB')).toBe(2_000_000);
  });

  it('converts across binary units', () => {
    expect(convertFileSize(1, 'GiB', 'MiB')).toBe(1024);
  });

  it('mixes decimal and binary bases', () => {
    const gigabytes = convertFileSize(1000, 'MB', 'GB');
    const gibibytes = convertFileSize(1000, 'MB', 'GiB');
    expect(gigabytes).toBeCloseTo(1, 6);
    expect(gibibytes).toBeCloseTo(0.931323, 5);
  });
});

describe('formatFileSizeValue', () => {
  it('uses 4 significant digits', () => {
    expect(formatFileSizeValue(0.95367431640625)).toBe('0.9537');
    expect(formatFileSizeValue(12345.678)).toBe('12,350');
  });

  it('handles non-finite values', () => {
    expect(formatFileSizeValue(Number.NaN)).toBe('0');
    expect(formatFileSizeValue(Number.POSITIVE_INFINITY)).toBe('0');
  });
});

describe('listFileSizes', () => {
  it('lists every unit for a value', () => {
    const rows = listFileSizes(1, 'GB');
    expect(rows).toHaveLength(11);
    expect(rows[0]?.unit).toBe('B');
    expect(rows[0]?.value).toBe(1_000_000_000);
    expect(rows[2]?.unit).toBe('MB');
    expect(rows[2]?.value).toBe(1000);
    expect(rows[7]?.unit).toBe('MiB');
    expect(rows[7]?.value).toBeCloseTo(953.674, 3);
  });

  it('formats every row', () => {
    const rows = listFileSizes(1024, 'KiB');
    for (const row of rows) {
      expect(row.formatted.length).toBeGreaterThan(0);
    }
  });
});
