import type { Metadata } from 'next';
import { BookOpen } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';

export const metadata: Metadata = createMetadata({
  title: 'Blog',
  description: 'Guides and articles are on the way. Check back soon!',
  canonical: '/blog',
  keywords: ['developer blog', 'tool comparisons', 'dev workflows', 'engineering guides'],
});

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        icon={<BookOpen className="h-6 w-6" aria-hidden="true" />}
        title="Blog"
        description="Guides, comparisons, and deep dives from our team."
        breadcrumb={[{ label: 'Blog', current: true }]}
      />

      <EmptyState
        icon="file"
        title="Blog coming soon"
        description="We're writing guides, comparisons, and deep dives. They'll be published here soon — stay tuned!"
      />
    </div>
  );
}
