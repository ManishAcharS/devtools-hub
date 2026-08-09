const ONES = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];

const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const SCALES = [
  '',
  'thousand',
  'million',
  'billion',
  'trillion',
  'quadrillion',
  'quintillion',
  'sextillion',
  'septillion',
  'octillion',
  'nonillion',
  'decillion',
  'undecillion',
  'duodecillion',
  'tredecillion',
  'quattuordecillion',
  'quindecillion',
  'sexdecillion',
  'septendecillion',
  'octodecillion',
  'novemdecillion',
  'vigintillion',
];

const NUMBER_PATTERN = /^-?\d+(\.\d+)?$/;
const DIGIT_WORDS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

export function threeDigitWords(value: number): string {
  if (value <= 0) return '';
  const hundreds = Math.floor(value / 100);
  const remainder = value % 100;
  const parts: string[] = [];
  if (hundreds > 0) {
    parts.push(`${ONES[hundreds] ?? 'zero'} hundred`);
  }
  if (remainder > 0) {
    if (remainder < 20) {
      parts.push(ONES[remainder] ?? 'zero');
    } else {
      const tens = Math.floor(remainder / 10);
      const ones = remainder % 10;
      const tensWord = TENS[tens] ?? '';
      parts.push(ones === 0 ? tensWord : `${tensWord}-${ONES[ones] ?? 'zero'}`);
    }
  }
  return parts.join(' ');
}

export function integerToWords(value: bigint): string {
  if (value === BigInt(0)) return 'zero';
  const negative = value < BigInt(0);
  const digits = (negative ? -value : value).toString();
  const groups: string[] = [];
  for (let index = digits.length; index > 0; index -= 3) {
    groups.push(digits.slice(Math.max(0, index - 3), index));
  }
  const parts: string[] = [];
  groups.forEach((group, groupIndex) => {
    const groupValue = Number(group);
    if (groupValue > 0) {
      const scale = SCALES[groupIndex];
      parts.push(scale ? `${threeDigitWords(groupValue)} ${scale}` : threeDigitWords(groupValue));
    }
  });
  const words = parts.reverse().join(' ');
  return negative ? `negative ${words}` : words;
}

export function decimalToWords(fractionDigits: string): string {
  return fractionDigits
    .split('')
    .map((digit) => DIGIT_WORDS[Number(digit)] ?? '')
    .join(' ');
}

export interface NumberToWordsResult {
  words: string;
  error: string | null;
}

export function numberToWords(input: string): NumberToWordsResult {
  const trimmed = input.trim();
  if (!NUMBER_PATTERN.test(trimmed)) {
    return { words: '', error: 'Enter a number with optional sign and decimal part.' };
  }
  const negative = trimmed.startsWith('-');
  const [integerPart, fractionPart] = trimmed.replace('-', '').split('.');
  const integerWords = integerToWords(BigInt(integerPart ?? '0'));
  const words = negative ? `negative ${integerWords}` : integerWords;
  if (fractionPart && fractionPart.length > 0) {
    return { words: `${words} point ${decimalToWords(fractionPart)}`, error: null };
  }
  return { words, error: null };
}

export interface AmountInWordsResult {
  words: string;
  error: string | null;
}

export function amountInWords(input: string): AmountInWordsResult {
  const trimmed = input.trim();
  if (!NUMBER_PATTERN.test(trimmed)) {
    return { words: '', error: 'Enter an amount with optional sign and decimal part.' };
  }
  const negative = trimmed.startsWith('-');
  const [integerPart, fractionPart = ''] = trimmed.replace('-', '').split('.');
  const dollars = BigInt(integerPart ?? '0');
  const centsText = fractionPart.padEnd(2, '0').slice(0, 2);
  const cents = Number(centsText);
  const dollarWord = dollars === BigInt(1) ? 'dollar' : 'dollars';
  const centWord = cents === 1 ? 'cent' : 'cents';
  const dollarWords = `${integerToWords(dollars)} ${dollarWord}`;
  const centWords = cents > 0 ? `${threeDigitWords(cents)} ${centWord}` : 'zero cents';
  const combined = cents > 0 ? `${dollarWords} and ${centWords}` : dollarWords;
  return { words: negative ? `negative ${combined}` : combined, error: null };
}
