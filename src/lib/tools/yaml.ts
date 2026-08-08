import type { ToolValidationIssue, ToolValidationResult } from './types';

export interface YamlResult {
  data: unknown;
  error: string | null;
  line?: number;
}

interface EffLine {
  indent: number;
  content: string;
  srcLine: number;
}

interface BlockResult {
  data: unknown;
  next: number;
}

function stripComment(raw: string): string {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw[i];
    if (inSingle) {
      if (ch === "'") {
        if (raw[i + 1] === "'") i += 1;
        else inSingle = false;
      }
    } else if (inDouble) {
      if (ch === '\\') i += 1;
      else if (ch === '"') inDouble = false;
    } else if (ch === "'") {
      inSingle = true;
    } else if (ch === '"') {
      inDouble = true;
    } else if (ch === '#') {
      if (i === 0 || /\s/.test(raw[i - 1])) return raw.slice(0, i);
    }
  }
  return raw;
}

function preprocess(source: string): EffLine[] {
  const lines: EffLine[] = [];
  const rawLines = source.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  rawLines.forEach((raw, index) => {
    const withoutComment = stripComment(raw);
    if (/^\s*$/.test(withoutComment)) return;
    const leading = withoutComment.match(/^\s*/)?.[0] ?? '';
    if (leading.includes('\t')) {
      throw new YamlError(
        `Tabs are not allowed for indentation (line ${index + 1}). Use spaces.`,
        index + 1
      );
    }
    const trimmed = withoutComment.replace(/\s+$/, '');
    const indent = trimmed.length - trimmed.trimStart().length;
    lines.push({ indent, content: trimmed.trimStart(), srcLine: index + 1 });
  });
  return lines;
}

class YamlError extends Error {
  line: number;

  constructor(message: string, line: number) {
    super(message);
    this.line = line;
  }
}

function findKeyColon(content: string): number {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i];
    if (inSingle) {
      if (ch === "'") {
        if (content[i + 1] === "'") i += 1;
        else inSingle = false;
      }
    } else if (inDouble) {
      if (ch === '\\') i += 1;
      else if (ch === '"') inDouble = false;
    } else if (ch === "'") {
      inSingle = true;
    } else if (ch === '"') {
      inDouble = true;
    } else if (ch === ':') {
      const next = content[i + 1];
      if (next === undefined || next === ' ' || next === '\t') return i;
    }
  }
  return -1;
}

function parseDoubleQuoted(s: string, line: number): string {
  if (s.length < 2 || s[0] !== '"' || s[s.length - 1] !== '"') {
    throw new YamlError(`Unterminated double-quoted string (line ${line}).`, line);
  }
  let out = '';
  for (let i = 1; i < s.length - 1; i += 1) {
    const ch = s[i];
    if (ch === '\\') {
      const next = s[i + 1];
      switch (next) {
        case 'n':
          out += '\n';
          break;
        case 't':
          out += '\t';
          break;
        case 'r':
          out += '\r';
          break;
        case 'b':
          out += '\b';
          break;
        case 'f':
          out += '\f';
          break;
        case '0':
          out += '\0';
          break;
        case '\\':
          out += '\\';
          break;
        case '"':
          out += '"';
          break;
        case '/':
          out += '/';
          break;
        case 'u': {
          const hex = s.slice(i + 2, i + 6);
          if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
            throw new YamlError(`Invalid \\u escape in string (line ${line}).`, line);
          }
          out += String.fromCharCode(parseInt(hex, 16));
          i += 5;
          break;
        }
        default:
          if (next === undefined) {
            throw new YamlError(`Unterminated double-quoted string (line ${line}).`, line);
          }
          out += next;
      }
      i += 1;
    } else {
      out += ch;
    }
  }
  return out;
}

