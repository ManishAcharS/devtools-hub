const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'but',
  'by',
  'for',
  'from',
  'has',
  'in',
  'is',
  'it',
  'its',
  'of',
  'on',
  'or',
  'that',
  'the',
  'their',
  'this',
  'to',
  'was',
  'were',
  'with',
  'you',
  'your',
]);

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(text: string): string[] {
  const tokens = normalizeText(text).split(/[\s-]+/);
  return Array.from(new Set(tokens.filter((token) => token.length > 0 && !STOP_WORDS.has(token))));
}

export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  if (Math.abs(m - n) > 1 && (m < 3 || n < 3)) return Math.max(m, n);

  let prev = new Array<number>(n + 1);
  let curr = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

export function isFuzzyMatch(queryToken: string, candidate: string): boolean {
  if (queryToken.length < 3) return false;
  if (queryToken.length >= 4) {
    return levenshtein(queryToken, candidate) <= 1;
  }
  return levenshtein(queryToken, candidate) === 1 && candidate.startsWith(queryToken[0]);
}

export function getBigrams(text: string): string[] {
  const clean = normalizeText(text);
  const grams: string[] = [];
  for (let i = 0; i < clean.length - 1; i++) {
    grams.push(clean.slice(i, i + 2));
  }
  return grams;
}

export function bigramSimilarity(a: string, b: string): number {
  const gramsA = new Set(getBigrams(a));
  const gramsB = getBigrams(b);
  if (gramsA.size === 0 || gramsB.length === 0) return 0;
  const overlap = gramsB.filter((gram) => gramsA.has(gram)).length;
  return overlap / Math.max(gramsA.size, gramsB.length);
}
