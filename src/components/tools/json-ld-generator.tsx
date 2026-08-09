'use client';

import React, { useMemo, useState } from 'react';
import { Tags } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';
import { SectionHeading } from '@/components/shared/section-heading';

type SchemaType =
  | 'Article'
  | 'Product'
  | 'FAQPage'
  | 'BreadcrumbList'
  | 'Organization'
  | 'WebSite'
  | 'LocalBusiness';

interface FieldDef {
  key: string;
  label: string;
  placeholder?: string;
  kind: 'text' | 'url' | 'textarea' | 'list' | 'number' | 'select';
  options?: string[];
}

const SCHEMA_TYPES: { value: SchemaType; label: string }[] = [
  { value: 'Article', label: 'Article' },
  { value: 'Product', label: 'Product' },
  { value: 'FAQPage', label: 'FAQ page' },
  { value: 'BreadcrumbList', label: 'Breadcrumbs' },
  { value: 'Organization', label: 'Organization' },
  { value: 'WebSite', label: 'WebSite' },
  { value: 'LocalBusiness', label: 'Local business' },
];

const FIELDS: Record<SchemaType, FieldDef[]> = {
  Article: [
    { key: 'headline', label: 'Headline', kind: 'text', placeholder: 'The article title' },
    { key: 'description', label: 'Description', kind: 'textarea', placeholder: 'Short summary' },
    { key: 'author', label: 'Author', kind: 'text', placeholder: 'Ada Lovelace' },
    { key: 'datePublished', label: 'Published date', kind: 'text', placeholder: '2026-01-02' },
    { key: 'dateModified', label: 'Modified date', kind: 'text', placeholder: '2026-01-09' },
    { key: 'image', label: 'Image URL', kind: 'url', placeholder: 'https://example.com/cover.jpg' },
    { key: 'url', label: 'Article URL', kind: 'url', placeholder: 'https://example.com/article' },
  ],
  Product: [
    { key: 'name', label: 'Name', kind: 'text', placeholder: 'Hammer' },
    {
      key: 'description',
      label: 'Description',
      kind: 'textarea',
      placeholder: 'Product description',
    },
    { key: 'brand', label: 'Brand', kind: 'text', placeholder: 'Acme Tools' },
    { key: 'sku', label: 'SKU', kind: 'text', placeholder: 'HAM-123' },
    { key: 'price', label: 'Price', kind: 'number', placeholder: '19.99' },
    { key: 'priceCurrency', label: 'Currency', kind: 'text', placeholder: 'USD' },
    {
      key: 'availability',
      label: 'Availability',
      kind: 'select',
      options: ['InStock', 'OutOfStock', 'PreOrder'],
    },
    {
      key: 'image',
      label: 'Image URL',
      kind: 'url',
      placeholder: 'https://example.com/hammer.jpg',
    },
  ],
  FAQPage: [
    { key: 'question1', label: 'Question 1', kind: 'text', placeholder: 'What is it?' },
    { key: 'answer1', label: 'Answer 1', kind: 'textarea', placeholder: 'The answer' },
    { key: 'question2', label: 'Question 2', kind: 'text', placeholder: 'Who is it for?' },
    { key: 'answer2', label: 'Answer 2', kind: 'textarea', placeholder: 'The answer' },
    { key: 'question3', label: 'Question 3', kind: 'text', placeholder: 'How does it work?' },
    { key: 'answer3', label: 'Answer 3', kind: 'textarea', placeholder: 'The answer' },
  ],
  BreadcrumbList: [
    { key: 'item1Name', label: 'Item 1 name', kind: 'text', placeholder: 'Home' },
    { key: 'item1Url', label: 'Item 1 URL', kind: 'url', placeholder: 'https://example.com/' },
    { key: 'item2Name', label: 'Item 2 name', kind: 'text', placeholder: 'Products' },
    {
      key: 'item2Url',
      label: 'Item 2 URL',
      kind: 'url',
      placeholder: 'https://example.com/products',
    },
    { key: 'item3Name', label: 'Item 3 name', kind: 'text', placeholder: 'Hammer' },
    {
      key: 'item3Url',
      label: 'Item 3 URL',
      kind: 'url',
      placeholder: 'https://example.com/products/hammer',
    },
  ],
  Organization: [
    { key: 'name', label: 'Name', kind: 'text', placeholder: 'Acme Corp' },
    { key: 'url', label: 'Website URL', kind: 'url', placeholder: 'https://example.com' },
    { key: 'logo', label: 'Logo URL', kind: 'url', placeholder: 'https://example.com/logo.png' },
    {
      key: 'description',
      label: 'Description',
      kind: 'textarea',
      placeholder: 'What the org does',
    },
    { key: 'email', label: 'Email', kind: 'text', placeholder: 'hello@example.com' },
    {
      key: 'sameAs',
      label: 'Social profiles (comma separated)',
      kind: 'list',
      placeholder: 'https://x.com/acme, https://github.com/acme',
    },
  ],
  WebSite: [
    { key: 'name', label: 'Name', kind: 'text', placeholder: 'DevTools Hub' },
    { key: 'url', label: 'Website URL', kind: 'url', placeholder: 'https://example.com' },
    { key: 'description', label: 'Description', kind: 'textarea', placeholder: 'Site description' },
    {
      key: 'searchUrlTemplate',
      label: 'Search URL template',
      kind: 'text',
      placeholder: 'https://example.com/search?q={search_term_string}',
    },
  ],
  LocalBusiness: [
    { key: 'name', label: 'Name', kind: 'text', placeholder: 'Acme Bakery' },
    { key: 'url', label: 'Website URL', kind: 'url', placeholder: 'https://example.com' },
    {
      key: 'description',
      label: 'Description',
      kind: 'textarea',
      placeholder: 'Business description',
    },
    { key: 'streetAddress', label: 'Street address', kind: 'text', placeholder: '1 Main Street' },
    { key: 'addressLocality', label: 'City', kind: 'text', placeholder: 'London' },
    { key: 'postalCode', label: 'Postal code', kind: 'text', placeholder: 'SW1A 1AA' },
    { key: 'phone', label: 'Phone', kind: 'text', placeholder: '+44 20 7946 0000' },
    { key: 'openingHours', label: 'Opening hours', kind: 'text', placeholder: 'Mo-Fr 09:00-17:00' },
  ],
};

