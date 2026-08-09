import { describe, expect, it } from 'vitest';
import {
  calendarMonthsBetween,
  dateDifference,
  epochUnitForDigits,
  fromLocalInputValue,
  parseEpochInput,
  toLocalInputValue,
} from '@/lib/tools/dates';

describe('epochUnitForDigits', () => {
  it('classifies by digit count', () => {
    expect(epochUnitForDigits(10)).toBe('seconds');
    expect(epochUnitForDigits(13)).toBe('milliseconds');
    expect(epochUnitForDigits(16)).toBe('microseconds');
    expect(epochUnitForDigits(19)).toBe('nanoseconds');
    expect(epochUnitForDigits(20)).toBeNull();
  });
});

describe('parseEpochInput', () => {
  it('parses seconds, milliseconds, and microseconds', () => {
    expect(parseEpochInput('1609459200').unit).toBe('seconds');
    expect(parseEpochInput('1609459200000').unit).toBe('milliseconds');
    expect(parseEpochInput('1609459200000000').unit).toBe('microseconds');
  });

  it('rejects non-numeric input with an error', () => {
    const result = parseEpochInput('abc');
    expect(result.error).not.toBeNull();
    expect(result.error).toMatch(/digits/i);
  });

  it('converts seconds to milliseconds', () => {
    const result = parseEpochInput('1609459200');
    expect(result.milliseconds).toBe(1609459200000);
  });

  it('handles negative timestamps', () => {
    const result = parseEpochInput('-1');
    expect(result.milliseconds).toBe(-1000);
  });
});

describe('dateDifference', () => {
  it('computes the gap between two dates', () => {
    const from = new Date('2024-01-01T00:00:00Z');
    const to = new Date('2024-01-11T12:00:00Z');
    const result = dateDifference(from, to);
    expect(result.totalDays).toBe(10);
    expect(result.totalHours).toBe(10 * 24 + 12);
    expect(result.error).toBeNull();
  });

  it('signs reversed inputs correctly', () => {
    const from = new Date('2024-01-11T00:00:00Z');
    const to = new Date('2024-01-01T00:00:00Z');
    const result = dateDifference(from, to);
    expect(result.sign).toBe(-1);
    expect(result.totalDays).toBe(10);
  });
});

describe('calendarMonthsBetween', () => {
  it('counts full calendar months', () => {
    expect(calendarMonthsBetween(new Date('2024-01-15'), new Date('2024-05-15'))).toBe(4);
  });

  it('does not count a partial month', () => {
    expect(calendarMonthsBetween(new Date('2024-01-15'), new Date('2024-05-10'))).toBe(3);
  });
});

describe('local input conversion', () => {
  it('round-trips local input values', () => {
    const value = '2024-06-15T10:30';
    const date = fromLocalInputValue(value);
    expect(date).not.toBeNull();
    expect(toLocalInputValue(date!)).toBe(value);
  });

  it('rejects invalid values', () => {
    expect(fromLocalInputValue('nope')).toBeNull();
  });
});
