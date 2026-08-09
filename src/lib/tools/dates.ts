export type EpochUnit = 'seconds' | 'milliseconds' | 'microseconds' | 'nanoseconds';

export interface EpochParseResult {
  milliseconds: number;
  unit: EpochUnit;
  error: string | null;
}

export interface DateParseResult {
  date: Date;
  warning: string | null;
  error: string | null;
}

export interface DateDifferenceResult {
  sign: 1 | -1;
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  months: number;
  years: number;
  remainingDays: number;
  error: string | null;
}

export interface CurrentEpochValues {
  seconds: string;
  milliseconds: string;
  microseconds: string;
  nanoseconds: string;
  isoUtc: string;
}

const DIGITS_PATTERN = /^-?\d+$/;

const FALLBACK_ZONES: string[] = [
  'UTC',
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Madrid',
  'Europe/Rome',
  'Europe/Amsterdam',
  'Europe/Stockholm',
  'Europe/Warsaw',
  'Europe/Moscow',
  'Africa/Cairo',
  'Africa/Lagos',
  'Asia/Dubai',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Australia/Sydney',
  'Pacific/Auckland',
];

export function epochUnitForDigits(digitCount: number): EpochUnit | null {
  if (digitCount <= 10) return 'seconds';
  if (digitCount <= 13) return 'milliseconds';
  if (digitCount <= 16) return 'microseconds';
  if (digitCount <= 19) return 'nanoseconds';
  return null;
}

export function parseEpochInput(value: string): EpochParseResult {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return {
      milliseconds: 0,
      unit: 'seconds',
      error: 'Input is empty. Paste a unix timestamp to convert it.',
    };
  }
  if (!DIGITS_PATTERN.test(trimmed)) {
    return {
      milliseconds: 0,
      unit: 'seconds',
      error:
        'Timestamps must contain digits only (optionally with a leading minus for dates before 1970).',
    };
  }
  const unit = epochUnitForDigits(trimmed.replace('-', '').length);
  if (!unit) {
    return {
      milliseconds: 0,
      unit: 'seconds',
      error: 'This number is too large to be a unix timestamp.',
    };
  }
  const raw = Number(trimmed);
  if (Number.isNaN(raw) || !Number.isFinite(raw)) {
    return {
      milliseconds: 0,
      unit: 'seconds',
      error: 'This timestamp is outside the safe integer range.',
    };
  }
  if ((unit === 'seconds' || unit === 'milliseconds') && !Number.isSafeInteger(raw)) {
    return {
      milliseconds: 0,
      unit: 'seconds',
      error: 'This timestamp is outside the safe integer range.',
    };
  }
  const scale: Record<EpochUnit, number> = {
    seconds: 1000,
    milliseconds: 1,
    microseconds: 1 / 1000,
    nanoseconds: 1 / 1_000_000,
  };
  return { milliseconds: raw * scale[unit], unit, error: null };
}

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseDateInput(value: string): DateParseResult {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return {
      date: new Date(0),
      warning: null,
      error: 'Input is empty. Enter a date, ISO string, or unix timestamp.',
    };
  }

  if (DATE_ONLY_PATTERN.test(trimmed)) {
    const [year, month, day] = trimmed.split('-').map(Number);
    if (
      year === undefined ||
      month === undefined ||
      day === undefined ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      return { date: new Date(0), warning: null, error: 'That is not a valid calendar date.' };
    }
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return { date: new Date(0), warning: null, error: 'That is not a valid calendar date.' };
    }
    return { date, warning: 'Date-only input is interpreted in your local timezone.', error: null };
  }

  if (DIGITS_PATTERN.test(trimmed)) {
    const epoch = parseEpochInput(trimmed);
    if (epoch.error) {
      return { date: new Date(0), warning: null, error: epoch.error };
    }
    return {
      date: new Date(epoch.milliseconds),
      warning: `Detected as unix ${epoch.unit}.`,
      error: null,
    };
  }

  const parsed = Date.parse(trimmed);
  if (Number.isNaN(parsed)) {
    return {
      date: new Date(0),
      warning: null,
      error:
        'Could not parse this date. Try ISO 8601 (2026-08-08T10:30:00Z), a date-only value, or a unix timestamp.',
    };
  }
  return { date: new Date(parsed), warning: null, error: null };
}

