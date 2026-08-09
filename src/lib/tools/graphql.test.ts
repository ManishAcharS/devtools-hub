import { describe, expect, it } from 'vitest';
import { formatGraphQL, minifyGraphQL } from '@/lib/tools/graphql';

describe('formatGraphQL', () => {
  it('formats a one-line query into indented output', () => {
    const output = formatGraphQL('query GetUser($id: ID!) { user(id: $id) { id name } }');
    expect(output).toBe('query GetUser($id: ID!) {\n  user(id: $id) {\n    id\n    name\n  }\n}\n');
  });

  it('keeps multiple fields on separate lines', () => {
    const output = formatGraphQL('{ users { id email } posts { title } }');
    expect(output).toBe('{\n  users {\n    id\n    email\n  }\n  posts {\n    title\n  }\n}\n');
  });

  it('preserves comments on their own lines', () => {
    const output = formatGraphQL('{ # fetch the user\n  user { id } }');
    expect(output).toContain('# fetch the user');
    expect(output).toContain('  user {');
  });

  it('preserves block strings', () => {
    const output = formatGraphQL('{ article { description: """multi\nline text""" } }');
    expect(output).toContain('"""multi\nline text"""');
  });

  it('formats SDL with directives and descriptions', () => {
    const output = formatGraphQL('type User @cacheControl(maxAge: 60) { id: ID! name: String }');
    expect(output).toBe('type User @cacheControl(maxAge: 60) {\n  id: ID!\n  name: String\n}\n');
  });

  it('formats fragment spreads and variable definitions', () => {
    const output = formatGraphQL(
      'query Q($id: ID!) { user(id: $id) { ...UserFields } } fragment UserFields on User { name }'
    );
    expect(output).toContain('...UserFields');
    expect(output).toContain('fragment UserFields on User {');
  });

  it('formats argument lists with commas', () => {
    const output = formatGraphQL('{ users(ids: [1, 2], limit: 10) { id } }');
    expect(output).toContain('users(ids: [1, 2], limit: 10) {');
  });

  it('throws on unbalanced braces', () => {
    expect(() => formatGraphQL('{ user { id }')).toThrow();
  });

  it('throws on unterminated strings and empty input', () => {
    expect(() => formatGraphQL('{ field(a: "unclosed) }')).toThrow();
    expect(() => formatGraphQL('   ')).toThrow();
  });
});

describe('minifyGraphQL', () => {
  it('compresses a query to a single line', () => {
    const output = minifyGraphQL('query GetUser($id: ID!) {\n  user(id: $id) {\n    id\n  }\n}');
    expect(output).toBe('query GetUser($id:ID!){user(id:$id){id}}\n');
  });

  it('drops comments', () => {
    const output = minifyGraphQL('# header comment\n{ field } # trailing');
    expect(output).not.toContain('#');
    expect(output).toBe('{field}\n');
  });

  it('keeps required spaces between names', () => {
    expect(minifyGraphQL('fragment F on User { id }')).toBe('fragment F on User{id}\n');
    expect(minifyGraphQL('type Query { hello: String! }')).toBe('type Query{hello:String!}\n');
  });

  it('preserves block strings', () => {
    const output = minifyGraphQL('{ field(arg: """keep me""") }');
    expect(output).toBe('{field(arg:"""keep me""")}\n');
  });

  it('throws on unbalanced delimiters', () => {
    expect(() => minifyGraphQL('{ field( ')).toThrow();
    expect(() => minifyGraphQL('')).toThrow();
  });
});
