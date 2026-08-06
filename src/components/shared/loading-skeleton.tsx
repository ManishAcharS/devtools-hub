import React, { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => (
  <div
    className={cn('bg-muted animate-pulse rounded-md', className)}
    aria-hidden="true"
    {...props}
  />
);

Skeleton.displayName = 'Skeleton';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'tool' | 'category' | 'hero' | 'sidebar' | 'article' | 'table';
  count?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 3,
  className,
}) => {
  const renderCard = (key: number) => (
    <div key={key} className="border-border flex flex-col gap-4 rounded-xl border p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );

  const renderList = (key: number) => (
    <div key={key} className="border-border flex items-center gap-4 rounded-xl border p-4">
      <Skeleton className="h-11 w-11 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
  );

  const renderHero = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto max-w-2xl space-y-3">
        <Skeleton className="mx-auto h-4 w-24 rounded-full" />
        <Skeleton className="mx-auto h-12 w-3/4" />
        <Skeleton className="mx-auto h-4 w-1/2" />
      </div>
      <Skeleton className="mx-auto h-12 w-full max-w-lg rounded-xl" />
      <div className="flex justify-center gap-3">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full rounded-lg" />
      ))}
    </div>
  );

  const renderArticle = () => (
    <div className="space-y-4">
      <Skeleton className="h-10 w-2/3" />
      <div className="flex gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-1/6" />
        </div>
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="border-border overflow-hidden rounded-xl border">
      <div className="bg-muted/40 border-border flex items-center gap-4 border-b p-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/6" />
        <Skeleton className="h-4 w-1/6" />
        <Skeleton className="ml-auto h-4 w-1/4" />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-border flex items-center gap-4 border-b p-4 last:border-0">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="ml-auto h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );

  const renderers: Record<string, (key: number) => React.ReactNode> = {
    card: renderCard,
    list: renderList,
    tool: renderCard,
    category: renderCard,
    hero: renderHero,
    sidebar: renderSidebar,
    article: renderArticle,
    table: renderTable,
  };

  const render = renderers[variant];

  return (
    <div
      className={cn('space-y-4', className)}
      role="status"
      aria-label={`Loading ${variant} content`}
    >
      {variant === 'hero'
        ? render(0)
        : variant === 'sidebar' || variant === 'article' || variant === 'table'
          ? render(0)
          : Array.from({ length: count }).map((_, i) => render(i))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

LoadingSkeleton.displayName = 'LoadingSkeleton';

export { LoadingSkeleton, Skeleton };
