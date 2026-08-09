type TomlValue = string | number | boolean | null | TomlValue[] | { [key: string]: TomlValue };

interface TomlState {
  text: string;
  pos: number;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseJsonValue(jsonStr: string): unknown {
  const trimmed = jsonStr.trim();
  if (!trimmed) throw new Error('Enter a JSON document first.');
  try {
    return JSON.parse(trimmed);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Invalid JSON.');
  }
}

function navigate(root: Record<string, unknown>, path: string[]): Record<string, unknown> {
  let node: Record<string, unknown> = root;
  for (let i = 0; i < path.length - 1; i += 1) {
    const key = path[i]!;
    let next = node[key];
    if (next === undefined) {
      next = {};
      node[key] = next;
    }
    if (Array.isArray(next)) {
      if (next.length === 0) throw new Error(`Table array "${key}" is empty.`);
      next = next[next.length - 1] as Record<string, unknown>;
    }
    if (!isPlainObject(next)) throw new Error(`"${key}" is not a table.`);
    node = next;
  }
  return node;
}

function setValue(root: Record<string, unknown>, path: string[], value: unknown): void {
  const parent = navigate(root, path);
  parent[path[path.length - 1]!] = value;
}

function skipTomlWs(state: TomlState): void {
  while (state.pos < state.text.length && /\s/.test(state.text[state.pos]!)) {
    state.pos += 1;
  }
}

function parseBasicString(state: TomlState): string {
  state.pos += 1;
  let result = '';
  while (state.pos < state.text.length) {
    const ch = state.text[state.pos]!;
    if (ch === '"') {
      state.pos += 1;
      return result;
    }
    if (ch === '\\') {
      state.pos += 1;
      const escape = state.text[state.pos];
      if (escape === undefined) throw new Error('Unterminated escape sequence.');
      if (escape === 'n') result += '\n';
      else if (escape === 't') result += '\t';
      else if (escape === 'r') result += '\r';
      else if (escape === 'b') result += '\b';
      else if (escape === 'f') result += '\f';
      else if (escape === '"') result += '"';
      else if (escape === '\\') result += '\\';
      else if (escape === 'u') {
        const hex = state.text.slice(state.pos + 1, state.pos + 5);
        if (!/^[0-9a-fA-F]{4}$/.test(hex)) throw new Error('Invalid \\u escape.');
        result += String.fromCharCode(Number.parseInt(hex, 16));
        state.pos += 4;
      } else if (escape === 'U') {
        const hex = state.text.slice(state.pos + 1, state.pos + 9);
        if (!/^[0-9a-fA-F]{8}$/.test(hex)) throw new Error('Invalid \\U escape.');
        const codePoint = Number.parseInt(hex, 16);
        if (codePoint > 0x10ffff) throw new Error('Invalid Unicode code point.');
        result += String.fromCodePoint(codePoint);
        state.pos += 8;
      } else {
        throw new Error(`Unknown escape sequence "\\${escape}".`);
      }
      state.pos += 1;
      continue;
    }
    if (ch === '\n') throw new Error('Unescaped newline in basic string.');
    result += ch;
    state.pos += 1;
  }
  throw new Error('Unterminated string.');
}

function parseMultilineBasic(state: TomlState): string {
  state.pos += 3;
  if (state.text.startsWith('\n', state.pos)) state.pos += 1;
  if (state.text.startsWith('\r\n', state.pos)) state.pos += 2;
  let result = '';
  while (state.pos < state.text.length) {
    if (state.text.startsWith('"""', state.pos)) {
      state.pos += 3;
      return result;
    }
    const ch = state.text[state.pos]!;
    if (ch === '\\') {
      state.pos += 1;
      if (state.text.startsWith('\r\n', state.pos)) {
        state.pos += 2;
      } else if (state.text[state.pos] === '\n' || state.text[state.pos] === ' ') {
        while (state.pos < state.text.length && /\s/.test(state.text[state.pos]!)) {
          state.pos += 1;
        }
        continue;
      }
      const escape = state.text[state.pos];
      if (escape === 'n') result += '\n';
      else if (escape === 't') result += '\t';
      else if (escape === 'r') result += '\r';
      else if (escape === '"') result += '"';
      else if (escape === '\\') result += '\\';
      else throw new Error(`Unknown escape sequence "\\${escape ?? ''}".`);
      state.pos += 1;
      continue;
    }
    result += ch;
    state.pos += 1;
  }
  throw new Error('Unterminated multi-line string.');
}

function parseLiteralString(state: TomlState): string {
  state.pos += 1;
  const end = state.text.indexOf("'", state.pos);
  if (end === -1) throw new Error('Unterminated literal string.');
  const result = state.text.slice(state.pos, end);
  state.pos = end + 1;
  return result;
}

function parseMultilineLiteral(state: TomlState): string {
  state.pos += 3;
  if (state.text.startsWith('\n', state.pos)) state.pos += 1;
  const end = state.text.indexOf("'''", state.pos);
  if (end === -1) throw new Error('Unterminated multi-line literal string.');
  const result = state.text.slice(state.pos, end);
  state.pos = end + 3;
  return result;
}

function parseTomlArray(state: TomlState): TomlValue[] {
  state.pos += 1;
  const items: TomlValue[] = [];
  skipTomlWs(state);
  if (state.text[state.pos] === ']') {
    state.pos += 1;
    return items;
  }
  while (true) {
    items.push(parseTomlValueInner(state));
    skipTomlWs(state);
    const ch = state.text[state.pos];
    if (ch === ',') {
      state.pos += 1;
      skipTomlWs(state);
      if (state.text[state.pos] === ']') {
        state.pos += 1;
        return items;
      }
      continue;
    }
    if (ch === ']') {
      state.pos += 1;
      return items;
    }
    throw new Error('Expected "," or "]" in array.');
  }
}

function parseInlineKey(state: TomlState): string[] {
  const start = state.pos;
  while (state.pos < state.text.length) {
    const ch = state.text[state.pos]!;
    if (ch === ',' || ch === '}' || ch === '=') break;
    state.pos += 1;
  }
  const raw = state.text.slice(start, state.pos);
  return parseKeyText(raw);
}

function parseInlineTable(state: TomlState): { [key: string]: TomlValue } {
  state.pos += 1;
  const table: { [key: string]: TomlValue } = {};
  skipTomlWs(state);
  if (state.text[state.pos] === '}') {
    state.pos += 1;
    return table;
  }
  while (true) {
    const keys = parseInlineKey(state);
    if (keys.length === 0) throw new Error('Empty key in inline table.');
    skipTomlWs(state);
    if (state.text[state.pos] !== '=') throw new Error('Expected "=" in inline table.');
    state.pos += 1;
    skipTomlWs(state);
    const value = parseTomlValueInner(state);
    setValue(table, keys, value);
    skipTomlWs(state);
    const ch = state.text[state.pos];
    if (ch === ',') {
      state.pos += 1;
      skipTomlWs(state);
      continue;
    }
    if (ch === '}') {
      state.pos += 1;
      return table;
    }
    throw new Error('Expected "," or "}" in inline table.');
  }
}

function parseNumberOrBare(state: TomlState): TomlValue {
  const rest = state.text.slice(state.pos);
  const match = /^[+-]?[0-9][0-9_]*(?:\.[0-9][0-9_]*)?(?:[eE][+-]?[0-9]+)?/.exec(rest);
  if (match) {
    const raw = match[0];
    const next = rest[raw.length];
    if (next === undefined || /[\s,\]}]/.test(next)) {
      state.pos += raw.length;
      const cleaned = raw.replace(/_/g, '');
      if (/[eE]/.test(cleaned) || cleaned.includes('.')) return Number.parseFloat(cleaned);
      return Number.parseInt(cleaned, 10);
    }
  }
  if (/^true\b/.test(rest)) {
    state.pos += 4;
    return true;
  }
  if (/^false\b/.test(rest)) {
    state.pos += 5;
    return false;
  }
  throw new Error(`Invalid TOML value "${rest.slice(0, 30)}".`);
}

