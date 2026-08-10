import { SearchX } from 'lucide-react';
import { ComingSoon } from '@/components/shared/coming-soon';

export default function NotFound() {
  return (
    <ComingSoon
      variant="not-found"
      badge="404 · Page not found"
      icon={<SearchX className="h-9 w-9" aria-hidden="true" />}
      description="The page you are looking for doesn't exist or has been moved. Check the URL or search for the tool you need."
    />
  );
}
