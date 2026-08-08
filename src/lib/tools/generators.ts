import { clamp, parseBoundedInt } from '@/lib/tools/validate';

export interface UuidOptions {
  uppercase: boolean;
  removeHyphens: boolean;
}

export interface UuidGenerateResult {
  uuids: string[];
  error: string | null;
}

export interface SlugifyOptions {
  separator: string;
  lowercase: boolean;
  maxLength: number;
}

export interface SlugifyResult {
  value: string;
  error: string | null;
}

export interface LoremOptions {
  paragraphs: number;
  sentencesPerParagraph: number;
  startWithClassic: boolean;
}

export interface LoremResult {
  value: string;
  error: string | null;
}

export interface RandomNumberOptions {
  min: number;
  max: number;
  count: number;
  unique: boolean;
}

export interface RandomNumberResult {
  numbers: number[];
  error: string | null;
}

export function randomUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
}

export function generateUuids(count: number, options: UuidOptions): UuidGenerateResult {
  const parsed = parseBoundedInt(String(count), { min: 1, max: 500, label: 'Count' });
  const boundedCount = parsed.error ? 1 : parsed.value;
  const uuids: string[] = [];
  const seen = new Set<string>();
  while (uuids.length < boundedCount) {
    let uuid = randomUuid();
    if (options.removeHyphens) uuid = uuid.replace(/-/g, '');
    if (options.uppercase) uuid = uuid.toUpperCase();
    if (seen.has(uuid)) continue;
    seen.add(uuid);
    uuids.push(uuid);
  }
  return { uuids, error: parsed.error };
}

export function slugify(text: string, options: SlugifyOptions): SlugifyResult {
  const raw = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let slug = raw
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/gi, options.separator)
    .replace(new RegExp(`(?:${escapeRegExp(options.separator)})+`, 'g'), options.separator);
  if (options.lowercase) slug = slug.toLowerCase();
  slug = slug.replace(
    new RegExp(`^${escapeRegExp(options.separator)}|${escapeRegExp(options.separator)}$`, 'g'),
    ''
  );
  if (slug.length > options.maxLength) {
    slug = slug
      .slice(0, options.maxLength)
      .replace(new RegExp(`${escapeRegExp(options.separator)}$`), '');
  }
  return {
    value: slug,
    error: text.trim().length === 0 ? 'Input is empty. Type some text to generate a slug.' : null,
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const LOREM_WORDS: string[] = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'in',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'eu',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
  'suscipit',
  'nibh',
  'imperdiet',
  'tincidunt',
  'gravida',
  'porttitor',
  'risus',
  'donec',
  'ornare',
  'sagittis',
  'neque',
  'habitasse',
  'platea',
  'dictumst',
  'vestibulum',
  'rhoncus',
  'pulvinar',
  'lobortis',
  'malesuada',
  'scelerisque',
  'viverra',
  'turpis',
  'faucibus',
  'pharetra',
  'cras',
  'vulputate',
  'fermentum',
  'nunc',
  'congue',
  'eleifend',
  'venenatis',
  'lacus',
  'sodales',
  'semper',
  'egestas',
];

function randomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)] ?? 'lorem';
}

function sentence(startWithCapital: boolean): string {
  const length = 7 + Math.floor(Math.random() * 8);
  const words: string[] = [];
  for (let i = 0; i < length; i += 1) {
    words.push(randomWord());
  }
  let sentence = words.join(' ');
  if (startWithCapital) {
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }
  return `${sentence}.`;
}

export function generateLorem(options: LoremOptions): LoremResult {
  const paragraphs = clamp(options.paragraphs, 1, 20);
  const sentencesPerParagraph = clamp(options.sentencesPerParagraph, 1, 20);

  const output: string[] = [];
  for (let p = 0; p < paragraphs; p += 1) {
    const sentences: string[] = [];
    for (let s = 0; s < sentencesPerParagraph; s += 1) {
      sentences.push(sentence(s > 0));
    }
    let paragraph = sentences.join(' ');
    if (p === 0 && options.startWithClassic) {
      paragraph =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    }
    output.push(paragraph);
  }
  return { value: `${output.join('\n\n')}\n`, error: null };
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomNumbers(options: RandomNumberOptions): RandomNumberResult {
  if (!Number.isSafeInteger(options.min) || !Number.isSafeInteger(options.max)) {
    return { numbers: [], error: 'Both bounds must be whole numbers.' };
  }
  if (options.min > options.max) {
    return { numbers: [], error: 'The minimum must not be greater than the maximum.' };
  }
  if (options.count < 1 || options.count > 1000) {
    return { numbers: [], error: 'Count must be between 1 and 1000.' };
  }
  const range = options.max - options.min + 1;
  if (options.unique && options.count > range) {
    return {
      numbers: [],
      error: `Cannot draw ${options.count} unique numbers from a range of only ${range}.`,
    };
  }

  const numbers: number[] = [];
  if (options.unique) {
    const pool = new Set<number>();
    while (pool.size < options.count) {
      pool.add(randomInt(options.min, options.max));
    }
    numbers.push(...pool);
  } else {
    for (let i = 0; i < options.count; i += 1) {
      numbers.push(randomInt(options.min, options.max));
    }
  }
  return { numbers, error: null };
}
