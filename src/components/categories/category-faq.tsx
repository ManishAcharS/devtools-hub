import React from 'react';
import { FAQ } from '@/components/shared/faq';
import type { CategoryFAQ as CategoryFAQType } from '@/types';

interface CategoryFAQProps {
  faqs: CategoryFAQType[];
  title?: string;
  description?: string;
}

const CategoryFAQ: React.FC<CategoryFAQProps> = ({
  faqs,
  title = 'Frequently asked questions',
  description,
}) => {
  if (faqs.length === 0) return null;
  return (
    <section aria-label="Frequently asked questions" className="mt-14">
      <FAQ
        items={faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))}
        title={title}
        description={description}
        variant="separated"
        defaultOpen={0}
      />
    </section>
  );
};

CategoryFAQ.displayName = 'CategoryFAQ';

export { CategoryFAQ };
