'use client';

import React, { useMemo, useState } from 'react';
import { Key, Copy, Download, Shield, AlertTriangle } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const base64ToPem = (base64: string, type: 'PUBLIC KEY' | 'PRIVATE KEY'): string => {
  const lines = base64.match(/.{1,64}/g) ?? [];
  return `-----BEGIN ${type}-----\n${lines.join('\n')}\n-----END ${type}-----\n`;
};

const pemToBase64 = (pem: string): string => {
  return pem
    .replace(/-----BEGIN [A-Z ]+-----/, '')
    .replace(/-----END [A-Z ]+-----/, '')
    .replace(/\s/g, '');
};

const KeypairGenerator: React.FC<ToolComponentProps> = () => {
  const [algorithm, setAlgorithm] = useState<'RSA' | 'ECDSA'>('RSA');
  const [rsaSize, setRsaSize] = useState(2048);
  const [ecdsaCurve, setEcdsaCurve] = useState<'P-256' | 'P-384' | 'P-521'>('P-256');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setGenerating(true);
    setError(null);
    try {
      let keyPair: CryptoKeyPair;
      if (algorithm === 'RSA') {
        keyPair = await crypto.subtle.generateKey(
          {
            name: 'RSASSA-PKCS1-v1_5',
            modulusLength: rsaSize,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: 'SHA-256',
          },
          true,
          ['sign', 'verify']
        );
      } else {
        keyPair = await crypto.subtle.generateKey(
          {
            name: 'ECDSA',
            namedCurve: ecdsaCurve,
          },
          true,
          ['sign', 'verify']
        );
      }

      const publicKeySpki = await crypto.subtle.exportKey('spki', keyPair.publicKey);
      const privateKeyPkcs8 = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

      setPublicKey(base64ToPem(arrayBufferToBase64(publicKeySpki), 'PUBLIC KEY'));
      setPrivateKey(base64ToPem(arrayBufferToBase64(privateKeyPkcs8), 'PRIVATE KEY'));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  const output = useMemo(() => {
    if (!publicKey || !privateKey) return '';
    return `=== PUBLIC KEY ===\n${publicKey}\n=== PRIVATE KEY ===\n${privateKey}`;
  }, [publicKey, privateKey]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Key className="h-6 w-6" aria-hidden="true" />}
        title="Key pair generator"
        description="Generate RSA or ECDSA key pairs using Web Crypto API. Keys are exported in PEM format."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
          Algorithm
        </p>
        <div className="flex flex-wrap gap-3">
          {(['RSA', 'ECDSA'] as const).map((alg) => (
            <button
              key={alg}
              type="button"
              onClick={() => setAlgorithm(alg)}
              aria-pressed={algorithm === alg}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                algorithm === alg
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              {alg}
            </button>
          ))}
        </div>

        {algorithm === 'RSA' && (
          <div className="mt-4">
            <label className="text-muted-foreground mb-2 block text-xs font-semibold tracking-wider uppercase">
              Key size
            </label>
            <div className="flex items-center gap-4">
              {[2048, 3072, 4096].map((size) => (
                <label key={size} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="rsa-size"
                    value={String(size)}
                    checked={rsaSize === size}
                    onChange={() => setRsaSize(size)}
                    className="accent-primary h-4 w-4"
                  />
                  {size} bits
                </label>
              ))}
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              2048 bits is standard. 3072+ recommended for long-term security.
            </p>
          </div>
        )}

        {algorithm === 'ECDSA' && (
          <div className="mt-4">
            <label className="text-muted-foreground mb-2 block text-xs font-semibold tracking-wider uppercase">
              Curve
            </label>
            <div className="flex items-center gap-4">
              {(['P-256', 'P-384', 'P-521'] as const).map((curve) => (
                <label key={curve} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="ecdsa-curve"
                    value={curve}
                    checked={ecdsaCurve === curve}
                    onChange={() => setEcdsaCurve(curve)}
                    className="accent-primary h-4 w-4"
                  />
                  {curve}
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={generate}
          disabled={generating}
          className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium disabled:opacity-50"
        >
          {generating ? 'Generating…' : 'Generate key pair'}
        </button>

        {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>

      {publicKey && privateKey && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <TransformPanel
              inputId="public-key-output"
              inputValue=""
              onInputChange={() => {}}
              outputValue={publicKey}
              outputLabel="Public Key (PEM)"
              fileName="public-key.pem"
              toolbar={
                <>
                  <CopyButton value={publicKey} iconOnly size="sm" />
                  <DownloadButton
                    content={publicKey}
                    fileName="public-key.pem"
                    contentType="application/x-pem-file;charset=utf-8"
                    label="Download"
                    size="sm"
                  />
                </>
              }
            />
            <TransformPanel
              inputId="private-key-output"
              inputValue=""
              onInputChange={() => {}}
              outputValue={privateKey}
              outputLabel="Private Key (PEM)"
              fileName="private-key.pem"
              toolbar={
                <>
                  <CopyButton value={privateKey} iconOnly size="sm" />
                  <DownloadButton
                    content={privateKey}
                    fileName="private-key.pem"
                    contentType="application/x-pem-file;charset=utf-8"
                    label="Download"
                    size="sm"
                  />
                </>
              }
            />
          </div>

          <div className="border-border bg-card rounded-xl border p-5">
            <p className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
              <Shield className="h-4 w-4" />
              Security notes
            </p>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>
                Private keys never leave your browser — generation happens entirely client-side.
              </li>
              <li>Store private keys securely. Anyone with the private key can sign/decrypt.</li>
              <li>RSA 2048 is adequate for most uses; 4096 for high-security requirements.</li>
              <li>ECDSA P-256 provides equivalent security to RSA 3072 with smaller keys.</li>
              <li>For production, consider hardware security modules (HSMs) or cloud KMS.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

KeypairGenerator.displayName = 'KeypairGenerator';

export { KeypairGenerator };
