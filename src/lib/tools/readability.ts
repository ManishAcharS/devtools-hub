export interface ReadabilityMetrics {
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  fleschReadingEase: number;
  fleschKincaidGrade: number;
}

const VOWEL_GROUP_PATTERN = /[aeiouy]+/g;
const SILENT_E_PATTERN = /(^|[^aeiouy])e$/;
const CONSONANT_LE_PATTERN = /[^aeiouy]le$/;
const SENTENCE_END_PATTERN = /[.!?…]+(?=\s|$)/g;

export function countSyllables(word: string): number {
  const letters = word.toLowerCase().replace(/[^a-z]/g, '');
  if (letters.length === 0) return 0;
  if (letters.length <= 3) return 1;
  let count = (letters.match(VOWEL_GROUP_PATTERN) ?? []).length;
  if (count > 1 && SILENT_E_PATTERN.test(letters) && !CONSONANT_LE_PATTERN.test(letters)) {
    count -= 1;
  }
  return Math.max(1, count);
}

export function countSentences(text: string): number {
  if (text.trim().length === 0) return 0;
  const matches = text.match(SENTENCE_END_PATTERN);
  if (matches && matches.length > 0) return matches.length;
  return 1;
}

export function countWords(text: string): number {
  const matches = text.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

export function fleschReadingEase(
  wordCount: number,
  sentenceCount: number,
  syllableCount: number
): number {
  if (wordCount === 0 || sentenceCount === 0) return 0;
  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = syllableCount / wordCount;
  return 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
}

export function fleschKincaidGrade(
  wordCount: number,
  sentenceCount: number,
  syllableCount: number
): number {
  if (wordCount === 0 || sentenceCount === 0) return 0;
  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = syllableCount / wordCount;
  return 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
}

export function analyzeReadability(text: string): ReadabilityMetrics {
  const wordCount = countWords(text);
  const sentenceCount = countSentences(text);
  const syllableCount = text.split(/\s+/).reduce((total, word) => total + countSyllables(word), 0);
  const effectiveSentences = Math.max(1, sentenceCount);
  const avgWordsPerSentence = wordCount === 0 ? 0 : wordCount / effectiveSentences;
  const avgSyllablesPerWord = wordCount === 0 ? 0 : syllableCount / wordCount;
  return {
    wordCount,
    sentenceCount,
    syllableCount,
    avgWordsPerSentence,
    avgSyllablesPerWord,
    fleschReadingEase: fleschReadingEase(wordCount, effectiveSentences, syllableCount),
    fleschKincaidGrade: fleschKincaidGrade(wordCount, effectiveSentences, syllableCount),
  };
}
