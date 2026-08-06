import { LoadingSkeleton } from '@/components/shared/loading-skeleton';

export default function RootLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl space-y-4">
        <div className="bg-muted h-4 w-24 animate-pulse rounded-full" />
        <div className="bg-muted h-10 w-3/4 animate-pulse rounded-xl" />
        <div className="bg-muted h-4 w-1/2 animate-pulse rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <LoadingSkeleton variant="card" count={6} />
      </div>
    </div>
  );
}
