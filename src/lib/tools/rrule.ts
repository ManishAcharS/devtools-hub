export type RruleFreq = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type Weekday = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';

export interface RruleOptions {
  freq: RruleFreq;
  interval: number;
  byDay: Weekday[];
  count?: number;
}

const WEEKDAY_ORDER: Weekday[] = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

const WEEKDAY_JS_DAY: Record<Weekday, number> = {
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
  SU: 0,
};

export function buildRrule(options: RruleOptions): string {
  const parts: string[] = [`FREQ=${options.freq.toUpperCase()}`];
  if (options.interval > 1) {
    parts.push(`INTERVAL=${options.interval}`);
  }
  if (options.byDay.length > 0) {
    parts.push(`BYDAY=${options.byDay.join(',')}`);
  }
  if (options.count !== undefined && options.count > 0) {
    parts.push(`COUNT=${options.count}`);
  }
  return parts.join(';');
}

export function parseRrule(rrule: string): RruleOptions {
  const options: RruleOptions = { freq: 'daily', interval: 1, byDay: [] };
  for (const part of rrule.split(';')) {
    const separator = part.indexOf('=');
    if (separator === -1) continue;
    const key = part.slice(0, separator).toUpperCase();
    const value = part.slice(separator + 1);
    if (key === 'FREQ') {
      const freq = value.toLowerCase();
      if (freq === 'daily' || freq === 'weekly' || freq === 'monthly' || freq === 'yearly') {
        options.freq = freq;
      }
    } else if (key === 'INTERVAL') {
      const interval = Number(value);
      if (Number.isInteger(interval) && interval > 0) options.interval = interval;
    } else if (key === 'BYDAY') {
      options.byDay = value
        .split(',')
        .filter((day): day is Weekday => (WEEKDAY_ORDER as string[]).includes(day.toUpperCase()))
        .map((day) => day.toUpperCase() as Weekday);
    } else if (key === 'COUNT') {
      const count = Number(value);
      if (Number.isInteger(count) && count > 0) options.count = count;
    }
  }
  return options;
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function expandRrule(rrule: string, startDate: Date, count: number): Date[] {
  const options = parseRrule(rrule);
  const limit = options.count !== undefined ? Math.min(count, options.count) : count;
  if (limit <= 0) return [];
  const dates: Date[] = [];

  if (options.freq === 'weekly' && options.byDay.length > 0) {
    const start = startOfUtcDay(startDate);
    const startWeekday = start.getUTCDay();
    const targetDays = options.byDay.map((day) => WEEKDAY_JS_DAY[day]).sort((a, b) => a - b);
    for (let week = 0; dates.length < limit; week += 1) {
      const weekStart = new Date(start.getTime() + week * options.interval * 7 * 86_400_000);
      for (const targetDay of targetDays) {
        const delta = (targetDay + 7 - startWeekday) % 7;
        const candidate = new Date(weekStart.getTime() + delta * 86_400_000);
        if (candidate.getTime() >= start.getTime()) {
          dates.push(candidate);
          if (dates.length >= limit) break;
        }
      }
    }
  } else if (options.freq === 'weekly') {
    for (let index = 0; index < limit; index += 1) {
      const date = new Date(startDate.getTime() + index * options.interval * 7 * 86_400_000);
      dates.push(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())));
    }
  } else if (options.freq === 'monthly') {
    for (let index = 0; index < limit; index += 1) {
      const year = startDate.getUTCFullYear();
      const month = startDate.getUTCMonth() + index * options.interval;
      const day = startDate.getUTCDate();
      const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      dates.push(new Date(Date.UTC(year, month, Math.min(day, lastDay))));
    }
  } else if (options.freq === 'yearly') {
    for (let index = 0; index < limit; index += 1) {
      const year = startDate.getUTCFullYear() + index * options.interval;
      const month = startDate.getUTCMonth();
      const day = startDate.getUTCDate();
      const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      dates.push(new Date(Date.UTC(year, month, Math.min(day, lastDay))));
    }
  } else {
    for (let index = 0; index < limit; index += 1) {
      const date = new Date(startDate.getTime() + index * options.interval * 86_400_000);
      dates.push(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())));
    }
  }
  return dates;
}

export function formatRruleDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
