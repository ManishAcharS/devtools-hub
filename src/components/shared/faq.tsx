'use client';

import React, { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: ReactNode;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  description?: string;
  defaultOpen?: number | null;
  allowMultiple?: boolean;
  variant?: 'default' | 'bordered' | 'separated';
  className?: string;
}

const FAQ: React.FC<FAQProps> = ({
  items,
  title,
  description,
  defaultOpen = null,
  allowMultiple = false,
  variant = 'default',
  className,
}) => {
  const [openItems, setOpenItems] = useState<Set<number>>(
    new Set(defaultOpen !== null ? [defaultOpen] : [])
  );

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(index);
      }
      return next;
    });
  };

  const containerVariants = {
    default: '',
    bordered: 'border border-border rounded-2xl divide-y divide-border',
    separated: 'space-y-4',
  };

  const itemVariants = {
    default: 'border-b border-border last:border-b-0',
    bordered: 'p-1',
    separated: 'border border-border rounded-xl overflow-hidden',
  };

  return (
    <div className={cn('w-full', className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-foreground text-2xl font-bold">{title}</h2>}
          {description && <p className="text-muted-foreground mt-2">{description}</p>}
        </div>
      )}
      <div className={containerVariants[variant]}>
        {items.map((item, index) => {
          const isOpen = openItems.has(index);
          const itemId = `faq-item-${index}`;
          return (
            <div key={itemId} className={itemVariants[variant]}>
              <h3 className="m-0">
                <button
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  aria-controls={`${itemId}-panel`}
                  className={cn(
                    'hover:bg-muted/50 flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors',
                    variant === 'bordered' && 'rounded-xl',
                    isOpen && 'bg-muted/30'
                  )}
                >
                  <span className="text-foreground text-sm font-medium sm:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'text-muted-foreground h-5 w-5 flex-shrink-0 transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              <div
                id={`${itemId}-panel`}
                role="region"
                className={cn(
                  'grid transition-all duration-200 ease-in-out',
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <div className="overflow-hidden">
                  <div className="text-muted-foreground px-5 pt-3 pb-5 text-sm leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

FAQ.displayName = 'FAQ';

export { FAQ, type FAQItem };
