import { describe, expect, it } from 'vitest';
import {
  buildUrl,
  parseQueryString,
  parseUrlComponents,
  serializeQueryString,
} from '@/lib/tools/urls';

function partValue(parts: { label: string; value: string }[], label: string): string | undefined {
  return parts.find((part) => part.label === label)?.value;
}

describe('parseQueryString', () => {
  it('splits key-value pairs', () => {
    const result = parseQueryString('a=1&b=two');
    expect(result.entries).toEqual([
      { key: 'a', value: '1' },
      { key: 'b', value: 'two' },
    ]);
  });

  it('decodes percent-encoding', () => {
    const result = parseQueryString('q=hello%20world');
    expect(result.entries[0]?.value).toBe('hello world');
  });

  it('handles empty input', () => {
    expect(parseQueryString('').entries).toEqual([]);
  });
});

describe('serializeQueryString', () => {
  it('round-trips entries', () => {
    const serialized = serializeQueryString([
      { key: 'a', value: '1' },
      { key: 'q', value: 'hello world' },
    ]);
    expect(serialized).toBe('a=1&q=hello%20world');
  });
});

describe('parseUrlComponents', () => {
  it('splits a full URL', () => {
    const url = parseUrlComponents('https://user:pass@example.com:8443/path?a=1#frag');
    expect(url.error).toBeNull();
    expect(partValue(url.parts, 'Protocol')).toBe('https:');
    expect(partValue(url.parts, 'Hostname')).toBe('example.com');
    expect(partValue(url.parts, 'Port')).toBe('8443');
    expect(partValue(url.parts, 'Path')).toBe('/path');
    expect(partValue(url.parts, 'Fragment')).toBe('#frag');
    expect(url.query).toEqual([{ key: 'a', value: '1' }]);
  });

  it('assumes https:// when the protocol is missing', () => {
    const url = parseUrlComponents('example.com/path');
    expect(url.error).toBeNull();
    expect(url.warning).toMatch(/https:\/\//);
    expect(partValue(url.parts, 'Hostname')).toBe('example.com');
  });

  it('returns error for invalid URLs', () => {
    const url = parseUrlComponents('not a url');
    expect(url.error).toBeTruthy();
  });
});

describe('buildUrl', () => {
  it('builds a URL from parts', () => {
    const result = buildUrl({
      protocol: 'https',
      host: 'example.com',
      pathname: '/api',
      port: '',
      hash: '',
      query: [{ key: 'q', value: '1' }],
    });
    expect(result.error).toBeNull();
    expect(result.url).toBe('https://example.com/api?q=1');
  });

  it('requires a host', () => {
    const result = buildUrl({
      protocol: 'https',
      host: '',
      pathname: '/api',
      query: [],
      port: '',
      hash: '',
    });
    expect(result.error).toBeTruthy();
  });
});
