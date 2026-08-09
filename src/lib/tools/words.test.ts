import { describe, expect, it } from 'vitest';
import { amountInWords, integerToWords, numberToWords, threeDigitWords } from '@/lib/tools/words';

describe('threeDigitWords', () => {
  it('spells numbers under 1000', () => {
    expect(threeDigitWords(5)).toBe('five');
    expect(threeDigitWords(21)).toBe('twenty-one');
    expect(threeDigitWords(99)).toBe('ninety-nine');
    expect(threeDigitWords(100)).toBe('one hundred');
    expect(threeDigitWords(345)).toBe('three hundred forty-five');
  });
});

describe('integerToWords', () => {
  it('handles zero and negatives', () => {
    expect(integerToWords(BigInt(0))).toBe('zero');
    expect(integerToWords(BigInt(-42))).toBe('negative forty-two');
  });

  it('uses scale names up to vigintillion', () => {
    expect(integerToWords(BigInt(1234))).toBe('one thousand two hundred thirty-four');
    expect(integerToWords(BigInt(1_000_000))).toBe('one million');
    expect(
      integerToWords(BigInt('1000000000000000000000000000000000000000000000000000000000000000'))
    ).toBe('one vigintillion');
  });

  it('spells a mixed-scale number', () => {
    expect(integerToWords(BigInt(123_456_789))).toBe(
      'one hundred twenty-three million four hundred fifty-six thousand seven hundred eighty-nine'
    );
  });
});

describe('numberToWords', () => {
  it('converts whole numbers', () => {
    const result = numberToWords('1234');
    expect(result.error).toBeNull();
    expect(result.words).toBe('one thousand two hundred thirty-four');
  });

  it('converts negatives', () => {
    expect(numberToWords('-7').words).toBe('negative seven');
  });

  it('spells decimal digits after point', () => {
    const result = numberToWords('12.5');
    expect(result.words).toBe('twelve point five');
    expect(numberToWords('0.07').words).toBe('zero point zero seven');
  });

  it('rejects invalid input', () => {
    expect(numberToWords('1e5').error).not.toBeNull();
    expect(numberToWords('abc').error).not.toBeNull();
    expect(numberToWords('').error).not.toBeNull();
  });
});

describe('amountInWords', () => {
  it('uses dollars and cents', () => {
    const result = amountInWords('1234.5');
    expect(result.error).toBeNull();
    expect(result.words).toBe('one thousand two hundred thirty-four dollars and fifty cents');
  });

  it('handles singular units', () => {
    expect(amountInWords('1.01').words).toBe('one dollar and one cent');
  });

  it('omits cents when zero', () => {
    expect(amountInWords('100').words).toBe('one hundred dollars');
    expect(amountInWords('0.5').words).toBe('zero dollars and fifty cents');
  });

  it('handles negatives', () => {
    expect(amountInWords('-25.10').words).toBe('negative twenty-five dollars and ten cents');
  });
});
