import type { Metadata } from 'next';
import { GraduationCap, ArrowUpRight, Clock } from 'lucide-react';
import { getAllResources } from '@/data';
import { createMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';

export const metadata: Metadata = createMetadata({
  title: 'Resources',
  description:
    'Courses, books, articles, newsletters, and podcasts to level up your development skills.',
  canonical: '/resources',
});

const typeLabels: Record<string, string> = {
  article: 'Article',
  video: 'Video',
  course: 'Course',
  book: 'Book',
  tool: 'Tool',
  newsletter: 'Newsletter',
  podcast: 'Podcast',
};

const difficultyStyles: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

export default function ResourcesPage() {
  const resources = getAllResources();

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        icon={<GraduationCap className="h-6 w-6" aria-hidden="true" />}
        title="Resources"
        description="Curated learning materials to level up your development skills."
        breadcrumb={[{ label: 'Resources', current: true }]}
        actions={
          <span className="text-muted-foreground bg-muted rounded-full px-3 py-1 text-sm font-medium">
            {resources.length} resources
          </span>
        }
      />

      {resources.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="No resources yet"
          description="Resources are being added. Check back soon."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group border-border bg-card hover:border-primary/40 focus-visible:ring-ring flex flex-col rounded-xl border p-6 transition-all hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="bg-primary/10 text-primary inline-flex rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase">
                  {typeLabels[resource.type]}
                </span>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${difficultyStyles[resource.difficulty]}`}
                >
                  {resource.difficulty}
                </span>
              </div>
              <h2 className="group-hover:text-primary mt-3 text-lg leading-snug font-semibold transition-colors">
                {resource.title}
              </h2>
              <p className="text-muted-foreground mt-2 line-clamp-2 flex-1 text-sm">
                {resource.description}
              </p>
              <div className="text-muted-foreground mt-4 flex items-center gap-4 text-xs">
                {resource.readingTime !== undefined && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {resource.readingTime} min read
                  </span>
                )}
                <span
                  className={
                    resource.free ? 'font-medium text-green-600 dark:text-green-400' : 'font-medium'
                  }
                >
                  {resource.free ? 'Free' : 'Paid'}
                </span>
                <span className="text-primary ml-auto inline-flex items-center gap-1 font-medium">
                  Visit
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