function parseSingleQuoted(s: string, line: number): string {
  if (s.length < 2 || s[0] !== "'" || s[s.length - 1] !== "'") {
    throw new YamlError(`Unterminated single-quoted string (line ${line}).`, line);
  }
  return s.slice(1, -1).replace(/''/g, "'");
}

function resolvePlain(value: string): unknown {
  if (value === 'null' || value === 'Null' || value === 'NULL' || value === '~') return null;
  if (
    value === 'true' ||
    value === 'True' ||
    value === 'TRUE' ||
    value === 'yes' ||
    value === 'Yes' ||
    value === 'on' ||
    value === 'On'
  ) {
    return true;
  }
  if (
    value === 'false' ||
    value === 'False' ||
    value === 'FALSE' ||
    value === 'no' ||
    value === 'No' ||
    value === 'off' ||
    value === 'Off'
  ) {
    return false;
  }
  if (
    /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/.test(value) ||
    /^-?\.\d+([eE][+-]?\d+)?$/.test(value)
  ) {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return value;
}

function parseScalar(raw: string, line: number): unknown {
  const s = raw.trim();
  if (s === '') return null;
  if (s.startsWith('[') || s.startsWith('{')) return parseFlow(s, line);
  if (s.startsWith('"')) return parseDoubleQuoted(s, line);
  if (s.startsWith("'")) return parseSingleQuoted(s, line);
  return resolvePlain(s);
}

function parseFlow(s: string, line: number): unknown {
  let pos = 0;
  const skipWs = (): void => {
    while (pos < s.length && /\s/.test(s[pos])) pos += 1;
  };
  const parseValue = (): unknown => {
    skipWs();
    if (pos >= s.length)
      throw new YamlError(`Unexpected end of flow collection (line ${line}).`, line);
    const ch = s[pos];
    if (ch === '[') return parseSeq();
    if (ch === '{') return parseMap();
    if (ch === '"' || ch === "'") {
      const start = pos;
      const quote = ch;
      pos += 1;
      while (pos < s.length && s[pos] !== quote) {
        if (quote === '"' && s[pos] === '\\') pos += 1;
        pos += 1;
      }
      if (pos >= s.length)
        throw new YamlError(`Unterminated quoted string in flow collection (line ${line}).`, line);
      pos += 1;
      return parseScalar(s.slice(start, pos), line);
    }
    const start = pos;
    while (pos < s.length && !/[,\]}:]/.test(s[pos])) pos += 1;
    const token = s.slice(start, pos).trim();
    if (token === '') throw new YamlError(`Invalid flow collection syntax (line ${line}).`, line);
    return resolvePlain(token);
  };
  const parseSeq = (): unknown[] => {
    pos += 1;
    const items: unknown[] = [];
    skipWs();
    if (s[pos] === ']') {
      pos += 1;
      return items;
    }
    for (;;) {
      items.push(parseValue());
      skipWs();
      if (s[pos] === ',') {
        pos += 1;
        continue;
      }
      if (s[pos] === ']') {
        pos += 1;
        return items;
      }
      throw new YamlError(`Expected "," or "]" in flow sequence (line ${line}).`, line);
    }
  };
  const parseMap = (): Record<string, unknown> => {
    pos += 1;
    const map: Record<string, unknown> = {};
    skipWs();
    if (s[pos] === '}') {
      pos += 1;
      return map;
    }
    for (;;) {
      const key = parseValue();
      if (typeof key !== 'string') {
        throw new YamlError(`Flow map keys must be strings (line ${line}).`, line);
      }
      skipWs();
      if (s[pos] !== ':')
        throw new YamlError(`Expected ":" after flow map key (line ${line}).`, line);
      pos += 1;
      const value = parseValue();
      map[key] = value;
      skipWs();
      if (s[pos] === ',') {
        pos += 1;
        continue;
      }
      if (s[pos] === '}') {
        pos += 1;
        return map;
      }
      throw new YamlError(`Expected "," or "}" in flow map (line ${line}).`, line);
    }
  };
  skipWs();
  if (s[pos] === '[') return parseSeq();
  if (s[pos] === '{') return parseMap();
  throw new YamlError(`Invalid flow collection (line ${line}).`, line);
}

