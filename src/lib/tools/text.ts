export type TextCaseStyle =
  'camel' | 'pascal' | 'snake' | 'kebab' | 'constant' | 'title' | 'sentence' | 'upper' | 'lower';

export interface TextCaseStyleInfo {
  value: TextCaseStyle;
  label: string;
  example: string;
}

export const TEXT_CASE_STYLES: TextCaseStyleInfo[] = [
  { value: 'camel', label: 'camelCase', example: 'helloWorld' },
  { value: 'pascal', label: 'PascalCase', example: 'HelloWorld' },
  { value: 'snake', label: 'snake_case', example: 'hello_world' },
  { value: 'kebab', label: 'kebab-case', example: 'hello-world' },
  { value: 'constant', label: 'CONSTANT_CASE', example: 'HELLO_WORLD' },
  { value: 'title', label: 'Title Case', example: 'Hello World' },
  { value: 'sentence', label: 'Sentence case', example: 'Hello world' },
  { value: 'upper', label: 'UPPERCASE', example: 'HELLO WORLD' },
  { value: 'lower', label: 'lowercase', example: 'hello world' },
];

const WORD_BOUNDARY = /[\s\-_.:/\\@#]+/;

function splitIntoWords(text: string): string[] {
  const parts = text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
  return parts.split(WORD_BOUNDARY).filter((word) => word.length > 0);
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Converts arbitrary text into a target case style. Words are split on
 * separators (spaces, hyphens, underscores, dots, slashes) and camelCase
 * boundaries, so "hello_world" and "helloWorld" both produce "hello-world".
 */
export function convertCase(text: string, style: TextCaseStyle): string {
  const words = splitIntoWords(text);
  if (words.length === 0) return '';
  switch (style) {
    case 'camel': {
      const lower = words.map((word) => word.toLowerCase());
      return lower[0] + lower.slice(1).map(capitalize).join('');
    }
    case 'pascal':
      return words.map(capitalize).join('');
    case 'snake':
      return words.map((word) => word.toLowerCase()).join('_');
    case 'kebab':
      return words.map((word) => word.toLowerCase()).join('-');
    case 'constant':
      return words.map((word) => word.toUpperCase()).join('_');
    case 'title':
      return words.map(capitalize).join(' ');
    case 'sentence': {
      const lower = words.map((word) => word.toLowerCase());
      return capitalize(lower[0]) + (lower.length > 1 ? ' ' + lower.slice(1).join(' ') : '');
    }
    case 'upper':
      return words.map((word) => word.toUpperCase()).join(' ');
    case 'lower':
      return words.map((word) => word.toLowerCase()).join(' ');
    default:
      return text;
  }
}

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  sentences: number;
  bytes: number;
  readingTimeSeconds: number;
  speakingTimeSeconds: number;
}

const READING_WORDS_PER_MINUTE = 200;
const SPEAKING_WORDS_PER_MINUTE = 130;

export function textStats(text: string): TextStats {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
  const lines = text.length === 0 ? 0 : text.split('\n').length;
  const sentences =
    text.trim().length === 0
      ? 0
      : text.split(/[.!?]+(?:\s|$)/).filter((part) => part.trim().length > 0).length;
  const bytes = new TextEncoder().encode(text).length;
  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    sentences,
    bytes,
    readingTimeSeconds: Math.round((words / READING_WORDS_PER_MINUTE) * 60),
    speakingTimeSeconds: Math.round((words / SPEAKING_WORDS_PER_MINUTE) * 60),
  };
}

export type DiffOperation = 'equal' | 'added' | 'removed';

export interface DiffPart {
  operation: DiffOperation;
  value: string;
}

const MAX_LCS_CELLS = 1_000_000;

/**
 * Line-oriented diff between two texts. Uses a dynamic-programming LCS when
 * the inputs are small enough, falling back to a prefix/suffix-aligned diff
 * for very large inputs so the browser tab never freezes.
 */
export function diffLines(before: string, after: string): DiffPart[] {
  const a = before.split('\n');
  const b = after.split('\n');
  return lcsDiff(a, b, '\n');
}

/** Word-oriented diff that keeps whitespace as separate tokens for clean wrapping. */
export function diffWords(before: string, after: string): DiffPart[] {
  const tokenize = (text: string): string[] => text.match(/\s+|\S+/g) ?? [];
  return lcsDiff(tokenize(before), tokenize(after), '');
}

function lcsDiff(a: string[], b: string[], joinWith: string): DiffPart[] {
  const n = a.length;
  const m = b.length;
  if (n * m > MAX_LCS_CELLS || n === 0 || m === 0) {
    return simpleDiff(a, b, joinWith);
  }
  const dp: Uint32Array[] = [];
  for (let i = 0; i <= n; i += 1) {
    dp.push(new Uint32Array(m + 1));
  }
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const parts: DiffPart[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      pushPart(parts, 'equal', a[i], joinWith);
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      pushPart(parts, 'removed', a[i], joinWith);
      i += 1;
    } else {
      pushPart(parts, 'added', b[j], joinWith);
      j += 1;
    }
  }
  while (i < n) {
    pushPart(parts, 'removed', a[i], joinWith);
    i += 1;
  }
  while (j < m) {
    pushPart(parts, 'added', b[j], joinWith);
    j += 1;
  }
  return parts;
}

