import { describe, expect, it } from 'vitest';
import {
  bytesToHex,
  computeTextHashes,
  hmacHex,
  md5Hex,
  md5HexString,
  sha1Hex,
  sha256Hex,
} from '@/lib/tools/hashing';

describe('bytesToHex', () => {
  it('encodes bytes as lowercase hex', () => {
    expect(bytesToHex(new Uint8Array([0, 15, 255]))).toBe('000fff');
  });
});

describe('md5HexString', () => {
  it('matches the RFC 1321 test vector', () => {
    expect(md5HexString('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
    expect(md5HexString('abc')).toBe('900150983cd24fb0d6963f7d28e17f72');
    expect(md5HexString('message digest')).toBe('f96b697d7cb7938d525a2f31aaf161d0');
  });
});

describe('sha256Hex', () => {
  it('matches the NIST test vector', async () => {
    expect(await sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
    expect(await sha256Hex('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    );
  });
});

describe('sha1Hex', () => {
  it('matches the NIST test vector', async () => {
    expect(await sha1Hex('abc')).toBe('a9993e364706816aba3e25717850c26c9cd0d89d');
  });
});

describe('md5Hex', () => {
  it('accepts Uint8Array input', () => {
    expect(md5Hex(new TextEncoder().encode('abc'))).toBe('900150983cd24fb0d6963f7d28e17f72');
  });
});

describe('hmacHex', () => {
  it('computes an HMAC-SHA256', async () => {
    const hex = await hmacHex('SHA-256', 'key', 'abc');
    expect(hex).toMatch(/^[0-9a-f]{64}$/);
  });

  it('computes an HMAC-SHA1', async () => {
    const hex = await hmacHex('SHA-1', 'key', 'abc');
    expect(hex).toMatch(/^[0-9a-f]{40}$/);
  });

  it('matches a known test vector', async () => {
    const hex = await hmacHex('SHA-256', 'key', 'The quick brown fox jumps over the lazy dog');
    expect(hex).toBe('f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8');
  });
});

describe('computeTextHashes', () => {
  it('computes all requested algorithms', async () => {
    const results = await computeTextHashes('abc', ['MD5', 'SHA-1', 'SHA-256', 'SHA-512']);
    expect(results).toHaveLength(4);
    const md5 = results.find((entry) => entry.algorithm === 'MD5');
    expect(md5?.hex).toBe('900150983cd24fb0d6963f7d28e17f72');
  });

  it('hashes empty input to the empty digest', async () => {
    const results = await computeTextHashes('', ['SHA-256']);
    expect(results[0]?.hex).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    );
  });
});