function parseKey(raw: string, line: number): string {
  const key = raw.trim();
  if (key === '') throw new YamlError(`Empty mapping key (line ${line}).`, line);
  if (key.startsWith('"')) return parseDoubleQuoted(key, line);
  if (key.startsWith("'")) return parseSingleQuoted(key, line);
  return key;
}

function isBlockScalarMarker(value: string): boolean {
  return /^[|>][+-]?$/.test(value);
}

function collectBlockScalar(
  lines: EffLine[],
  start: number,
  parentIndent: number,
  marker: string
): { value: string; next: number } {
  const collected: EffLine[] = [];
  let i = start;
  while (i < lines.length && lines[i].indent > parentIndent) {
    collected.push(lines[i]);
    i += 1;
  }
  const minIndent =
    collected.length > 0 ? Math.min(...collected.map((entry) => entry.indent)) : parentIndent + 1;
  const content = collected
    .map((entry) => entry.content.padStart(entry.indent - minIndent + entry.content.length, ' '))
    .join('\n');
  const literal = marker[0] === '|';
  let value: string;
  if (content === '') {
    value = '';
  } else if (literal) {
    value = content;
  } else {
    const paragraphs = content.split(/\n{2,}/);
    value = paragraphs
      .map((paragraph) => paragraph.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim())
      .join('\n');
  }
  const chomp = marker[1];
  if (chomp === '+') {
    // keep all trailing newlines (block content already holds them)
  } else if (chomp === '-') {
    value = value.replace(/\n+$/, '');
  } else if (value !== '') {
    value = `${value}\n`;
  }
  return { value, next: i };
}

function parseBlockAt(lines: EffLine[], start: number, indent: number): BlockResult {
  const first = lines[start];
  if (first.content === '-' || first.content.startsWith('- ')) {
    return parseSequenceAt(lines, start, indent);
  }
  return parseMappingAt(lines, start, indent);
}

function parseMappingAt(lines: EffLine[], start: number, indent: number): BlockResult {
  const data: Record<string, unknown> = {};
  let i = start;
  while (i < lines.length) {
    const line = lines[i];
    if (line.indent < indent) break;
    if (line.indent > indent) {
      throw new YamlError(`Unexpected indentation at line ${line.srcLine}.`, line.srcLine);
    }
    if (line.content === '---' || line.content === '...') {
      throw new YamlError(
        `Document marker "${line.content}" is not allowed inside a mapping (line ${line.srcLine}).`,
        line.srcLine
      );
    }
    const colon = findKeyColon(line.content);
    if (colon < 0) {
      throw new YamlError(
        `Expected a "key: value" mapping entry at line ${line.srcLine}.`,
        line.srcLine
      );
    }
    const key = parseKey(line.content.slice(0, colon), line.srcLine);
    const rest = line.content.slice(colon + 1).trim();

    if (rest === '') {
      if (i + 1 < lines.length && lines[i + 1].indent > indent) {
        const child = parseBlockAt(lines, i + 1, lines[i + 1].indent);
        data[key] = child.data;
        i = child.next;
      } else {
        data[key] = null;
        i += 1;
      }
    } else if (isBlockScalarMarker(rest)) {
      const collected = collectBlockScalar(lines, i + 1, indent, rest);
      data[key] = collected.value;
      i = collected.next;
    } else {
      data[key] = parseScalar(rest, line.srcLine);
      i += 1;
    }
  }
  return { data, next: i };
}

