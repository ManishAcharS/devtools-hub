export interface SpecificityPart {
  raw: string;
  a: number;
  b: number;
  c: number;
}

export interface SpecificityResult {
  a: number;
  b: number;
  c: number;
  score: number;
  parts: SpecificityPart[];
}

interface Totals {
  a: number;
  b: number;
  c: number;
}

const PSEUDO_ELEMENTS = new Set([
  'before',
  'after',
  'first-line',
  'first-letter',
  'backdrop',
  'placeholder',
  'selection',
  'marker',
  'cue',
  'file-selector-button',
]);

const FUNCTIONAL_PSEUDO_PATTERN = /:((?:is|not|has|where))\s*\(/i;
const TOKEN_PATTERN =
  /(::[\w-]+)|(#[-\w]+)|(\.[-\w]+)|(\[[^\]]*\])|(:[\w-]+\([^()]*\))|(:[\w-]+)|([-\w]+)/g;

function findMatchingParen(input: string, openIndex: number): number {
  let depth = 0;
  let quote: string | null = null;
  for (let i = openIndex; i < input.length; i += 1) {
    const ch = input[i];
    if (quote !== null) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(') {
      depth += 1;
    } else if (ch === ')') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function splitTopLevel(input: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let current = '';
  for (const ch of input) {
    if (quote !== null) {
      current += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
    } else if (ch === '(' || ch === '[') {
      depth += 1;
      current += ch;
    } else if (ch === ')' || ch === ']') {
      depth -= 1;
      current += ch;
    } else if (ch === ',' && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts;
}

function addPart(
  parts: SpecificityPart[],
  raw: string,
  contribution: Totals,
  totals: Totals
): void {
  parts.push({ raw, a: contribution.a, b: contribution.b, c: contribution.c });
  totals.a += contribution.a;
  totals.b += contribution.b;
  totals.c += contribution.c;
}

function specificityOf(selector: string): { parts: SpecificityPart[]; totals: Totals } {
  const parts: SpecificityPart[] = [];
  const totals: Totals = { a: 0, b: 0, c: 0 };
  let rest = selector;

  let match = FUNCTIONAL_PSEUDO_PATTERN.exec(rest);
  while (match) {
    const name = match[1].toLowerCase();
    const openIndex = match.index + match[0].lastIndexOf('(');
    const endIndex = findMatchingParen(rest, openIndex);
    if (endIndex === -1) break;
    const raw = rest.slice(match.index, endIndex + 1);
    const innerArgs = splitTopLevel(rest.slice(openIndex + 1, endIndex));
    if (name === 'where') {
      addPart(parts, raw, { a: 0, b: 0, c: 0 }, totals);
    } else {
      let mostSpecific: Totals = { a: 0, b: 0, c: 0 };
      for (const arg of innerArgs) {
        const sub = specificityOf(arg);
        if (isGreater(sub.totals, mostSpecific)) mostSpecific = sub.totals;
      }
      addPart(parts, raw, mostSpecific, totals);
    }
    rest = `${rest.slice(0, match.index)} ${rest.slice(endIndex + 1)}`;
    match = FUNCTIONAL_PSEUDO_PATTERN.exec(rest);
  }

  const tokenMatches = rest.matchAll(TOKEN_PATTERN);
  for (const m of tokenMatches) {
    const [, pseudoElement, id, className, attribute, pseudoClassFn, pseudoClass, element] = m;
    if (id) {
      addPart(parts, id, { a: 1, b: 0, c: 0 }, totals);
    } else if (className) {
      addPart(parts, className, { a: 0, b: 1, c: 0 }, totals);
    } else if (attribute) {
      addPart(parts, attribute, { a: 0, b: 1, c: 0 }, totals);
    } else if (pseudoElement) {
      addPart(parts, pseudoElement, { a: 0, b: 0, c: 1 }, totals);
    } else if (pseudoClassFn || pseudoClass) {
      const token = pseudoClassFn ?? pseudoClass;
      const name = token.replace(/^:/, '');
      if (PSEUDO_ELEMENTS.has(name)) {
        addPart(parts, token, { a: 0, b: 0, c: 1 }, totals);
      } else {
        addPart(parts, token, { a: 0, b: 1, c: 0 }, totals);
      }
    } else if (element) {
      addPart(parts, element, { a: 0, b: 0, c: 1 }, totals);
    }
  }

  return { parts, totals };
}

function isGreater(x: Totals, y: Totals): boolean {
  if (x.a !== y.a) return x.a > y.a;
  if (x.b !== y.b) return x.b > y.b;
  return x.c > y.c;
}

export function calculateSpecificity(selector: string): SpecificityResult {
  const cleaned = selector.replace(/\/\*[\s\S]*?\*\//g, '').trim();
  if (cleaned.length === 0) {
    return { a: 0, b: 0, c: 0, score: 0, parts: [] };
  }
  let best: { parts: SpecificityPart[]; totals: Totals } | null = null;
  for (const branch of splitTopLevel(cleaned)) {
    const result = specificityOf(branch);
    if (!best || isGreater(result.totals, best.totals)) best = result;
  }
  const { parts, totals } = best as { parts: SpecificityPart[]; totals: Totals };
  return {
    a: totals.a,
    b: totals.b,
    c: totals.c,
    score: totals.a * 100 + totals.b * 10 + totals.c,
    parts,
  };
}

export function compareSpecificity(a: SpecificityResult, b: SpecificityResult): -1 | 0 | 1 {
  if (a.a !== b.a) return a.a > b.a ? 1 : -1;
  if (a.b !== b.b) return a.b > b.b ? 1 : -1;
  if (a.c !== b.c) return a.c > b.c ? 1 : -1;
  return 0;
}
