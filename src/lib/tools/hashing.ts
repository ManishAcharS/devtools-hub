export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

export const HASH_ALGORITHMS: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'];

export interface HashResult {
  algorithm: HashAlgorithm;
  hex: string;
}

const MD5_SHIFTS = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14,
  20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6,
  10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
];

const MD5_K = new Int32Array(64);
for (let i = 0; i < 64; i += 1) {
  MD5_K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000);
}

function md5Add32(a: number, b: number): number {
  return (a + b) | 0;
}

function md5RotateLeft(value: number, bits: number): number {
  return (value << bits) | (value >>> (32 - bits)) | 0;
}

function md5Block(state: Int32Array, block: Uint8Array, offset: number): void {
  const words = new Int32Array(16);
  for (let i = 0; i < 16; i += 1) {
    const index = offset + i * 4;
    words[i] =
      block[index] |
      (block[index + 1] << 8) |
      (block[index + 2] << 16) |
      (block[index + 3] << 24) |
      0;
  }
  let a = state[0];
  let b = state[1];
  let c = state[2];
  let d = state[3];
  for (let i = 0; i < 64; i += 1) {
    let f: number;
    let g: number;
    if (i < 16) {
      f = (b & c) | (~b & d);
      g = i;
    } else if (i < 32) {
      f = (d & b) | (~d & c);
      g = (5 * i + 1) % 16;
    } else if (i < 48) {
      f = b ^ c ^ d;
      g = (3 * i + 5) % 16;
    } else {
      f = c ^ (b | ~d);
      g = (7 * i) % 16;
    }
    const temp = d;
    d = c;
    c = b;
    b = md5Add32(
      b,
      md5RotateLeft(md5Add32(md5Add32(a, f), md5Add32(MD5_K[i], words[g])), MD5_SHIFTS[i])
    );
    a = temp;
  }
  state[0] = md5Add32(state[0], a);
  state[1] = md5Add32(state[1], b);
  state[2] = md5Add32(state[2], c);
  state[3] = md5Add32(state[3], d);
}

export class Md5Hasher {
  private state = new Int32Array([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]);
  private buffer = new Uint8Array(64);
  private bufferLength = 0;
  private totalBytes = 0;

  update(data: Uint8Array): this {
    this.totalBytes += data.length;
    let offset = 0;
    if (this.bufferLength > 0) {
      const needed = 64 - this.bufferLength;
      const take = Math.min(needed, data.length);
      this.buffer.set(data.subarray(0, take), this.bufferLength);
      this.bufferLength += take;
      offset += take;
      if (this.bufferLength === 64) {
        md5Block(this.state, this.buffer, 0);
        this.bufferLength = 0;
      }
    }
    while (offset + 64 <= data.length) {
      md5Block(this.state, data, offset);
      offset += 64;
    }
    if (offset < data.length) {
      this.buffer.set(data.subarray(offset));
      this.bufferLength = data.length - offset;
    }
    return this;
  }

  digest(): Uint8Array {
    const paddedLength = Math.floor((this.bufferLength + 8) / 64) * 64 + 64;
    const padded = new Uint8Array(paddedLength);
    padded.set(this.buffer.subarray(0, this.bufferLength));
    padded[this.bufferLength] = 0x80;
    const bitLength = this.totalBytes * 8;
    const view = new DataView(padded.buffer);
    view.setUint32(paddedLength - 8, bitLength >>> 0, true);
    view.setUint32(paddedLength - 4, Math.floor(bitLength / 0x100000000), true);
    const final = new Int32Array(this.state);
    let offset = 0;
    while (offset < padded.length) {
      md5Block(final, padded, offset);
      offset += 64;
    }
    const result = new Uint8Array(16);
    const resultView = new DataView(result.buffer);
    for (let i = 0; i < 4; i += 1) {
      resultView.setUint32(i * 4, final[i] >>> 0, true);
    }
    return result;
  }

  hexDigest(): string {
    return bytesToHex(this.digest());
  }
}

export function bytesToHex(bytes: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < bytes.length; i += 1) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

export function hexToBytes(hex: string): Uint8Array {
  const cleaned = hex.trim().replace(/\s+/g, '');
  if (!/^(?:[0-9a-fA-F]{2})*$/.test(cleaned)) {
    throw new Error('Hex input must contain pairs of hexadecimal digits.');
  }
  const result = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < result.length; i += 1) {
    result[i] = parseInt(cleaned.slice(i * 2, i * 2 + 2), 16);
  }
  return result;
}

export function textToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

export function md5Hex(data: Uint8Array | string): string {
  const bytes = typeof data === 'string' ? textToBytes(data) : data;
  return new Md5Hasher().update(bytes).hexDigest();
}

