export type SearchItemType = 'tool' | 'category' | 'blog' | 'resource';

export interface SearchItem {
  id: string;
  type: SearchItemType;
  title: string;
  description: string;
  href: string;
  category?: string;
  tags: string[];
  keywords: string[];
  icon?: string;
  rating?: number;
  featured?: boolean;
  boost?: number;
}

export interface SearchResultItem {
  item: SearchItem;
  score: number;
  matchedTokens: string[];
}

export interface SearchFilters {
  types?: SearchItemType[];
  category?: string;
  limit?: number;
  fuzzy?: boolean;
}

export interface SearchSuggestion {
  value: string;
  type: SearchItemType;
  href: string;
}

export interface SearchCounts {
  tool: number;
  category: number;
  blog: number;
  resource: number;
}
