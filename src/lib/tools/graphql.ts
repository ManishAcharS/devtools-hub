type Token =
  | { type: 'name'; value: string }
  | { type: 'number'; value: string }
  | { type: 'string'; value: string }
  | { type: 'blockString'; value: string }
  | { type: 'comment'; value: string }
  | { type: 'punct'; value: string };

const SINGLE_CHAR = new Set(['{', '}', '(', ')', '[', ']', ':', '@', '$', '!', '=', '|', '&']);

function tokenize(query: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = query.length;

  while (i < n) {
    const ch = query[i]!;

    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === ',') {
      i += 1;
      continue;
    }

    if (ch === '#') {
      const end = query.indexOf('\n', i);
      const lineEnd = end === -1 ? n : end;
      tokens.push({ type: 'comment', value: query.slice(i, lineEnd) });
      i = lineEnd;
      continue;
    }

    if (query.startsWith('"""', i)) {
      const end = query.indexOf('"""', i + 3);
      if (end === -1) throw new Error('Unterminated block string.');
      tokens.push({ type: 'blockString', value: query.slice(i, end + 3) });
      i = end + 3;
      continue;
    }

    if (ch === '"') {
      let j = i + 1;
      let value = '';
      let closed = false;
      while (j < n) {
        const inner = query[j]!;
        if (inner === '\\' && j + 1 < n) {
          const next = query[j + 1]!;
          if (next === 'n') value += '\n';
          else if (next === 't') value += '\t';
          else if (next === 'r') value += '\r';
          else if (next === 'u') {
            const hex = query.slice(j + 2, j + 6);
            if (/^[0-9a-fA-F]{4}$/.test(hex)) {
              value += String.fromCharCode(Number.parseInt(hex, 16));
              j += 4;
            } else {
              value += next;
            }
          } else {
            value += next;
          }
          j += 2;
          continue;
        }
        if (inner === '"') {
          closed = true;
          j += 1;
          break;
        }
        value += inner;
        j += 1;
      }
      if (!closed) throw new Error('Unterminated string literal.');
      tokens.push({ type: 'string', value });
      i = j;
      continue;
    }

    if (/[_A-Za-z]/.test(ch)) {
      let j = i;
      while (j < n && /[_0-9A-Za-z]/.test(query[j]!)) j += 1;
      tokens.push({ type: 'name', value: query.slice(i, j) });
      i = j;
      continue;
    }

    if (/[0-9]/.test(ch) || (ch === '-' && /[0-9]/.test(query[i + 1] ?? ''))) {
      const match = /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/.exec(query.slice(i));
      if (match) {
        tokens.push({ type: 'number', value: match[0] });
        i += match[0].length;
        continue;
      }
    }

    if (query.startsWith('...', i)) {
      tokens.push({ type: 'punct', value: '...' });
      i += 3;
      continue;
    }

    if (SINGLE_CHAR.has(ch)) {
      tokens.push({ type: 'punct', value: ch });
      i += 1;
      continue;
    }

    throw new Error(`Unexpected character "${ch}" at position ${i + 1}.`);
  }

  return tokens;
}

function isWord(token: Token): boolean {
  return (
    token.type === 'name' ||
    token.type === 'number' ||
    token.type === 'string' ||
    token.type === 'blockString'
  );
}

interface Cursor {
  tokens: Token[];
  index: number;
}

function nextToken(cursor: Cursor): Token | null {
  if (cursor.index >= cursor.tokens.length) return null;
  const token = cursor.tokens[cursor.index];
  cursor.index += 1;
  return token;
}

function collectInline(cursor: Cursor): string {
  let out = '';
  let afterValue = false;
  const trimEnd = (): void => {
    out = out.replace(/\s+$/, '');
  };
  const OPEN = new Set(['(', '[', '{']);
  const CLOSE: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

  while (true) {
    const token = nextToken(cursor);
    if (!token) throw new Error('Unterminated inline group.');
    if (token.type === 'comment') continue;

    if (
      token.type === 'blockString' ||
      token.type === 'string' ||
      token.type === 'number' ||
      token.type === 'name'
    ) {
      if (afterValue) {
        trimEnd();
        out += ', ';
      }
      out += token.value;
      out += ' ';
      afterValue = true;
      continue;
    }

    const value = token.value;
    if (OPEN.has(value)) {
      if (afterValue) {
        trimEnd();
        out += ', ';
      }
      out += value;
      out += collectInline(cursor);
      out += ' ';
      afterValue = true;
      continue;
    }
    if (CLOSE[value]) {
      trimEnd();
      return `${out}${value}`;
    }
    if (value === ':') {
      trimEnd();
      out += ': ';
      afterValue = false;
      continue;
    }
    if (value === '=') {
      trimEnd();
      out += ' = ';
      afterValue = false;
      continue;
    }
    if (value === '!') {
      trimEnd();
      out += '!';
      afterValue = true;
      continue;
    }
    if (value === '$' || value === '...') {
      out += afterValue ? ', ' : '';
      out += value;
      afterValue = false;
      continue;
    }
    if (value === '@') {
      trimEnd();
      out += afterValue ? ' @' : '@';
      afterValue = false;
      continue;
    }
    if (value === '|' || value === '&') {
      trimEnd();
      out += ` ${value} `;
      afterValue = false;
      continue;
    }
    throw new Error(`Unexpected token "${value}" in inline group.`);
  }
}