function parseTomlValueInner(state: TomlState): TomlValue {
  skipTomlWs(state);
  const ch = state.text[state.pos];
  if (ch === undefined) throw new Error('Missing value.');
  if (ch === '"') {
    if (state.text.startsWith('"""', state.pos)) return parseMultilineBasic(state);
    return parseBasicString(state);
  }
  if (ch === "'") {
    if (state.text.startsWith("'''", state.pos)) return parseMultilineLiteral(state);
    return parseLiteralString(state);
  }
  if (ch === '[') return parseTomlArray(state);
  if (ch === '{') return parseInlineTable(state);
  return parseNumberOrBare(state);
}

function parseTomlValueText(text: string): TomlValue {
  const state: TomlState = { text, pos: 0 };
  const value = parseTomlValueInner(state);
  skipTomlWs(state);
  if (state.pos < state.text.length) {
    throw new Error(
      `Unexpected trailing characters in value: "${text.slice(state.pos, state.pos + 20)}".`
    );
  }
  return value;
}

function parseKeySegment(raw: string): string {
  const segment = raw.trim();
  if (segment.startsWith('"') && segment.endsWith('"') && segment.length >= 2) {
    const state: TomlState = { text: segment, pos: 0 };
    return parseBasicString(state);
  }
  if (segment.startsWith("'") && segment.endsWith("'") && segment.length >= 2) {
    const state: TomlState = { text: segment, pos: 0 };
    return parseLiteralString(state);
  }
  if (!/^[A-Za-z0-9_-]+$/.test(segment)) {
    throw new Error(`Invalid key "${segment}".`);
  }
  return segment;
}

