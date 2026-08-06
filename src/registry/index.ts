export { toolDefinitions } from './tool-definitions';

export { categoryDefinitions } from './category-definitions';

export {
  registerCategory,
  initializeCategoryRegistry,
  getCategoryBySlug,
  getCategoryOrThrow,
  categoryExists,
  assertCategoryExists,
  getAllCategories as getAllToolCategories,
  getFeaturedCategories as getFeaturedToolCategories,
  getCategorySlugs,
  getRegisteredCategoryCount,
} from './category-registry';

export {
  registerTool,
  registerTools,
  validateRegisteredTools,
  hasTool,
  getToolEntry,
  getToolDefinition,
  getToolDefinitionOrThrow,
  getToolSlugs,
  getAllToolEntries,
  getAllToolDefinitions,
  getToolsByCategory,
  getToolsByTag,
  getFeaturedTools,
  getTrendingTools,
  getRecentlyAddedTools,
  getToolCountByCategory,
  getRelatedToolsFor,
  searchTools,
} from './tool-registry';

export {
  getToolBreadcrumbItems,
  generateToolMetadata,
  generateToolStructuredData,
} from './metadata';
