'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';

interface AppErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: AppErrorProps) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="w-full max-w-md">
        <EmptyState
          icon="tools"
          title="Something went wrong"
          description="An unexpected error occurred while rendering this page. Try reloading, or go back home."
          action={
            <div className="flex items-center justify-center gap-2">
              <Button onClick={reset} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                Try again
              </Button>
              <Button asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                  Go home
                </Link>
              </Button>
            </div>
          }
        />
        {process.env.NODE_ENV === 'development' && (
          <details className="border-border bg-muted/30 mt-4 rounded-xl border p-4 text-left">
            <summary className="text-foreground flex cursor-pointer items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 text-yellow-500" aria-hidden="true" />
              Error details
            </summary>
            <pre className="text-muted-foreground mt-3 overflow-x-auto text-xs whitespace-pre-wrap">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
