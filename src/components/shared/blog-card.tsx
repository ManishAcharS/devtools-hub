import React from 'react';
import Link from 'next/link';
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, className }) => {
  return (
    <article
      className={
        'hover-lift group border-border bg-card hover:border-primary/30 flex flex-col rounded-xl border p-6 ' +
        (className ?? '')
      }
    >
      <span className="bg-primary/10 text-primary inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium capitalize">
        {post.category.replace(/-/g, ' ')}
      </span>
      <h3 className="group-hover:text-primary mt-3 text-lg leading-snug font-semibold transition-colors">
        <Link
          href={`/blog/${post.slug}`}
          className="focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:outline-none"
        >
          {post.title}
        </Link>
      </h3>
      <p className="text-muted-foreground mt-2 line-clamp-2 flex-1 text-sm">{post.excerpt}</p>
      <div className="text-muted-foreground mt-4 flex items-center gap-4 text-xs">
        <span className="text-foreground font-medium">{post.author.name}</span>
        <span className="flex items-center gap-1.5" aria-label="Publish date">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          {formatDate(post.publishedAt)}
        </span>
        <span className="flex items-center gap-1.5" aria-label="Reading time">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {post.readingTime} min read
        </span>
      </div>
      <span className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium">
        Read more
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </article>
  );
};

BlogCard.displayName = 'BlogCard';

export { BlogCard };
