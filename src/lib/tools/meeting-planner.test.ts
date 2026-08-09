import { describe, expect, it } from 'vitest';
import {
  findOverlaps,
  formatOverlapWindow,
  shiftWindowToZone,
  workingHourSet,
  type TimeZoneOffset,
} from '@/lib/tools/meeting-planner';

const utc: TimeZoneOffset = { name: 'UTC', offsetMinutes: 0 };
const london: TimeZoneOffset = { name: 'London', offsetMinutes: 60 };
const newYork: TimeZoneOffset = { name: 'New York', offsetMinutes: -240 };
const tokyo: TimeZoneOffset = { name: 'Tokyo', offsetMinutes: 540 };
const kolkata: TimeZoneOffset = { name: 'Kolkata', offsetMinutes: 330 };

describe('findOverlaps', () => {
  it('returns the full working window for a single zone', () => {
    const overlaps = findOverlaps([utc], 9, 17);
    expect(overlaps).toEqual([[9, 17]]);
  });

  it('intersects aligned zones in UTC hours', () => {
    const overlaps = findOverlaps([utc, london, newYork], 9, 17);
    expect(overlaps).toEqual([[13, 16]]);
  });

  it('reports no overlap when same-day windows never meet', () => {
    const overlaps = findOverlaps([newYork, tokyo], 9, 17);
    expect(overlaps).toEqual([]);
  });

  it('splits windows that cross midnight', () => {
    const losAngeles: TimeZoneOffset = { name: 'Los Angeles', offsetMinutes: -420 };
    const honolulu: TimeZoneOffset = { name: 'Honolulu', offsetMinutes: -600 };
    const overlaps = findOverlaps([losAngeles, honolulu], 9, 17);
    expect(overlaps).toEqual([[19, 24]]);
  });

  it('returns empty for disjoint windows', () => {
    const east: TimeZoneOffset = { name: 'East', offsetMinutes: 480 };
    const west: TimeZoneOffset = { name: 'West', offsetMinutes: -480 };
    expect(findOverlaps([east, west], 9, 17)).toEqual([]);
  });

  it('is independent of zone order', () => {
    const a = findOverlaps([utc, kolkata], 9, 17);
    const b = findOverlaps([kolkata, utc], 9, 17);
    expect(a).toEqual(b);
    expect(a).toEqual([[9, 11.5]]);
  });

  it('treats equal zones as a single window', () => {
    const overlaps = findOverlaps([utc, { name: 'GMT', offsetMinutes: 0 }], 8, 18);
    expect(overlaps).toEqual([[8, 18]]);
  });

  it('returns empty for invalid hours', () => {
    expect(findOverlaps([utc], 17, 9)).toEqual([]);
    expect(findOverlaps([utc], -1, 9)).toEqual([]);
    expect(findOverlaps([utc], 9, 25)).toEqual([]);
    expect(findOverlaps([], 9, 17)).toEqual([]);
  });
});

describe('shiftWindowToZone', () => {
  it('shifts a window between offsets', () => {
    const shifted = shiftWindowToZone([9, 17], 0, 60);
    expect(shifted).toEqual([[10, 18]]);
  });

  it('splits windows that wrap past midnight', () => {
    const shifted = shiftWindowToZone([23, 3], 0, 120);
    expect(shifted).toEqual([[1, 5]]);
  });
});

describe('workingHourSet', () => {
  it('marks reference-zone hours as working', () => {
    const hours = workingHourSet(utc, utc, 9, 17);
    expect(hours.has(9)).toBe(true);
    expect(hours.has(16)).toBe(true);
    expect(hours.has(17)).toBe(false);
    expect(hours.size).toBe(8);
  });

  it('shifts working hours of another zone', () => {
    const hours = workingHourSet(kolkata, utc, 9, 17);
    expect(hours.has(9)).toBe(true);
    expect(hours.has(11)).toBe(true);
    expect(hours.has(12)).toBe(false);
  });
});

describe('formatOverlapWindow', () => {
  it('formats whole hours with AM/PM', () => {
    expect(formatOverlapWindow({ startHour: 9, endHour: 17 })).toBe('9:00 AM – 5:00 PM');
    expect(formatOverlapWindow({ startHour: 0, endHour: 12 })).toBe('12:00 AM – 12:00 PM');
  });
});