function parseKeyText(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('Empty key.');
  const segments: string[] = [];
  let current = '';
  let inBasic = false;
  let inLiteral = false;
  for (let i = 0; i < trimmed.length; i += 1) {
    const ch = trimmed[i]!;
    if (inBasic) {
      current += ch;
      if (ch === '\\' && i + 1 < trimmed.length) {
        current += trimmed[i + 1];
        i += 1;
        continue;
      }
      if (ch === '"') inBasic = false;
      continue;
    }
    if (inLiteral) {
      current += ch;
      if (ch === "'") inLiteral = false;
      continue;
    }
    if (ch === '"') {
      if (current.trim().length > 0) {
        segments.push(parseKeySegment(current));
        current = '';
      }
      current = '"';
      inBasic = true;
      continue;
    }
    if (ch === "'") {
      if (current.trim().length > 0) {
        segments.push(parseKeySegment(current));
        current = '';
      }
      current = "'";
      inLiteral = true;
      continue;
    }
    if (ch === '.') {
      segments.push(parseKeySegment(current));
      current = '';
      continue;
    }
    current += ch;
  }
  if (inBasic || inLiteral) throw new Error('Unterminated quoted key.');
  if (current.trim().length > 0) {
    segments.push(parseKeySegment(current));
  }
  return segments;
}

function findEquals(text: string): number {
  let inBasic = false;
  let inLiteral = false;
  let depth = 0;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]!;
    if (inBasic) {
      if (ch === '\\') i += 1;
      else if (ch === '"') inBasic = false;
      continue;
    }
    if (inLiteral) {
      if (ch === "'") inLiteral = false;
      continue;
    }
    if (ch === '"') inBasic = true;
    else if (ch === "'") inLiteral = true;
    else if (ch === '[' || ch === '{') depth += 1;
    else if (ch === ']' || ch === '}') depth -= 1;
    else if (ch === '=' && depth === 0) return i;
  }
  return -1;
}

