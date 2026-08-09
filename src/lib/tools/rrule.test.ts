import { describe, expect, it } from 'vitest';
import { buildRrule, expandRrule, parseRrule } from '@/lib/tools/rrule';

const start = new Date(Date.UTC(2026, 7, 10));

describe('buildRrule', () => {
  it('builds a daily rule', () => {
    expect(buildRrule({ freq: 'daily', interval: 1, byDay: [] })).toBe('FREQ=DAILY');
  });

  it('includes interval when greater than one', () => {
    expect(buildRrule({ freq: 'weekly', interval: 2, byDay: ['MO'] })).toBe(
      'FREQ=WEEKLY;INTERVAL=2;BYDAY=MO'
    );
  });

  it('includes count when provided', () => {
    expect(buildRrule({ freq: 'monthly', interval: 1, byDay: [], count: 5 })).toBe(
      'FREQ=MONTHLY;COUNT=5'
    );
  });
});

describe('parseRrule', () => {
  it('round-trips a full rule', () => {
    const parsed = parseRrule('FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE;COUNT=10');
    expect(parsed.freq).toBe('weekly');
    expect(parsed.interval).toBe(2);
    expect(parsed.byDay).toEqual(['MO', 'WE']);
    expect(parsed.count).toBe(10);
  });

  it('falls back to safe defaults for garbage', () => {
    const parsed = parseRrule('FREQ=HOURLY;INTERVAL=-3;BYDAY=XX');
    expect(parsed.freq).toBe('daily');
    expect(parsed.interval).toBe(1);
    expect(parsed.byDay).toEqual([]);
  });
});

describe('expandRrule', () => {
  it('expands daily rules', () => {
    const dates = expandRrule('FREQ=DAILY', start, 3);
    expect(dates.map((date) => date.toISOString().slice(0, 10))).toEqual([
      '2026-08-10',
      '2026-08-11',
      '2026-08-12',
    ]);
  });

  it('expands weekly rules with an interval', () => {
    const dates = expandRrule('FREQ=WEEKLY;INTERVAL=2', start, 3);
    expect(dates.map((date) => date.toISOString().slice(0, 10))).toEqual([
      '2026-08-10',
      '2026-08-24',
      '2026-09-07',
    ]);
  });

  it('expands weekly rules with BYDAY', () => {
    const dates = expandRrule('FREQ=WEEKLY;BYDAY=MO,FR', start, 4);
    expect(dates.map((date) => date.toISOString().slice(0, 10))).toEqual([
      '2026-08-10',
      '2026-08-14',
      '2026-08-17',
      '2026-08-21',
    ]);
  });

  it('expands monthly rules with day clamping', () => {
    const jan31 = new Date(Date.UTC(2026, 0, 31));
    const dates = expandRrule('FREQ=MONTHLY', jan31, 3);
    expect(dates.map((date) => date.toISOString().slice(0, 10))).toEqual([
      '2026-01-31',
      '2026-02-28',
      '2026-03-31',
    ]);
  });

  it('expands yearly rules and clamps leap day', () => {
    const leapDay = new Date(Date.UTC(2024, 1, 29));
    const dates = expandRrule('FREQ=YEARLY', leapDay, 2);
    expect(dates.map((date) => date.toISOString().slice(0, 10))).toEqual([
      '2024-02-29',
      '2025-02-28',
    ]);
  });

  it('respects the COUNT limit', () => {
    const dates = expandRrule('FREQ=DAILY;COUNT=4', start, 10);
    expect(dates).toHaveLength(4);
  });

  it('returns nothing for a zero count', () => {
    expect(expandRrule('FREQ=DAILY', start, 0)).toEqual([]);
  });
});
