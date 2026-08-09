'use client';

import React, { useMemo, useState } from 'react';
import { Hash, Shield, Key, Copy, Download, Eye, EyeOff, RefreshCw } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import * as bcrypt from 'bcryptjs';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

const BCRYPT_COST_MIN = 4;
const BCRYPT_COST_MAX = 31;

const BcryptGenerator: React.FC<ToolComponentProps> = () => {
  const [password, setPassword] = useState('');
  const [cost, setCost] = useState(10);
  const [visible, setVisible] = useState(false);
  const [hash, setHash] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [checkHash, setCheckHash] = useState('');
  const [checkResult, setCheckResult] = useState<{ match: boolean; time: number } | null>(null);
  const [generating, setGenerating] = useState(false);

  const generateHash = async () => {
    if (!password) return;
    setGenerating(true);
    try {
      const result = await bcrypt.hash(password, cost);
      setHash(result);
    } catch (error) {
      alert(`Hash generation failed: ${(error as Error).message}`);
    } finally {
      setGenerating(false);
    }
  };

  const verifyPassword = async () => {
    if (!checkPassword || !checkHash) return;
    const start = performance.now();
    try {
      const match = await bcrypt.compare(checkPassword, checkHash);
      setCheckResult({ match, time: performance.now() - start });
    } catch (error) {
      setCheckResult({ match: false, time: performance.now() - start });
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Shield className="h-6 w-6" aria-hidden="true" />}
        title="Bcrypt hash generator & checker"
        description="Generate secure bcrypt password hashes and verify passwords against existing hashes."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
          Generate hash
        </p>
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[200px] flex-1">
            <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
              Password
            </label>
            <div className="relative">
              <input
                type={visible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to hash"
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary w-full rounded-lg border px-4 py-3 pr-12 text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
              <button
                type="button"
                onClick={() => setVisible((prev) => !prev)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
              Cost factor
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={BCRYPT_COST_MIN}
                max={BCRYPT_COST_MAX}
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="max-w-xs flex-1"
              />
              <span className="w-10 text-right font-mono text-sm">{cost}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={generateHash}
            disabled={!password || generating}
            className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium disabled:opacity-50"
          >
            {generating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Hash className="h-4 w-4" />
            )}
            Generate
          </button>
        </div>
      </div>

      {hash && (
        <TransformPanel
          inputId="bcrypt-hash-output"
          inputValue=""
          onInputChange={() => {}}
          outputValue={hash}
          outputLabel="Bcrypt hash"
          fileName="bcrypt-hash.txt"
          toolbar={
            <>
              <CopyButton value={hash} iconOnly size="sm" />
              <DownloadButton
                content={hash}
                fileName="bcrypt-hash.txt"
                contentType="text/plain;charset=utf-8"
                label="Download"
                size="sm"
              />
            </>
          }
        />
      )}

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
          Verify password
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
              Password
            </label>
            <input
              type="password"
              value={checkPassword}
              onChange={(e) => setCheckPassword(e.target.value)}
              placeholder="Enter password to check"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
              Hash
            </label>
            <input
              type="password"
              value={checkHash}
              onChange={(e) => setCheckHash(e.target.value)}
              placeholder="Paste bcrypt hash"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={verifyPassword}
          disabled={!checkPassword || !checkHash}
          className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          <Key className="h-4 w-4" />
          Verify
        </button>
        {checkResult && (
          <div
            className={`mt-4 rounded-lg p-3 ${checkResult.match ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-red-500/30 bg-red-500/10'} border`}
          >
            <p
              className={
                checkResult.match
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }
              font-medium
            >
              {checkResult.match ? '✓ Password matches the hash' : '✗ Password does not match'}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Verified in {checkResult.time.toFixed(2)} ms
            </p>
          </div>
        )}
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          About bcrypt
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
          <li>Bcrypt is a slow, adaptive hashing algorithm designed for password storage.</li>
          <li>
            Cost factor (4–31) controls computational difficulty — higher = slower = more secure.
          </li>
          <li>Default cost 10 is a good balance for most applications in 2024.</li>
          <li>
            Each hash includes a unique salt, so identical passwords produce different hashes.
          </li>
          <li>Never store plain-text passwords. Always hash before saving to a database.</li>
        </ul>
      </div>
    </div>
  );
};

BcryptGenerator.displayName = 'BcryptGenerator';

export { BcryptGenerator };
