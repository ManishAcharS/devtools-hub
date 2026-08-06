import { normalizeText } from './tokenizer';

export interface HighlightSegment {
  text: string;
  match: boolean;
}

export function getHighlightSegments(text: string, tokens: string[]): HighlightSegment[] {
  const normalizedTokens = tokens
    .map((token) => normalizeText(token))
    .filter((token) => token.length > 0);

  if (normalizedTokens.length === 0 || !text) {
    return [{ text, match: false }];
  }

  const lowerText = text.toLowerCase();
  const segments: HighlightSegment[] = [];
  let cursor = 0;

  const boundaries: Array<{ start: number; end: number }> = [];
  for (const token of normalizedTokens) {
    let index = lowerText.indexOf(token, 0);
    while (index !== -1) {
      boundaries.push({ start: index, end: index + token.length });
      index = lowerText.indexOf(token, index + token.length);
    }
  }

  boundaries.sort((a, b) => a.start - b.start);

  const merged: Array<{ start: number; end: number }> = [];
  for (const boundary of boundaries) {
    const last = merged[merged.length - 1];
    if (last && boundary.start <= last.end) {
      last.end = Math.max(last.end, boundary.end);
    } else {
      merged.push({ ...boundary });
    }
  }

  for (const { start, end } of merged) {
    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), match: false });
    }
    segments.push({ text: text.slice(start, end), match: true });
    cursor = end;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), match: false });
  }

  return segments.length > 0 ? segments : [{ text, match: false }];
}