function parseSequenceAt(lines: EffLine[], start: number, indent: number): BlockResult {
  const items: unknown[] = [];
  let i = start;
  while (i < lines.length) {
    const line = lines[i];
    if (line.indent < indent) break;
    if (line.indent > indent) {
      throw new YamlError(`Unexpected indentation at line ${line.srcLine}.`, line.srcLine);
    }
    if (line.content === '---' || line.content === '...') {
      throw new YamlError(
        `Document marker "${line.content}" is not allowed inside a sequence (line ${line.srcLine}).`,
        line.srcLine
      );
    }
    if (line.content !== '-' && !line.content.startsWith('- ')) break;
    const rest = line.content.slice(1).trim();
    const itemIndent = indent + 2;

    if (rest === '') {
      if (i + 1 < lines.length && lines[i + 1].indent > indent) {
        const child = parseBlockAt(lines, i + 1, lines[i + 1].indent);
        items.push(child.data);
        i = child.next;
      } else {
        items.push(null);
        i += 1;
      }
    } else {
      const colon = findKeyColon(rest);
      if (colon >= 0) {
        const synthetic: EffLine = { indent: itemIndent, content: rest, srcLine: line.srcLine };
        const merged = [synthetic, ...lines.slice(i + 1)];
        const child = parseMappingAt(merged, 0, itemIndent);
        items.push(child.data);
        i += child.next;
      } else if (rest === '-' || rest.startsWith('- ')) {
        const synthetic: EffLine = { indent: itemIndent, content: rest, srcLine: line.srcLine };
        const merged = [synthetic, ...lines.slice(i + 1)];
        const child = parseSequenceAt(merged, 0, itemIndent);
        items.push(child.data);
        i += child.next;
      } else if (isBlockScalarMarker(rest)) {
        const collected = collectBlockScalar(lines, i + 1, indent, rest);
        items.push(collected.value);
        i = collected.next;
      } else {
        items.push(parseScalar(rest, line.srcLine));
        i += 1;
      }
    }
  }
  return { data: items, next: i };
}

