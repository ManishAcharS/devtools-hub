import React from 'react';
import { BookOpen } from 'lucide-react';
import { BlogCard } from '@/components/shared/blog-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { getFeaturedPosts } from '@/data';
import type { BlogPost } from '@/types';

interface LatestArticlesSectionProps {
  posts?: BlogPost[];
  title?: string;
  description?: string;
}

const LatestArticlesSection: React.FC<LatestArticlesSectionProps> = ({
  posts = getFeaturedPosts(3),
  title = 'From the Blog',
  description = 'Guides, comparisons, and deep dives from our team.',
}) => {
  return (
    <section className="border-border bg-muted/30 border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          title={title}
          description={description}
          icon={<BookOpen className="h-6 w-6" aria-hidden="true" />}
          actionLabel="All posts"
          actionHref="/blog"
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

LatestArticlesSection.displayName = 'LatestArticlesSection';

export { LatestArticlesSection };
