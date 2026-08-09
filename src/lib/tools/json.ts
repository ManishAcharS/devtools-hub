import type { ToolStat, ToolTransformResult, ToolValidationResult } from './types';

export interface JsonParseResult {
  ok: boolean;
  value: unknown;
  error: string | null;
  line: number;
  column: number;
}

/**
 * Parses JSON with position-aware error reporting. JSON.parse reports only a
 * character offset, so the error position is recovered by scanning the string
 * back to the last newline and counting characters on that line.
 */
export function parseJson(text: string): JsonParseResult {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { ok: false, value: null, error: 'Enter a JSON document first.', line: 0, column: 0 };
  }
  try {
    return { ok: true, value: JSON.parse(trimmed), error: null, line: 0, column: 0 };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : 'Invalid JSON.';
    const { line, column } = locateJsonError(trimmed, message);
    return { ok: false, value: null, error: message, line, column };
  }
}

/**
 * Recovers the error position from a JSON.parse error message. Older engines
 * report "at position N" or "at line L column C". Newer V8 versions report
 * "Unexpected token '<token>', ...<context>" without a position, so a small
 * structural scanner is used as a deterministic fallback.
 */
function locateJsonError(trimmed: string, message: string): { line: number; column: number } {
  const positionMatch = /at position (\d+)/.exec(message);
  if (positionMatch) {
    const offset = Number(positionMatch[1]);
    return offsetToPosition(trimmed, offset);
  }
  const lineColumnMatch = /at line (\d+) column (\d+)/.exec(message);
  if (lineColumnMatch) {
    return { line: Number(lineColumnMatch[1]), column: Number(lineColumnMatch[2]) };
  }
  const offset = scanJsonForError(trimmed);
  if (offset !== null && offset > 0) {
    return offsetToPosition(trimmed, offset);
  }
  return { line: 1, column: 0 };
}

/**
 * Scans JSON text for the first structural violation and returns its offset,
 * or null when the structure is well-formed. This mirrors the JSON grammar
 * closely enough to pinpoint syntax errors even when the engine's error
 * message carries no position.
 */
function scanJsonForError(text: string): number | null {
  const n = text.length;
  let i = 0;
  let mode: 'value' | 'key' | 'colon' | 'comma' | 'done' = 'value';
  const stack: { type: 'obj' | 'arr'; anyValue: boolean }[] = [];

  const skipWs = (): void => {
    while (i < n && (text[i] === ' ' || text[i] === '\t' || text[i] === '\n' || text[i] === '\r')) {
      i += 1;
    }
  };

  const parseString = (): boolean => {
    i += 1;
    while (i < n) {
      const ch = text[i];
      if (ch === '\\') {
        i += 2;
        continue;
      }
      if (ch === '"') {
        i += 1;
        return true;
      }
      i += 1;
    }
    return false;
  };

  const parseNumber = (): boolean => {
    const start = i;
    if (text[i] === '-') i += 1;
    if (text[i] === '0') {
      i += 1;
    } else if (text[i] >= '1' && text[i] <= '9') {
      while (i < n && text[i] >= '0' && text[i] <= '9') i += 1;
    } else {
      return false;
    }
    if (text[i] === '.') {
      i += 1;
      const digitsStart = i;
      while (i < n && text[i] >= '0' && text[i] <= '9') i += 1;
      if (i === digitsStart) return false;
    }
    if (text[i] === 'e' || text[i] === 'E') {
      i += 1;
      if (text[i] === '+' || text[i] === '-') i += 1;
      const digitsStart = i;
      while (i < n && text[i] >= '0' && text[i] <= '9') i += 1;
      if (i === digitsStart) return false;
    }
    return i > start;
  };

  const close = (ch: string): boolean => {
    const top = stack[stack.length - 1];
    if (!top || top.type !== (ch === '}' ? 'obj' : 'arr')) return false;
    stack.pop();
    i += 1;
    mode = stack.length === 0 ? 'done' : 'comma';
    return true;
  };

  while (true) {
    skipWs();
    if (i >= n) {
      if (stack.length > 0 || mode === 'value' || mode === 'comma' || mode === 'colon') return n;
      return null;
    }
    const ch = text[i];
    const top = stack[stack.length - 1];
    if (mode === 'done') return i;
    if (mode === 'comma') {
      if (ch === ',') {
        i += 1;
        mode = top.type === 'obj' ? 'key' : 'value';
        continue;
      }
      if ((ch === '}' || ch === ']') && close(ch)) continue;
      return i;
    }
    if (mode === 'colon') {
      if (ch === ':') {
        i += 1;
        mode = 'value';
        continue;
      }
      return i;
    }
    if (mode === 'key') {
      if (ch === '}' && top.type === 'obj' && top.anyValue === false) {
        stack.pop();
        i += 1;
        mode = stack.length === 0 ? 'done' : 'comma';
        continue;
      }
      if (ch !== '"') return i;
      if (!parseString()) return i;
      mode = 'colon';
      continue;
    }
    if (ch === '{' || ch === '[') {
      stack.push({ type: ch === '{' ? 'obj' : 'arr', anyValue: false });
      i += 1;
      mode = ch === '{' ? 'key' : 'value';
      continue;
    }
    if (ch === '}' || ch === ']') {
      if (ch === ']' && top.type === 'arr' && top.anyValue === false) {
        stack.pop();
        i += 1;
        mode = stack.length === 0 ? 'done' : 'comma';
        continue;
      }
      return i;
    }
    top.anyValue = true;
    if (ch === '"') {
      if (!parseString()) return i;
      mode = stack.length === 0 ? 'done' : 'comma';
      continue;
    }
    if (ch === 't' && text.startsWith('true', i)) {
      i += 4;
      mode = stack.length === 0 ? 'done' : 'comma';
      continue;
    }
    if (ch === 'f' && text.startsWith('false', i)) {
      i += 5;
      mode = stack.length === 0 ? 'done' : 'comma';
      continue;
    }
    if (ch === 'n' && text.startsWith('null', i)) {
      i += 4;
      mode = stack.length === 0 ? 'done' : 'comma';
      continue;
    }
    if (ch === '-' || (ch >= '0' && ch <= '9')) {
      if (!parseNumber()) return i;
      mode = stack.length === 0 ? 'done' : 'comma';
      continue;
    }
    return i;
  }
}

