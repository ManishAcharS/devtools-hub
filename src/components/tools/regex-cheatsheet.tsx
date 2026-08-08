'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { REGEX_FLAGS } from '@/lib/tools/regex-tools';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

interface CheatRow {
  pattern: string;
  description: string;
  example?: string;
}

interface CheatSection {
  title: string;
  rows: CheatRow[];
}

const sections: CheatSection[] = [
  {
    title: 'Anchors and boundaries',
    rows: [
      {
        pattern: '^',
        description: 'Start of the string (or line with the m flag).',
        example: '^Hello',
      },
      {
        pattern: '$',
        description: 'End of the string (or line with the m flag).',
        example: 'world$',
      },
      {
        pattern: '\\b',
        description: 'Word boundary.',
        example: '\\bcat\\b matches "cat" but not "concatenate"',
      },
      {
        pattern: '\\B',
        description: 'Not a word boundary.',
        example: '\\Bcat matches "concatenate"',
      },
    ],
  },
  {
    title: 'Character classes',
    rows: [
      { pattern: '[abc]', description: 'Any one of the characters a, b or c.' },
      { pattern: '[^abc]', description: 'Any character that is not a, b or c.' },
      { pattern: '[a-z]', description: 'Any lowercase letter.' },
      { pattern: '[0-9]', description: 'Any digit.' },
      {
        pattern: '.',
        description: 'Any character except line terminators.',
        example: 'a.c matches "abc"',
      },
      { pattern: '\\d', description: 'Any digit, shorthand for [0-9].' },
      { pattern: '\\D', description: 'Any character that is not a digit.' },
      { pattern: '\\w', description: 'Word character: letters, digits and underscore.' },
      { pattern: '\\W', description: 'Any character that is not a word character.' },
      { pattern: '\\s', description: 'Whitespace: space, tab, newline and carriage return.' },
      { pattern: '\\S', description: 'Any character that is not whitespace.' },
    ],
  },
  {
    title: 'Quantifiers',
    rows: [
      { pattern: 'a*', description: 'Zero or more of the preceding element.' },
      { pattern: 'a+', description: 'One or more of the preceding element.' },
      { pattern: 'a?', description: 'Zero or one of the preceding element.' },
      { pattern: 'a{3}', description: 'Exactly three of the preceding element.' },
      { pattern: 'a{2,5}', description: 'Between two and five of the preceding element.' },
      { pattern: 'a{2,}', description: 'Two or more of the preceding element.' },
      {
        pattern: 'a+?',
        description: 'Lazy: matches as few as possible.',
        example: 'a+? in "aaa" matches just "a"',
      },
    ],
  },
  {
    title: 'Groups and alternation',
    rows: [
      { pattern: '(abc)', description: 'Capturing group; result is captured for reference.' },
      { pattern: '(?:abc)', description: 'Non-capturing group; groups without capturing.' },
      {
        pattern: '(?<name>abc)',
        description: 'Named capturing group.',
        example: '/(?<year>\\d{4})-\\d{2}/',
      },
      { pattern: 'a|b', description: 'Alternation: matches a or b.', example: 'cat|dog' },
      { pattern: '\\1', description: 'Backreference to the first capturing group.' },
    ],
  },
  {
    title: 'Escape sequences',
    rows: [
      { pattern: '\\\\', description: 'A literal backslash.' },
      { pattern: '\\.', description: 'A literal dot (escaped meta character).' },
      { pattern: '\\n', description: 'Newline character.' },
      { pattern: '\\t', description: 'Tab character.' },
      { pattern: '\\r', description: 'Carriage return character.' },
      { pattern: '\\0', description: 'Null character.' },
      { pattern: '\\x41', description: 'Character by hexadecimal code point ("A").' },
      { pattern: '\\u{1F600}', description: 'Unicode code point (with the u flag).' },
    ],
  },
  {
    title: 'Common patterns',
    rows: [
      { pattern: '\\b\\w+@\\w+\\.\\w+\\b', description: 'A simple email address.' },
      { pattern: '\\b\\d{1,3}(\\.\\d{1,3}){3}\\b', description: 'An IPv4 address.' },
      { pattern: '#[0-9a-fA-F]{6}', description: 'A hex color code like #ff00aa.' },
      { pattern: '\\d{4}-\\d{2}-\\d{2}', description: 'An ISO date like 2026-08-08.' },
      { pattern: '<[^>]+>', description: 'HTML tags (as raw text).' },
      {
        pattern: '\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b',
        description: 'A credit-card-style number.',
      },
    ],
  },
];

const RegexCheatsheet: React.FC<ToolComponentProps> = () => (
  <div className="space-y-6">
    <SectionHeading
      icon={<BookOpen className="h-6 w-6" aria-hidden="true" />}
      title="Regular expression cheatsheet"
      description="A quick reference for anchors, character classes, quantifiers, and groups — copy any pattern straight into your expression."
    />

    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="border-border bg-card rounded-xl border">
          <h2 className="text-foreground border-border border-b px-5 py-3 text-sm font-semibold">
            {section.title}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-left text-sm">
              <tbody>
                {section.rows.map((row) => (
                  <tr key={row.pattern} className="border-border border-b last:border-b-0">
                    <td className="w-px px-4 py-2.5 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <code className="border-border bg-muted text-foreground rounded-md border px-2 py-1 font-mono text-xs">
                          {row.pattern}
                        </code>
                        <CopyButton value={row.pattern} label="Copy pattern" size="sm" iconOnly />
                      </div>
                    </td>
                    <td className="text-muted-foreground px-4 py-2.5">{row.description}</td>
                    <td className="text-muted-foreground hidden px-4 py-2.5 font-mono text-xs lg:table-cell">
                      {row.example ?? ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>

    <div className="border-border bg-card rounded-xl border p-5">
      <h2 className="text-foreground text-sm font-semibold">Flags</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {REGEX_FLAGS.map((flag) => (
          <div key={flag.value} className="bg-muted flex items-start gap-3 rounded-lg p-3">
            <code className="bg-background text-foreground border-border rounded-md border px-2 py-1 font-mono text-sm">
              {flag.value}
            </code>
            <div>
              <p className="text-foreground text-sm font-medium">{flag.label}</p>
              <p className="text-muted-foreground text-xs">{flag.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

RegexCheatsheet.displayName = 'RegexCheatsheet';

export { RegexCheatsheet };
