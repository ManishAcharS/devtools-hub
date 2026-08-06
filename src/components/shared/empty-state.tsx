import React, { type ReactNode } from 'react';
import { SearchX, FolderX, Wrench, FileX, Inbox, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: 'search' | 'tools' | 'folder' | 'file' | 'inbox' | LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const defaultIcons: Record<string, LucideIcon> = {
  search: SearchX,
  tools: Wrench,
  folder: FolderX,
  file: FileX,
  inbox: Inbox,
};

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  action,
  actionLabel,
  onAction,
  size = 'md',
  className,
}) => {
  const Icon = typeof icon === 'string' ? defaultIcons[icon] || Inbox : icon;

  const sizeClasses = {
    sm: {
      container: 'p-6',
      icon: 'h-8 w-8',
      iconContainer: 'w-12 h-12 rounded-xl',
      title: 'text-base',
      description: 'text-sm',
    },
    md: {
      container: 'p-10',
      icon: 'h-10 w-10',
      iconContainer: 'w-16 h-16 rounded-2xl',
      title: 'text-xl',
      description: 'text-sm',
    },
    lg: {
      container: 'p-14',
      icon: 'h-12 w-12',
      iconContainer: 'w-20 h-20 rounded-2xl',
      title: 'text-2xl',
      description: 'text-base',
    },
  };

  const s = sizeClasses[size];

  return (
    <div
      className={cn(
        'border-border bg-muted/30 flex flex-col items-center justify-center rounded-2xl border border-dashed text-center',
        s.container,
        className
      )}
      role="status"
    >
      <div
        className={cn(
          'bg-primary/10 text-primary mb-4 flex items-center justify-center',
          s.iconContainer
        )}
      >
        <Icon className={s.icon} aria-hidden="true" />
      </div>
      <h3 className={cn('text-foreground mb-1 font-semibold', s.title)}>{title}</h3>
      {description && (
        <p className={cn('text-muted-foreground mx-auto mb-5 max-w-sm', s.description)}>
          {description}
        </p>
      )}
      {(action || (actionLabel && onAction)) && (
        <div className="mt-1">
          {action ? (
            action
          ) : (
            <Button onClick={onAction} variant="outline">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';

export { EmptyState };