function offsetToPosition(text: string, offset: number): { line: number; column: number } {
  const before = text.slice(0, offset);
  const lastNewline = before.lastIndexOf('\n');
  return { line: before.split('\n').length, column: offset - lastNewline };
}

export interface JsonFormatOptions {
  minify?: boolean;
  indentSize?: 2 | 4;
}

export function formatJson(text: string, options: JsonFormatOptions = {}): ToolTransformResult {
  const parsed = parseJson(text);
  if (!parsed.ok) {
    return {
      value: '',
      error: parsed.error,
      stats: [
        { label: 'Line', value: String(parsed.line || '-') },
        { label: 'Column', value: String(parsed.column || '-') },
      ],
    };
  }
  try {
    const output = options.minify
      ? JSON.stringify(parsed.value)
      : JSON.stringify(parsed.value, null, options.indentSize ?? 2);
    return {
      value: output,
      error: null,
      stats: [
        { label: 'Input length', value: text.trim().length.toLocaleString() },
        { label: 'Output length', value: output.length.toLocaleString() },
        { label: 'Lines', value: output.split('\n').length.toLocaleString() },
      ],
    };
  } catch {
    return { value: '', error: 'The document contains a value that cannot be serialized.' };
  }
}

export function validateJson(text: string): ToolValidationResult {
  const parsed = parseJson(text);
  if (parsed.ok) {
    let tokenCount = 0;
    try {
      const serialized = JSON.stringify(parsed.value);
      tokenCount = serialized.length;
    } catch {
      tokenCount = 0;
    }
    return {
      valid: true,
      error: null,
      issues: [],
      stats: [
        { label: 'Characters', value: text.trim().length.toLocaleString() },
        { label: 'Serialized length', value: tokenCount.toLocaleString() },
      ],
    };
  }
  return {
    valid: false,
    error: parsed.error ?? 'Invalid JSON.',
    issues: [
      {
        message: parsed.error ?? 'Invalid JSON.',
        line: parsed.line > 0 ? parsed.line : undefined,
        column: parsed.column > 0 ? parsed.column : undefined,
      },
    ],
  };
}

export function jsonStats(value: unknown, text: string): ToolStat[] {
  const serialized = JSON.stringify(value) ?? '';
  return [
    { label: 'Input length', value: text.trim().length.toLocaleString() },
    { label: 'Serialized length', value: serialized.length.toLocaleString() },
  ];
}

const XML_ESCAPE_MAP: Record<string, string> = {
  '&': '&',
  '<': '<',
  '>': '>',
  '"': '"',
  "'": '&apos;',
};

function escapeXml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => XML_ESCAPE_MAP[char]!);
}

function buildXml(
  value: unknown,
  options: { rootName?: string; arrayItemName?: string; indent?: string; level?: number }
): string {
  const { rootName = 'root', arrayItemName = 'item', indent = '  ', level = 0 } = options;
  const padding = indent.repeat(level);
  const nextPadding = indent.repeat(level + 1);

  if (value === null) {
    return `${padding}<${rootName} xsi:nil="true"/>`;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => buildXml(item, { rootName: arrayItemName, arrayItemName, indent, level }))
      .join('\n');
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return `${padding}<${rootName}/>`;
    }
    const children = entries
      .map(([key, val]) =>
        buildXml(val, { rootName: key, arrayItemName, indent, level: level + 1 })
      )
      .join('\n');
    return `${padding}<${rootName}>\n${children}\n${padding}</${rootName}>`;
  }

  if (typeof value === 'string') {
    return `${padding}<${rootName}>${escapeXml(value)}</${rootName}>`;
  }

  return `${padding}<${rootName}>${value}</${rootName}>`;
}

export interface JsonToXmlOptions {
  rootName?: string;
  arrayItemName?: string;
  indent?: 2 | 4;
  declaration?: boolean;
}

export function jsonToXml(text: string, options: JsonToXmlOptions = {}): string {
  const parsed = parseJson(text);
  if (!parsed.ok) {
    throw new Error(parsed.error ?? 'Invalid JSON.');
  }
  const { rootName = 'root', arrayItemName = 'item', indent = 2, declaration = true } = options;
  const xmlBody = buildXml(parsed.value, {
    rootName,
    arrayItemName,
    indent: ' '.repeat(indent),
  });
  const decl = declaration ? '<?xml version="1.0" encoding="UTF-8"?>\n' : '';
  return `${decl}${xmlBody}`;
}
