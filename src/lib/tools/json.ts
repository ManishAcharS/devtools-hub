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
    let offset = 0;
    const positionMatch = /position (\d+)/.exec(message);
    if (positionMatch) {
      offset = Number(positionMatch[1]);
    } else {
      const indexMatch = /at position (\d+)/.exec(message);
      offset = indexMatch ? Number(indexMatch[1]) : 0;
    }
    const before = trimmed.slice(0, offset);
    const line = before.split('\n').length;
    const lastNewline = before.lastIndexOf('\n');
    const column = offset - lastNewline;
    return { ok: false, value: null, error: message, line, column };
  }
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