function buildJsonLd(type: SchemaType, values: Record<string, string>): Record<string, unknown> {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  switch (type) {
    case 'Article': {
      if (values.headline) base.headline = values.headline;
      if (values.description) base.description = values.description;
      if (values.author) base.author = { '@type': 'Person', name: values.author };
      if (values.datePublished) base.datePublished = values.datePublished;
      if (values.dateModified) base.dateModified = values.dateModified;
      if (values.image) base.image = values.image;
      if (values.url) base.url = values.url;
      break;
    }
    case 'Product': {
      if (values.name) base.name = values.name;
      if (values.description) base.description = values.description;
      if (values.brand) base.brand = { '@type': 'Brand', name: values.brand };
      if (values.sku) base.sku = values.sku;
      if (values.price || values.priceCurrency) {
        const offer: Record<string, unknown> = { '@type': 'Offer' };
        if (values.price) offer.price = Number(values.price);
        if (values.priceCurrency) offer.priceCurrency = values.priceCurrency;
        if (values.availability) offer.availability = `https://schema.org/${values.availability}`;
        base.offers = offer;
      }
      if (values.image) base.image = values.image;
      break;
    }
    case 'FAQPage': {
      const questions: Record<string, unknown>[] = [];
      for (let i = 1; i <= 3; i += 1) {
        const question = values[`question${i}`];
        const answer = values[`answer${i}`];
        if (question || answer) {
          questions.push({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
          });
        }
      }
      if (questions.length > 0) base.mainEntity = questions;
      break;
    }
    case 'BreadcrumbList': {
      const items: Record<string, unknown>[] = [];
      for (let i = 1; i <= 3; i += 1) {
        const name = values[`item${i}Name`];
        const url = values[`item${i}Url`];
        if (name) {
          const item: Record<string, unknown> = { '@type': 'ListItem', position: i, name };
          if (url) item.item = url;
          items.push(item);
        }
      }
      if (items.length > 0) base.itemListElement = items;
      break;
    }
    case 'Organization': {
      if (values.name) base.name = values.name;
      if (values.url) base.url = values.url;
      if (values.logo) base.logo = { '@type': 'ImageObject', url: values.logo };
      if (values.description) base.description = values.description;
      if (values.email) base.email = values.email;
      if (values.sameAs) {
        base.sameAs = values.sameAs
          .split(',')
          .map((entry) => entry.trim())
          .filter((entry) => entry.length > 0);
      }
      break;
    }
    case 'WebSite': {
      if (values.name) base.name = values.name;
      if (values.url) base.url = values.url;
      if (values.description) base.description = values.description;
      if (values.searchUrlTemplate) {
        base.potentialAction = {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: values.searchUrlTemplate,
          },
          'query-input': 'required name=search_term_string',
        };
      }
      break;
    }
    case 'LocalBusiness': {
      if (values.name) base.name = values.name;
      if (values.url) base.url = values.url;
      if (values.description) base.description = values.description;
      if (values.streetAddress || values.addressLocality || values.postalCode) {
        base.address = {
          '@type': 'PostalAddress',
          streetAddress: values.streetAddress,
          addressLocality: values.addressLocality,
          postalCode: values.postalCode,
        };
      }
      if (values.phone) base.telephone = values.phone;
      if (values.openingHours) base.openingHours = values.openingHours;
      break;
    }
  }

  return base;
}

