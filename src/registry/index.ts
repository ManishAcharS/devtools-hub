export { toolDefinitions } from './tool-definitions';

export { categoryDefinitions, dynamicCategoryDefinitions } from './category-definitions';

export {
  getAllCategoryDefinitions,
  getCategoryDefinitionBySlug,
  getCategoryDefinitionOrThrow,
  getAllCategorySlugs,
  isDynamicCategory,
  getCategoryToolCounts,
  getCategoryTools,
  getCategoryFeaturedTools,
  getCategoryPopularTools,
  getCategoryRecentlyAddedTools,
  getRelatedCategoryDefinitions,
  getCategoryFeaturedArticles,
  getCategoryFaqs,
  getCategoryStats,
  toCategoryView,
  type CategoryStats,
} from './category-engine';

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
