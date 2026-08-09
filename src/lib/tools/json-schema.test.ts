import { describe, expect, it } from 'vitest';
import { jsonToSchema } from '@/lib/tools/json-schema';

describe('jsonToSchema', () => {
  it('throws on invalid JSON', () => {
    expect(() => jsonToSchema('{ not json')).toThrow();
    expect(() => jsonToSchema('')).toThrow();
  });

  it('uses draft 2020-12 and a title', () => {
    const schema = JSON.parse(jsonToSchema('{"a": 1}')) as Record<string, unknown>;
    expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
    expect(schema.title).toBe('Generated Schema');
  });

  it('infers primitive types', () => {
    const schema = JSON.parse(
      jsonToSchema('{"name": "Ada", "age": 36, "score": 1.5, "active": true, "note": null}')
    ) as { properties: Record<string, { type: string }> };
    expect(schema.properties.name.type).toBe('string');
    expect(schema.properties.age.type).toBe('integer');
    expect(schema.properties.score.type).toBe('number');
    expect(schema.properties.active.type).toBe('boolean');
    expect(schema.properties.note.type).toBe('null');
  });

  it('marks all non-null keys as required', () => {
    const schema = JSON.parse(jsonToSchema('{"name": "Ada", "nickname": null}')) as {
      required: string[];
    };
    expect(schema.required).toEqual(['name']);
  });

  it('nests objects and marks them required', () => {
    const schema = JSON.parse(jsonToSchema('{"user": {"id": 1, "email": "a@b.com"}}')) as {
      properties: {
        user: { type: string; required: string[]; properties: Record<string, unknown> };
      };
    };
    expect(schema.properties.user.type).toBe('object');
    expect(schema.properties.user.required).toEqual(['id', 'email']);
  });

  it('infers enums for arrays of unique primitives', () => {
    const schema = JSON.parse(jsonToSchema('{"roles": ["admin", "editor", "viewer"]}')) as {
      properties: { roles: { type: string; items: { type: string; enum: string[] } } };
    };
    expect(schema.properties.roles.type).toBe('array');
    expect(schema.properties.roles.items.type).toBe('string');
    expect(schema.properties.roles.items.enum).toEqual(['admin', 'editor', 'viewer']);
  });

  it('does not emit enums for arrays with duplicates', () => {
    const schema = JSON.parse(jsonToSchema('{"tags": ["a", "a", "b"]}')) as {
      properties: { tags: { items: { enum?: unknown } } };
    };
    expect(schema.properties.tags.items.enum).toBeUndefined();
  });

  it('infers object items inside arrays', () => {
    const schema = JSON.parse(jsonToSchema('{"users": [{"id": 1}, {"id": 2}]}')) as {
      properties: { users: { items: { type: string; properties: Record<string, unknown> } } };
    };
    expect(schema.properties.users.items.type).toBe('object');
    expect(schema.properties.users.items.properties.id).toBeDefined();
  });

  it('infers union types for mixed arrays', () => {
    const schema = JSON.parse(jsonToSchema('{"mixed": [1, "two", false]}')) as {
      properties: { mixed: { items?: unknown } };
    };
    const items = schema.properties.mixed.items as { anyOf: { type: string }[] };
    expect(items.anyOf.map((entry) => entry.type).sort()).toEqual(['boolean', 'integer', 'string']);
  });

  it('adds string format constraints', () => {
    const schema = JSON.parse(
      jsonToSchema('{"email": "a@b.com", "site": "https://x.dev", "day": "2026-01-02"}')
    ) as { properties: Record<string, { format?: string }> };
    expect(schema.properties.email.format).toBe('email');
    expect(schema.properties.site.format).toBe('uri');
    expect(schema.properties.day.format).toBe('date');
  });

  it('respects the indent option', () => {
    const output = jsonToSchema('{"a": 1}', { indentSize: 4 });
    expect(output).toContain('\n    "properties"');
  });
});
