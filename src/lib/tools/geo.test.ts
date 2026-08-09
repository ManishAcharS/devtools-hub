import { describe, expect, it } from 'vitest';
import { decimalToDms, dmsToDecimal, formatDms, parseDecimalCoordinate } from '@/lib/tools/geo';

describe('decimalToDms', () => {
  it('converts positive latitude with N hemisphere', () => {
    const dms = decimalToDms(37.7749, true);
    expect(dms.degrees).toBe(37);
    expect(dms.minutes).toBe(46);
    expect(dms.seconds).toBeCloseTo(29.64, 1);
    expect(dms.hemisphere).toBe('N');
  });

  it('converts negative longitude with W hemisphere', () => {
    const dms = decimalToDms(-122.4194, false);
    expect(dms.degrees).toBe(122);
    expect(dms.minutes).toBe(25);
    expect(dms.seconds).toBeCloseTo(9.84, 1);
    expect(dms.hemisphere).toBe('W');
  });

  it('maps signs to S and E', () => {
    expect(decimalToDms(-33.8688, true).hemisphere).toBe('S');
    expect(decimalToDms(151.2093, false).hemisphere).toBe('E');
  });

  it('treats zero as north and east', () => {
    expect(decimalToDms(0, true).hemisphere).toBe('N');
    expect(decimalToDms(0, false).hemisphere).toBe('E');
  });
});

describe('dmsToDecimal', () => {
  it('converts N and E values as positive', () => {
    expect(dmsToDecimal(37, 46, 29.64, 'N')).toBeCloseTo(37.7749, 4);
    expect(dmsToDecimal(151, 12, 33.48, 'E')).toBeCloseTo(151.2093, 4);
  });

  it('converts S and W values as negative', () => {
    expect(dmsToDecimal(122, 25, 9.84, 'W')).toBeCloseTo(-122.4194, 4);
    expect(dmsToDecimal(33, 52, 7.68, 'S')).toBeCloseTo(-33.8688, 4);
  });

  it('clamps out-of-range minutes and seconds', () => {
    expect(dmsToDecimal(10, 61, 30, 'N')).toBeCloseTo(11.00833, 4);
    expect(dmsToDecimal(10, 0, 90, 'N')).toBeCloseTo(10.01667, 4);
  });
});

describe('round-trip', () => {
  it('decimal -> DMS -> decimal preserves the value', () => {
    const samples = [
      37.7749, -122.4194, 51.5074, -0.1278, 35.6895, 139.6917, 0, 89.9999, -179.9999,
    ];
    for (const sample of samples) {
      const part = decimalToDms(sample, sample >= 0);
      const roundTrip = dmsToDecimal(part.degrees, part.minutes, part.seconds, part.hemisphere);
      expect(roundTrip).toBeCloseTo(sample, 4);
    }
  });
});

describe('formatDms', () => {
  it('formats with the requested precision', () => {
    const dms = decimalToDms(37.7749, true);
    expect(formatDms(dms, 2)).toContain('N');
    expect(formatDms(dms, 0)).toContain('30\u2033');
  });
});

describe('parseDecimalCoordinate', () => {
  it('accepts valid coordinates', () => {
    const result = parseDecimalCoordinate('37.7749', '-122.4194');
    expect(result.error).toBeNull();
    expect(result.latitude).toBe(37.7749);
    expect(result.longitude).toBe(-122.4194);
  });

  it('rejects out-of-range values', () => {
    expect(parseDecimalCoordinate('91', '0').error).not.toBeNull();
    expect(parseDecimalCoordinate('0', '181').error).not.toBeNull();
    expect(parseDecimalCoordinate('0', '-181').error).not.toBeNull();
  });

  it('rejects non-numeric values', () => {
    expect(parseDecimalCoordinate('abc', '10').error).not.toBeNull();
    expect(parseDecimalCoordinate('', '10').error).not.toBeNull();
  });
});
