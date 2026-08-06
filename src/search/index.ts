export * from './types';
export * from './tokenizer';
export * from './highlight';
export * from './engine';
export * from './indexer';
export * from './popular';

import { SearchEngine } from './engine';
import { buildIndex } from './indexer';

const globalIndex = buildIndex();
export const searchEngine = new SearchEngine(globalIndex);

export function getSearchCounts() {
  return searchEngine.getItemCounts();
}
