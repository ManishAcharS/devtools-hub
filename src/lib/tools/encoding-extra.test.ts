import { describe, expect, it } from 'vitest';
import {
  base32Decode,
  base32Encode,
  decodeHtmlEntities,
  encodeHtmlEntities,
  fromPunycode,
  toPunycode,
} from '@/lib/tools/encoding-extra';

describe('encodeHtmlEntities', () => {
  it('escapes the five special characters to named entities', () => {
    expect(encodeHtmlEntities(`<a href="x" title='y'>Tom & Jerry</a>`)).toBe(
      '&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;Tom &amp; Jerry&lt;/a&gt;'
    );
  });

  it('leaves other characters untouched', () => {
    expect(encodeHtmlEntities('hello world 123')).toBe('hello world 123');
  });

  it('handles empty input', () => {
    expect(encodeHtmlEntities('')).toBe('');
  });
});

describe('decodeHtmlEntities', () => {
  it('decodes named entities with and without semicolons', () => {
    expect(decodeHtmlEntities('&amp; &lt; &gt; &quot; &apos;')).toBe('& < > " \x27');
    expect(decodeHtmlEntities('a &amp b')).toBe('a & b');
  });

  it('decodes numeric decimal entities', () => {
    expect(decodeHtmlEntities('&#65;&#66;&#67;')).toBe('ABC');
  });

  it('decodes numeric hexadecimal entities', () => {
    expect(decodeHtmlEntities('&#x41;&#x42;')).toBe('AB');
  });

  it('decodes emoji via code points', () => {
    expect(decodeHtmlEntities('&#128512;')).toBe('\u{1F600}');
  });

  it('leaves unknown entities untouched', () => {
    expect(decodeHtmlEntities('&bogus; &wat')).toBe('&bogus; &wat');
  });

  it('handles empty input', () => {
    expect(decodeHtmlEntities('')).toBe('');
  });
});

describe('toPunycode', () => {
  it('encodes a German domain', () => {
    expect(toPunycode('münchen.de')).toBe('xn--mnchen-3ya.de');
  });

  it('encodes a Chinese domain', () => {
    expect(toPunycode('例子.中国')).toBe('xn--fsqu00a.xn--fiqs8s');
  });

  it('encodes a German word with umlaut', () => {
    expect(toPunycode('bücher.de')).toBe('xn--bcher-kva.de');
  });

  it('passes pure ASCII through unchanged', () => {
    expect(toPunycode('example.com')).toBe('example.com');
  });

  it('round-trips with fromPunycode', () => {
    expect(fromPunycode(toPunycode('münchen.de'))).toBe('münchen.de');
    expect(fromPunycode(toPunycode('例子.中国'))).toBe('例子.中国');
    expect(fromPunycode(toPunycode('bücher.de'))).toBe('bücher.de');
    expect(fromPunycode(toPunycode('mañana.es'))).toBe('mañana.es');
  });

  it('rejects empty input', () => {
    expect(() => toPunycode('')).toThrow('Input is empty.');
  });
});

describe('fromPunycode', () => {
  it('decodes ASCII-compatible encodings', () => {
    expect(fromPunycode('xn--mnchen-3ya.de')).toBe('münchen.de');
    expect(fromPunycode('xn--bcher-kva.de')).toBe('bücher.de');
    expect(fromPunycode('xn--fsqu00a.xn--fiqs8s')).toBe('例子.中国');
  });

  it('decodes mixed-case encoded digits', () => {
    expect(fromPunycode('xn--mnchen-3YA.de')).toBe('münchen.de');
  });

  it('passes non-punycode labels through', () => {
    expect(fromPunycode('example.com')).toBe('example.com');
  });

  it('rejects invalid punycode digits', () => {
    expect(() => fromPunycode('xn--!!!!')).toThrow(/Invalid base32|bad digit/);
  });
});

describe('base32Encode', () => {
  it('encodes RFC 4648 test vectors', () => {
    expect(base32Encode('')).toBe('');
    expect(base32Encode('f')).toBe('MY======');
    expect(base32Encode('fo')).toBe('MZXQ====');
    expect(base32Encode('foo')).toBe('MZXW6===');
    expect(base32Encode('foob')).toBe('MZXW6YQ=');
    expect(base32Encode('fooba')).toBe('MZXW6YTB');
    expect(base32Encode('foobar')).toBe('MZXW6YTBOI======');
  });

  it('encodes base32hex test vectors', () => {
    expect(base32Encode('f', { alphabet: 'base32hex' })).toBe('CO======');
    expect(base32Encode('foo', { alphabet: 'base32hex' })).toBe('CPNMU===');
    expect(base32Encode('foobar', { alphabet: 'base32hex' })).toBe('CPNMUOJ1E8======');
  });

  it('omits padding when requested', () => {
    expect(base32Encode('foobar', { padding: false })).toBe('MZXW6YTBOI');
    expect(base32Encode('foo', { padding: false })).toBe('MZXW6');
  });

  it('round-trips UTF-8 input', () => {
    expect(base32Decode(base32Encode('é'))).toBe('é');
  });
});

describe('base32Decode', () => {
  it('decodes RFC 4648 test vectors', () => {
    expect(base32Decode('')).toBe('');
    expect(base32Decode('MY======')).toBe('f');
    expect(base32Decode('MZXQ====')).toBe('fo');
    expect(base32Decode('MZXW6===')).toBe('foo');
    expect(base32Decode('MZXW6YQ=')).toBe('foob');
    expect(base32Decode('MZXW6YTB')).toBe('fooba');
    expect(base32Decode('MZXW6YTBOI======')).toBe('foobar');
  });

  it('decodes unpadded and lowercase input', () => {
    expect(base32Decode('mzxw6ytboi')).toBe('foobar');
  });

  it('decodes base32hex', () => {
    expect(base32Decode('CPNMUOJ1E8======', { alphabet: 'base32hex' })).toBe('foobar');
  });

  it('round-trips', () => {
    const samples = ['foobar', 'hello world', 'münchen', '例子', 'a'];
    for (const sample of samples) {
      expect(base32Decode(base32Encode(sample))).toBe(sample);
    }
  });

  it('rejects invalid characters', () => {
    expect(() => base32Decode('MZXW6YTBOI!=====')).toThrow(/Invalid base32 character/);
  });
});
