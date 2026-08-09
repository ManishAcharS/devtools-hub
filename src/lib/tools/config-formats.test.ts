import { describe, expect, it } from 'vitest';
import { iniToJson, jsonToIni, jsonToToml, tomlToJson } from '@/lib/tools/config-formats';

describe('tomlToJson', () => {
  it('parses scalars, booleans, and comments', () => {
    const result = JSON.parse(
      tomlToJson(`
# a comment
title = "Devtools Hub"
port = 8080
ratio = 1.5
enabled = true
`)
    ) as Record<string, unknown>;
    expect(result.title).toBe('Devtools Hub');
    expect(result.port).toBe(8080);
    expect(result.ratio).toBe(1.5);
    expect(result.enabled).toBe(true);
  });

  it('parses sections and nested tables', () => {
    const result = JSON.parse(
      tomlToJson(`
[server]
host = "localhost"

[server.database]
name = "app"
pool = 10
`)
    ) as { server: { host: string; database: { name: string; pool: number } } };
    expect(result.server.host).toBe('localhost');
    expect(result.server.database.name).toBe('app');
    expect(result.server.database.pool).toBe(10);
  });

  it('parses arrays and arrays of tables', () => {
    const result = JSON.parse(
      tomlToJson(`
ports = [8000, 8001, 8002]
names = ["a", "b"]

[[products]]
name = "Hammer"
sku = 738594937

[[products]]
name = "Nail"
sku = 284758393
`)
    ) as { ports: number[]; names: string[]; products: { name: string; sku: number }[] };
    expect(result.ports).toEqual([8000, 8001, 8002]);
    expect(result.names).toEqual(['a', 'b']);
    expect(result.products).toHaveLength(2);
    expect(result.products[1].name).toBe('Nail');
  });

  it('parses inline tables and dotted keys', () => {
    const result = JSON.parse(
      tomlToJson(`
point = { x = 1, y = 2 }
a.b.c = 42
"quoted.key" = "value"
`)
    ) as Record<string, unknown>;
    expect(result.point).toEqual({ x: 1, y: 2 });
    expect((result.a as { b: { c: number } }).b.c).toBe(42);
    expect(result['quoted.key']).toBe('value');
  });

  it('parses literal and multi-line strings', () => {
    const result = JSON.parse(
      tomlToJson(`
path = 'C:\\Users\\x'
desc = """line one
line two"""
`)
    ) as Record<string, unknown>;
    expect(result.path).toBe('C:\\Users\\x');
    expect(result.desc).toBe('line one\nline two');
  });

  it('throws on invalid input', () => {
    expect(() => tomlToJson('')).toThrow();
    expect(() => tomlToJson('this is not toml')).toThrow();
  });
});

describe('jsonToToml', () => {
  it('serializes scalars, tables, and arrays', () => {
    const output = jsonToToml(
      JSON.stringify({
        title: 'Devtools Hub',
        port: 8080,
        enabled: true,
        tags: ['a', 'b'],
        server: { host: 'localhost', database: { name: 'app' } },
        products: [{ name: 'Hammer' }, { name: 'Nail' }],
      })
    );
    expect(output).toContain('title = "Devtools Hub"');
    expect(output).toContain('port = 8080');
    expect(output).toContain('enabled = true');
    expect(output).toContain('tags = ["a", "b"]');
    expect(output).toContain('[server]');
    expect(output).toContain('[server.database]');
    expect(output).toContain('name = "app"');
    expect(output).toContain('[[products]]');
  });

  it('round-trips through tomlToJson', () => {
    const source = {
      title: 'Hub',
      port: 3000,
      server: { host: 'localhost' },
      products: [{ name: 'Hammer', sku: 1 }],
    };
    const json = JSON.stringify(source);
    const back = JSON.parse(tomlToJson(jsonToToml(json))) as Record<string, unknown>;
    expect(back.title).toBe('Hub');
    expect(back.port).toBe(3000);
    expect((back.server as { host: string }).host).toBe('localhost');
    expect((back.products as { name: string }[])[0].name).toBe('Hammer');
  });

  it('skips null values and rejects non-object roots', () => {
    expect(jsonToToml('{"a": null, "b": 1}')).toBe('b = 1\n');
    expect(() => jsonToToml('[1, 2]')).toThrow();
    expect(() => jsonToToml('')).toThrow();
  });
});

describe('iniToJson', () => {
  it('parses sections and comments', () => {
    const result = JSON.parse(
      iniToJson(`
; top comment
# another comment
app_name = MyApp

[server]
host = localhost
port = 8080
debug = true
ratio = 0.5
`)
    ) as Record<string, unknown>;
    expect(result.app_name).toBe('MyApp');
    expect((result.server as Record<string, unknown>).host).toBe('localhost');
    expect((result.server as Record<string, unknown>).port).toBe(8080);
    expect((result.server as Record<string, unknown>).debug).toBe(true);
    expect((result.server as Record<string, unknown>).ratio).toBe(0.5);
  });

  it('nests dotted keys and strips quotes', () => {
    const result = JSON.parse(
      iniToJson(`
[a]
b.c = 1
name = "Ada"
`)
    ) as { a: { b: { c: number }; name: string } };
    expect(result.a.b.c).toBe(1);
    expect(result.a.name).toBe('Ada');
  });

  it('supports colon separators', () => {
    const result = JSON.parse(iniToJson('key: value')) as Record<string, unknown>;
    expect(result.key).toBe('value');
  });

  it('throws on malformed input', () => {
    expect(() => iniToJson('no separator here')).toThrow();
    expect(() => iniToJson('')).toThrow();
  });
});

describe('jsonToIni', () => {
  it('flattens objects into sections', () => {
    const output = jsonToIni(
      JSON.stringify({
        title: 'Hub',
        server: { host: 'localhost', port: 8080, nested: { flag: true } },
      })
    );
    expect(output).toContain('title = Hub');
    expect(output).toContain('[server]');
    expect(output).toContain('host = localhost');
    expect(output).toContain('port = 8080');
    expect(output).toContain('[server.nested]');
    expect(output).toContain('flag = true');
  });

  it('round-trips through iniToJson', () => {
    const source = { a: { b: 1, c: 'x' }, d: true };
    const back = JSON.parse(iniToJson(jsonToIni(JSON.stringify(source)))) as Record<
      string,
      unknown
    >;
    expect(back.a).toEqual({ b: 1, c: 'x' });
    expect(back.d).toBe(true);
  });

  it('rejects non-object roots', () => {
    expect(() => jsonToIni('42')).toThrow();
  });
});
