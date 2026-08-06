'use client';

import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme, type ThemePreference } from '@/hooks/use-theme';

interface ThemeToggleProps {
  variant?: 'icon' | 'segmented' | 'dropdown';
  size?: 'sm' | 'md';
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'icon', size = 'md', className }) => {
  const { themePreference, setThemePreference, toggleTheme } = useTheme();

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  if (variant === 'segmented') {
    const options: Array<{ value: ThemePreference; label: string; icon: React.ReactNode }> = [
      { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" aria-hidden="true" /> },
      { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" aria-hidden="true" /> },
      {
        value: 'system',
        label: 'System',
        icon: <Monitor className="h-4 w-4" aria-hidden="true" />,
      },
    ];

    return (
      <div
        role="radiogroup"
        aria-label="Color scheme"
        className={cn(
          'border-border bg-muted inline-flex items-center gap-1 rounded-lg border p-1',
          className
        )}
      >
        {options.map((option) => (
          <button
            key={option.value}
            role="radio"
            aria-checked={themePreference === option.value}
            onClick={() => setThemePreference(option.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              themePreference === option.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {option.icon}
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={cn('relative', className)}>
        <button
          onClick={toggleTheme}
          className="border-border hover:bg-muted inline-flex items-center justify-center rounded-lg border p-2 transition-colors"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          <span className="sr-only">Toggle theme</span>
          <Sun className={cn(iconSize, 'hidden dark:block')} aria-hidden="true" />
          <Moon className={cn(iconSize, 'dark:hidden')} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring inline-flex items-center justify-center rounded-lg p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className
      )}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <Sun className={cn(iconSize, 'hidden dark:block')} aria-hidden="true" />
      <Moon className={cn(iconSize, 'dark:hidden')} aria-hidden="true" />
    </button>
  );
};

ThemeToggle.displayName = 'ThemeToggle';

export { ThemeToggle };
