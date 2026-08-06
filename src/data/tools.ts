import type { Tool } from '@/types';
import { getRelatedToolsFor } from '@/registry';
import { toolDefinitions } from '@/registry/tool-definitions';

export const tools: Tool[] = toolDefinitions;

export function getRelatedTools(tool: Tool, count = 3): Tool[] {
  return getRelatedToolsFor(tool, count);
}

export {
  getToolDefinition as getToolBySlug,
  getAllToolDefinitions as getAllTools,
  getToolsByCategory,
  getFeaturedTools,
  getTrendingTools,
  getRecentlyAddedTools,
  getToolCountByCategory,
} from '@/registry';
