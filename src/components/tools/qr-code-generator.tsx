'use client';

import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import {
  QrCode,
  Download,
  Copy,
  Smartphone,
  Wifi,
  Mail,
  MapPin,
  Link2,
  Shield,
} from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import QRCode from 'qrcode';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';
import { TransformPanel } from '@/components/tools/transform-panel';

const PRESETS = [
  {
    id: 'url',
    label: 'URL',
    icon: <Link2 className="h-4 w-4" />,
    placeholder: 'https://example.com',
  },
  {
    id: 'text',
    label: 'Plain text',
    icon: <Smartphone className="h-4 w-4" />,
    placeholder: 'Any text content',
  },
  {
    id: 'email',
    label: 'Email',
    icon: <Mail className="h-4 w-4" />,
    placeholder: 'mailto:user@example.com?subject=Hello',
  },
  {
    id: 'phone',
    label: 'Phone',
    icon: <Smartphone className="h-4 w-4" />,
    placeholder: 'tel:+15551234567',
  },
  {
    id: 'sms',
    label: 'SMS',
    icon: <Smartphone className="h-4 w-4" />,
    placeholder: 'sms:+15551234567?body=Hello',
  },
  {
    id: 'wifi',
    label: 'WiFi',
    icon: <Wifi className="h-4 w-4" />,
    placeholder: 'WIFI:T:WPA;S:MyNetwork;P:password;;',
  },
  {
    id: 'vcard',
    label: 'vCard',
    icon: <Smartphone className="h-4 w-4" />,
    placeholder: 'BEGIN:VCARD\nFN:John Doe\nTEL:+15551234567\nEMAIL:john@example.com\nEND:VCARD',
  },
  {
    id: 'geo',
    label: 'Location',
    icon: <MapPin className="h-4 w-4" />,
    placeholder: 'geo:37.7749,-122.4194',
  },
] as const;

type PresetId = (typeof PRESETS)[number]['id'];

const QrCodeGenerator: React.FC<ToolComponentProps> = () => {
  const [preset, setPreset] = useState<PresetId>('url');
  const [input, setInput] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(4);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = useCallback(async () => {
    if (!input.trim()) return;
    setGenerating(true);
    try {
      const canvas = canvasRef.current ?? document.createElement('canvas');
      canvasRef.current = canvas;
      await QRCode.toCanvas(canvas, input, {
        width: size,
        margin,
        errorCorrectionLevel: errorCorrection,
        color: { dark: foreground, light: background },
      });
      const url = canvas.toDataURL('image/png');
      setDataUrl(url);
    } catch (error) {
      console.error('QR generation error:', error);
      alert(`Generation failed: ${(error as Error).message}`);
    } finally {
      setGenerating(false);
    }
  }, [input, size, margin, errorCorrection, foreground, background]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generate();
  }, [generate]);

  const presetTemplates: Record<PresetId, string> = {
    url: 'https://example.com',
    text: 'Hello, World!',
    email: 'mailto:user@example.com?subject=Hello&body=Message',
    phone: 'tel:+15551234567',
    sms: 'sms:+15551234567?body=Hello',
    wifi: 'WIFI:T:WPA;S:MyNetwork;P:password;;',
    vcard:
      'BEGIN:VCARD\nFN:John Doe\nORG:Acme Inc\nTEL:+15551234567\nEMAIL:john@example.com\nURL:https://example.com\nEND:VCARD',
    geo: 'geo:37.7749,-122.4194',
  };

  const handlePresetChange = (id: PresetId) => {
    setPreset(id);
    setInput(presetTemplates[id]);
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<QrCode className="h-6 w-6" aria-hidden="true" />}
        title="QR code generator"
        description="Create QR codes for URLs, text, WiFi, vCards, and more. Customize colors, size, and error correction."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          Content type
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePresetChange(p.id)}
              aria-pressed={preset === p.id}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                preset === p.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>
        <label className="text-muted-foreground mt-4 mb-1 block text-xs font-semibold tracking-wider uppercase">
          Content
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={PRESETS.find((p) => p.id === preset)?.placeholder}
          rows={4}
          spellCheck={false}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
              Size (px)
            </label>
            <input
              type="number"
              min={64}
              max={1024}
              step={16}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="border-border bg-background text-foreground focus-visible:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
              Margin (modules)
            </label>
            <input
              type="number"
              min={0}
              max={20}
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="border-border bg-background text-foreground focus-visible:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
              Error correction
            </label>
            <select
              value={errorCorrection}
              onChange={(e) => setErrorCorrection(e.target.value as 'L' | 'M' | 'Q' | 'H')}
              className="border-border bg-background text-foreground focus-visible:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              <option value="L">L — 7% recovery</option>
              <option value="M">M — 15% recovery</option>
              <option value="Q">Q — 25% recovery</option>
              <option value="H">H — 30% recovery</option>
            </select>
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
              Foreground
            </label>
            <input
              type="color"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border"
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
              Background
            </label>
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border"
            />
          </div>
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="mb-4 flex items-center justify-center">
          <canvas ref={canvasRef} className="bg-white" aria-label="QR code preview" />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {dataUrl && (
            <>
              <a
                href={dataUrl}
                download="qrcode.png"
                className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
              >
                <Download className="h-4 w-4" />
                Download PNG
              </a>
              <CopyButton value={dataUrl} label="Copy data URL" iconOnly={false} size="sm" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

QrCodeGenerator.displayName = 'QrCodeGenerator';

export { QrCodeGenerator };
