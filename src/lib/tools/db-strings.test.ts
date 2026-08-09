import { describe, expect, it } from 'vitest';
import { buildConnectionString, parseConnectionString } from '@/lib/tools/db-strings';

describe('parseConnectionString', () => {
  it('parses a postgres connection string', () => {
    const result = parseConnectionString(
      'postgres://user:secret@db.example.com:5432/appdb?sslmode=require'
    );
    expect(result.error).toBeNull();
    expect(result.scheme).toBe('postgres');
    expect(result.username).toBe('user');
    expect(result.password).toBe('secret');
    expect(result.host).toBe('db.example.com');
    expect(result.port).toBe('5432');
    expect(result.database).toBe('appdb');
    expect(result.params).toEqual({ sslmode: 'require' });
  });

  it('parses a mongodb connection string with multiple hosts', () => {
    const result = parseConnectionString(
      'mongodb://admin:pw@host1:27017,host2:27017/shop?replicaSet=rs0'
    );
    expect(result.error).toBeNull();
    expect(result.scheme).toBe('mongodb');
    expect(result.host).toBe('host1');
    expect(result.database).toBe('shop');
    expect(result.params.replicaSet).toBe('rs0');
  });

  it('parses a redis connection string without credentials', () => {
    const result = parseConnectionString('redis://localhost:6379/0');
    expect(result.error).toBeNull();
    expect(result.scheme).toBe('redis');
    expect(result.username).toBe('');
    expect(result.password).toBe('');
    expect(result.host).toBe('localhost');
    expect(result.port).toBe('6379');
    expect(result.database).toBe('0');
  });

  it('decodes percent-encoded credentials', () => {
    const result = parseConnectionString('mysql://us%40er:p%40ss@db:3306/db');
    expect(result.username).toBe('us@er');
    expect(result.password).toBe('p@ss');
  });

  it('rejects unsupported schemes', () => {
    const result = parseConnectionString('ftp://host/db');
    expect(result.error).toContain('not supported');
    expect(result.scheme).toBe('');
  });

  it('returns an error for garbage input', () => {
    expect(parseConnectionString('not a url at all').error).not.toBeNull();
    expect(parseConnectionString('').error).not.toBeNull();
  });
});

describe('buildConnectionString', () => {
  it('builds a full connection string', () => {
    const built = buildConnectionString({
      scheme: 'postgres',
      username: 'user',
      password: 'secret',
      host: 'localhost',
      port: '5432',
      database: 'appdb',
    });
    expect(built).toBe('postgres://user:secret@localhost:5432/appdb');
  });

  it('omits the port and database when absent', () => {
    const built = buildConnectionString({
      scheme: 'redis',
      username: '',
      password: '',
      host: 'cache.internal',
      port: '',
      database: '',
    });
    expect(built).toBe('redis://cache.internal');
  });

  it('omits credentials when there is no username', () => {
    const built = buildConnectionString({
      scheme: 'mysql',
      username: '',
      password: 'pw',
      host: 'db',
      port: '3306',
      database: 'mydb',
    });
    expect(built).toBe('mysql://db:3306/mydb');
  });

  it('percent-encodes special characters in credentials and database', () => {
    const built = buildConnectionString({
      scheme: 'postgres',
      username: 'us er',
      password: 'p@ss/word',
      host: 'db',
      port: '',
      database: 'my db',
    });
    expect(built).toBe('postgres://us%20er:p%40ss%2Fword@db/my%20db');
  });

  it('round-trips with parseConnectionString', () => {
    const built = buildConnectionString({
      scheme: 'postgres',
      username: 'user',
      password: 'secret',
      host: 'localhost',
      port: '5432',
      database: 'appdb',
    });
    const parsed = parseConnectionString(built);
    expect(parsed.error).toBeNull();
    expect(parsed.scheme).toBe('postgres');
    expect(parsed.username).toBe('user');
    expect(parsed.password).toBe('secret');
    expect(parsed.host).toBe('localhost');
    expect(parsed.port).toBe('5432');
    expect(parsed.database).toBe('appdb');
  });
});
