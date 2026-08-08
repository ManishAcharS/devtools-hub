export interface UrlPart {
  label: string;
  value: string;
  copyValue: string;
}

export interface QueryEntry {
  key: string;
  value: string;
}

export interface QueryParseResult {
  entries: QueryEntry[];
  decodeErrors: number;
  error: string | null;
}

export interface ParsedUrl {
  parts: UrlPart[];
  query: QueryEntry[];
  warning: string | null;
  error: string | null;
}

export interface UrlBuilderInput {
  protocol: string;
  host: string;
  port: string;
  pathname: string;
  query: QueryEntry[];
  hash: string;
}

export interface UrlBuildResult {
  url: string;
  error: string | null;
}

function decodePart(raw: string): { value: string; failed: boolean } {
  try {
    return { value: decodeURIComponent(raw.replace(/\+/g, ' ')), failed: false };
  } catch {
    return { value: raw, failed: true };
  }
}

export function parseQueryString(input: string): QueryParseResult {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { entries: [], decodeErrors: 0, error: null };
  }
  const rawEntries = trimmed.split('&');
  const entries: QueryEntry[] = [];
  let decodeErrors = 0;
  for (const raw of rawEntries) {
    if (raw.length === 0) continue;
    const separatorIndex = raw.indexOf('=');
    const rawKey = separatorIndex === -1 ? raw : raw.slice(0, separatorIndex);
    const rawValue = separatorIndex === -1 ? '' : raw.slice(separatorIndex + 1);
    const key = decodePart(rawKey);
    const value = decodePart(rawValue);
    if (key.failed || value.failed) decodeErrors += 1;
    entries.push({ key: key.value, value: value.value });
  }
  return {
    entries,
    decodeErrors,
    error:
      decodeErrors > 0 ? 'Some values contain invalid percent-encoding and were left as-is.' : null,
  };
}

export function serializeQueryString(entries: QueryEntry[]): string {
  return entries
    .filter((entry) => entry.key.trim().length > 0)
    .map((entry) => `${encodeURIComponent(entry.key.trim())}=${encodeURIComponent(entry.value)}`)
    .join('&');
}

export function parseUrlComponents(input: string): ParsedUrl {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return {
      parts: [],
      query: [],
      warning: null,
      error: 'Input is empty. Paste an absolute URL such as https://example.com/path?q=1#top.',
    };
  }

  let url: URL;
  let warning: string | null = null;
  try {
    url = new URL(trimmed);
  } catch {
    try {
      url = new URL(`https://${trimmed}`);
      warning = 'A protocol was missing, so https:// was assumed.';
    } catch {
      return {
        parts: [],
        query: [],
        warning: null,
        error:
          'Could not parse this as a URL. An absolute URL needs a protocol, for example https://example.com.',
      };
    }
  }

  const parts: UrlPart[] = [
    { label: 'Protocol', value: url.protocol, copyValue: url.protocol },
    { label: 'Username', value: url.username, copyValue: url.username },
    { label: 'Password', value: url.password ? '••••••••' : '', copyValue: url.password },
    { label: 'Host', value: url.host, copyValue: url.host },
    { label: 'Hostname', value: url.hostname, copyValue: url.hostname },
    { label: 'Port', value: url.port || '(default)', copyValue: url.port },
    { label: 'Path', value: url.pathname, copyValue: url.pathname },
    { label: 'Query string', value: url.search, copyValue: url.search },
    { label: 'Fragment', value: url.hash, copyValue: url.hash },
    { label: 'Origin', value: url.origin, copyValue: url.origin },
  ];

  const query = parseQueryString(url.search.replace(/^\?/, '')).entries;

  return { parts, query, warning, error: null };
}

export function buildUrl(input: UrlBuilderInput): UrlBuildResult {
  const protocol = input.protocol.trim().replace(/:$/, '').toLowerCase();
  const host = input.host.trim().toLowerCase();
  const port = input.port.trim();
  const pathname = input.pathname.trim();
  const hash = input.hash.trim();

  if (!protocol) {
    return { url: '', error: 'Protocol is required.' };
  }
  if (!/^[a-z][a-z0-9+.-]*$/.test(protocol)) {
    return { url: '', error: 'Protocol may contain letters, digits, +, - and . only.' };
  }
  if (!host) {
    return { url: '', error: 'Host is required.' };
  }
  if (
    !/^[a-z0-9-]+(\.[a-z0-9-]+)*$/.test(host) &&
    !/^\d{1,3}(\.\d{1,3}){3}$/.test(host) &&
    !/^\[[0-9a-f:.]+\]$/i.test(host)
  ) {
    return {
      url: '',
      error: 'Host must be a domain name, IPv4 address, or bracketed IPv6 address.',
    };
  }
  if (port.length > 0 && !/^\d{1,5}$/.test(port)) {
    return { url: '', error: 'Port must be a number between 1 and 65535.' };
  }
  if (port.length > 0 && (Number(port) < 1 || Number(port) > 65535)) {
    return { url: '', error: 'Port must be between 1 and 65535.' };
  }
  if (pathname.length > 0 && !pathname.startsWith('/')) {
    return { url: '', error: 'Path must start with a /.' };
  }
  if (pathname.includes('#') || pathname.includes('?')) {
    return {
      url: '',
      error: 'Path may not contain # or ?. Use the dedicated query and fragment fields.',
    };
  }
  if (hash.includes('#')) {
    return { url: '', error: 'Fragment must be entered without the leading #.' };
  }

  const queryString = serializeQueryString(input.query);
  const portPart = port ? `:${port}` : '';
  const queryPart = queryString ? `?${queryString}` : '';
  const hashPart = hash ? `#${hash}` : '';

  return { url: `${protocol}://${host}${portPart}${pathname}${queryPart}${hashPart}`, error: null };
}

export function isValidHostname(host: string): boolean {
  return (
    /^[a-z0-9-]+(\.[a-z0-9-]+)*$/i.test(host) &&
    host.length <= 253 &&
    !host.startsWith('-') &&
    !host.endsWith('-')
  );
}
