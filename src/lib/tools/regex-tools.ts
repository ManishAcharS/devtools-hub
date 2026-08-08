export function escapeRegexLiteral(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export interface RegexMatch {
  index: number;
  value: string;
  groups: string[];
}

export interface RegexMatchResult {
  matches: RegexMatch[];
  error: string | null;
  truncated: boolean;
  elapsedMs: number;
  flags: string;
}

export const REGEX_FLAGS: { value: string; label: string; description: string }[] = [
  { value: 'g', label: 'g', description: 'Global — find all matches' },
  { value: 'i', label: 'i', description: 'Case-insensitive' },
  { value: 'm', label: 'm', description: 'Multiline — ^ and $ match line boundaries' },
  { value: 's', label: 's', description: 'Dotall — . matches newlines' },
  { value: 'u', label: 'u', description: 'Unicode — full Unicode support' },
  { value: 'y', label: 'y', description: 'Sticky — match only at the exact position' },
];

const MAX_MATCHES = 5000;

export function findMatches(pattern: string, flags: string, text: string): RegexMatchResult {
  const startedAt = performance.now();
  const validFlags = flags
    .split('')
    .filter((flag) => ['g', 'i', 'm', 's', 'u', 'y', 'd'].includes(flag))
    .join('');
  const effectiveFlags = validFlags.includes('g') ? validFlags : `${validFlags}g`;

  if (pattern.trim().length === 0) {
    return {
      matches: [],
      error: null,
      truncated: false,
      elapsedMs: 0,
      flags: '',
    };
  }

  if (text.length === 0) {
    return {
      matches: [],
      error: null,
      truncated: false,
      elapsedMs: 0,
      flags: effectiveFlags,
    };
  }

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, effectiveFlags);
  } catch (error) {
    return {
      matches: [],
      error: error instanceof Error ? error.message : 'Invalid regular expression',
      truncated: false,
      elapsedMs: performance.now() - startedAt,
      flags: effectiveFlags,
    };
  }

  const matches: RegexMatch[] = [];
  let truncated = false;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      value: match[0],
      groups: match.slice(1).map((group) => (group === undefined ? '' : group)),
    });
    if (matches.length >= MAX_MATCHES) {
      truncated = true;
      break;
    }
    if (match[0].length === 0) {
      regex.lastIndex += 1;
    }
  }

  return {
    matches,
    error: null,
    truncated,
    elapsedMs: performance.now() - startedAt,
    flags: effectiveFlags,
  };
}

export interface GeneratedRegex {
  pattern: string;
  flags: string;
  description: string;
}

export function generateRegexFromText(text: string): GeneratedRegex {
  const escaped = escapeRegexLiteral(text);
  const words = text.split(/[^A-Za-z0-9_]+/).filter((word) => word.length > 0);
  const uniqueWords = [...new Set(words.map((word) => word.toLowerCase()))];
  const hasUpperCase = /[A-Z]/.test(text);
  const flags = hasUpperCase ? 'gi' : 'g';
  const alternatives =
    uniqueWords.length > 0 ? `\\b(?:${uniqueWords.map(escapeRegexLiteral).join('|')})\\b` : '';

  let description = `Matches the exact text "…${text.length > 24 ? `${text.slice(0, 24)}…` : text}" (every regex metacharacter escaped).`;
  if (uniqueWords.length > 1) {
    description = `Matches any of ${uniqueWords.length} unique words found in the input as whole words.`;
  } else if (uniqueWords.length === 1) {
    description = `Matches the word "${uniqueWords[0]}" as a whole word.`;
  }
  if (hasUpperCase) {
    description += ' Case-insensitive.';
  }

  return {
    pattern: text.trim().length > 0 ? alternatives || escaped : escaped,
    flags,
    description,
  };
}