function tomlValueComplete(text: string): boolean {
  let depth = 0;
  let inBasic = false;
  let inLiteral = false;
  let triple: string | null = null;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]!;
    if (triple) {
      if (text.startsWith(triple.repeat(3), i)) {
        triple = null;
        i += 2;
      }
      continue;
    }
    if (inBasic) {
      if (ch === '\\') i += 1;
      else if (ch === '"') inBasic = false;
      continue;
    }
    if (inLiteral) {
      if (ch === "'") inLiteral = false;
      continue;
    }
    if (ch === '"') {
      if (text.startsWith('"""', i)) {
        triple = '"';
        i += 2;
      } else {
        inBasic = true;
      }
    } else if (ch === "'") {
      if (text.startsWith("'''", i)) {
        triple = "'";
        i += 2;
      } else {
        inLiteral = true;
      }
    } else if (ch === '[' || ch === '{') {
      depth += 1;
    } else if (ch === ']' || ch === '}') {
      depth -= 1;
    }
  }
  return depth === 0 && !inBasic && !inLiteral && triple === null;
}

function ensureTable(root: Record<string, unknown>, path: string[]): void {
  if (path.length === 0) throw new Error('Empty table header.');
  navigate(root, path);
}

function ensureArrayTable(root: Record<string, unknown>, path: string[]): void {
  if (path.length === 0) throw new Error('Empty table array header.');
  const parent = navigate(root, path);
  const key = path[path.length - 1]!;
  const existing = parent[key];
  if (Array.isArray(existing)) {
    existing.push({});
  } else {
    parent[key] = [{}];
  }
}

export function tomlToJson(tomlStr: string): string {
  const lines = tomlStr.split(/\r?\n/);
  const root: Record<string, unknown> = {};
  let currentPath: string[] = [];
  let found = false;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      i += 1;
      continue;
    }
    if (trimmed.startsWith('[[')) {
      const close = trimmed.lastIndexOf(']]');
      if (close === -1 || close < 2) throw new Error('Malformed table array header.');
      const path = parseKeyText(trimmed.slice(2, close));
      ensureArrayTable(root, path);
      currentPath = path;
      found = true;
      i += 1;
      continue;
    }
    if (trimmed.startsWith('[')) {
      const close = trimmed.lastIndexOf(']');
      if (close === -1 || close === 0) throw new Error('Malformed table header.');
      const path = parseKeyText(trimmed.slice(1, close));
      ensureTable(root, path);
      currentPath = path;
      found = true;
      i += 1;
      continue;
    }
    const eq = findEquals(line);
    if (eq === -1) throw new Error(`Expected "key = value", got: "${trimmed}".`);
    const keys = parseKeyText(line.slice(0, eq));
    let valueText = line.slice(eq + 1);
    while (!tomlValueComplete(valueText)) {
      i += 1;
      if (i >= lines.length) throw new Error('Unterminated value.');
      valueText += `\n${lines[i]}`;
    }
    const path = [...currentPath, ...keys];
    setValue(root, path, parseTomlValueText(valueText));
    found = true;
    i += 1;
  }

  if (!found) throw new Error('No TOML content found.');
  return JSON.stringify(root, null, 2);
}

function serializeTomlPrimitive(value: TomlValue, inline = false): string {
  if (value === null) throw new Error('null values cannot be represented in TOML.');
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') {
    if (!Number.isFinite(value))
      throw new Error('Non-finite numbers cannot be represented in TOML.');
    return String(value);
  }
  if (Array.isArray(value)) {
    const items = value.map((item) =>
      isPlainObject(item)
        ? `{ ${Object.entries(item)
            .map(([key, val]) => `${key} = ${serializeTomlPrimitive(val as TomlValue, true)}`)
            .join(', ')} }`
        : serializeTomlPrimitive(item, true)
    );
    return `[${items.join(', ')}]`;
  }
  if (inline && isPlainObject(value)) {
    return `{ ${Object.entries(value)
      .map(([key, val]) => `${key} = ${serializeTomlPrimitive(val as TomlValue, true)}`)
      .join(', ')} }`;
  }
  throw new Error('Unsupported value type.');
}

