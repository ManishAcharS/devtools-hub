import type { Metadata } from 'next';
import Link from 'next/link';
import { Wrench } from 'lucide-react';
import { getAllTools, getAllCategories } from '@/data';
import {
  createMetadata,
  createItemListStructuredData,
  StructuredData,
  getCanonicalUrl,
} from '@/lib/seo';
import { ToolCard } from '@/components/ui/tool-card';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';

export const metadata: Metadata = createMetadata({
  title: 'Developer Tools',
  description:
    'Browse our curated collection of developer tools across API development, databases, frontend, backend, testing, monitoring, security, and more.',
  canonical: '/tools',
  keywords: ['developer tools', 'dev tools directory', 'software tools', 'best dev tools'],
});

export default function ToolsPage() {
  const tools = getAllTools();
  const categories = getAllCategories();

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <StructuredData
        data={createItemListStructuredData(
          tools.map((tool) => ({ name: tool.title, url: getCanonicalUrl(`/tools/${tool.slug}`) }))
        )}
      />
      <PageHeader
        icon={<Wrench className="h-6 w-6" aria-hidden="true" />}
        title="Developer Tools"
        description="A curated directory of the best tools for modern software development."
        breadcrumb={[{ label: 'Tools', current: true }]}
        actions={
          <span className="text-muted-foreground bg-muted rounded-full px-3 py-1 text-sm font-medium">
            {tools.length} tools
          </span>
        }
      />

      <nav aria-label="Filter by category" className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/tools"
          className="bg-primary/10 text-primary rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
        >
          All
        </Link>
        {categories.slice(0, 8).map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="hover-glow text-muted-foreground hover:bg-muted hover:text-foreground border-border focus-visible:ring-ring rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {category.name}
          </Link>
        ))}
      </nav>

      {tools.length === 0 ? (
        <EmptyState
          icon="tools"
          title="No tools yet"
          description="Tools are being added. Check back soon or explore categories."
          actionLabel="Browse categories"
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="group focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:outline-none"
            >
              <ToolCard tool={tool} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
