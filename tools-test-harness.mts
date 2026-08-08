import assert from 'node:assert';
import * as colors from './src/lib/tools/colors.ts';
import * as hashing from './src/lib/tools/hashing.ts';

const results: string[] = [];

async function run(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    results.push(`PASS ${name}`);
  } catch (error: unknown) {
    results.push(`FAIL ${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// --- colors ---
await run('hexToRgb #ff0000', () => {
  assert.deepStrictEqual(colors.parseHexColor('#ff0000'), { r: 255, g: 0, b: 0, a: 1 });
});
await run('hexToRgb 3-digit #f00', () => {
  assert.deepStrictEqual(colors.parseHexColor('f00'), { r: 255, g: 0, b: 0, a: 1 });
});
await run('hexToRgb 8-digit alpha', () => {
  assert.deepStrictEqual(colors.parseHexColor('#ff000080'), { r: 255, g: 0, b: 0, a: 128 / 255 });
});
await run('hexToRgb invalid', () => {
  assert.strictEqual(colors.parseHexColor('#12345'), null);
  assert.strictEqual(colors.parseHexColor('red'), null);
});
await run('rgbToHex', () => {
  assert.strictEqual(colors.rgbToHex({ r: 255, g: 0, b: 0, a: 1 }), '#ff0000');
  assert.strictEqual(colors.rgbToHex({ r: 1, g: 2, b: 3, a: 0.5 }), '#01020380');
});
await run('rgb<->hsl roundtrip', () => {
  const rgb = { r: 200, g: 100, b: 50, a: 1 };
  const hsl = colors.rgbToHsl(rgb);
  assert.ok(Math.abs(hsl.h - 20) < 0.5);
  assert.ok(Math.abs(hsl.s - 60) < 0.5);
  assert.ok(Math.abs(hsl.l - 49) < 0.5);
  const back = colors.hslToRgb(hsl);
  assert.ok(
    Math.abs(back.r - rgb.r) <= 1 &&
      Math.abs(back.g - rgb.g) <= 1 &&
      Math.abs(back.b - rgb.b) <= 1
  );
});
await run('parseRgbCss', () => {
  assert.deepStrictEqual(colors.parseRgbCss('rgb(255, 0, 0)'), { r: 255, g: 0, b: 0, a: 1 });
  assert.deepStrictEqual(colors.parseRgbCss('rgba(0, 0, 255, 0.5)'), { r: 0, g: 0, b: 255, a: 0.5 });
  assert.deepStrictEqual(colors.parseRgbCss('rgb(100%, 0%, 0%)'), { r: 255, g: 0, b: 0, a: 1 });
  assert.deepStrictEqual(colors.parseRgbCss('rgb(300, 0, 0)'), { r: 255, g: 0, b: 0, a: 1 });
  assert.strictEqual(colors.parseRgbCss('rgb(not-a-number, 0, 0)'), null);
});
await run('parseCssColor named', () => {
  const result = colors.parseCssColor('tomato');
  assert.ok(result.ok);
  if (result.ok) assert.strictEqual(result.color.hex, '#ff6347');
});
await run('parseCssColor hsl', () => {
  const result = colors.parseCssColor('hsl(120, 100%, 50%)');
  assert.ok(result.ok);
  if (result.ok) assert.strictEqual(result.color.hex, '#00ff00');
});
await run('contrast ratio black/white', () => {
  const black = { r: 0, g: 0, b: 0, a: 1 };
  const white = { r: 255, g: 255, b: 255, a: 1 };
  assert.ok(Math.abs(colors.contrastRatio(black, white) - 21) < 0.01);
});
await run('contrastResult AA thresholds', () => {
  const whiteOnBlack = colors.contrastResult({ r: 255, g: 255, b: 255, a: 1 }, { r: 0, g: 0, b: 0, a: 1 });
  assert.strictEqual(whiteOnBlack.level, 'AAA');
  assert.ok(whiteOnBlack.passesAA);
  const grayOnWhite = colors.contrastResult({ r: 150, g: 150, b: 150, a: 1 }, { r: 255, g: 255, b: 255, a: 1 });
  assert.strictEqual(grayOnWhite.level, 'Fail');
  assert.ok(!grayOnWhite.passesAA);
});
await run('palette complementary', () => {
  const palette = colors.generatePalette('#ff0000', 'complementary', 2);
  assert.strictEqual(palette.length, 2);
  assert.strictEqual(palette[0].toLowerCase(), '#ff0000');
  assert.strictEqual(palette[1].toLowerCase(), '#00ffff');
});
await run('palette analogous', () => {
  const palette = colors.generatePalette('#ff0000', 'analogous', 5);
  assert.strictEqual(palette.length, 5);
  assert.strictEqual(palette[2].toLowerCase(), '#ff0000');
});
await run('palette tints', () => {
  const palette = colors.generatePalette('#000000', 'tints', 3);
  assert.strictEqual(palette.length, 3);
  assert.strictEqual(palette[2].toLowerCase(), '#ffffff');
});
await run('gradientSteps', () => {
  const steps = colors.gradientSteps('#000000', '#ffffff', 3);
  assert.deepStrictEqual(steps, ['#000000', '#808080', '#ffffff']);
});
await run('gradientCss', () => {
  assert.strictEqual(
    colors.gradientCss('#000000', '#ffffff'),
    'linear-gradient(to right, #000000 0%, #ffffff 100%)'
  );
});
await run('randomHexColor valid', () => {
  const color = colors.randomHexColor();
  assert.ok(/^#[0-9a-f]{6}$/.test(color));
});

// --- hashing ---
await run('md5 empty string', () => {
  assert.strictEqual(hashing.md5HexString(''), 'd41d8cd98f00b204e9800998ecf8427e');
});
await run('md5 abc', () => {
  assert.strictEqual(hashing.md5HexString('abc'), '900150983cd24fb0d6963f7d28e17f72');
});
await run('md5 known vectors', () => {
  assert.strictEqual(
    hashing.md5HexString('The quick brown fox jumps over the lazy dog'),
    '9e107d9d372bb6826bd81d3542a419d6'
  );
  assert.strictEqual(hashing.md5HexString('message digest'), 'f96b697d7cb7938d525a2f31aaf161d0');
  assert.strictEqual(hashing.md5HexString('a'.repeat(1000000)), '7707d6ae4e027c70eea2a935c2296f21');
});
await run('md5 streaming matches one-shot', () => {
  const data = hashing.textToBytes('streaming test data '.repeat(100));
  const oneShot = new hashing.Md5Hasher().update(data).hexDigest();
  const streamed = new hashing.Md5Hasher()
    .update(data.subarray(0, 7))
    .update(data.subarray(7, 1000))
    .update(data.subarray(1000))
    .hexDigest();
  assert.strictEqual(oneShot, streamed);
});
await run('hexToBytes/bytesToHex roundtrip', () => {
  const bytes = hashing.hexToBytes('00ff10');
  assert.deepStrictEqual(Array.from(bytes), [0, 255, 16]);
  assert.strictEqual(hashing.bytesToHex(bytes), '00ff10');
});
await run('sha256 empty', async () => {
  const hex = await hashing.sha256Hex('');
  assert.strictEqual(
    hex,
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  );
});
await run('sha256 abc', async () => {
  const hex = await hashing.sha256Hex('abc');
  assert.strictEqual(hex, 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});
await run('sha1 abc', async () => {
  const hex = await hashing.sha1Hex('abc');
  assert.strictEqual(hex, 'a9993e364706816aba3e25717850c26c9cd0d89d');
});
await run('sha512 abc', async () => {
  const hex = await hashing.sha512Hex('abc');
  assert.strictEqual(
    hex,
    'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f'
  );
});
await run('hmac sha256 known vector', async () => {
  const hex = await hashing.hmacHex('SHA-256', 'key', 'The quick brown fox jumps over the lazy dog');
  assert.strictEqual(hex, 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8');
});
await run('hmac hex input format (RFC 4231 test case 1)', async () => {
  const hex = await hashing.hmacHex(
    'SHA-256',
    '0b'.repeat(20),
    '4869205468657265',
    { inputFormat: 'hex' }
  );
  assert.strictEqual(hex, 'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7');
});
await run('computeTextHashes', async () => {
  const results = await hashing.computeTextHashes('abc', ['MD5', 'SHA-256']);
  assert.strictEqual(results.length, 2);
  assert.strictEqual(results[0].hex, '900150983cd24fb0d6963f7d28e17f72');
  assert.strictEqual(results[1].hex, 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});

console.log(results.join('\n'));
const failures = results.filter((r) => r.startsWith('FAIL')).length;
console.log('----------------------------------------');
console.log(`${results.length} checks: ${results.length - failures} passed, ${failures} failed.`);
if (failures > 0) process.exit(1);
