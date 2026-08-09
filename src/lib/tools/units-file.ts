export type FileSizeUnit =
  'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'KiB' | 'MiB' | 'GiB' | 'TiB' | 'PiB';

export interface FileSizeRow {
  unit: FileSizeUnit;
  value: number;
  formatted: string;
}

const DECIMAL_UNITS: FileSizeUnit[] = ['KB', 'MB', 'GB', 'TB', 'PB'];
const BINARY_UNITS: FileSizeUnit[] = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB'];

export const FILE_SIZE_UNITS: FileSizeUnit[] = [
  'B',
  'KB',
  'MB',
  'GB',
  'TB',
  'PB',
  'KiB',
  'MiB',
  'GiB',
  'TiB',
  'PiB',
];

export function unitMultiplier(unit: FileSizeUnit): number {
  if (unit === 'B') return 1;
  if (unit.endsWith('iB')) {
    return 1024 ** (BINARY_UNITS.indexOf(unit) + 1);
  }
  return 1000 ** (DECIMAL_UNITS.indexOf(unit) + 1);
}

export function normalizeUnit(value: string): FileSizeUnit | null {
  const upper = value.trim().toUpperCase();
  const index = FILE_SIZE_UNITS.findIndex((unit) => unit.toUpperCase() === upper);
  return index === -1 ? null : FILE_SIZE_UNITS[index];
}

export function convertFileSize(value: number, from: FileSizeUnit, to: FileSizeUnit): number {
  return (value * unitMultiplier(from)) / unitMultiplier(to);
}

export function formatFileSizeValue(value: number): string {
  if (!Number.isFinite(value)) return '0';
  return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 4 }).format(value);
}

export function listFileSizes(value: number, from: FileSizeUnit): FileSizeRow[] {
  return FILE_SIZE_UNITS.map((unit) => {
    const converted = convertFileSize(value, from, unit);
    return { unit, value: converted, formatted: formatFileSizeValue(converted) };
  });
}
