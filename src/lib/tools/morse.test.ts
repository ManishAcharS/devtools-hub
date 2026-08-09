import { describe, expect, it } from 'vitest';
import { morseToText, textToMorse } from './morse';

describe('morse', () => {
  it('encodes letters and numbers', () => {
    expect(textToMorse('SOS')).toBe('... --- ...');
    expect(textToMorse('hello')).toBe('.... . .-.. .-.. ---');
    expect(textToMorse('1 2 3')).toBe('.---- / ..--- / ...--');
  });

  it('decodes morse back to text', () => {
    expect(morseToText('... --- ...')).toBe('SOS');
    expect(morseToText('.... . .-.. .-.. ---')).toBe('HELLO');
  });

  it('round-trips a full sentence', () => {
    const sentence = 'HELLO WORLD';
    expect(morseToText(textToMorse(sentence))).toBe(sentence);
  });

  it('supports punctuation', () => {
    expect(textToMorse('?')).toBe('..--..');
    expect(morseToText('..--..')).toBe('?');
  });

  it('drops unsupported characters without crashing', () => {
    expect(textToMorse('a#b')).toBe('.- -...');
  });

  it('handles empty input', () => {
    expect(textToMorse('')).toBe('');
    expect(morseToText('')).toBe('');
  });
});