export function parseYaml(source: string): YamlResult {
  try {
    let lines: EffLine[];
    try {
      lines = preprocess(source);
    } catch (error) {
      if (error instanceof YamlError) {
        return { data: null, error: error.message, line: error.line };
      }
      throw error;
    }
    if (lines.length === 0) {
      return { data: null, error: 'Input is empty. Paste a YAML document to parse it.' };
    }
    let start = 0;
    while (start < lines.length && lines[start].content === '---') start += 1;
    if (start >= lines.length) {
      return { data: null, error: 'Input contains a document marker but no YAML content.' };
    }
    const root = parseBlockAt(lines, start, lines[start].indent);
    if (root.next < lines.length) {
      let cursor = root.next;
      while (cursor < lines.length && lines[cursor].content === '...') cursor += 1;
      if (cursor < lines.length) {
        const leftover = lines[cursor];
        throw new YamlError(
          leftover.content === '---'
            ? `Multiple YAML documents are not supported. Found a second document at line ${leftover.srcLine}.`
            : `Unexpected content at line ${leftover.srcLine}. Check the indentation of this document.`,
          leftover.srcLine
        );
      }
    }
    return { data: root.data, error: null };
  } catch (error) {
    if (error instanceof YamlError) {
      return { data: null, error: error.message, line: error.line };
    }
    return { data: null, error: error instanceof Error ? error.message : 'Unknown YAML error' };
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isScalar(value: unknown): boolean {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

const YAML_RESERVED_WORDS =
  /^(null|Null|NULL|~|true|True|TRUE|yes|Yes|on|On|false|False|FALSE|no|No|off|Off)$/;

function needsQuoting(s: string): boolean {
  if (s === '') return true;
  if (/^[\s-]/.test(s) || /[\s]$/.test(s)) return true;
  if (YAML_RESERVED_WORDS.test(s)) return true;
  if (/^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/.test(s) || /^-?\.\d+/.test(s)) return true;
  if (/[:#\[\]{},&*!|>'"?%@`]/.test(s)) return true;
  return false;
}

function yamlString(value: string): string {
  return needsQuoting(value) ? JSON.stringify(value) : value;
}

function yamlKey(value: string): string {
  return needsQuoting(value) ? JSON.stringify(value) : value;
}

function yamlScalar(value: unknown): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return yamlString(value);
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return yamlString(String(value));
}

function yamlLines(data: unknown, depth: number, indentSize: number, lines: string[]): void {
  const pad = ' '.repeat(depth * indentSize);
  if (Array.isArray(data)) {
    if (data.length === 0) {
      lines.push(`${pad}[]`);
      return;
    }
    for (const item of data) {
      if (isScalar(item)) {
        lines.push(`${pad}- ${yamlScalar(item)}`);
      } else if (Array.isArray(item) && item.length === 0) {
        lines.push(`${pad}- []`);
      } else if (isPlainObject(item) && Object.keys(item).length === 0) {
        lines.push(`${pad}- {}`);
      } else {
        const sub: string[] = [];
        yamlLines(item, depth, indentSize, sub);
        sub[0] = `${pad}- ${sub[0].slice(pad.length)}`;
        lines.push(...sub);
      }
    }
    return;
  }
  if (isPlainObject(data)) {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      lines.push(`${pad}{}`);
      return;
    }
    for (const key of keys) {
      const value = data[key];
      const k = yamlKey(key);
      if (isScalar(value)) {
        lines.push(`${pad}${k}: ${yamlScalar(value)}`);
      } else if (Array.isArray(value) && value.length === 0) {
        lines.push(`${pad}${k}: []`);
      } else if (isPlainObject(value) && Object.keys(value).length === 0) {
        lines.push(`${pad}${k}: {}`);
      } else {
        lines.push(`${pad}${k}:`);
        yamlLines(value, depth + 1, indentSize, lines);
      }
    }
    return;
  }
  lines.push(`${pad}${yamlScalar(data)}`);
}

export function stringifyYaml(data: unknown, indentSize = 2): string {
  const lines: string[] = [];
  yamlLines(data, 0, indentSize, lines);
  return `${lines.join('\n')}\n`;
}

export function formatYaml(
  source: string,
  indentSize = 2
): { value: string; error: string | null } {
  const parsed = parseYaml(source);
  if (parsed.error) {
    return { value: '', error: parsed.error };
  }
  return { value: stringifyYaml(parsed.data, indentSize), error: null };
}

export function yamlToJson(source: string): { value: string; error: string | null } {
  const parsed = parseYaml(source);
  if (parsed.error) {
    return { value: '', error: parsed.error };
  }
  return { value: JSON.stringify(parsed.data, null, 2), error: null };
}

export function jsonToYaml(
  source: string,
  indentSize = 2
): { value: string; error: string | null } {
  let data: unknown;
  try {
    data = JSON.parse(source);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown JSON error';
    return { value: '', error: `Invalid JSON: ${message}` };
  }
  if (source.trim() === '') {
    return { value: '', error: 'Input is empty. Paste a JSON document to convert it.' };
  }
  return { value: stringifyYaml(data, indentSize), error: null };
}

export function validateYaml(source: string): ToolValidationResult {
  const parsed = parseYaml(source);
  if (parsed.error) {
    const issues: ToolValidationIssue[] = [
      {
        message: parsed.error,
        ...(parsed.line !== undefined ? { line: parsed.line } : {}),
      },
    ];
    return { valid: false, error: parsed.error, issues };
  }
  const sourceLines = source.split(/\r\n|\r|\n/).length;
  return {
    valid: true,
    error: null,
    issues: [],
    stats: [
      { label: 'Size', value: `${source.length.toLocaleString()} chars` },
      { label: 'Lines', value: sourceLines.toLocaleString() },
      {
        label: 'Root type',
        value: Array.isArray(parsed.data)
          ? 'sequence'
          : isPlainObject(parsed.data)
            ? 'mapping'
            : 'scalar',
      },
    ],
  };
}
