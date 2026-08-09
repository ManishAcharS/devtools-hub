const TEXT_TO_MORSE: Record<string, string> = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  "'": '.----.',
  '!': '-.-.--',
  '/': '-..-.',
  '(': '-.--.',
  ')': '-.--.-',
  '&': '.-...',
  ':': '---...',
  ';': '-.-.-.',
  '=': '-...-',
  '+': '.-.-.',
  '-': '-....-',
  _: '..--.-',
  '"': '.-..-.',
  $: '...-..-',
  '@': '.--.-.',
};

const MORSE_TO_TEXT: Record<string, string> = Object.fromEntries(
  Object.entries(TEXT_TO_MORSE).map(([letter, code]) => [code, letter])
);

export function textToMorse(text: string): string {
  const words = text.toUpperCase().split(/\s+/).filter(Boolean);
  return words
    .map((word) =>
      [...word]
        .map((char) => TEXT_TO_MORSE[char])
        .filter((code): code is string => code !== undefined)
        .join(' ')
    )
    .join(' / ');
}

export function morseToText(morse: string): string {
  return morse
    .split(/\s*\/\s*|\s{3,}/)
    .map((word) =>
      word
        .split(/\s+/)
        .filter(Boolean)
        .map((code) => MORSE_TO_TEXT[code] ?? '?')
        .join('')
    )
    .join(' ');
}
