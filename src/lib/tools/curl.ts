export interface CurlHeader {
  name: string;
  value: string;
}

export type CurlAuth =
  | { type: 'bearer'; token: string }
  | { type: 'basic'; username: string; password: string }
  | undefined;

export interface CurlOptions {
  method: string;
  url: string;
  headers?: CurlHeader[];
  body?: string;
  auth?: CurlAuth;
}

function quoteShell(text: string): string {
  return `'${text.replace(/'/g, "'\\''")}'`;
}

function shellOption(flag: string, value: string, continuation: boolean): string {
  const prefix = continuation ? '  ' : '';
  return `${prefix}${flag} ${quoteShell(value)}`;
}

export function buildCurl(options: CurlOptions): string {
  const method = options.method.trim().toUpperCase() || 'GET';
  const url = options.url.trim();
  if (!url) return '';

  const args: string[] = [];
  if (method !== 'GET') args.push(`-X ${method}`);

  if (options.auth?.type === 'bearer' && options.auth.token.trim()) {
    args.push(`-H ${quoteShell(`Authorization: Bearer ${options.auth.token.trim()}`)}`);
  } else if (options.auth?.type === 'basic') {
    args.push(`-u ${quoteShell(`${options.auth.username.trim()}:${options.auth.password}`)}`);
  }

  const headers = (options.headers ?? []).filter(
    (header) => header.name.trim() && header.value.trim()
  );
  for (const header of headers) {
    args.push(`-H ${quoteShell(`${header.name.trim()}: ${header.value.trim()}`)}`);
  }

  const body = options.body?.trim();
  if (body) {
    args.push(`-d ${quoteShell(body)}`);
  }

  const parts = [
    `curl ${args.length > 0 ? `${args.join(' \\\n  ')} \\\n  ` : ''}${quoteShell(url)}`,
  ];
  return `${parts.join('')}\n`;
}

interface Token {
  value: string;
  raw: string;
}

function tokenizeShell(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < line.length) {
    const ch = line[i]!;
    if (ch === ' ' || ch === '\t') {
      i += 1;
      continue;
    }
    if (ch === "'") {
      let value = '';
      let j = i + 1;
      while (j < line.length && line[j] !== "'") {
        if (line[j] === '\\' && line[j + 1] === "'") {
          value += "'";
          j += 2;
        } else {
          value += line[j];
          j += 1;
        }
      }
      tokens.push({ value, raw: line.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    if (ch === '"') {
      let value = '';
      let j = i + 1;
      while (j < line.length && line[j] !== '"') {
        if (line[j] === '\\') {
          value += line[j + 1] ?? '';
          j += 2;
        } else {
          value += line[j];
          j += 1;
        }
      }
      tokens.push({ value, raw: line.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    let j = i;
    while (j < line.length && !/\s/.test(line[j]!)) j += 1;
    tokens.push({ value: line.slice(i, j), raw: line.slice(i, j) });
    i = j;
  }
  return tokens;
}

function joinShell(lines: string[]): Token[] {
  const tokens: Token[] = [];
  for (const line of lines) {
    tokens.push(...tokenizeShell(line));
  }
  return tokens;
}

function base64Encode(text: string): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const bytes = new TextEncoder().encode(text);
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i]!;
    const b2 = i + 1 < bytes.length ? bytes[i + 1]! : 0;
    const b3 = i + 2 < bytes.length ? bytes[i + 2]! : 0;
    const combined = (b1 << 16) | (b2 << 8) | b3;
    result += alphabet[(combined >> 18) & 63];
    result += alphabet[(combined >> 12) & 63];
    result += i + 1 < bytes.length ? alphabet[(combined >> 6) & 63] : '=';
    result += i + 2 < bytes.length ? alphabet[combined & 63] : '=';
  }
  return result;
}

export function curlToFetch(curl: string): string {
  const tokens = joinShell(curl.split(/\r?\n/));
  let url = '';
  let method = 'GET';
  const headers: { name: string; value: string }[] = [];
  const bodyParts: string[] = [];
  let basicCredentials: string | null = null;

  let i = 0;
  const next = (): Token | null => {
    if (i >= tokens.length) return null;
    const token = tokens[i];
    i += 1;
    return token;
  };

  const consumeValue = (): Token | null => {
    const token = next();
    return token;
  };

  while (true) {
    const token = next();
    if (!token) break;
    const flag = token.value;
    if (flag === 'curl' || flag === '\\') continue;

    if (flag === '-X' || flag === '--request') {
      const value = consumeValue();
      if (value) method = value.value.toUpperCase();
      continue;
    }
    if (flag === '-H' || flag === '--header') {
      const value = consumeValue();
      if (value) {
        const colon = value.value.indexOf(':');
        if (colon > 0) {
          headers.push({
            name: value.value.slice(0, colon).trim(),
            value: value.value.slice(colon + 1).trim(),
          });
        }
      }
      continue;
    }
    if (
      flag === '-d' ||
      flag === '--data' ||
      flag === '--data-raw' ||
      flag === '--data-binary' ||
      flag === '--data-urlencode'
    ) {
      const value = consumeValue();
      if (value) bodyParts.push(value.value);
      continue;
    }
    if (flag === '-u' || flag === '--user' || flag === '-U' || flag === '--proxy-user') {
      const value = consumeValue();
      if (value) basicCredentials = value.value;
      continue;
    }
    if (flag.startsWith('-') && flag !== '-') continue;
    if (!url) {
      url = flag;
    }
  }

  const hasBody = bodyParts.length > 0;
  if (method === 'GET' && hasBody) method = 'POST';
  const body = bodyParts.join('&');

  const headerMap: Record<string, string> = {};
  for (const header of headers) {
    const key = header.name.toLowerCase();
    if (!(key in headerMap)) headerMap[key] = header.value;
  }

  if (basicCredentials) {
    headerMap.authorization = `Basic ${base64Encode(basicCredentials)}`;
  }

  const headerNames = Object.keys(headerMap);
  const lines: string[] = [];
  const hasJsonBody = hasBody && /application\/json/i.test(headerMap['content-type'] ?? '');

  if (!url) return '';

  if (!hasBody && headerNames.length === 0) {
    return `fetch(${JSON.stringify(url)});\n`;
  }

  lines.push(`fetch(${JSON.stringify(url)}, {`);
  if (method !== 'GET') {
    lines.push(`  method: ${JSON.stringify(method)},`);
  }
  if (headerNames.length > 0) {
    lines.push('  headers: {');
    for (const name of headerNames) {
      lines.push(`    ${JSON.stringify(name)}: ${JSON.stringify(headerMap[name])},`);
    }
    lines.push('  },');
  }
  if (hasBody) {
    if (hasJsonBody) {
      try {
        const parsed = JSON.parse(body);
        lines.push(`  body: JSON.stringify(${JSON.stringify(parsed)}),`);
      } catch {
        lines.push(`  body: JSON.stringify(${JSON.stringify(body)}),`);
      }
    } else {
      lines.push(`  body: ${JSON.stringify(body)},`);
    }
  }
  lines.push('});');
  return `${lines.join('\n')}\n`;
}
