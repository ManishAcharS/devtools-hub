'use client';

import React, { useState, type ReactNode } from 'react';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
  children?: SidebarItem[];
  external?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  footer?: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
  contentClassName?: string;
  renderItem?: (item: SidebarItem) => ReactNode;
  renderLink?: (item: SidebarItem) => ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  title,
  footer,
  collapsible = false,
  defaultCollapsed = false,
  className,
  contentClassName,
  renderItem,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const defaultRenderItem = (item: SidebarItem): ReactNode => {
    if (item.children && item.children.length > 0) {
      const isExpanded = expandedGroups.has(item.label);
      return (
        <div className="mb-1">
          <button
            onClick={() => toggleGroup(item.label)}
            aria-expanded={isExpanded}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              item.active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {item.icon}
            {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
            {!collapsed &&
              (isExpanded ? (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              ))}
          </button>
          {!collapsed && isExpanded && (
            <div className="border-border mt-1 ml-4 space-y-0.5 border-l pl-3">
              {item.children.map((child) => defaultRenderItem(child))}
            </div>
          )}
        </div>
      );
    }

    return (
      <a
        href={item.href}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noopener noreferrer' : undefined}
        aria-disabled={item.disabled}
        className={cn(
          'hover-glow mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          item.disabled && 'pointer-events-none opacity-50',
          item.active
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
      >
        {item.icon}
        {!collapsed && <span className="flex-1">{item.label}</span>}
        {item.badge && !collapsed && (
          <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase">
            {item.badge}
          </span>
        )}
      </a>
    );
  };

  const content = (
    <>
      <div className="flex-1 overflow-y-auto">
        {title && !collapsed && (
          <p className="text-muted-foreground px-3 pt-3 pb-2 text-xs font-semibold tracking-wider uppercase">
            {title}
          </p>
        )}
        <nav aria-label={title || 'Sidebar navigation'} className={cn('px-2 py-2')}>
          {items.map((item) => (
            <React.Fragment key={item.label}>
              {renderItem ? renderItem(item) : defaultRenderItem(item)}
            </React.Fragment>
          ))}
        </nav>
      </div>
      {footer && !collapsed && <div className="border-border border-t p-3">{footer}</div>}
    </>
  );

  return (
    <>
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="border-border hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium"
          aria-label="Open sidebar"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
          Menu
        </button>
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
        <aside
          className={cn(
            'bg-background border-border fixed inset-y-0 left-0 z-50 w-72 border-r shadow-xl transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          aria-hidden={!mobileOpen}
        >
          <div className="border-border flex items-center justify-between border-b p-4">
            <span className="text-foreground font-semibold">{title || 'Navigation'}</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="hover:bg-muted text-muted-foreground rounded-md p-1"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="flex h-[calc(100%-57px)] flex-col">{content}</div>
        </aside>
      </div>

      <aside
        className={cn(
          'border-border bg-muted/20 hidden h-full shrink-0 border-r lg:block',
          collapsible && 'transition-all duration-300',
          collapsible && (collapsed ? 'w-16' : 'w-64'),
          !collapsible && 'w-64',
          className
        )}
      >
        {collapsible && (
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="text-muted-foreground hover:text-foreground flex w-full items-center justify-end p-3"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
        <div className={cn('flex flex-col', contentClassName)}>{content}</div>
      </aside>
    </>
  );
};

Sidebar.displayName = 'Sidebar';

export { Sidebar, type SidebarItem };