function formatGraphQLBody(query: string): string {
  const tokens = tokenize(query);
  const cursor: Cursor = { tokens, index: 0 };
  const lines: string[] = [];
  let current = '';
  let indent = 0;

  const pushCurrent = (): void => {
    if (current.trim().length > 0 || current.length > 0) {
      lines.push(`${'  '.repeat(indent)}${current}`);
    }
    current = '';
  };

  const emit = (text: string): void => {
    current += text;
  };

  const emitName = (value: string): void => {
    if (
      current.length > 0 &&
      !/\s$/.test(current) &&
      !/[(@[:\[\]$!]/.test(current[current.length - 1]!)
    ) {
      emit(' ');
    }
    emit(value);
  };

  let previous: Token | null = null;

  const isFieldEnd = (token: Token): boolean => {
    if (token.type === 'name') return true;
    if (
      token.type === 'punct' &&
      (token.value === '!' || token.value === ')' || token.value === ']' || token.value === '}')
    ) {
      return true;
    }
    return false;
  };

  while (true) {
    const token = nextToken(cursor);
    if (!token) break;

    if (token.type === 'comment') {
      pushCurrent();
      lines.push(`${'  '.repeat(indent)}${token.value}`);
      previous = token;
      continue;
    }

    if (token.type === 'blockString') {
      pushCurrent();
      lines.push(`${'  '.repeat(indent)}${token.value}`);
      previous = token;
      continue;
    }

    if (token.type === 'string' || token.type === 'number') {
      if (current.length > 0 && !/\s$/.test(current)) emit(' ');
      emit(token.value);
      previous = token;
      continue;
    }

    if (token.type === 'name') {
      if (indent > 0 && previous && isFieldEnd(previous) && previous.value !== '...') {
        pushCurrent();
      }
      if (previous && previous.value === '...' && token.value !== 'on') {
        emit(token.value);
      } else {
        emitName(token.value);
      }
      previous = token;
      continue;
    }

    const value = token.value;

    if (value === '{') {
      const separator = current.length > 0 && !/\s$/.test(current) ? ' ' : '';
      lines.push(`${'  '.repeat(indent)}${current}${separator}{`);
      current = '';
      indent += 1;
      previous = token;
      continue;
    }

    if (value === '}') {
      pushCurrent();
      indent = Math.max(0, indent - 1);
      lines.push(`${'  '.repeat(indent)}}`);
      if (indent === 0) lines.push('');
      previous = token;
      continue;
    }

    if (value === '(' || value === '[') {
      emit(value);
      emit(collectInline(cursor));
      previous = { type: 'punct', value: value === '(' ? ')' : ']' };
      continue;
    }

    if (value === ':') {
      emit(': ');
      previous = token;
      continue;
    }

    if (value === '=') {
      emit(' = ');
      previous = token;
      continue;
    }

    if (value === '@') {
      if (current.length > 0 && !/\s$/.test(current)) emit(' ');
      emit('@');
      previous = token;
      continue;
    }

    if (value === '!' || value === '$') {
      emit(value);
      previous = token;
      continue;
    }

    if (value === '...') {
      emitName(value);
      previous = token;
      continue;
    }

    if (value === '|' || value === '&') {
      emit(` ${value} `);
      previous = token;
      continue;
    }

    throw new Error(`Unexpected token "${value}".`);
  }

  if (indent !== 0) throw new Error('Unbalanced braces — a selection set is never closed.');
  pushCurrent();
  return lines.join('\n');
}

export function formatGraphQL(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) throw new Error('Enter a GraphQL document first.');
  const output = formatGraphQLBody(trimmed);
  return `${output.replace(/\n+$/, '')}\n`;
}

function minifyGraphQLBody(query: string): string {
  const tokens = tokenize(query);
  const parts: string[] = [];
  let previous: Token | null = null;
  let depth = 0;

  for (const token of tokens) {
    if (token.type === 'comment') continue;

    if (token.type === 'punct') {
      if (token.value === '(' || token.value === '[' || token.value === '{') {
        depth += 1;
      } else if (token.value === ')' || token.value === ']' || token.value === '}') {
        depth -= 1;
        if (depth < 0) throw new Error('Unbalanced delimiters.');
      }
      if (token.value === '=') {
        parts.push('=');
        parts.push(' ');
        previous = null;
        continue;
      }
      parts.push(token.value);
      previous = null;
      continue;
    }

    if (previous && isWord(previous)) parts.push(' ');
    parts.push(token.value);
    previous = token;
  }

  if (depth !== 0) throw new Error('Unbalanced delimiters.');
  return parts.join('').trim();
}

export function minifyGraphQL(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) throw new Error('Enter a GraphQL document first.');
  return `${minifyGraphQLBody(trimmed)}\n`;
}
