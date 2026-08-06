import Link from 'next/link';
import { Search, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-primary text-sm font-semibold tracking-wider uppercase">404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Page not found
        </h1>
        <p className="text-muted-foreground mt-4 text-lg text-pretty">
          The page you are looking for doesn&apos;t exist or has been moved. Check the URL or search
          for the tool you need.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/tools">
              <Wrench className="mr-2 h-4 w-4" aria-hidden="true" />
              Browse all tools
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" aria-hidden="true" />
              Search
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
