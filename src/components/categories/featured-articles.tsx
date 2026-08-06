import React from 'react';
import { BlogCard } from '@/components/shared/blog-card';
import type { BlogPost } from '@/types';

interface FeaturedArticlesProps {
  articles: BlogPost[];
}

const FeaturedArticles: React.FC<FeaturedArticlesProps> = ({ articles }) => {
  if (articles.length === 0) return null;
  return (
    <section aria-label="Featured articles" className="mt-14">
      <h2 className="text-2xl font-bold tracking-tight">Featured articles</h2>
      <p className="text-muted-foreground mt-2 mb-6">
        Guides and deep dives related to this category.
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
};

FeaturedArticles.displayName = 'FeaturedArticles';

export { FeaturedArticles };
