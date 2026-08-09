import { describe, expect, it } from 'vitest';
import { buildEnvFile, validateEnvFile } from '@/lib/tools/env-file';

describe('buildEnvFile', () => {
  it('joins entries as KEY=VALUE lines', () => {
    const output = buildEnvFile([
      { key: 'NODE_ENV', value: 'production' },
      { key: 'PORT', value: '3000' },
    ]);
    expect(output).toBe('NODE_ENV=production\nPORT=3000\n');
  });

  it('skips entries with empty keys', () => {
    expect(buildEnvFile([{ key: '  ', value: 'x' }])).toBe('\n');
  });

  it('quotes values that contain spaces or hashes', () => {
    expect(buildEnvFile([{ key: 'GREETING', value: 'hello world' }])).toBe(
      'GREETING="hello world"\n'
    );
    expect(buildEnvFile([{ key: 'URL', value: 'http://x/#frag' }])).toBe('URL="http://x/#frag"\n');
  });

  it('quotes empty values', () => {
    expect(buildEnvFile([{ key: 'EMPTY', value: '' }])).toBe('EMPTY=""\n');
  });

  it('escapes double quotes inside values', () => {
    expect(buildEnvFile([{ key: 'K', value: 'say "hi"' }])).toBe('K="say \\"hi\\""\n');
  });
});

describe('validateEnvFile', () => {
  it('reports no issues for a clean file', () => {
    const result = validateEnvFile(
      'NODE_ENV=production\nPORT=3000\n# a comment\n\nSECRET="abc 123"'
    );
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it('flags duplicate keys', () => {
    const result = validateEnvFile('A=1\nB=2\nA=3');
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.message).toContain('Duplicate key "A"');
    expect(result.errors[0]?.line).toBe(3);
  });

  it('flags whitespace around the equals sign', () => {
    const result = validateEnvFile('A = 1\nB= 2\nC =3\nD=4');
    expect(result.errors.map((e) => e.line)).toEqual([1, 2, 3]);
  });

  it('warns about unquoted spaces in values', () => {
    const result = validateEnvFile('GREETING=hello world\nGREETING2="hello world"');
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]?.line).toBe(1);
    expect(result.warnings[0]?.message).toContain('unquoted spaces');
  });

  it('warns about empty values', () => {
    const result = validateEnvFile('EMPTY=');
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]?.message).toContain('empty value');
  });

  it('flags lines that are not assignments', () => {
    const result = validateEnvFile('not-an-assignment\nA=1');
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.message).toContain('KEY=VALUE');
  });

  it('flags invalid key names', () => {
    const result = validateEnvFile('1BADKEY=1\nGOOD_KEY_2=2');
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.message).toContain('Invalid key');
  });

  it('ignores blank lines and comments', () => {
    const result = validateEnvFile('# comment\n   \n#another\nA=1');
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });
});
