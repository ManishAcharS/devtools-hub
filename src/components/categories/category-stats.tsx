import React from 'react';
import { Archive, FileText as FileTextIcon, Sparkles } from 'lucide-react';
import type { CategoryStats as CategoryStatsData } from '@/registry';

interface CategoryStatsProps {
  stats: CategoryStatsData;
}

const CategoryStats: React.FC<CategoryStatsProps> = ({ stats }) => {
  const items = [
    { label: 'tools', value: stats.toolCount, icon: Archive },
    { label: 'featured', value: stats.featuredToolCount, icon: Sparkles },
    { label: 'articles', value: stats.articleCount, icon: FileTextIcon },
  ];

  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Category statistics">
      {items.map(({ label, value, icon: Icon }) => (
        <li
          key={label}
          className="text-muted-foreground bg-muted/60 flex items-center gap-1.5 rounded-full px-3 py-1 text-sm"
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-foreground font-semibold tabular-nums">{value}</span>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
};

CategoryStats.displayName = 'CategoryStats';

export { CategoryStats };
