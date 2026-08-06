import type { ToolDefinition, ToolPricing, ToolRegistryEntry } from '@/types';

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URL_PATTERN = /^https?:\/\/[^\s]+$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

export function isValidSlug(value: unknown): boolean {
  return typeof value === 'string' && SLUG_PATTERN.test(value) && value.length <= 64;
}

export function isValidUrl(value: unknown): boolean {
  return typeof value === 'string' && URL_PATTERN.test(value);
}

export function isValidEmail(value: unknown): boolean {
  return typeof value === 'string' && EMAIL_PATTERN.test(value);
}

export function isValidIsoDate(value: unknown): boolean {
  return (
    typeof value === 'string' && ISO_DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(value))
  );
}

export function isNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function hasMaxLength(value: unknown, max: number): boolean {
  return typeof value === 'string' && value.length <= max;
}

export function isValidPricing(value: unknown): value is ToolPricing {
  return value === 'free' || value === 'freemium' || value === 'paid' || value === 'open-source';
}

export function isUniqueStrings(values: string[]): boolean {
  return new Set(values).size === values.length;
}

function validateId(id: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!isNonEmptyString(id)) {
    issues.push({ path: 'id', message: 'must be a non-empty string' });
  } else if (id.length > 128) {
    issues.push({ path: 'id', message: 'must be at most 128 characters' });
  }
  return issues;
}

function validateStrings(
  values: string[],
  path: string,
  label: string,
  max = 64
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!Array.isArray(values) || values.length === 0) {
    issues.push({ path, message: `must contain at least one ${label}` });
    return issues;
  }
  values.forEach((value, index) => {
    if (!isNonEmptyString(value)) {
      issues.push({ path: `${path}[${index}]`, message: `${label} must be a non-empty string` });
    } else if (value.length > max) {
      issues.push({
        path: `${path}[${index}]`,
        message: `${label} must be at most ${max} characters`,
      });
    }
  });
  if (!isUniqueStrings(values)) {
    issues.push({ path, message: `must not contain duplicate ${label}s` });
  }
  return issues;
}

export function validateToolDefinition(
  definition: ToolDefinition,
  knownCategories: ReadonlySet<string> = new Set()
): ValidationResult {
  const issues: ValidationIssue[] = [
    ...validateId(definition.id),
    ...validateStrings([definition.slug], 'slug', 'slug'),
    ...validateStrings([definition.title], 'title', 'title', 128),
    ...validateStrings([definition.shortDescription], 'shortDescription', 'short description', 200),
    ...validateStrings([definition.description], 'description', 'description', 2000),
    ...validateStrings([definition.category], 'category', 'category slug'),
    ...validateStrings(definition.keywords, 'keywords', 'keyword', 40),
    ...validateStrings(definition.tags, 'tags', 'tag', 40),
    ...validateStrings(
      definition.faqs.map((faq) => faq.question),
      'faqs',
      'question'
    ),
    ...validateStrings(
      definition.faqs.map((faq) => faq.answer),
      'faqs',
      'answer',
      1000
    ),
    ...validateStrings(
      definition.examples.map((example) => example.title),
      'examples',
      'title'
    ),
  ];

  if (definition.faqs.some((faq) => faq.question.trim().length > 160)) {
    issues.push({ path: 'faqs', message: 'questions must be at most 160 characters' });
  }

  if (knownCategories.size > 0 && !knownCategories.has(definition.category)) {
    issues.push({ path: 'category', message: `unknown category "${definition.category}"` });
  }

  if (definition.website && !isValidUrl(definition.website)) {
    issues.push({ path: 'website', message: 'must be a valid URL' });
  }
  if (definition.repository && !isValidUrl(definition.repository)) {
    issues.push({ path: 'repository', message: 'must be a valid URL' });
  }
  if (!isValidPricing(definition.pricing)) {
    issues.push({
      path: 'pricing',
      message: `"${String(definition.pricing)}" is not a valid pricing model`,
    });
  }
  if (!isValidIsoDate(definition.createdAt)) {
    issues.push({ path: 'createdAt', message: 'must be an ISO-8601 date' });
  }
  if (!isValidIsoDate(definition.updatedAt)) {
    issues.push({ path: 'updatedAt', message: 'must be an ISO-8601 date' });
  }
  if (definition.rating !== undefined && (definition.rating < 0 || definition.rating > 5)) {
    issues.push({ path: 'rating', message: 'must be between 0 and 5' });
  }
  if (definition.copyValue !== undefined && !isNonEmptyString(definition.copyValue)) {
    issues.push({ path: 'copyValue', message: 'must be a non-empty string' });
  }
  if (definition.download) {
    if (!isNonEmptyString(definition.download.fileName)) {
      issues.push({ path: 'download.fileName', message: 'must be a non-empty string' });
    }
    if (definition.download.url && !isValidUrl(definition.download.url)) {
      issues.push({ path: 'download.url', message: 'must be a valid URL' });
    }
    if (!definition.download.url && !isNonEmptyString(definition.download.content)) {
      issues.push({ path: 'download.content', message: 'required when url is not provided' });
    }
  }
  if (definition.seo) {
    if (definition.seo.title !== undefined && !isNonEmptyString(definition.seo.title)) {
      issues.push({ path: 'seo.title', message: 'must be a non-empty string' });
    }
    if (definition.seo.canonical !== undefined && !isNonEmptyString(definition.seo.canonical)) {
      issues.push({ path: 'seo.canonical', message: 'must be a non-empty string' });
    }
    if (definition.seo.keywords !== undefined) {
      issues.push(...validateStrings(definition.seo.keywords, 'seo.keywords', 'keyword', 40));
    }
  }

  return { valid: issues.length === 0, issues };
}

export function validateToolRegistry(
  entries: ToolRegistryEntry[],
  knownCategories: ReadonlySet<string> = new Set()
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const seenSlugs = new Set<string>();
  const seenIds = new Set<string>();

  entries.forEach((entry, index) => {
    const prefix = `entries[${index}]`;
    const definitionIssues = validateToolDefinition(entry.definition, knownCategories).issues;
    definitionIssues.forEach((issue) =>
      issues.push({ path: `${prefix}.${issue.path}`, message: issue.message })
    );

    if (seenSlugs.has(entry.definition.slug)) {
      issues.push({ path: `${prefix}.slug`, message: `duplicate slug "${entry.definition.slug}"` });
    }
    seenSlugs.add(entry.definition.slug);

    if (seenIds.has(entry.definition.id)) {
      issues.push({ path: `${prefix}.id`, message: `duplicate id "${entry.definition.id}"` });
    }
    seenIds.add(entry.definition.id);

    entry.definition.relatedTools?.forEach((slug, relatedIndex) => {
      if (!isValidSlug(slug)) {
        issues.push({
          path: `${prefix}.relatedTools[${relatedIndex}]`,
          message: `"${slug}" is not a valid slug`,
        });
      }
    });
  });

  const allSlugs = new Set(entries.map((entry) => entry.definition.slug));
  entries.forEach((entry, index) => {
    entry.definition.relatedTools?.forEach((slug) => {
      if (slug !== entry.definition.slug && !allSlugs.has(slug)) {
        issues.push({
          path: `entries[${index}].relatedTools`,
          message: `references unknown tool "${slug}"`,
        });
      }
    });
  });

  return { valid: issues.length === 0, issues };
}

export function formatIssues(issues: ValidationIssue[]): string {
  return issues.map((issue) => `${issue.path}: ${issue.message}`).join('; ');
}
