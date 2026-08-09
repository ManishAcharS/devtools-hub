export interface ParsedConnectionString {
  scheme: string;
  username: string;
  password: string;
  host: string;
  port: string;
  database: string;
  params: Record<string, string>;
  error: string | null;
}

export interface BuildConnectionStringOptions {
  scheme: string;
  username: string;
  password: string;
  host: string;
  port: string;
  database: string;
}

const ALLOWED_SCHEMES = new Set([
  'postgres',
  'postgresql',
  'mysql',
  'mongodb',
  'redis',
  'rediss',
  'mongo',
  'http',
  'https',
]);

function decodePart(value: string | null): string {
  if (value === null) return '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function parseConnectionString(input: string): ParsedConnectionString {
  const empty = {
    scheme: '',
    username: '',
    password: '',
    host: '',
    port: '',
    database: '',
    params: {},
  };
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { ...empty, error: 'Paste a connection string to parse it.' };
  }

  const schemeMatch = /^([a-z][a-z0-9+.-]*):\/\//i.exec(trimmed);
  if (!schemeMatch) {
    return { ...empty, error: 'This does not look like a valid URL-style connection string.' };
  }

  const scheme = schemeMatch[1].toLowerCase();
  if (!ALLOWED_SCHEMES.has(scheme)) {
    return {
      ...empty,
      error: `Scheme "${scheme}" is not supported. Use postgres, mysql, mongodb, or redis.`,
    };
  }

  const rest = trimmed.slice(schemeMatch[0].length);
  const authorityEnd = rest.search(/[/?]/);
  const authority = authorityEnd === -1 ? rest : rest.slice(0, authorityEnd);
  const tail = authorityEnd === -1 ? '' : rest.slice(authorityEnd);

  const atIndex = authority.lastIndexOf('@');
  let username = '';
  let password = '';
  let hostPort = authority;
  if (atIndex !== -1) {
    const userInfo = authority.slice(0, atIndex);
    hostPort = authority.slice(atIndex + 1);
    const colonIndex = userInfo.indexOf(':');
    if (colonIndex === -1) {
      username = decodePart(userInfo);
    } else {
      username = decodePart(userInfo.slice(0, colonIndex));
      password = decodePart(userInfo.slice(colonIndex + 1));
    }
  }

  const primaryHost = hostPort.split(',')[0] ?? '';
  let host = primaryHost;
  let port = '';
  if (primaryHost.startsWith('[')) {
    const closingBracket = primaryHost.indexOf(']');
    host = primaryHost.slice(1, closingBracket === -1 ? undefined : closingBracket);
    const afterBracket = primaryHost.slice(closingBracket === -1 ? 0 : closingBracket + 1);
    if (afterBracket.startsWith(':')) port = afterBracket.slice(1);
  } else {
    const lastColon = primaryHost.lastIndexOf(':');
    if (lastColon !== -1) {
      host = primaryHost.slice(0, lastColon);
      port = primaryHost.slice(lastColon + 1);
    }
  }

  const queryIndex = tail.indexOf('?');
  const path = queryIndex === -1 ? tail : tail.slice(0, queryIndex);
  const queryString = queryIndex === -1 ? '' : tail.slice(queryIndex + 1);

  const params: Record<string, string> = {};
  try {
    new URLSearchParams(queryString).forEach((value, key) => {
      params[key] = value;
    });
  } catch {
    return { ...empty, error: 'The query parameters in this connection string are not valid.' };
  }

  return {
    scheme,
    username,
    password,
    host: decodePart(host),
    port,
    database: decodePart(path.replace(/^\//, '')),
    params,
    error: null,
  };
}

function encodePart(value: string): string {
  if (/^[a-zA-Z0-9._~-]*$/.test(value)) return value;
  return encodeURIComponent(value);
}

export function buildConnectionString(options: BuildConnectionStringOptions): string {
  let output = `${options.scheme}://`;
  if (options.username) {
    output += encodePart(options.username);
    if (options.password) {
      output += `:${encodePart(options.password)}`;
    }
    output += '@';
  }
  output += options.host || 'localhost';
  if (options.port) {
    output += `:${options.port}`;
  }
  if (options.database) {
    output += `/${encodePart(options.database)}`;
  }
  return output;
}
