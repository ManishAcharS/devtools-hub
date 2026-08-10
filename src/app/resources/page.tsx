import type { Metadata } from 'next';
import { GraduationCap } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';

export const metadata: Metadata = createMetadata({
  title: 'Resources',
  description: 'Curated learning resources are on the way. Check back soon!',
  canonical: '/resources',
});

export default function ResourcesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        icon={<GraduationCap className="h-6 w-6" aria-hidden="true" />}
        title="Resources"
        description="Curated learning materials to level up your development skills."
        breadcrumb={[{ label: 'Resources', current: true }]}
      />

      <EmptyState
        icon="inbox"
        title="Resources coming soon"
        description="We're curating courses, books, articles, and tools. They'll be listed here soon — stay tuned!"
      />
    </div>
  );
}
