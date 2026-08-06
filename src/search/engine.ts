import type {
  SearchItem,
  SearchResultItem,
  SearchFilters,
  SearchSuggestion,
  SearchCounts,
  SearchItemType,
} from './types';
import { tokenize, isFuzzyMatch } from './tokenizer';

interface FieldTokens {
  title: string[];
  keywords: string[];
  description: string[];
  category: string[];
}

interface DocEntry {
  item: SearchItem;
  fields: FieldTokens;
  titleSet: Set<string>;
  keywordSet: Set<string>;
}

const TYPE_BOOST: Record<SearchItemType, number> = {
  tool: 1,
  category: 0.95,
  blog: 0.85,
  resource: 0.8,
};

export class SearchEngine {
  private docs: DocEntry[];
  private allTokens: string[];

  constructor(items: SearchItem[]) {
    this.docs = items.map((item) => {
      const title = tokenize(item.title);
      const keywords = tokenize(item.keywords.join(' '));
      const description = tokenize(item.description);
      const category = item.category ? tokenize(item.category) : [];
      return {
        item,
        fields: { title, keywords, description, category },
        titleSet: new Set(title),
        keywordSet: new Set(keywords),
      };
    });
    this.allTokens = Array.from(
      new Set(
        this.docs.flatMap((doc) => [
          ...doc.fields.title,
          ...doc.fields.keywords,
          ...doc.fields.description,
          ...doc.fields.category,
        ])
      )
    ).sort();
  }

  getItemCounts(): SearchCounts {
    const counts: SearchCounts = { tool: 0, category: 0, blog: 0, resource: 0 };
    for (const doc of this.docs) {
      counts[doc.item.type] += 1;
    }
    return counts;
  }

  private matchCandidateTokens(
    queryToken: string,
    fuzzy: boolean
  ): { token: string; fuzzyMatch: boolean }[] {
    const candidates: { token: string; fuzzyMatch: boolean }[] = [];
    for (const candidate of this.allTokens) {
      if (candidate === queryToken) {
        candidates.push({ token: candidate, fuzzyMatch: false });
      } else if (candidate.startsWith(queryToken)) {
        candidates.push({ token: candidate, fuzzyMatch: false });
      } else if (fuzzy && isFuzzyMatch(queryToken, candidate)) {
        candidates.push({ token: candidate, fuzzyMatch: true });
      }
    }
    return candidates;
  }

  private scoreDoc(
    doc: DocEntry,
    queryToken: string,
    matched: { token: string; fuzzyMatch: boolean }
  ): number {
    const { token, fuzzyMatch } = matched;
    const fieldScore = (field: string[]): number =>
      field.includes(token) ? (fuzzyMatch ? 0.5 : 1) : 0;

    let score = 0;
    const title = fieldScore(doc.fields.title);
    const keyword = fieldScore(doc.fields.keywords);
    const description = fieldScore(doc.fields.description);
    const category = fieldScore(doc.fields.category);

    if (title > 0) {
      score += title * (doc.titleSet.has(queryToken) ? 100 : 80);
    }
    if (keyword > 0) {
      score += keyword * (doc.keywordSet.has(queryToken) ? 60 : 45);
    }
    if (category > 0) {
      score += category * 25;
    }
    if (description > 0) {
      score += description * 20;
    }
    return score;
  }

  search(query: string, filters: SearchFilters = {}): SearchResultItem[] {
    const { types, category, limit = 20, fuzzy = true } = filters;
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const typeFilter = types && types.length > 0 ? new Set(types) : null;

    const scores = new Map<number, { score: number; matchedTokens: Set<string> }>();

    for (const queryToken of queryTokens) {
      const candidates = this.matchCandidateTokens(queryToken, fuzzy);
      for (const matched of candidates) {
        for (let docIndex = 0; docIndex < this.docs.length; docIndex++) {
          const doc = this.docs[docIndex];
          if (typeFilter && !typeFilter.has(doc.item.type)) continue;
          if (category && doc.item.category !== category) continue;

          const fieldScore = this.scoreDoc(doc, queryToken, matched);
          if (fieldScore <= 0) continue;

          const entry = scores.get(docIndex);
          if (entry) {
            entry.score += fieldScore;
            entry.matchedTokens.add(queryToken);
          } else {
            scores.set(docIndex, { score: fieldScore, matchedTokens: new Set([queryToken]) });
          }
        }
      }
    }

    const results: SearchResultItem[] = [];
    for (const [docIndex, { score, matchedTokens }] of scores) {
      const doc = this.docs[docIndex];
      const tokenBonus = 1 + 0.15 * (matchedTokens.size - 1);
      const ratingBonus = doc.item.rating !== undefined && doc.item.rating >= 4.8 ? 3 : 0;
      const featuredBonus = doc.item.featured ? 2 : 0;
      const boost = (doc.item.boost ?? 1) * TYPE_BOOST[doc.item.type];

      results.push({
        item: doc.item,
        score: score * tokenBonus * boost + ratingBonus + featuredBonus,
        matchedTokens: Array.from(matchedTokens),
      });
    }

    results.sort(
      (a, b) =>
        b.score - a.score ||
        (b.item.rating ?? 0) - (a.item.rating ?? 0) ||
        a.item.title.localeCompare(b.item.title)
    );

    return results.slice(0, limit);
  }

  suggest(query: string, limit = 6): SearchSuggestion[] {
    const trimmed = query.trim();
    if (!trimmed) return [];
    const results = this.search(trimmed, { limit: Math.max(limit * 2, 8) });
    const suggestions: SearchSuggestion[] = [];
    const seen = new Set<string>();

    for (const { item } of results) {
      if (suggestions.length >= limit) break;
      const title = item.title;
      if (!seen.has(title) && title.toLowerCase().startsWith(trimmed.toLowerCase())) {
        seen.add(title);
        suggestions.push({ value: title, type: item.type, href: item.href });
        continue;
      }
      if (!seen.has(title) && title.toLowerCase().includes(trimmed.toLowerCase())) {
        seen.add(title);
        suggestions.push({ value: title, type: item.type, href: item.href });
      }
    }

    if (suggestions.length < limit) {
      for (const { item } of results) {
        if (suggestions.length >= limit) break;
        if (seen.has(item.title)) continue;
        seen.add(item.title);
        suggestions.push({ value: item.title, type: item.type, href: item.href });
      }
    }

    return suggestions.slice(0, limit);
  }
}
