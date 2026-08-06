import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createNoIndexMetadata } from '@/lib/seo';
import { SearchPageClient } from '@/components/search/search-page-client';
import type { SearchItemType } from '@/search';

export const metadata: Metadata = createNoIndexMetadata(
  'Search',
  'Search tools, categories, blog posts, and resources across DevTools Hub.'
);

interface SearchPageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

const VALID_TYPES: SearchItemType[] = ['tool', 'category', 'blog', 'resource'];

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, type } = await searchParams;
  const initialQuery = typeof q === 'string' ? q.slice(0, 120) : '';
  const initialType = VALID_TYPES.includes(type as SearchItemType)
    ? (type as SearchItemType)
    : 'all';

  return (
    <Suspense fallback={null}>
      <SearchPageClient initialQuery={initialQuery} initialType={initialType} />
    </Suspense>
  );
}
