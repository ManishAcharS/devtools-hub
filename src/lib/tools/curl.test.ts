import { describe, expect, it } from 'vitest';
import { buildCurl, curlToFetch } from '@/lib/tools/curl';

describe('buildCurl', () => {
  it('builds a simple GET without -X', () => {
    expect(buildCurl({ method: 'GET', url: 'https://api.example.com/users' })).toBe(
      "curl 'https://api.example.com/users'\n"
    );
  });

  it('adds -X for non-GET methods', () => {
    expect(buildCurl({ method: 'post', url: 'https://api.example.com/users' })).toContain(
      '-X POST'
    );
  });

  it('adds headers with quoting', () => {
    const output = buildCurl({
      method: 'POST',
      url: 'https://api.example.com/users',
      headers: [{ name: 'Content-Type', value: 'application/json' }],
    });
    expect(output).toContain("-H 'Content-Type: application/json'");
  });

  it('adds bearer auth header', () => {
    const output = buildCurl({
      method: 'GET',
      url: 'https://api.example.com/me',
      auth: { type: 'bearer', token: 'abc123' },
    });
    expect(output).toContain("-H 'Authorization: Bearer abc123'");
  });

  it('adds basic auth with -u', () => {
    const output = buildCurl({
      method: 'GET',
      url: 'https://api.example.com/me',
      auth: { type: 'basic', username: 'ada', password: 'pw' },
    });
    expect(output).toContain("-u 'ada:pw'");
  });

  it('adds the JSON body', () => {
    const output = buildCurl({
      method: 'POST',
      url: 'https://api.example.com/users',
      body: '{"name": "Ada"}',
    });
    expect(output).toContain('-d \'{"name": "Ada"}\'');
  });

  it('escapes single quotes inside values', () => {
    const output = buildCurl({
      method: 'GET',
      url: "https://api.example.com/it's-a-test",
    });
    expect(output).toContain("'https://api.example.com/it'\\''s-a-test'");
  });

  it('skips empty headers and returns empty for missing URL', () => {
    const output = buildCurl({
      method: 'GET',
      url: 'https://api.example.com',
      headers: [
        { name: '', value: '' },
        { name: 'X-A', value: '1' },
      ],
    });
    expect(output).toContain("-H 'X-A: 1'");
    expect(output).not.toContain("''");
    expect(buildCurl({ method: 'GET', url: '  ' })).toBe('');
  });
});

describe('curlToFetch', () => {
  it('parses a simple GET', () => {
    expect(curlToFetch("curl 'https://api.example.com/users'")).toBe(
      'fetch("https://api.example.com/users");\n'
    );
  });

  it('parses multi-line commands with headers and body', () => {
    const curl = buildCurl({
      method: 'POST',
      url: 'https://api.example.com/users',
      headers: [{ name: 'Content-Type', value: 'application/json' }],
      body: '{"name": "Ada"}',
    });
    const fetch = curlToFetch(curl);
    expect(fetch).toContain('method: "POST"');
    expect(fetch).toContain('"content-type": "application/json"');
    expect(fetch).toContain('body: JSON.stringify({"name":"Ada"})');
  });

  it('parses bearer auth into an Authorization header', () => {
    const curl = buildCurl({
      method: 'GET',
      url: 'https://api.example.com/me',
      auth: { type: 'bearer', token: 'tok' },
    });
    const fetch = curlToFetch(curl);
    expect(fetch).toContain('"authorization": "Bearer tok"');
  });

  it('parses basic auth into a base64 header', () => {
    const curl = buildCurl({
      method: 'GET',
      url: 'https://api.example.com/me',
      auth: { type: 'basic', username: 'ada', password: 'pw' },
    });
    const fetch = curlToFetch(curl);
    expect(fetch).toContain('"authorization": "Basic YWRhOnB3"');
  });

  it('returns an empty string for an empty command', () => {
    expect(curlToFetch('')).toBe('');
  });
});
