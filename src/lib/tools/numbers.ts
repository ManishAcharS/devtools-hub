const BASE_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export interface BaseConversionResult {
  value: string;
  error: string | null;
}

export interface PercentageResult {
  value: string;
  formula: string;
  error: string | null;
}

function digitToValue(character: string): number {
  return BASE_ALPHABET.indexOf(character.toUpperCase());
}

function valueToDigit(value: number): string {
  return BASE_ALPHABET.charAt(value);
}

export function validateBaseInput(
  input: string,
  base: number
): { integer: string; fraction: string | null; error: string | null } {
  const trimmed = input.trim().toUpperCase();
  if (trimmed.length === 0) {
    return {
      integer: '',
      fraction: null,
      error: 'Input is empty. Enter a number in the source base.',
    };
  }
  if (base < 2 || base > 36) {
    return { integer: '', fraction: null, error: 'Bases must be between 2 and 36.' };
  }
  if (trimmed.includes('.')) {
    const parts = trimmed.split('.');
    if (parts.length > 2) {
      return {
        integer: '',
        fraction: null,
        error: 'A number may contain at most one decimal point.',
      };
    }
    if (parts[1]?.length === 0) {
      return { integer: '', fraction: null, error: 'The fractional part is empty.' };
    }
  }
  for (const character of trimmed) {
    if (character === '.') continue;
    if (!/^[0-9A-Z]$/.test(character)) {
      return {
        integer: '',
        fraction: null,
        error: `"${character}" is not a valid digit for base ${base}.`,
      };
    }
    if (digitToValue(character) >= base) {
      return {
        integer: '',
        fraction: null,
        error: `"${character}" is not a valid digit for base ${base}.`,
      };
    }
  }
  const dotIndex = trimmed.indexOf('.');
  const integer = dotIndex === -1 ? trimmed : trimmed.slice(0, dotIndex);
  const fraction = dotIndex === -1 ? null : trimmed.slice(dotIndex + 1);
  return { integer, fraction, error: null };
}

export function convertBase(input: string, fromBase: number, toBase: number): BaseConversionResult {
  const validation = validateBaseInput(input, fromBase);
  if (validation.error) {
    return { value: '', error: validation.error };
  }
  if (validation.integer === '' && validation.fraction === null) {
    return { value: '', error: 'Input is empty. Enter a number in the source base.' };
  }

  let integerValue = BigInt(0);
  for (const character of validation.integer) {
    integerValue = integerValue * BigInt(fromBase) + BigInt(digitToValue(character));
  }
  let integerOutput = integerValue === BigInt(0) ? '0' : '';
  let working = integerValue;
  while (working > BigInt(0)) {
    const remainder = Number(working % BigInt(toBase));
    integerOutput = valueToDigit(remainder) + integerOutput;
    working = working / BigInt(toBase);
  }

  let fractionOutput = '';
  if (validation.fraction !== null) {
    let numerator = BigInt(0);
    for (const character of validation.fraction) {
      numerator = numerator * BigInt(fromBase) + BigInt(digitToValue(character));
    }
    const denominator = BigInt(fromBase) ** BigInt(validation.fraction.length);
    const maxDigits = 12;
    for (let i = 0; i < maxDigits; i += 1) {
      numerator = numerator * BigInt(toBase);
      const digit = numerator / denominator;
      fractionOutput += valueToDigit(Number(digit));
      numerator = numerator % denominator;
      if (numerator === BigInt(0)) break;
    }
    fractionOutput = fractionOutput.replace(/0+$/, '');
  }

  return {
    value: `${integerOutput}${fractionOutput ? `.${fractionOutput}` : ''}`,
    error: null,
  };
}

export function percentOf(percent: number, of: number): PercentageResult {
  if (!Number.isFinite(percent) || !Number.isFinite(of)) {
    return { value: '', formula: '', error: 'Both values must be numbers.' };
  }
  const result = (percent / 100) * of;
  return {
    value: formatResult(result),
    formula: `${formatNumber(percent)}% of ${formatNumber(of)} = (${formatNumber(percent)} ÷ 100) × ${formatNumber(of)}`,
    error: null,
  };
}

export function isWhatPercent(part: number, whole: number): PercentageResult {
  if (!Number.isFinite(part) || !Number.isFinite(whole)) {
    return { value: '', formula: '', error: 'Both values must be numbers.' };
  }
  if (whole === 0) {
    return { value: '', formula: '', error: 'The whole cannot be zero when finding a percentage.' };
  }
  const result = (part / whole) * 100;
  return {
    value: `${formatResult(result)}%`,
    formula: `${formatNumber(part)} ÷ ${formatNumber(whole)} × 100`,
    error: null,
  };
}

export function percentChange(from: number, to: number): PercentageResult {
  if (!Number.isFinite(from) || !Number.isFinite(to)) {
    return { value: '', formula: '', error: 'Both values must be numbers.' };
  }
  if (from === 0) {
    return {
      value: '',
      formula: '',
      error: 'The starting value cannot be zero when measuring change.',
    };
  }
  const result = ((to - from) / Math.abs(from)) * 100;
  return {
    value: `${result >= 0 ? '+' : ''}${formatResult(result)}%`,
    formula: `(${formatNumber(to)} − ${formatNumber(from)}) ÷ |${formatNumber(from)}| × 100`,
    error: null,
  };
}

function formatResult(value: number): string {
  if (!Number.isFinite(value)) return '0';
  const rounded = Number(value.toFixed(6));
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(rounded);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(value);
}

const ROMAN_NUMERALS: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

const ROMAN_PATTERN = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

export interface RomanResult {
  value: string;
  error: string | null;
}

export function toRoman(input: number): RomanResult {
  if (!Number.isInteger(input)) {
    return { value: '', error: 'Only whole numbers can be converted to Roman numerals.' };
  }
  if (input < 1 || input > 3999) {
    return { value: '', error: 'Classic Roman numerals support values from 1 to 3999.' };
  }
  let remaining = input;
  let output = '';
  for (const [value, numeral] of ROMAN_NUMERALS) {
    while (remaining >= value) {
      output += numeral;
      remaining -= value;
    }
  }
  return { value: output, error: null };
}

export function fromRoman(input: string): RomanResult {
  const trimmed = input.trim().toUpperCase();
  if (trimmed.length === 0) {
    return { value: '', error: 'Input is empty. Enter a Roman numeral such as MCMXCIV.' };
  }
  if (!ROMAN_PATTERN.test(trimmed)) {
    return {
      value: '',
      error:
        'This is not a valid Roman numeral. Only M, D, C, L, X, V and I are allowed, in classic order.',
    };
  }
  let total = 0;
  let previous = 0;
  for (let i = trimmed.length - 1; i >= 0; i -= 1) {
    const numeral = trimmed.charAt(i);
    const value = numeralValues[numeral] ?? 0;
    if (value === 0) {
      return { value: '', error: `"${numeral}" is not a Roman numeral character.` };
    }
    if (value < previous) {
      total -= value;
    } else {
      total += value;
      previous = value;
    }
  }
  if (total < 1 || total > 3999) {
    return { value: '', error: 'Classic Roman numerals cover values from 1 to 3999.' };
  }
  return { value: total.toString(), error: null };
}

const numeralValues: Record<string, number> = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