function writeTomlTable(object: Record<string, unknown>, path: string[], lines: string[]): void {
  for (const [key, value] of Object.entries(object)) {
    if (value === null) continue;
    const fullPath = [...path, key];
    if (isPlainObject(value)) {
      lines.push(`[${fullPath.join('.')}]`);
      writeTomlTable(value, fullPath, lines);
      continue;
    }
    if (Array.isArray(value) && value.length > 0 && value.every(isPlainObject)) {
      for (const item of value) {
        lines.push(`[[${fullPath.join('.')}]]`);
        writeTomlTable(item, fullPath, lines);
      }
      continue;
    }
    lines.push(`${key} = ${serializeTomlPrimitive(value as TomlValue)}`);
  }
}

export function jsonToToml(jsonStr: string): string {
  const value = parseJsonValue(jsonStr);
  if (!isPlainObject(value)) throw new Error('JSON root must be an object.');
  const lines: string[] = [];
  writeTomlTable(value, [], lines);
  if (lines.length === 0) throw new Error('The object contains no convertible values.');
  return `${lines.join('\n')}\n`;
}

function stripIniComment(line: string): string {
  let inBasic = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]!;
    if (ch === '"') inBasic = !inBasic;
    if (!inBasic && (ch === ';' || ch === '#') && (i === 0 || /\s/.test(line[i - 1]!))) {
      return line.slice(0, i);
    }
  }
  return line;
}

function findIniSeparator(line: string): number {
  let inBasic = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]!;
    if (ch === '"') inBasic = !inBasic;
    if (!inBasic && (ch === '=' || ch === ':')) return i;
  }
  return -1;
}

function parseIniValue(raw: string): string | number | boolean {
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(raw)) {
    const number = Number(raw);
    if (Number.isFinite(number)) return number;
  }
  return raw;
}

export function iniToJson(iniStr: string): string {
  const lines = iniStr.split(/\r?\n/);
  const root: Record<string, unknown> = {};
  let section: string[] = [];
  let found = false;

  for (const raw of lines) {
    const line = stripIniComment(raw).trim();
    if (!line) continue;
    if (line.startsWith('[') && line.endsWith(']')) {
      section = line
        .slice(1, -1)
        .split('.')
        .map((part) => part.trim())
        .filter((part) => part.length > 0);
      continue;
    }
    const sep = findIniSeparator(line);
    if (sep === -1) throw new Error(`Expected "key = value", got: "${line}".`);
    const keyText = line.slice(0, sep).trim();
    if (!keyText) throw new Error(`Missing key in line: "${line}".`);
    let valueText = line.slice(sep + 1).trim();
    if (
      (valueText.startsWith('"') && valueText.endsWith('"') && valueText.length >= 2) ||
      (valueText.startsWith("'") && valueText.endsWith("'") && valueText.length >= 2)
    ) {
      valueText = valueText.slice(1, -1);
    }
    const keys = [...section, ...keyText.split('.').map((part) => part.trim())];
    setValue(root, keys, parseIniValue(valueText));
    found = true;
  }

  if (!found) throw new Error('No key/value pairs found.');
  return JSON.stringify(root, null, 2);
}

function iniValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function writeIniTable(object: Record<string, unknown>, path: string[], lines: string[]): void {
  for (const [key, value] of Object.entries(object)) {
    if (!isPlainObject(value)) {
      lines.push(`${key} = ${iniValue(value)}`);
    }
  }
  for (const [key, value] of Object.entries(object)) {
    if (isPlainObject(value)) {
      const childPath = [...path, key];
      lines.push(`[${childPath.join('.')}]`);
      writeIniTable(value, childPath, lines);
    }
  }
}

export function jsonToIni(jsonStr: string): string {
  const value = parseJsonValue(jsonStr);
  if (!isPlainObject(value)) throw new Error('JSON root must be an object.');
  const lines: string[] = [];
  writeIniTable(value, [], lines);
  if (lines.length === 0) throw new Error('The object contains no convertible values.');
  return `${lines.join('\n')}\n`;
}
