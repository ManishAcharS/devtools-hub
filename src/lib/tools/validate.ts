export function isNonEmptyTrimmed(value: string): boolean {
  return value.trim().length > 0;
}

export function parseStrictInt(value: string): number | null {
  const trimmed = value.trim();
  if (!/^-?\d+$/.test(trimmed)) return null;
  const parsed = Number(trimmed);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export function parseStrictFloat(value: string): number | null {
  const trimmed = value.trim();
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export interface BoundedIntOptions {
  min?: number;
  max?: number;
  label?: string;
}

export function parseBoundedInt(
  value: string,
  options: BoundedIntOptions = {}
): { value: number; error: string | null } {
  const { min, max, label = 'Value' } = options;
  const parsed = parseStrictInt(value);
  if (parsed === null) {
    return { value: 0, error: `${label} must be a whole number.` };
  }
  if (min !== undefined && parsed < min) {
    return { value: min, error: `${label} must be at least ${min}.` };
  }
  if (max !== undefined && parsed > max) {
    return { value: max, error: `${label} must be at most ${max}.` };
  }
  return { value: parsed, error: null };
}

export function parseBoundedFloat(
  value: string,
  options: BoundedIntOptions & { maxFractionDigits?: number } = {}
): { value: number; error: string | null } {
  const { min, max, label = 'Value' } = options;
  const parsed = parseStrictFloat(value);
  if (parsed === null) {
    return { value: 0, error: `${label} must be a number.` };
  }
  if (min !== undefined && parsed < min) {
    return { value: min, error: `${label} must be at least ${min}.` };
  }
  if (max !== undefined && parsed > max) {
    return { value: max, error: `${label} must be at most ${max}.` };
  }
  return { value: parsed, error: null };
}

export function formatNumber(value: number, maxFractionDigits = 4): string {
  const fixed = Number(value.toFixed(maxFractionDigits));
  if (Number.isNaN(fixed)) return '0';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: maxFractionDigits }).format(fixed);
}
