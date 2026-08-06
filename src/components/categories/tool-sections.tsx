import React from 'react';
import { ToolGridSection } from '@/components/categories/category-tool-grid';
import type { Tool } from '@/types';

interface FeaturedToolsProps {
  tools: Tool[];
}

const FeaturedTools: React.FC<FeaturedToolsProps> = ({ tools }) => (
  <ToolGridSection
    title="Featured tools"
    description="Hand-picked tools we recommend in this category."
    tools={tools}
  />
);

FeaturedTools.displayName = 'FeaturedTools';

interface PopularToolsProps {
  tools: Tool[];
}

const PopularTools: React.FC<PopularToolsProps> = ({ tools }) => (
  <ToolGridSection
    title="Popular tools"
    description="The most highly rated tools developers choose in this category."
    tools={tools}
  />
);

PopularTools.displayName = 'PopularTools';

interface RecentlyAddedToolsProps {
  tools: Tool[];
}

const RecentlyAddedTools: React.FC<RecentlyAddedToolsProps> = ({ tools }) => (
  <ToolGridSection
    title="Recently added"
    description="The newest additions to this category."
    tools={tools}
  />
);

RecentlyAddedTools.displayName = 'RecentlyAddedTools';

export { FeaturedTools, PopularTools, RecentlyAddedTools };
