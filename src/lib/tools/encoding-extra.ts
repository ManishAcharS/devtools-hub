const HTML_ENCODE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '\x22': '&quot;',
  "'": '&#39;',
};

const HTML_DECODE_MAP: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '\x22',
  apos: "'",
  nbsp: '\u00a0',
  copy: '\u00a9',
  reg: '\u00ae',
  trade: '\u2122',
  hellip: '\u2026',
  mdash: '\u2014',
  ndash: '\u2013',
  lsquo: '\u2018',
  rsquo: '\u2019',
  ldquo: '\u201c',
  rdquo: '\u201d',
  cent: '\u00a2',
  pound: '\u00a3',
  yen: '\u00a5',
  euro: '\u20ac',
  sect: '\u00a7',
  para: '\u00b6',
  laquo: '\u00ab',
  raquo: '\u00bb',
};

const NAMED_ENTITY_PATTERN = /&([a-zA-Z][a-zA-Z0-9]*);?/g;
const NUMERIC_ENTITY_PATTERN = /&#(x[0-9a-fA-F]+|[0-9]+);?/g;

export function encodeHtmlEntities(input: string): string {
  return input.replace(/[&<>']|\x22/g, (character) => HTML_ENCODE_MAP[character] ?? character);
}

export function decodeHtmlEntities(input: string): string {
  const numericDecoded = input.replace(NUMERIC_ENTITY_PATTERN, (_match, code: string) => {
    const value = code.startsWith('x') ? parseInt(code.slice(1), 16) : parseInt(code, 10);
    if (Number.isNaN(value) || value < 0 || value > 0x10ffff) return _match;
    try {
      return String.fromCodePoint(value);
    } catch {
      return _match;
    }
  });
  return numericDecoded.replace(NAMED_ENTITY_PATTERN, (_match, name: string) => {
    const decoded = HTML_DECODE_MAP[name.toLowerCase()];
    return decoded !== undefined ? decoded : _match;
  });
}

const PUNYCODE_BASE = 36;
const PUNYCODE_TMIN = 1;
const PUNYCODE_TMAX = 26;
const PUNYCODE_SKEW = 38;
const PUNYCODE_DAMP = 700;
const PUNYCODE_INITIAL_BIAS = 72;
const PUNYCODE_INITIAL_N = 128;
const PUNYCODE_DELIMITER = '-';

function punycodeAdapt(delta: number, numpoints: number, firsttime: boolean): number {
  let d = firsttime ? Math.floor(delta / PUNYCODE_DAMP) : delta >> 1;
  d += Math.floor(d / numpoints);
  let k = 0;
  while (d > Math.floor(((PUNYCODE_BASE - PUNYCODE_TMIN) * PUNYCODE_TMAX) / 2)) {
    d = Math.floor(d / (PUNYCODE_BASE - PUNYCODE_TMIN));
    k += PUNYCODE_BASE;
  }
  return k + Math.floor(((PUNYCODE_BASE - PUNYCODE_TMIN + 1) * d) / (d + PUNYCODE_SKEW));
}

function punycodeEncodeDigit(digit: number): string {
  return String.fromCharCode(digit < 26 ? 97 + digit : 22 + digit);
}

function punycodeDecodeDigit(codePoint: number): number {
  if (codePoint >= 48 && codePoint < 58) return codePoint - 22;
  if (codePoint >= 65 && codePoint < 91) return codePoint - 65;
  if (codePoint >= 97 && codePoint < 123) return codePoint - 97;
  return PUNYCODE_BASE;
}

function punycodeEncodeLabel(label: string): string {
  const codeUnits = Array.from(label, (character) => character.charCodeAt(0));
  const basic = codeUnits.filter((codeUnit) => codeUnit < 0x80);
  let output = String.fromCharCode(...basic);
  if (basic.length > 0) output += PUNYCODE_DELIMITER;
  let n = PUNYCODE_INITIAL_N;
  let delta = 0;
  let bias = PUNYCODE_INITIAL_BIAS;
  let handled = basic.length;
  while (handled < codeUnits.length) {
    let m = 0x7fffffff;
    for (const codeUnit of codeUnits) {
      if (codeUnit >= n && codeUnit < m) m = codeUnit;
    }
    if (m - n > Math.floor((0x7fffffff - delta) / (handled + 1))) {
      throw new Error('Punycode overflow while encoding.');
    }
    delta += (m - n) * (handled + 1);
    n = m;
    for (const codeUnit of codeUnits) {
      if (codeUnit < n) {
        delta += 1;
        if (delta > 0x7fffffff) throw new Error('Punycode overflow while encoding.');
      }
      if (codeUnit === n) {
        let q = delta;
        for (let k = PUNYCODE_BASE; ; k += PUNYCODE_BASE) {
          const t =
            k <= bias ? PUNYCODE_TMIN : k >= bias + PUNYCODE_TMAX ? PUNYCODE_TMAX : k - bias;
          if (q < t) break;
          output += punycodeEncodeDigit(t + ((q - t) % (PUNYCODE_BASE - t)));
          q = Math.floor((q - t) / (PUNYCODE_BASE - t));
        }
        output += punycodeEncodeDigit(q);
        bias = punycodeAdapt(delta, handled + 1, handled === basic.length);
        delta = 0;
        handled += 1;
      }
    }
    delta += 1;
    n += 1;
  }
  return output;
}

function punycodeDecodeLabel(label: string): string {
  let input = label;
  const delimiterIndex = input.lastIndexOf(PUNYCODE_DELIMITER);
  let basic = '';
  if (delimiterIndex >= 0) {
    basic = input.slice(0, delimiterIndex);
    input = input.slice(delimiterIndex + 1);
  }
  const output: number[] = Array.from(basic, (character) => character.charCodeAt(0));
  if (output.some((codeUnit) => codeUnit >= 0x80)) {
    throw new Error('Invalid punycode: basic segment contains non-ASCII characters.');
  }
  let n = PUNYCODE_INITIAL_N;
  let i = 0;
  let bias = PUNYCODE_INITIAL_BIAS;
  while (input.length > 0) {
    const oldi = i;
    let w = 1;
    for (let k = PUNYCODE_BASE; ; k += PUNYCODE_BASE) {
      if (input.length === 0) throw new Error('Invalid punycode: truncated input.');
      const digit = punycodeDecodeDigit(input.charCodeAt(0));
      input = input.slice(1);
      if (digit >= PUNYCODE_BASE) throw new Error('Invalid punycode: bad digit.');
      if (digit > Math.floor((0x7fffffff - i) / w)) {
        throw new Error('Punycode overflow while decoding.');
      }
      i += digit * w;
      const t = k <= bias ? PUNYCODE_TMIN : k >= bias + PUNYCODE_TMAX ? PUNYCODE_TMAX : k - bias;
      if (digit < t) break;
      if (w > Math.floor(0x7fffffff / (PUNYCODE_BASE - t))) {
        throw new Error('Punycode overflow while decoding.');
      }
      w *= PUNYCODE_BASE - t;
    }
    const outLength = output.length + 1;
    bias = punycodeAdapt(i - oldi, outLength, oldi === 0);
    if (Math.floor(i / outLength) > 0x7fffffff - n) {
      throw new Error('Punycode overflow while decoding.');
    }
    n += Math.floor(i / outLength);
    i %= outLength;
    output.splice(i, 0, n);
    i += 1;
  }
  return String.fromCharCode(...output);
}

export function toPunycode(input: string): string {
  if (input.length === 0) throw new Error('Input is empty.');
  const labels = input.split('.');
  const encoded = labels.map((label) => {
    if (label.length === 0) throw new Error('Empty label in input.');
    if (/[\u0080-\uffff]/.test(label)) return 'xn--' + punycodeEncodeLabel(label);
    return label;
  });
  return encoded.join('.');
}

export function fromPunycode(input: string): string {
  if (input.length === 0) throw new Error('Input is empty.');
  const labels = input.split('.');
  const decoded = labels.map((label) => {
    if (label.length === 0) throw new Error('Empty label in input.');
    if (/^xn--/i.test(label)) return punycodeDecodeLabel(label.slice(4));
    return label;
  });
  return decoded.join('.');
}

const BASE32_ALPHABET: Record<string, string> = {
  base32: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
  base32hex: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
};

export type Base32Alphabet = 'base32' | 'base32hex';

export interface Base32Options {
  alphabet?: Base32Alphabet;
  padding?: boolean;
}

function toUtf8Bytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

function fromUtf8Bytes(bytes: Uint8Array): string {
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export function base32Encode(input: string | Uint8Array, options: Base32Options = {}): string {
  const alphabet = options.alphabet ?? 'base32';
  const padding = options.padding ?? true;
  const bytes = typeof input === 'string' ? toUtf8Bytes(input) : input;
  const symbols = BASE32_ALPHABET[alphabet] ?? BASE32_ALPHABET.base32;
  let bits = 0;
  let value = 0;
  let output = '';
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += symbols[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += symbols[(value << (5 - bits)) & 31];
  }
  if (padding) {
    while (output.length % 8 !== 0) output += '=';
  }
  return output;
}

export function base32Decode(input: string, options: Base32Options = {}): string {
  const alphabet = options.alphabet ?? 'base32';
  const symbols = BASE32_ALPHABET[alphabet] ?? BASE32_ALPHABET.base32;
  const cleaned = input.replace(/=+$/g, '').trim().toUpperCase();
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;
  for (const character of cleaned) {
    const digit = symbols.indexOf(character);
    if (digit === -1) {
      throw new Error(`Invalid base32 character: ${character}`);
    }
    value = (value << 5) | digit;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return fromUtf8Bytes(Uint8Array.from(bytes));
}