function simpleDiff(a: string[], b: string[], joinWith: string): DiffPart[] {
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start += 1;
  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA -= 1;
    endB -= 1;
  }
  const parts: DiffPart[] = [];
  for (let k = 0; k < start; k += 1) pushPart(parts, 'equal', a[k], joinWith);
  const removed = a.slice(start, endA);
  const added = b.slice(start, endB);
  const pairs = Math.max(removed.length, added.length);
  for (let k = 0; k < pairs; k += 1) {
    if (k < removed.length) pushPart(parts, 'removed', removed[k], joinWith);
    if (k < added.length) pushPart(parts, 'added', added[k], joinWith);
  }
  for (let k = endA; k < a.length; k += 1) pushPart(parts, 'equal', a[k], joinWith);
  return parts;
}

function pushPart(
  parts: DiffPart[],
  operation: DiffOperation,
  value: string,
  joinWith: string
): void {
  const previous = parts[parts.length - 1];
  if (previous && previous.operation === operation) {
    previous.value += joinWith + value;
  } else {
    parts.push({ operation, value });
  }
}

export function reverseCharacters(text: string): string {
  return [...text].reverse().join('');
}

export function reverseWords(text: string): string {
  return text.split(/(\s+)/).reverse().join('');
}

export function reverseLines(text: string): string {
  return text.split('\n').reverse().join('\n');
}

export type WhitespaceMode = 'all' | 'line-breaks' | 'extra-spaces' | 'trim-lines';

export interface WhitespaceResult {
  value: string;
  removedCount: number;
}

export function removeWhitespace(text: string, mode: WhitespaceMode): WhitespaceResult {
  const originalLength = text.length;
  let value = text;
  switch (mode) {
    case 'all':
      value = text.replace(/\s+/g, '');
      break;
    case 'line-breaks':
      value = text.replace(/[\r\n]+/g, ' ');
      break;
    case 'extra-spaces':
      value = text
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      break;
    case 'trim-lines':
      value = text
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .trim();
      break;
  }
  return { value, removedCount: originalLength - value.length };
}

export interface FindReplaceOptions {
  caseSensitive: boolean;
  useRegex: boolean;
  global: boolean;
}

export interface FindReplaceResult {
  value: string;
  count: number;
  error: string | null;
}

export function findReplace(
  text: string,
  find: string,
  replacement: string,
  options: FindReplaceOptions
): FindReplaceResult {
  if (find.length === 0) {
    return { value: text, count: 0, error: 'Enter a value to search for.' };
  }
  if (options.useRegex) {
    try {
      const flags = options.global ? 'g' : '';
      const pattern = new RegExp(find, options.caseSensitive ? flags : `i${flags}`);
      const count = (text.match(pattern) ?? []).length;
      return { value: text.replace(pattern, replacement), count, error: null };
    } catch (error) {
      return {
        value: text,
        count: 0,
        error: `Invalid regular expression: ${(error as Error).message}`,
      };
    }
  }
  if (!options.caseSensitive) {
    const lowerText = text.toLowerCase();
    const lowerFind = find.toLowerCase();
    const indices: number[] = [];
    let index = lowerText.indexOf(lowerFind);
    while (index !== -1) {
      indices.push(index);
      index = lowerText.indexOf(lowerFind, index + find.length);
    }
    if (!options.global && indices.length > 1) {
      indices.length = 1;
    }
    let value = '';
    let cursor = 0;
    for (const matchIndex of indices) {
      value += text.slice(cursor, matchIndex) + replacement;
      cursor = matchIndex + find.length;
    }
    value += text.slice(cursor);
    return { value, count: indices.length, error: null };
  }
  const count = options.global ? text.split(find).length - 1 : text.includes(find) ? 1 : 0;
  const value = options.global
    ? text.split(find).join(replacement)
    : text.replace(find, replacement);
  return { value, count, error: null };
}

export interface KeywordDensityItem {
  word: string;
  count: number;
  density: number;
}

const KEYWORD_MIN_LENGTH = 3;
const KEYWORD_STOPWORDS = new Set([
  'the',
  'and',
  'for',
  'are',
  'was',
  'but',
  'not',
  'you',
  'all',
  'any',
  'can',
  'had',
  'her',
  'was',
  'one',
  'our',
  'out',
  'she',
  'who',
  'has',
  'his',
  'its',
  'may',
  'per',
  'put',
  'see',
  'two',
  'use',
  'way',
  'who',
  'why',
  'did',
  'get',
  'had',
  'how',
  'let',
  'nor',
  'off',
  'old',
  'too',
  'yet',
  'now',
  'own',
  'try',
  'via',
  'the',
  'this',
  'that',
  'with',
  'from',
  'have',
  'they',
  'them',
  'then',
  'than',
  'will',
  'would',
  'there',
  'their',
  'which',
  'what',
  'when',
  'where',
  'were',
  'been',
  'being',
  'more',
  'most',
  'some',
  'such',
  'only',
  'other',
  'about',
]);

export function keywordDensity(text: string, limit = 25): KeywordDensityItem[] {
  const words = text.toLowerCase().match(/[a-z0-9']+/g) ?? [];
  const total = words.length;
  if (total === 0) return [];
  const counts = new Map<string, number>();
  for (const word of words) {
    if (word.length < KEYWORD_MIN_LENGTH) continue;
    if (KEYWORD_STOPWORDS.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([word, count]) => ({ word, count, density: (count / total) * 100 }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, limit);
}
