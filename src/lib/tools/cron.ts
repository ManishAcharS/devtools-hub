export type CronField = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek';

export const CRON_FIELD_DEFINITIONS: Record<
  CronField,
  { label: string; min: number; max: number; names?: Record<number, string> }
> = {
  minute: { label: 'Minute', min: 0, max: 59 },
  hour: { label: 'Hour', min: 0, max: 23 },
  dayOfMonth: { label: 'Day of month', min: 1, max: 31 },
  month: {
    label: 'Month',
    min: 1,
    max: 12,
    names: {
      1: 'JAN',
      2: 'FEB',
      3: 'MAR',
      4: 'APR',
      5: 'MAY',
      6: 'JUN',
      7: 'JUL',
      8: 'AUG',
      9: 'SEP',
      10: 'OCT',
      11: 'NOV',
      12: 'DEC',
    },
  },
  dayOfWeek: {
    label: 'Day of week',
    min: 0,
    max: 6,
    names: { 0: 'SUN', 1: 'MON', 2: 'TUE', 3: 'WED', 4: 'THU', 5: 'FRI', 6: 'SAT' },
  },
};

export interface CronParseResult {
  fields: Record<CronField, string>;
  valid: boolean;
  error: string | null;
  human: string | null;
  nextRun: Date | null;
}

const STAR = '*';
const EVERY = '*/';

export function parseCronExpression(expression: string): CronParseResult {
  const trimmed = expression.trim();
  const invalid: CronParseResult = {
    fields: { minute: '', hour: '', dayOfMonth: '', month: '', dayOfWeek: '' },
    valid: false,
    error: 'Enter a cron expression with 5 fields (e.g. 0 12 * * 1).',
    human: null,
    nextRun: null,
  };

  if (trimmed.length === 0) return invalid;

  const parts = trimmed.split(/\s+/);
  if (parts.length !== 5) {
    return {
      ...invalid,
      error:
        'A standard cron expression has exactly 5 fields: minute hour dayOfMonth month dayOfWeek.',
    };
  }

  const fields: CronParseResult['fields'] = {
    minute: parts[0],
    hour: parts[1],
    dayOfMonth: parts[2],
    month: parts[3],
    dayOfWeek: parts[4],
  };

  for (const [fieldName, value] of Object.entries(fields)) {
    const definition = CRON_FIELD_DEFINITIONS[fieldName as CronField];
    if (!validateCronField(value, definition)) {
      return {
        ...invalid,
        error: `Invalid value for ${definition.label}: "${value}". Use ${definition.min}-${definition.max}, */n, comma-separated, or *.`,
      };
    }
  }

  const human = humanizeCron(fields);
  const nextRun = computeNextRun(fields);

  return { fields, valid: true, error: null, human, nextRun };
}

function validateCronField(
  value: string,
  definition: { label: string; min: number; max: number; names?: Record<number, string> }
): boolean {
  const segments = value.split(',');
  for (const segment of segments) {
    if (segment === STAR) continue;
    if (segment.startsWith(EVERY)) {
      const step = Number(segment.slice(2));
      if (!Number.isInteger(step) || step < 1 || step > definition.max) return false;
      continue;
    }
    if (segment.includes('-')) {
      const [start, end] = segment.split('-').map(Number);
      if (!Number.isInteger(start) || !Number.isInteger(end)) return false;
      if (start < definition.min || end > definition.max || start >= end) return false;
      continue;
    }
    const num = Number(segment);
    if (!Number.isInteger(num)) return false;
    if (num < definition.min || num > definition.max) return false;
  }
  return true;
}

function humanizeCron(fields: CronParseResult['fields']): string {
  const minute = fields.minute === STAR ? 'every minute' : fields.minute;
  const hour = fields.hour === STAR ? 'every hour' : fields.hour;
  const dayOfMonth = fields.dayOfMonth === STAR ? 'every day' : fields.dayOfMonth;
  const month = fields.month === STAR ? 'every month' : fields.month;
  const dayOfWeek = fields.dayOfWeek === STAR ? 'every day of the week' : fields.dayOfWeek;

  return `At ${minute} minutes past ${hour}, on ${dayOfMonth}, in ${month}, on ${dayOfWeek}.`;
}

function computeNextRun(fields: CronParseResult['fields']): Date | null {
  const now = new Date();
  const candidate = new Date(now);
  candidate.setSeconds(0, 0);

  const maxAttempts = 366 * 24 * 60;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (matchesCron(candidate, fields)) return new Date(candidate);
    candidate.setMinutes(candidate.getMinutes() + 1);
  }
  return null;
}

function matchesCron(date: Date, fields: CronParseResult['fields']): boolean {
  if (!matchField(date.getMinutes(), fields.minute, 0, 59)) return false;
  if (!matchField(date.getHours(), fields.hour, 0, 23)) return false;
  if (!matchField(date.getDate(), fields.dayOfMonth, 1, 31)) return false;
  if (!matchField(date.getMonth() + 1, fields.month, 1, 12)) return false;
  if (!matchField(date.getDay(), fields.dayOfWeek, 0, 6)) return false;
  return true;
}

function matchField(value: number, expression: string, min: number, max: number): boolean {
  if (expression === STAR) return true;
  const segments = expression.split(',');
  for (const segment of segments) {
    if (segment.startsWith(EVERY)) {
      const step = Number(segment.slice(2));
      if ((value - min) % step === 0) return true;
      continue;
    }
    if (segment.includes('-')) {
      const [start, end] = segment.split('-').map(Number);
      if (value >= start && value <= end) return true;
      continue;
    }
    if (Number(segment) === value) return true;
  }
  return false;
}