export function md5HexString(text: string): string {
  return md5Hex(text);
}

function getSubtle(): SubtleCrypto | null {
  if (typeof crypto === 'undefined' || typeof crypto.subtle === 'undefined') return null;
  return crypto.subtle;
}

export async function webcryptoDigest(
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512',
  data: Uint8Array
): Promise<string> {
  const subtle = getSubtle();
  if (!subtle) {
    throw new Error('WebCrypto is not available in this environment.');
  }
  const bytes = new Uint8Array(data);
  const digest = await subtle.digest(algorithm, bytes);
  return bytesToHex(new Uint8Array(digest));
}

export function isWebCryptoAvailable(): boolean {
  return getSubtle() !== null;
}

export async function sha1Hex(data: Uint8Array | string): Promise<string> {
  return webcryptoDigest('SHA-1', typeof data === 'string' ? textToBytes(data) : data);
}

export async function sha256Hex(data: Uint8Array | string): Promise<string> {
  return webcryptoDigest('SHA-256', typeof data === 'string' ? textToBytes(data) : data);
}

export async function sha512Hex(data: Uint8Array | string): Promise<string> {
  return webcryptoDigest('SHA-512', typeof data === 'string' ? textToBytes(data) : data);
}

export type HmacHash = 'SHA-1' | 'SHA-256' | 'SHA-512';

export interface HmacOptions {
  inputFormat?: 'utf8' | 'hex';
}

export async function hmacHex(
  algorithm: HmacHash,
  secret: string,
  data: string,
  options: HmacOptions = {}
): Promise<string> {
  const subtle = getSubtle();
  if (!subtle) {
    throw new Error('WebCrypto is not available in this environment.');
  }
  const secretBytes = options.inputFormat === 'hex' ? hexToBytes(secret) : textToBytes(secret);
  const dataBytes = options.inputFormat === 'hex' ? hexToBytes(data) : textToBytes(data);
  const key = await subtle.importKey(
    'raw',
    new Uint8Array(secretBytes),
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign']
  );
  const signature = await subtle.sign('HMAC', key, new Uint8Array(dataBytes));
  return bytesToHex(new Uint8Array(signature));
}

export async function computeTextHashes(
  text: string,
  algorithms: HashAlgorithm[]
): Promise<HashResult[]> {
  const results: HashResult[] = [];
  const bytes = textToBytes(text);
  for (const algorithm of algorithms) {
    if (algorithm === 'MD5') {
      results.push({ algorithm, hex: md5Hex(bytes) });
    } else {
      results.push({ algorithm, hex: await webcryptoDigest(algorithm, bytes) });
    }
  }
  return results;
}

export const MAX_HASH_FILE_BYTES = 512 * 1024 * 1024;
const HASH_READ_CHUNK = 8 * 1024 * 1024;

export interface FileHashProgress {
  bytesRead: number;
  totalBytes: number;
  percent: number;
}

export async function hashFile(
  file: File,
  algorithms: HashAlgorithm[],
  onProgress?: (progress: FileHashProgress) => void
): Promise<HashResult[]> {
  if (file.size > MAX_HASH_FILE_BYTES) {
    throw new Error('File is too large. The limit for client-side hashing is 512 MB.');
  }
  if (file.size === 0) {
    throw new Error('The file is empty; nothing to hash.');
  }
  const results: HashResult[] = [];
  const md5Needed = algorithms.includes('MD5');
  const shaNeeded = algorithms.filter(
    (algorithm): algorithm is 'SHA-1' | 'SHA-256' | 'SHA-512' => algorithm !== 'MD5'
  );

  const md5: Md5Hasher | null = md5Needed ? new Md5Hasher() : null;
  const shaBuffers: Uint8Array[] = [];

  let bytesRead = 0;
  while (bytesRead < file.size) {
    const slice = file.slice(bytesRead, Math.min(bytesRead + HASH_READ_CHUNK, file.size));
    const chunk = new Uint8Array(await slice.arrayBuffer());
    md5?.update(chunk);
    if (shaNeeded.length > 0) shaBuffers.push(chunk);
    bytesRead += chunk.length;
    onProgress?.({ bytesRead, totalBytes: file.size, percent: bytesRead / file.size });
  }

  if (md5) {
    results.push({ algorithm: 'MD5', hex: md5.hexDigest() });
  }
  if (shaNeeded.length > 0) {
    const combined = new Uint8Array(bytesRead);
    let offset = 0;
    for (const chunk of shaBuffers) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }
    for (const algorithm of shaNeeded) {
      results.push({ algorithm, hex: await webcryptoDigest(algorithm, combined) });
    }
  }
  return results;
}
