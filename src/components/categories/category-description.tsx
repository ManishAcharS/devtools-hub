import React from 'react';

interface CategoryDescriptionProps {
  longDescription: string;
}

const CategoryDescription: React.FC<CategoryDescriptionProps> = ({ longDescription }) => {
  return (
    <section aria-label="Category description" className="mb-10">
      <div className="border-border bg-card rounded-xl border p-6">
        <p className="text-muted-foreground leading-relaxed text-pretty">{longDescription}</p>
      </div>
    </section>
  );
};

CategoryDescription.displayName = 'CategoryDescription';

export { CategoryDescription };
