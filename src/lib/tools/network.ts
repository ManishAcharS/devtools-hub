export type IpVersion = 4 | 6;

export interface IpParseResult {
  version: IpVersion | null;
  octets: number[];
  hextets: string[];
  error: string | null;
}

export interface IpClassification {
  scope: string;
  description: string;
}

export interface CidrResult {
  version: IpVersion;
  network: string;
  broadcast: string | null;
  firstHost: string;
  lastHost: string;
  hostCount: string;
  prefix: number;
  maskText: string;
  error: string | null;
}

export interface UserAgentInfo {
  browser: { name: string; version: string };
  engine: { name: string };
  os: { name: string; version: string };
  device: string;
}

export interface DnsRecord {
  name: string;
  type: string;
  ttl: number;
  data: string;
}

export interface DnsLookupResult {
  status: string;
  records: DnsRecord[];
  error: string | null;
}

const IPV4_PATTERN = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

export function parseIpv4(text: string): { octets: number[]; error: string | null } {
  const trimmed = text.trim();
  const match = IPV4_PATTERN.exec(trimmed);
  if (!match) {
    return {
      octets: [],
      error: 'Not a valid IPv4 address. Expected four dot-separated numbers, e.g. 192.168.1.1.',
    };
  }
  const octets = match.slice(1).map(Number);
  for (let i = 0; i < octets.length; i += 1) {
    const octet = octets[i] ?? 0;
    if (octet > 255) {
      return { octets: [], error: `Octet ${i + 1} is ${octet}, which exceeds the maximum of 255.` };
    }
    if ((match[i + 1] ?? '').length > 1 && (match[i + 1] ?? '').startsWith('0')) {
      return {
        octets: [],
        error: `Octet ${i + 1} has a leading zero ("${match[i + 1]}"). Leading zeros are not allowed.`,
      };
    }
  }
  return { octets, error: null };
}

