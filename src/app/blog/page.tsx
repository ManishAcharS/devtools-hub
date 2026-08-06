import type { Metadata } from 'next';
import { BookOpen } from 'lucide-react';
import { getAllPosts } from '@/data';
import {
  createMetadata,
  createItemListStructuredData,
  StructuredData,
  getCanonicalUrl,
} from '@/lib/seo';
import { BlogCard } from '@/components/shared/blog-card';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';

export const metadata: Metadata = createMetadata({
  title: 'Blog',
  description:
    'Guides, comparisons, and deep dives on developer tools, workflows, and modern software engineering.',
  canonical: '/blog',
  keywords: ['developer blog', 'tool comparisons', 'dev workflows', 'engineering guides'],
});

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <StructuredData
        data={createItemListStructuredData(
          posts.map((post) => ({ name: post.title, url: getCanonicalUrl(`/blog/${post.slug}`) }))
        )}
      />
      <PageHeader
        icon={<BookOpen className="h-6 w-6" aria-hidden="true" />}
        title="Blog"
        description="Guides, comparisons, and deep dives from our team."
        breadcrumb={[{ label: 'Blog', current: true }]}
        actions={
          <span className="text-muted-foreground bg-muted rounded-full px-3 py-1 text-sm font-medium">
            {posts.length} posts
          </span>
        }
      />

      {posts.length === 0 ? (
        <EmptyState
          icon="file"
          title="No posts yet"
          description="Articles are being written. Check back soon."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
