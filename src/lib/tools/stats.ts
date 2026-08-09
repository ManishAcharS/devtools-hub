export interface StatsResult {
  count: number;
  sum: number;
  min: number | null;
  max: number | null;
  mean: number | null;
  median: number | null;
  modes: number[];
  range: number | null;
  variancePopulation: number | null;
  varianceSample: number | null;
  stdDevPopulation: number | null;
  stdDevSample: number | null;
  error: string | null;
}

export function parseNumbers(input: string): { numbers: number[]; error: string | null } {
  const tokens = input.split(/[\s,]+/).filter((token) => token.length > 0);
  const numbers: number[] = [];
  for (const token of tokens) {
    const parsed = Number(token);
    if (!Number.isFinite(parsed)) {
      return { numbers: [], error: `"${token}" is not a valid number.` };
    }
    numbers.push(parsed);
  }
  if (numbers.length === 0) {
    return {
      numbers: [],
      error: 'Enter at least one number, separated by spaces, commas, or newlines.',
    };
  }
  return { numbers, error: null };
}

export function mean(values: number[]): number {
  if (values.length === 0) return Number.NaN;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function median(values: number[]): number {
  if (values.length === 0) return Number.NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[middle] ?? Number.NaN;
  return ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2;
}

export function mode(values: number[]): number[] {
  if (values.length === 0) return [];
  const counts = new Map<number, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  let highest = 0;
  for (const count of counts.values()) {
    if (count > highest) highest = count;
  }
  if (highest <= 1) return [];
  const result: number[] = [];
  for (const [value, count] of counts) {
    if (count === highest) result.push(value);
  }
  return result.sort((a, b) => a - b);
}

export function variance(values: number[], sample: boolean): number {
  if (values.length === 0) return Number.NaN;
  if (sample && values.length < 2) return Number.NaN;
  const average = mean(values);
  const squared = values.reduce((sum, value) => sum + (value - average) ** 2, 0);
  return squared / (values.length - (sample ? 1 : 0));
}

export function stdDev(values: number[], sample: boolean): number {
  const spread = variance(values, sample);
  return Number.isNaN(spread) ? Number.NaN : Math.sqrt(spread);
}

export function allStats(input: string): StatsResult {
  const parsed = parseNumbers(input);
  if (parsed.error) {
    return {
      count: 0,
      sum: 0,
      min: null,
      max: null,
      mean: null,
      median: null,
      modes: [],
      range: null,
      variancePopulation: null,
      varianceSample: null,
      stdDevPopulation: null,
      stdDevSample: null,
      error: parsed.error,
    };
  }
  const numbers = parsed.numbers;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const average = mean(numbers);
  const spreadPopulation = variance(numbers, false);
  const spreadSample = variance(numbers, true);
  return {
    count: numbers.length,
    sum: numbers.reduce((total, value) => total + value, 0),
    min,
    max,
    mean: average,
    median: median(numbers),
    modes: mode(numbers),
    range: max - min,
    variancePopulation: spreadPopulation,
    varianceSample: spreadSample,
    stdDevPopulation: stdDev(numbers, false),
    stdDevSample: stdDev(numbers, true),
    error: null,
  };
}

export function formatStatValue(value: number | null, digits = 6): string {
  if (value === null || Number.isNaN(value)) return '\u2014';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value);
}