export function parseIpv6(text: string): { hextets: string[]; error: string | null } {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();
  let address = lower;
  const ipv4Match = address.match(/(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (ipv4Match) {
    const tail = ipv4Match[1] ?? '';
    const parsedV4 = parseIpv4(tail);
    if (parsedV4.error) {
      return { hextets: [], error: parsedV4.error };
    }
    const [a, b, c, d] = parsedV4.octets;
    const mapped = `${(((a ?? 0) << 8) | (b ?? 0)).toString(16)}:${(((c ?? 0) << 8) | (d ?? 0)).toString(16)}`;
    address = `${address.slice(0, -tail.length)}${mapped}`;
  }

  if (!/^[0-9a-f:]+$/.test(address)) {
    return { hextets: [], error: 'IPv6 addresses may contain hex digits, colons and dots only.' };
  }

  const doubleColonCount = (address.match(/::/g) ?? []).length;
  if (doubleColonCount > 1) {
    return { hextets: [], error: 'IPv6 shorthand "::" may appear only once.' };
  }

  const parts = address.split(':');
  if (parts.some((part) => part.length > 4)) {
    return { hextets: [], error: 'Each IPv6 group may contain at most 4 hex digits.' };
  }

  let hextets: string[];
  if (address.includes('::')) {
    const [left, right] = address.split('::');
    const leftParts = left ? left.split(':').filter((part) => part.length > 0) : [];
    const rightParts = right ? right.split(':').filter((part) => part.length > 0) : [];
    const missing = 8 - leftParts.length - rightParts.length;
    if (missing < 1) {
      return { hextets: [], error: 'This address has more than 8 groups.' };
    }
    hextets = [...leftParts, ...Array<string>(missing).fill('0'), ...rightParts];
  } else {
    const partsWithoutEmpty = address.split(':');
    if (partsWithoutEmpty.length !== 8 || partsWithoutEmpty.some((part) => part.length === 0)) {
      return {
        hextets: [],
        error: 'IPv6 addresses must have exactly 8 groups (or use "::" shorthand).',
      };
    }
    hextets = partsWithoutEmpty;
  }

  return { hextets: hextets.map((part) => part.padStart(4, '0')), error: null };
}

export function parseIp(text: string): IpParseResult {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return {
      version: null,
      octets: [],
      hextets: [],
      error: 'Input is empty. Enter an IPv4 or IPv6 address.',
    };
  }
  const v4 = parseIpv4(trimmed);
  if (!v4.error) {
    return { version: 4, octets: v4.octets, hextets: [], error: null };
  }
  const v6 = parseIpv6(trimmed);
  if (!v6.error) {
    return { version: 6, octets: [], hextets: v6.hextets, error: null };
  }
  return { version: null, octets: [], hextets: [], error: 'Not a valid IPv4 or IPv6 address.' };
}

export function ipv4ToBinary(octets: number[]): string {
  return octets.map((octet) => octet.toString(2).padStart(8, '0')).join('.');
}

export function ipv4ToNumber(octets: number[]): number {
  return (
    (((octets[0] ?? 0) << 24) |
      ((octets[1] ?? 0) << 16) |
      ((octets[2] ?? 0) << 8) |
      (octets[3] ?? 0)) >>>
    0
  );
}

export function classifyIpv4(octets: number[]): IpClassification {
  const [a, b, c, d] = octets;
  const first = a ?? 0;
  const second = b ?? 0;
  const third = c ?? 0;
  const fourth = d ?? 0;

  if (first === 0)
    return {
      scope: 'Reserved',
      description:
        '"This network" block (0.0.0.0/8) is reserved for source addresses of this network.',
    };
  if (first === 10)
    return {
      scope: 'Private',
      description:
        'Private range 10.0.0.0/8 — used on internal networks, never routed on the internet.',
    };
  if (first === 127)
    return { scope: 'Loopback', description: 'Loopback 127.0.0.0/8 — the host refers to itself.' };
  if (first === 169 && second === 254)
    return {
      scope: 'Link-local',
      description: 'APIPA link-local 169.254.0.0/16 — used when no DHCP server responds.',
    };
  if (first === 172 && second >= 16 && second <= 31)
    return {
      scope: 'Private',
      description: 'Private range 172.16.0.0/12 — common on corporate networks.',
    };
  if (first === 192 && second === 168)
    return {
      scope: 'Private',
      description: 'Private range 192.168.0.0/16 — the most common home LAN range.',
    };
  if (first === 100 && second >= 64 && second <= 127)
    return {
      scope: 'Carrier-grade NAT',
      description: 'CGNAT range 100.64.0.0/10 — used by ISPs to share public addresses.',
    };
  if (first === 192 && second === 0 && third === 0)
    return {
      scope: 'IETF reserved',
      description: '192.0.0.0/24 is reserved for IETF protocol assignments.',
    };
  if ((first === 198 && second === 18) || (first === 198 && second === 19))
    return {
      scope: 'Benchmarking',
      description: '198.18.0.0/15 is reserved for network benchmarking (RFC 2544).',
    };
  if (first >= 224 && first <= 239)
    return { scope: 'Multicast', description: '224.0.0.0/4 is the multicast range.' };
  if (first >= 240)
    return {
      scope: 'Reserved',
      description:
        '240.0.0.0/4 is reserved for future use; 255.255.255.255 is the limited broadcast.',
    };
  if (first === 192 && second === 0 && third === 2)
    return {
      scope: 'Documentation',
      description: '192.0.2.0/24 (TEST-NET-1) is reserved for documentation.',
    };
  if (first === 198 && second === 51 && third === 100)
    return {
      scope: 'Documentation',
      description: '198.51.100.0/24 (TEST-NET-2) is reserved for documentation.',
    };
  if (first === 203 && second === 0 && third === 113)
    return {
      scope: 'Documentation',
      description: '203.0.113.0/24 (TEST-NET-3) is reserved for documentation.',
    };
  return {
    scope: 'Public',
    description: `Globally routable address ${first}.${second}.${third}.${fourth} — reachable on the internet.`,
  };
}

export function classifyIpv6(hextets: string[]): IpClassification {
  const allZero = hextets.every((part) => part === '0000');
  const joined = hextets.join(':');

  if (allZero)
    return {
      scope: 'Unspecified',
      description: 'The all-zero address :: is the unspecified address, used as a placeholder.',
    };
  if (joined === '0000:0000:0000:0000:0000:0000:0000:0001')
    return {
      scope: 'Loopback',
      description: '::1 is the IPv6 loopback address — the host refers to itself.',
    };
  if (hextets[0]?.startsWith('ff'))
    return {
      scope: 'Multicast',
      description: 'Addresses starting ff00::/8 are multicast addresses.',
    };
  if (hextets[0]?.startsWith('fe8'))
    return {
      scope: 'Link-local',
      description: 'fe80::/10 is the link-local range, valid only on the local segment.',
    };
  if (hextets[0]?.startsWith('fc') || hextets[0]?.startsWith('fd'))
    return {
      scope: 'Unique local',
      description: 'fc00::/7 is the unique-local range — the IPv6 equivalent of private addresses.',
    };
  if (joined.startsWith('0000:0000:0000:0000:0000:ffff'))
    return {
      scope: 'IPv4-mapped',
      description: '::ffff:0:0/96 embeds an IPv4 address for translation between the stacks.',
    };
  if (joined.startsWith('2001:0db8'))
    return {
      scope: 'Documentation',
      description: '2001:db8::/32 is reserved for documentation and examples.',
    };
  if (hextets[0] === '2001' && hextets[1] === '0000')
    return { scope: 'Teredo', description: '2001::/32 is the Teredo tunneling range.' };
  return {
    scope: 'Global unicast',
    description: 'Globally routable address — unique across the whole internet.',
  };
}

export function expandIpv6(text: string): { hextets: string[]; error: string | null } {
  const result = parseIpv6(text);
  if (result.error) {
    return { hextets: [], error: result.error };
  }
  return { hextets: result.hextets, error: null };
}

export function ipv6ToFull(hextets: string[]): string {
  return hextets.join(':');
}

export function ipv6ToShort(hextets: string[]): string {
  const compressed = hextets.map((part) => part.replace(/^0+/, '') || '0');
  let bestStart = -1;
  let bestLength = 0;
  let currentStart = -1;
  let currentLength = 0;
  for (let i = 0; i < compressed.length; i += 1) {
    if (compressed[i] === '0') {
      if (currentStart === -1) currentStart = i;
      currentLength += 1;
      if (currentLength > bestLength) {
        bestStart = currentStart;
        bestLength = currentLength;
      }
    } else {
      currentStart = -1;
      currentLength = 0;
    }
  }
  if (bestLength < 2) {
    return compressed.join(':');
  }
  const before = compressed.slice(0, bestStart);
  const after = compressed.slice(bestStart + bestLength);
  return `${before.join(':')}::${after.join(':')}`;
}

export function cidrInfo(input: string): CidrResult {
  const trimmed = input.trim();
  const slashIndex = trimmed.indexOf('/');
  if (slashIndex === -1) {
    return emptyCidr('CIDR notation needs a prefix length, e.g. 192.168.1.0/24.');
  }
  const addressPart = trimmed.slice(0, slashIndex).trim();
  const prefixText = trimmed.slice(slashIndex + 1).trim();
  if (!/^\d+$/.test(prefixText)) {
    return emptyCidr('The prefix length must be a number.');
  }
  const prefix = Number(prefixText);

  const v4 = parseIpv4(addressPart);
  if (!v4.error) {
    if (prefix < 0 || prefix > 32) {
      return emptyCidr('For IPv4 the prefix length must be between 0 and 32.');
    }
    const number = ipv4ToNumber(v4.octets);
    const mask =
      prefix === 0 ? BigInt(0) : (BigInt(0xffffffff) << BigInt(32 - prefix)) & BigInt(0xffffffff);
    const network = BigInt(number) & mask;
    const broadcast = (network | (~mask & BigInt(0xffffffff))) & BigInt(0xffffffff);
    const toIpv4 = (value: bigint): string => {
      const n = Number(value);
      return [24, 16, 8, 0].map((shift) => ((n >>> shift) & 255).toString()).join('.');
    };
    const total = BigInt(2) ** BigInt(32 - prefix);
    let firstHost = toIpv4(network + BigInt(1));
    let lastHost = toIpv4(broadcast - BigInt(1));
    let hostCount = '';
    if (prefix === 32) {
      firstHost = toIpv4(network);
      lastHost = toIpv4(network);
      hostCount = '1 address';
    } else if (prefix === 31) {
      firstHost = toIpv4(network);
      lastHost = toIpv4(broadcast);
      hostCount = '2 addresses';
    } else {
      hostCount = `${(total - BigInt(2)).toString()} usable of ${total.toString()}`;
    }
    return {
      version: 4,
      network: toIpv4(network),
      broadcast: toIpv4(broadcast),
      firstHost,
      lastHost,
      hostCount,
      prefix,
      maskText: toIpv4(mask),
      error: null,
    };
  }

  const v6 = parseIpv6(addressPart);
  if (!v6.error) {
    if (prefix < 0 || prefix > 128) {
      return emptyCidr('For IPv6 the prefix length must be between 0 and 128.');
    }
    const network = applyV6Mask(v6.hextets, prefix);
    const networkText = network.map((part) => part.padStart(4, '0')).join(':');
    const hostCount = prefix === 128 ? '1 address' : `2^${128 - prefix} addresses`;
    return {
      version: 6,
      network: networkText,
      broadcast: null,
      firstHost:
        prefix === 128 ? networkText : network.map((part) => part.padStart(4, '0')).join(':'),
      lastHost: prefix === 128 ? networkText : '—',
      hostCount,
      prefix,
      maskText: `/${prefix}`,
      error: null,
    };
  }

  return emptyCidr('Not a valid IPv4 or IPv6 address.');
}

function emptyCidr(error: string): CidrResult {
  return {
    version: 4,
    network: '',
    broadcast: null,
    firstHost: '',
    lastHost: '',
    hostCount: '',
    prefix: 0,
    maskText: '',
    error,
  };
}

function applyV6Mask(hextets: string[], prefix: number): string[] {
  const bits: string[] = [];
  for (const hextet of hextets) {
    bits.push(...parseInt(hextet, 16).toString(2).padStart(16, '0').split(''));
  }
  for (let i = prefix; i < bits.length; i += 1) {
    bits[i] = '0';
  }
  const result: string[] = [];
  for (let i = 0; i < bits.length; i += 16) {
    result.push(bits.slice(i, i + 16).join(''));
  }
  return result.map((bits16) => parseInt(bits16, 2).toString(16).padStart(4, '0'));
}

export function parseUserAgent(ua: string): UserAgentInfo {
  const value = ua || '';
  const lower = value.toLowerCase();

  let browser = 'Unknown';
  let browserVersion = '';
  let engine = 'Unknown';
  let osName = 'Unknown';
  let osVersion = '';
  let device = 'Desktop';

  const matchVersion = (pattern: RegExp): string => {
    const match = pattern.exec(value);
    return match?.[1] ?? '';
  };

  if (/googlebot/i.test(lower)) {
    browser = 'Googlebot';
    browserVersion = matchVersion(/(?:googlebot\/|bingbot\/)([\d.]+)/i) || 'crawler';
    device = 'Bot';
  } else if (/bingbot|slurp/i.test(lower)) {
    browser = 'Bingbot';
    browserVersion = matchVersion(/bingbot\/([\d.]+)/i) || 'crawler';
    device = 'Bot';
  } else if (/duckduckbot|twitterbot|discordbot|slackbot/i.test(lower)) {
    browser = /duckduckbot/i.test(lower)
      ? 'DuckDuckBot'
      : /twitterbot/i.test(lower)
        ? 'Twitterbot'
        : /discordbot/i.test(lower)
          ? 'Discordbot'
          : 'Slackbot';
    device = 'Bot';
  } else if (/curl|wget|python-requests|node\.js|axios/i.test(lower)) {
    browser = /curl/i.test(lower)
      ? 'curl'
      : /wget/i.test(lower)
        ? 'wget'
        : /python-requests/i.test(lower)
          ? 'Python Requests'
          : /axios/i.test(lower)
            ? 'Axios'
            : 'Node.js';
    browserVersion = matchVersion(/(?:curl\/|wget\/)([\d.]+)/i);
    device = 'Bot';
  } else if (/edg\//i.test(lower)) {
    browser = 'Edge';
    browserVersion = matchVersion(/edg\/([\d.]+)/i);
    engine = 'Chromium';
  } else if (/opr\//i.test(lower) || /opera/i.test(lower)) {
    browser = 'Opera';
    browserVersion = matchVersion(/(?:opr\/|opera(?:\/|\s)(?:version\/)?)([\d.]+)/i);
    engine = 'Chromium';
  } else if (/samsungbrowser\//i.test(lower)) {
    browser = 'Samsung Internet';
    browserVersion = matchVersion(/samsungbrowser\/([\d.]+)/i);
    engine = 'Chromium';
  } else if (/chrome\//i.test(lower)) {
    browser = 'Chrome';
    browserVersion = matchVersion(/chrome\/([\d.]+)/i);
    engine = 'Chromium';
  } else if (/firefox\//i.test(lower) && !/seamonkey/i.test(lower)) {
    browser = 'Firefox';
    browserVersion = matchVersion(/firefox\/([\d.]+)/i);
    engine = 'Gecko';
  } else if (/version\/[\d.]+.*safari/i.test(lower) && !/chromium|edg\//i.test(lower)) {
    browser = 'Safari';
    browserVersion = matchVersion(/version\/([\d.]+)/i);
    engine = 'WebKit';
  }

  if (browser === 'Unknown') {
    const anyBrowser = /([a-z]+)\/([\d.]+)/i.exec(value);
    if (anyBrowser) {
      browser = anyBrowser[1] ?? 'Unknown';
      browserVersion = anyBrowser[2] ?? '';
      engine = 'Unknown';
    }
  }

  if (/windows nt/i.test(lower)) {
    osName = 'Windows';
    const nt = matchVersion(/windows nt ([\d.]+)/i);
    osVersion =
      { '10.0': '10 / 11', '6.3': '8.1', '6.2': '8', '6.1': '7', '6.0': 'Vista', '5.1': 'XP' }[
        nt
      ] ?? nt;
  } else if (/iphone|ipad|ipod/i.test(lower)) {
    osName = 'iOS';
    osVersion = matchVersion(/os ([\d_]+)/i).replace(/_/g, '.');
    device = /ipad/i.test(lower) ? 'Tablet' : 'Mobile';
  } else if (/android/i.test(lower)) {
    osName = 'Android';
    osVersion = matchVersion(/android ([\d.]+)/i);
    device = /tablet|sm-t|gt-p/i.test(lower) ? 'Tablet' : 'Mobile';
  } else if (/cros/i.test(lower)) {
    osName = 'Chrome OS';
  } else if (/mac os x/i.test(lower)) {
    osName = 'macOS';
    osVersion = matchVersion(/mac os x ([\d_]+)/i).replace(/_/g, '.');
  } else if (/linux/i.test(lower)) {
    osName = 'Linux';
  } else if (/playstation/i.test(lower)) {
    osName = 'PlayStation';
    device = 'Console';
  } else if (/xbox/i.test(lower)) {
    osName = 'Xbox';
    device = 'Console';
  }

  if (device === 'Desktop' && /mobile|iphone|android/i.test(lower)) {
    device = 'Mobile';
  }

  return {
    browser: { name: browser, version: browserVersion || '—' },
    engine: { name: engine },
    os: { name: osName, version: osVersion || '—' },
    device,
  };
}

export async function lookupDns(hostname: string, type: string): Promise<DnsLookupResult> {
  const trimmed = hostname
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/\.$/, '');
  if (trimmed.length === 0) {
    return { status: 'error', records: [], error: 'Enter a hostname to look up.' };
  }
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*$/i.test(trimmed)) {
    return { status: 'error', records: [], error: 'That is not a valid hostname.' };
  }
  if (typeof fetch === 'undefined') {
    return {
      status: 'error',
      records: [],
      error: 'DNS lookup is not supported in this environment.',
    };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(trimmed)}&type=${encodeURIComponent(type)}`,
      { headers: { accept: 'application/dns-json' }, signal: controller.signal }
    );
    if (!response.ok) {
      return {
        status: 'error',
        records: [],
        error: `The DNS resolver responded with HTTP ${response.status}.`,
      };
    }
    const data = (await response.json()) as {
      Status?: number;
      Answer?: { name: string; type: number; TTL: number; data: string }[];
      Authority?: { name: string; type: number; TTL: number; data: string }[];
      Comment?: string;
    };
    if (data.Status === 3) {
      return {
        status: 'nxdomain',
        records: [],
        error: `No such domain: "${trimmed}" does not exist.`,
      };
    }
    if (data.Status !== undefined && data.Status !== 0) {
      return {
        status: 'error',
        records: [],
        error: `The resolver returned status code ${data.Status} for "${trimmed}".`,
      };
    }
    const records: DnsRecord[] = (data.Answer ?? []).map((answer) => ({
      name: answer.name,
      type: dnsTypeName(answer.type),
      ttl: answer.TTL,
      data: answer.data,
    }));
    if (records.length === 0) {
      return {
        status: 'no-records',
        records: [],
        error: `No ${type} records were found for "${trimmed}".`,
      };
    }
    return { status: 'ok', records, error: null };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        status: 'error',
        records: [],
        error: 'The DNS lookup timed out after 8 seconds. Check your connection and try again.',
      };
    }
    return {
      status: 'error',
      records: [],
      error: 'The DNS lookup failed. You may be offline or a firewall may be blocking the request.',
    };
  } finally {
    clearTimeout(timer);
  }
}

function dnsTypeName(type: number): string {
  const names: Record<number, string> = {
    1: 'A',
    2: 'NS',
    5: 'CNAME',
    6: 'SOA',
    12: 'PTR',
    15: 'MX',
    16: 'TXT',
    17: 'RP',
    28: 'AAAA',
    33: 'SRV',
    43: 'DS',
    46: 'RRSIG',
    47: 'NSEC',
    48: 'DNSKEY',
    65: 'HTTPS',
    257: 'CAA',
  };
  return names[type] ?? `TYPE${type}`;
}