export function dateDifference(from: Date, to: Date): DateDifferenceResult {
  const fromMs = from.getTime();
  const toMs = to.getTime();
  const deltaMs = toMs - fromMs;
  const sign: 1 | -1 = deltaMs < 0 ? -1 : 1;
  const absMs = Math.abs(deltaMs);

  const totalSeconds = Math.floor(absMs / 1000);
  const totalMinutes = Math.floor(absMs / 60000);
  const totalHours = Math.floor(absMs / 3_600_000);
  const totalDays = Math.floor(absMs / 86_400_000);

  const [earlier, later] = sign === 1 ? [from, to] : [to, from];
  const months = calendarMonthsBetween(earlier, later);
  const years = Math.floor(months / 12);
  const anchor = new Date(
    earlier.getFullYear() + years,
    earlier.getMonth() + months,
    earlier.getDate(),
    earlier.getHours(),
    earlier.getMinutes(),
    earlier.getSeconds(),
    earlier.getMilliseconds()
  );
  const remainingDays = Math.floor((later.getTime() - anchor.getTime()) / 86_400_000);

  return {
    sign,
    totalSeconds,
    totalMinutes,
    totalHours,
    totalDays,
    months,
    years,
    remainingDays,
    error: null,
  };
}

export function calendarMonthsBetween(from: Date, to: Date): number {
  let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) {
    months -= 1;
  }
  return Math.max(0, months);
}

export function formatInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone,
    hour12: false,
  }).format(date);
}

export function timeZoneOffset(date: Date, timeZone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'longOffset',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).formatToParts(date);
    const name = parts.find((part) => part.type === 'timeZoneName')?.value ?? '';
    if (name === 'UTC' || name === 'GMT') return '±00:00';
    const match = name.match(/^GMT([+-]\d{1,2}):(\d{2})$/);
    if (match) {
      const hours = Number(match[1]);
      const minutes = Number(match[2]);
      const sign = hours < 0 ? '-' : '+';
      const absHours = Math.abs(hours).toString().padStart(2, '0');
      return `${sign}${absHours}:${minutes.toString().padStart(2, '0')}`;
    }
    return name;
  } catch {
    return '';
  }
}

export function getTimeZoneList(): string[] {
  let zones: string[] = FALLBACK_ZONES;
  if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function') {
    try {
      const supported = Intl.supportedValuesOf('timeZone');
      if (supported.length > 0) zones = supported;
    } catch {
      /* fall through to the fallback list */
    }
  }
  if (!zones.includes('UTC')) {
    zones = ['UTC', ...zones];
  }
  return zones;
}

export function currentEpochValues(now: Date = new Date()): CurrentEpochValues {
  const ms = now.getTime();
  return {
    seconds: Math.floor(ms / 1000).toString(),
    milliseconds: ms.toString(),
    microseconds: (ms * 1000).toString(),
    nanoseconds: (ms * 1_000_000).toString(),
    isoUtc: now.toISOString(),
  };
}

export function formatUtcIso(date: Date): string {
  return date.toISOString();
}

export function formatLocalIso(date: Date): string {
  const pad = (value: number): string => value.toString().padStart(2, '0');
  const local = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  return local;
}

export function formatRfc2822(date: Date): string {
  return date.toUTCString();
}

export function formatHumanDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
    hour12: false,
  }).format(date);
}

function padTwo(value: number): string {
  return value.toString().padStart(2, '0');
}

export function toLocalInputValue(date: Date): string {
  return `${date.getFullYear()}-${padTwo(date.getMonth() + 1)}-${padTwo(date.getDate())}T${padTwo(date.getHours())}:${padTwo(date.getMinutes())}`;
}

export function fromLocalInputValue(value: string): Date | null {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  nextBirthdayInDays: number;
  error: string | null;
}