const JsonLdGenerator: React.FC<ToolComponentProps> = () => {
  const [schemaType, setSchemaType] = useState<SchemaType>('Article');
  const [values, setValues] = useState<Record<string, string>>({});

  const fields = FIELDS[schemaType];

  const output = useMemo(() => {
    const object = buildJsonLd(schemaType, values);
    const json = JSON.stringify(object, null, 2);
    return `<script type="application/ld+json">\n${json}\n</script>`;
  }, [schemaType, values]);

  const setValue = (key: string, value: string): void => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Tags className="h-6 w-6" aria-hidden="true" />}
        title="JSON-LD generator"
        description="Build schema.org structured data markup for articles, products, FAQs, breadcrumbs, organizations, websites, and local businesses."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="jsonld-type"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Schema type
        </label>
        <select
          id="jsonld-type"
          value={schemaType}
          onChange={(event) => {
            setSchemaType(event.target.value as SchemaType);
            setValues({});
          }}
          className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none sm:w-64"
        >
          {SCHEMA_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.key}
              className={field.kind === 'textarea' ? 'sm:col-span-2' : undefined}
            >
              <label
                htmlFor={`jsonld-${field.key}`}
                className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
              >
                {field.label}
              </label>
              {field.kind === 'textarea' ? (
                <textarea
                  id={`jsonld-${field.key}`}
                  value={values[field.key] ?? ''}
                  onChange={(event) => setValue(field.key, event.target.value)}
                  placeholder={field.placeholder}
                  rows={2}
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
                />
              ) : field.kind === 'select' ? (
                <select
                  id={`jsonld-${field.key}`}
                  value={values[field.key] ?? ''}
                  onChange={(event) => setValue(field.key, event.target.value)}
                  className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
                >
                  <option value="">Select…</option>
                  {(field.options ?? []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`jsonld-${field.key}`}
                  type={field.kind === 'number' ? 'number' : 'text'}
                  value={values[field.key] ?? ''}
                  onChange={(event) => setValue(field.key, event.target.value)}
                  placeholder={field.placeholder}
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Structured data markup
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton value={output} size="sm" />
            <DownloadButton
              content={output}
              fileName="structured-data.html"
              contentType="text/html;charset=utf-8"
              label="Download"
              size="sm"
            />
          </div>
        </div>
        <pre className="bg-muted text-foreground mt-2 max-h-96 overflow-auto rounded-lg px-4 py-3 font-mono text-sm break-all whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </div>
  );
};

JsonLdGenerator.displayName = 'JsonLdGenerator';

export { JsonLdGenerator };
