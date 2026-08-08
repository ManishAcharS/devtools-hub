import type { ToolTransformResult, ToolValidationIssue, ToolValidationResult } from './types';

export type KeywordCase = 'upper' | 'lower' | 'asis';

type TokenType = 'word' | 'string' | 'comment' | 'number' | 'punct' | 'ws';

export interface SqlToken {
  type: TokenType;
  value: string;
  line: number;
}

export interface SqlTokenizeResult {
  tokens: SqlToken[];
  error: string | null;
}

const MULTI_CHAR_PUNCT = new Set([
  '->>',
  '::',
  '<<',
  '>>',
  '<>',
  '<=',
  '>=',
  '!=',
  '||',
  '->',
  '**',
  ':=',
]);

const SINGLE_CHAR_PUNCT = new Set([
  '(',
  ')',
  ',',
  ';',
  '.',
  '*',
  '=',
  '<',
  '>',
  '+',
  '-',
  '/',
  '%',
  '!',
  '~',
  '|',
  '&',
  '^',
  ':',
  '?',
  '@',
  '#',
  '[',
  ']',
  '{',
  '}',
  '$',
]);

const WORD_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*/;

export function tokenizeSql(sql: string): SqlTokenizeResult {
  const tokens: SqlToken[] = [];
  let line = 1;
  let i = 0;

  while (i < sql.length) {
    const ch = sql[i];

    if (ch === '\n') {
      line += 1;
      tokens.push({ type: 'ws', value: '\n', line });
      i += 1;
      continue;
    }

    if (/\s/.test(ch)) {
      let j = i;
      while (j < sql.length && /\s/.test(sql[j]) && sql[j] !== '\n') j += 1;
      tokens.push({ type: 'ws', value: ' ', line });
      i = j;
      continue;
    }

    if (ch === "'" || ch === '"' || ch === '`') {
      let j = i + 1;
      while (j < sql.length) {
        if (sql[j] === ch) {
          if (sql[j + 1] === ch) {
            j += 2;
            continue;
          }
          break;
        }
        if (sql[j] === '\n') line += 1;
        j += 1;
      }
      if (j >= sql.length) {
        return {
          tokens,
          error: `Unterminated string starting at line ${line}. Every ${ch}…${ch} string must be closed.`,
        };
      }
      tokens.push({ type: 'string', value: sql.slice(i, j + 1), line });
      i = j + 1;
      continue;
    }

    if (ch === '$') {
      const tagMatch = sql.slice(i).match(/^\$[A-Za-z_][A-Za-z0-9_]*\$/);
      if (tagMatch) {
        const tag = tagMatch[0];
        const end = sql.indexOf(tag, i + tag.length);
        if (end === -1) {
          return {
            tokens,
            error: `Unterminated dollar-quoted string starting at line ${line}.`,
          };
        }
        const raw = sql.slice(i, end + tag.length);
        line += (raw.match(/\n/g) ?? []).length;
        tokens.push({ type: 'string', value: raw, line });
        i = end + tag.length;
        continue;
      }
    }

    if (ch === '-' && sql[i + 1] === '-') {
      let j = i + 2;
      while (j < sql.length && sql[j] !== '\n') j += 1;
      tokens.push({ type: 'comment', value: sql.slice(i, j), line });
      i = j;
      continue;
    }

    if (ch === '/' && sql[i + 1] === '*') {
      let j = i + 2;
      let closed = false;
      while (j < sql.length) {
        if (sql[j] === '\n') line += 1;
        if (sql[j] === '*' && sql[j + 1] === '/') {
          closed = true;
          j += 2;
          break;
        }
        j += 1;
      }
      if (!closed) {
        return {
          tokens,
          error: `Unterminated block comment starting at line ${line}. Add the closing */ .`,
        };
      }
      tokens.push({ type: 'comment', value: sql.slice(i, j), line });
      i = j;
      continue;
    }

    const numberMatch = sql.slice(i).match(/^\d+(\.\d+)?([eE][+-]?\d+)?/);
    if (numberMatch) {
      tokens.push({ type: 'number', value: numberMatch[0], line });
      i += numberMatch[0].length;
      continue;
    }

    const wordMatch = sql.slice(i).match(WORD_PATTERN);
    if (wordMatch) {
      tokens.push({ type: 'word', value: wordMatch[0], line });
      i += wordMatch[0].length;
      continue;
    }

    let matched = false;
    for (const punct of MULTI_CHAR_PUNCT) {
      if (sql.startsWith(punct, i)) {
        tokens.push({ type: 'punct', value: punct, line });
        i += punct.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    if (SINGLE_CHAR_PUNCT.has(ch)) {
      tokens.push({ type: 'punct', value: ch, line });
      i += 1;
      continue;
    }

    tokens.push({ type: 'word', value: ch, line });
    i += 1;
  }

  return { tokens, error: null };
}

const CLAUSE_KEYWORDS = new Set([
  'SELECT',
  'FROM',
  'WHERE',
  'GROUP',
  'HAVING',
  'ORDER',
  'LIMIT',
  'OFFSET',
  'UNION',
  'INTERSECT',
  'EXCEPT',
  'VALUES',
  'SET',
  'JOIN',
  'INNER',
  'LEFT',
  'RIGHT',
  'FULL',
  'CROSS',
  'OUTER',
  'ON',
  'USING',
  'INSERT',
  'UPDATE',
  'DELETE',
  'CREATE',
  'ALTER',
  'DROP',
  'TRUNCATE',
  'WITH',
  'CASE',
  'WHEN',
  'THEN',
  'ELSE',
  'END',
  'AND',
  'OR',
  'RETURNING',
  'MERGE',
  'INTO',
  'BY',
  'AS',
  'DISTINCT',
  'ALL',
  'DESC',
  'ASC',
  'IN',
  'NOT',
  'IS',
  'LIKE',
]);

const BLOCK_OPENERS = new Set([
  'SELECT',
  'FROM',
  'WHERE',
  'GROUP',
  'HAVING',
  'ORDER',
  'LIMIT',
  'OFFSET',
  'UNION',
  'INTERSECT',
  'EXCEPT',
  'VALUES',
  'SET',
  'JOIN',
  'ON',
  'USING',
  'INSERT',
  'UPDATE',
  'DELETE',
  'CREATE',
  'ALTER',
  'DROP',
  'TRUNCATE',
  'WITH',
  'RETURNING',
  'MERGE',
]);

const STATEMENT_STARTERS = new Set([
  'SELECT',
  'INSERT',
  'UPDATE',
  'DELETE',
  'WITH',
  'CREATE',
  'ALTER',
  'DROP',
  'TRUNCATE',
  'EXPLAIN',
  'MERGE',
  'DECLARE',
  'BEGIN',
  'COMMIT',
  'ROLLBACK',
  'GRANT',
  'REVOKE',
  'VACUUM',
  'ANALYZE',
  'SHOW',
  'SET',
]);

interface PrintUnit {
  text: string;
  spaceBefore?: boolean;
  newlineBefore: boolean;
  newlineAfter: boolean;
  indentDelta: number;
  dedentBefore: boolean;
}

export function formatSql(
  sql: string,
  options: { keywordCase: KeywordCase; indentSize: number }
): ToolTransformResult {
  const { tokens, error } = tokenizeSql(sql);
  if (error) {
    return { value: '', error };
  }

  const significant = tokens.filter((token) => token.type !== 'ws');
  if (significant.length === 0) {
    return { value: '', error: 'Input is empty. Paste a SQL statement to format it.' };
  }

  const applyCase = (word: string): string => {
    if (options.keywordCase === 'upper') return word.toUpperCase();
    if (options.keywordCase === 'lower') return word.toLowerCase();
    return word;
  };

  const units: PrintUnit[] = [];
  let parenDepth = 0;
  let caseDepth = 0;
  let prevToken: SqlToken | null = null;

  significant.forEach((token) => {
    const isWord = token.type === 'word';
    const upper = isWord ? token.value.toUpperCase() : '';
    const prevUpper = prevToken && prevToken.type === 'word' ? prevToken.value.toUpperCase() : '';

    if (isWord && CLAUSE_KEYWORDS.has(upper)) {
      if (upper === 'CASE') {
        units.push({
          text: applyCase(token.value),
          newlineBefore: false,
          newlineAfter: false,
          indentDelta: 1,
          dedentBefore: false,
        });
        caseDepth += 1;
      } else if (upper === 'END') {
        units.push({
          text: applyCase(token.value),
          newlineBefore: true,
          newlineAfter: false,
          indentDelta: 0,
          dedentBefore: false,
        });
        if (caseDepth > 0) caseDepth -= 1;
      } else if (upper === 'WHEN' || upper === 'ELSE') {
        units.push({
          text: applyCase(token.value),
          newlineBefore: true,
          newlineAfter: false,
          indentDelta: 0,
          dedentBefore: false,
        });
      } else if (upper === 'AND' || upper === 'OR') {
        units.push({
          text: applyCase(token.value),
          newlineBefore: parenDepth === 0,
          newlineAfter: false,
          indentDelta: 0,
          dedentBefore: false,
        });
      } else if (BLOCK_OPENERS.has(upper)) {
        units.push({
          text: applyCase(token.value),
          newlineBefore: true,
          newlineAfter: false,
          indentDelta: 1,
          dedentBefore: true,
        });
      } else {
        units.push({
          text: applyCase(token.value),
          newlineBefore: false,
          newlineAfter: false,
          indentDelta: 0,
          dedentBefore: false,
        });
      }
    } else if (token.type === 'punct') {
      const value = token.value;

      if (value === '(') {
        const isFunctionCall =
          prevToken !== null && prevToken.type === 'word' && !CLAUSE_KEYWORDS.has(prevUpper);
        parenDepth += 1;
        units.push({
          text: '(',
          spaceBefore: !isFunctionCall,
          newlineBefore: false,
          newlineAfter: false,
          indentDelta: isFunctionCall ? 0 : 1,
          dedentBefore: false,
        });
      } else if (value === ')') {
        parenDepth = Math.max(0, parenDepth - 1);
        const openIndex = findLastOpenParen(units);
        const isInline = openIndex === -1 ? false : units[openIndex].indentDelta === 0;
        const multiline =
          openIndex !== -1 &&
          units.slice(openIndex + 1).some((unit) => unit.newlineBefore || unit.newlineAfter);
        units.push({
          text: ')',
          newlineBefore: !isInline && multiline,
          newlineAfter: false,
          indentDelta: 0,
          dedentBefore: !isInline,
        });
      } else if (value === ',') {
        units.push({
          text: ',',
          newlineBefore: false,
          newlineAfter: parenDepth === 0,
          indentDelta: 0,
          dedentBefore: false,
        });
      } else if (value === ';') {
        units.push({
          text: ';',
          newlineBefore: false,
          newlineAfter: true,
          indentDelta: 0,
          dedentBefore: false,
        });
      } else {
        units.push({
          text: value,
          newlineBefore: false,
          newlineAfter: false,
          indentDelta: 0,
          dedentBefore: false,
        });
      }
    } else if (token.type === 'comment') {
      units.push({
        text: token.value,
        newlineBefore: token.value.startsWith('--'),
        newlineAfter: token.value.startsWith('--'),
        indentDelta: 0,
        dedentBefore: false,
      });
    } else {
      units.push({
        text: token.value,
        newlineBefore: false,
        newlineAfter: false,
        indentDelta: 0,
        dedentBefore: false,
      });
    }

    if (token.type !== 'ws') {
      prevToken = token;
    }
  });

  const lines: string[] = [];
  let currentLine = '';
  let currentLineIndent = 0;
  let depth = 0;

  const flush = (): void => {
    if (currentLine.trim().length > 0) {
      lines.push(' '.repeat(currentLineIndent * options.indentSize) + currentLine.trim());
    }
    currentLine = '';
  };

  units.forEach((unit) => {
    if (unit.dedentBefore) depth = Math.max(0, depth - 1);
    if (unit.newlineBefore) flush();
    if (currentLine.length === 0)
      currentLineIndent = unit.text === ')' ? Math.max(0, depth - 1) : depth;
    const needsSpace =
      currentLine.length > 0 &&
      !currentLine.endsWith(' ') &&
      !currentLine.endsWith('(') &&
      (unit.spaceBefore ?? !'(),;'.includes(unit.text));
    currentLine += needsSpace ? ` ${unit.text}` : unit.text;
    if (unit.newlineAfter) flush();
    depth += unit.indentDelta;
  });
  flush();

  const value = `${lines.join('\n')}\n`;
  return {
    value,
    error: null,
    stats: [
      { label: 'Input', value: `${sql.length.toLocaleString()} chars` },
      { label: 'Output', value: `${value.length.toLocaleString()} chars` },
      { label: 'Lines', value: lines.length.toLocaleString() },
    ],
  };
}

function findLastOpenParen(units: PrintUnit[]): number {
  for (let i = units.length - 1; i >= 0; i -= 1) {
    if (units[i].text === '(') return i;
  }
  return -1;
}

export function minifySql(sql: string): ToolTransformResult {
  const { tokens, error } = tokenizeSql(sql);
  if (error) {
    return { value: '', error };
  }
  const significant = tokens.filter(
    (token) => token.type !== 'ws' && !(token.type === 'comment' && token.value.startsWith('--'))
  );
  if (significant.length === 0) {
    return { value: '', error: 'Input is empty. Paste a SQL statement to minify it.' };
  }

  const needsSpace = (prev: SqlToken, current: SqlToken): boolean => {
    const prevGroup = prev.type === 'word' || prev.type === 'number' || prev.type === 'string';
    const currentGroup =
      current.type === 'word' || current.type === 'number' || current.type === 'string';
    if (prevGroup && currentGroup) return true;
    if (prev.type === 'comment' && current.type !== 'punct') return true;
    return false;
  };

  let value = '';
  significant.forEach((token, index) => {
    if (index === 0) {
      value = token.value;
      return;
    }
    const prev = significant[index - 1];
    if (needsSpace(prev, token)) {
      value += ` ${token.value}`;
    } else {
      value += token.value;
    }
  });

  return {
    value,
    error: null,
    stats: [
      { label: 'Input', value: `${sql.length.toLocaleString()} chars` },
      { label: 'Output', value: `${value.length.toLocaleString()} chars` },
      { label: 'Saved', value: `${(sql.length - value.length).toLocaleString()} chars` },
    ],
  };
}

export function validateSql(sql: string): ToolValidationResult {
  const trimmed = sql.trim();
  if (trimmed.length === 0) {
    return {
      valid: false,
      error: 'Input is empty. Paste a SQL statement to validate it.',
      issues: [{ message: 'Input is empty. Paste a SQL statement to validate it.' }],
    };
  }

  const issues: ToolValidationIssue[] = [];
  const { tokens, error } = tokenizeSql(sql);
  if (error) {
    issues.push({ message: error });
    return { valid: false, error, issues };
  }

  let depth = 0;
  tokens.forEach((token) => {
    if (token.type === 'punct' && token.value === '(') depth += 1;
    if (token.type === 'punct' && token.value === ')') {
      depth -= 1;
      if (depth < 0) {
        issues.push({
          message: `Unmatched closing parenthesis ")" at line ${token.line}.`,
          line: token.line,
        });
        depth = 0;
      }
    }
  });
  if (depth > 0) {
    issues.push({
      message: `${depth} unclosed parenthes${depth === 1 ? 'is' : 'es'} at the end of the statement. Add the missing closing ${depth === 1 ? 'parenthesis' : 'parentheses'}.`,
    });
  }

  const first = tokens.find((token) => token.type !== 'ws');
  if (first && first.type === 'word') {
    const firstUpper = first.value.toUpperCase();
    if (!STATEMENT_STARTERS.has(firstUpper)) {
      issues.push({
        message: `"${first.value}" is not a valid statement starter. Statements usually begin with SELECT, INSERT, UPDATE, DELETE, WITH, or CREATE.`,
        line: first.line,
      });
    }
  } else if (first && first.type === 'punct') {
    issues.push({
      message: `Statement starts with unexpected character "${first.value}" at line ${first.line}.`,
      line: first.line,
    });
  }

  const keywordCount = tokens.filter(
    (token) =>
      token.type === 'word' &&
      ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'WITH', 'CREATE', 'ALTER', 'DROP'].includes(
        token.value.toUpperCase()
      )
  ).length;

  return {
    valid: issues.length === 0,
    error: issues.length > 0 ? issues[0].message : null,
    issues,
    stats: [
      {
        label: 'Tokens',
        value: tokens.filter((token) => token.type !== 'ws').length.toLocaleString(),
      },
      { label: 'Keywords', value: keywordCount.toLocaleString() },
      { label: 'Size', value: `${sql.length.toLocaleString()} chars` },
    ],
  };
}