export function ageFromDate(birthDate: Date, now: Date = new Date()): AgeResult {
  if (Number.isNaN(birthDate.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      totalWeeks: 0,
      totalHours: 0,
      nextBirthdayInDays: 0,
      error: 'Enter a valid birth date.',
    };
  }
  if (birthDate.getTime() > now.getTime()) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      totalWeeks: 0,
      totalHours: 0,
      nextBirthdayInDays: 0,
      error: 'The birth date cannot be in the future.',
    };
  }
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();
  if (days < 0) {
    months -= 1;
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += previousMonthEnd;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const deltaMs = now.getTime() - birthDate.getTime();
  const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday.getTime() < now.getTime()) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }
  return {
    years,
    months,
    days,
    totalDays: Math.floor(deltaMs / 86_400_000),
    totalWeeks: Math.floor(deltaMs / (7 * 86_400_000)),
    totalHours: Math.floor(deltaMs / 3_600_000),
    nextBirthdayInDays: Math.floor((nextBirthday.getTime() - now.getTime()) / 86_400_000),
    error: null,
  };
}

export interface WorkingDaysResult {
  calendarDays: number;
  workingDays: number;
  weekendDays: number;
  holidayDays: number;
  error: string | null;
}

export function workingDaysBetween(
  from: Date,
  to: Date,
  excludeWeekends: boolean,
  holidays: Date[] = []
): WorkingDaysResult {
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return {
      calendarDays: 0,
      workingDays: 0,
      weekendDays: 0,
      holidayDays: 0,
      error: 'Enter valid start and end dates.',
    };
  }
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  const calendarDays = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  if (calendarDays <= 0) {
    return {
      calendarDays: 0,
      workingDays: 0,
      weekendDays: 0,
      holidayDays: 0,
      error: 'The end date must be on or after the start date.',
    };
  }
  const holidaySet = new Set(
    holidays
      .filter((holiday) => !Number.isNaN(holiday.getTime()))
      .map((holiday) => holiday.toDateString())
  );
  let weekendDays = 0;
  let holidayDays = 0;
  let workingDays = 0;
  const cursor = new Date(start);
  for (let day = 0; day < calendarDays; day += 1) {
    const weekday = cursor.getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const isHoliday = holidaySet.has(cursor.toDateString());
    if (isWeekend) weekendDays += 1;
    if (isHoliday) holidayDays += 1;
    if (excludeWeekends ? !isWeekend && !isHoliday : !isHoliday) workingDays += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return { calendarDays, workingDays, weekendDays, holidayDays, error: null };
}

export type IsoKind = 'utc' | 'offset' | 'local' | 'date-only' | 'basic' | 'invalid';

export interface Iso8601Result {
  kind: IsoKind;
  date: Date | null;
  epochSeconds: string | null;
  epochMilliseconds: string | null;
  utc: string | null;
  local: string | null;
  error: string | null;
}

const BASIC_PATTERN = /^\d{8}T\d{6}(Z|[+-]\d{4})?$/;

export function analyzeIso8601(input: string): Iso8601Result {
  const trimmed = input.trim();
  const invalid: Iso8601Result = {
    kind: 'invalid',
    date: null,
    epochSeconds: null,
    epochMilliseconds: null,
    utc: null,
    local: null,
    error:
      'This is not a valid ISO 8601 string. Try 2026-08-08, 2026-08-08T10:30:00Z, or 2026-08-08T10:30:00+02:00.',
  };
  if (trimmed.length === 0) return invalid;

  let kind: IsoKind = 'local';
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) kind = 'date-only';
  else if (BASIC_PATTERN.test(trimmed)) kind = 'basic';
  else if (/Z$/.test(trimmed)) kind = 'utc';
  else if (/[+-]\d{2}:\d{2}$/.test(trimmed)) kind = 'offset';

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return invalid;

  return {
    kind,
    date: parsed,
    epochSeconds: String(Math.floor(parsed.getTime() / 1000)),
    epochMilliseconds: String(parsed.getTime()),
    utc: parsed.toISOString(),
    local: formatLocalIso(parsed),
    error: null,
  };
}
