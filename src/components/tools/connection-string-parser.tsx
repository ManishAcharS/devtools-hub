'use client';

import React, { useMemo, useState } from 'react';
import { Plug, Eye, EyeOff } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { buildConnectionString, parseConnectionString } from '@/lib/tools/db-strings';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

const SCHEMES = ['postgres', 'mysql', 'mongodb', 'redis'];

const ParserField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">{label}</p>
    <p className="bg-muted text-foreground mt-1 truncate rounded-md px-3 py-2 font-mono text-sm">
      {value || '—'}
    </p>
  </div>
);

ParserField.displayName = 'ParserField';

const ConnectionStringParser: React.FC<ToolComponentProps> = () => {
  const [mode, setMode] = useState<'parse' | 'build'>('parse');
  const [input, setInput] = useState('postgres://user:secret@localhost:5432/appdb?sslmode=require');
  const [redact, setRedact] = useState(false);
  const [form, setForm] = useState({
    scheme: 'postgres',
    username: 'user',
    password: 'secret',
    host: 'localhost',
    port: '5432',
    database: 'appdb',
  });

  const parsed = useMemo(() => parseConnectionString(input), [input]);

  const built = useMemo(() => buildConnectionString(form), [form]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const inputClasses =
    'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Plug className="h-6 w-6" aria-hidden="true" />}
        title="Connection string parser / builder"
        description="Parse database connection strings for PostgreSQL, MySQL, MongoDB, and Redis into their components — or build one from a form. Passwords can be redacted for safe sharing."
      />
      <div className="flex flex-wrap items-center gap-2">
        {(['parse', 'build'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setMode(option)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
              mode === option
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border hover:bg-muted'
            )}
            aria-pressed={mode === option}
          >
            {option === 'parse' ? 'Parse' : 'Build'}
          </button>
        ))}
      </div>

      {mode === 'parse' ? (
        <>
          <div className="border-border bg-card rounded-xl border p-5">
            <label
              htmlFor="conn-input"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Connection string
            </label>
            <textarea
              id="conn-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="postgres://user:password@host:5432/dbname"
              spellCheck={false}
              rows={4}
              className={cn(inputClasses, 'font-mono')}
            />
            <p className="text-muted-foreground mt-3 text-xs">
              Supports postgres, mysql, mongodb, and redis schemes.
            </p>
          </div>

          <div className="border-border bg-card rounded-xl border p-5">
            {parsed.error ? (
              <p className="text-sm text-red-600 dark:text-red-400">{parsed.error}</p>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Parsed fields
                  </p>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={redact}
                      onChange={(event) => setRedact(event.target.checked)}
                      className="accent-primary h-4 w-4"
                    />
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                    Redact password
                  </label>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <ParserField label="Scheme" value={parsed.scheme} />
                  <ParserField label="Host" value={parsed.host} />
                  <ParserField label="Port" value={parsed.port} />
                  <ParserField label="Database" value={parsed.database} />
                  <ParserField label="Username" value={parsed.username} />
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Password
                      </p>
                      {parsed.password && (
                        <button
                          type="button"
                          onClick={() => setRedact((prev) => !prev)}
                          className="text-muted-foreground hover:text-foreground"
                          aria-label={redact ? 'Show password' : 'Hide password'}
                        >
                          {redact ? (
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                        </button>
                      )}
                    </div>
                    <p className="bg-muted text-foreground mt-1 truncate rounded-md px-3 py-2 font-mono text-sm">
                      {parsed.password ? (redact ? '••••••••' : parsed.password) : '—'}
                    </p>
                  </div>
                </div>
                {Object.keys(parsed.params).length > 0 && (
                  <div className="mt-4">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Query parameters
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(parsed.params).map(([key, value]) => (
                        <span
                          key={key}
                          className="bg-muted text-foreground rounded-md px-2 py-1 font-mono text-xs"
                        >
                          {key}={value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <CopyButton value={input} size="sm" />
                  <DownloadButton
                    content={input}
                    fileName="connection-string.txt"
                    label="Download"
                    size="sm"
                  />
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="border-border bg-card rounded-xl border p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label
                  htmlFor="build-scheme"
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Scheme
                </label>
                <select
                  id="build-scheme"
                  value={form.scheme}
                  onChange={(event) => updateField('scheme', event.target.value)}
                  className={inputClasses}
                >
                  {SCHEMES.map((scheme) => (
                    <option key={scheme} value={scheme}>
                      {scheme}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="build-host"
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Host
                </label>
                <input
                  id="build-host"
                  type="text"
                  value={form.host}
                  onChange={(event) => updateField('host', event.target.value)}
                  placeholder="localhost"
                  spellCheck={false}
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor="build-port"
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Port
                </label>
                <input
                  id="build-port"
                  type="text"
                  value={form.port}
                  onChange={(event) => updateField('port', event.target.value)}
                  placeholder="5432"
                  spellCheck={false}
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor="build-username"
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Username
                </label>
                <input
                  id="build-username"
                  type="text"
                  value={form.username}
                  onChange={(event) => updateField('username', event.target.value)}
                  spellCheck={false}
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor="build-password"
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Password
                </label>
                <input
                  id="build-password"
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  spellCheck={false}
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor="build-database"
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Database
                </label>
                <input
                  id="build-database"
                  type="text"
                  value={form.database}
                  onChange={(event) => updateField('database', event.target.value)}
                  spellCheck={false}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          <div className="border-border bg-card rounded-xl border p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Generated string
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <CopyButton value={built} iconOnly size="sm" />
                <DownloadButton
                  content={built}
                  fileName="connection-string.txt"
                  label="Download"
                  size="sm"
                />
              </div>
            </div>
            <pre className="bg-muted text-foreground mt-2 max-h-40 overflow-auto rounded-lg px-4 py-3 font-mono text-sm break-all whitespace-pre-wrap">
              {built}
            </pre>
          </div>
        </>
      )}
    </div>
  );
};

ConnectionStringParser.displayName = 'ConnectionStringParser';

export { ConnectionStringParser };
