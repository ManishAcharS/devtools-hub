'use client';

import React, { useMemo, useState } from 'react';
import { Accessibility, Search } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { ARIA_ATTRIBUTES, ARIA_ROLES } from '@/lib/tools/aria-data';
import { SectionHeading } from '@/components/shared/section-heading';

const AriaReference: React.FC<ToolComponentProps> = () => {
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();

  const filteredRoles = useMemo(() => {
    if (!q) return ARIA_ROLES;
    return ARIA_ROLES.filter(
      (role) =>
        role.name.toLowerCase().includes(q) ||
        role.description.toLowerCase().includes(q) ||
        (role.notes ?? '').toLowerCase().includes(q) ||
        (role.requiredAttrs ?? []).some((attr) => attr.toLowerCase().includes(q))
    );
  }, [q]);

  const filteredAttributes = useMemo(() => {
    if (!q) return ARIA_ATTRIBUTES;
    return ARIA_ATTRIBUTES.filter(
      (attr) =>
        attr.name.toLowerCase().includes(q) ||
        attr.type.toLowerCase().includes(q) ||
        attr.description.toLowerCase().includes(q)
    );
  }, [q]);

  const noResults = filteredRoles.length === 0 && filteredAttributes.length === 0;

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Accessibility className="h-6 w-6" aria-hidden="true" />}
        title="ARIA reference"
        description="A searchable reference for ARIA roles, states, and properties — names, types, descriptions, and practical notes."
      />

      <div className="relative">
        <Search
          className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search roles, states, and properties…"
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary w-full rounded-lg border py-3 pr-4 pl-10 text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>

      {noResults && (
        <p className="border-border bg-card text-muted-foreground rounded-xl border p-8 text-center text-sm italic">
          No roles or attributes match &quot;{query}&quot;.
        </p>
      )}

      {filteredRoles.length > 0 && (
        <div className="border-border bg-card overflow-hidden rounded-xl border">
          <div className="border-border flex items-center justify-between border-b px-5 py-4">
            <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Roles
            </h3>
            <span className="text-muted-foreground text-xs">
              {filteredRoles.length} of {ARIA_ROLES.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs tracking-wider uppercase">
                <tr>
                  <th className="px-5 py-2.5 font-semibold">Role</th>
                  <th className="px-5 py-2.5 font-semibold">Description</th>
                  <th className="px-5 py-2.5 font-semibold">Required states</th>
                  <th className="px-5 py-2.5 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="border-border divide-border divide-y">
                {filteredRoles.map((role) => (
                  <tr key={role.name}>
                    <td className="text-primary px-5 py-3 font-mono font-medium whitespace-nowrap">
                      {role.name}
                    </td>
                    <td className="text-muted-foreground px-5 py-3">{role.description}</td>
                    <td className="px-5 py-3">
                      {role.requiredAttrs && role.requiredAttrs.length > 0 ? (
                        <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                          {role.requiredAttrs.join(', ')}
                        </code>
                      ) : (
                        <span className="text-muted-foreground italic">—</span>
                      )}
                    </td>
                    <td className="text-muted-foreground px-5 py-3">{role.notes ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredAttributes.length > 0 && (
        <div className="border-border bg-card overflow-hidden rounded-xl border">
          <div className="border-border flex items-center justify-between border-b px-5 py-4">
            <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              States &amp; properties
            </h3>
            <span className="text-muted-foreground text-xs">
              {filteredAttributes.length} of {ARIA_ATTRIBUTES.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs tracking-wider uppercase">
                <tr>
                  <th className="px-5 py-2.5 font-semibold">Attribute</th>
                  <th className="px-5 py-2.5 font-semibold">Type</th>
                  <th className="px-5 py-2.5 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="border-border divide-border divide-y">
                {filteredAttributes.map((attr) => (
                  <tr key={attr.name}>
                    <td className="text-primary px-5 py-3 font-mono font-medium whitespace-nowrap">
                      {attr.name}
                    </td>
                    <td className="text-muted-foreground px-5 py-3 text-xs">{attr.type}</td>
                    <td className="text-muted-foreground px-5 py-3">{attr.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

AriaReference.displayName = 'AriaReference';

export { AriaReference };
