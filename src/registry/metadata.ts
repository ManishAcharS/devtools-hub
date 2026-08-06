import type { Metadata } from 'next';
import type { BreadcrumbItem, ToolDefinition } from '@/types';
import { createToolMetadata, createToolPageStructuredData } from '@/seo';

export function getToolBreadcrumbItems(definition: ToolDefinition): BreadcrumbItem[] {
  return [
    { label: 'Tools', href: '/tools' },
    { label: definition.title, current: true },
  ];
}

export function generateToolMetadata(definition: ToolDefinition): Metadata {
  return createToolMetadata(definition);
}

export function generateToolStructuredData(definition: ToolDefinition): Record<string, unknown>[] {
  return createToolPageStructuredData(definition);
}
