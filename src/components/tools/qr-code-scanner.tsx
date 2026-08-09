'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, Image, QrCode, Copy, Download, X, RotateCcw, Loader2 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import jsQR from 'jsqr';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';
import { FileDropzone } from '@/components/tools/file-dropzone';

const QrCodeScanner: React.FC<ToolComponentProps> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const animationRef = useRef<number | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setScanning(true);
      scanLoop();
    } catch (err) {
      setError('Camera access denied or not available. Try uploading an image instead.');
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setScanning(false);
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    if (scanning) {
      stopCamera();
      setTimeout(startCamera, 100);
    }
  };

  const scanLoop = () => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
        if (code) {
          setResult(code.data);
          stopCamera();
          return;
        }
      }
    }
    animationRef.current = requestAnimationFrame(scanLoop);
  };

  const handleImageUpload = async (files: File[]) => {
    if (!files[0]) return;
    setError(null);
    const img = document.createElement('img');
    img.src = URL.createObjectURL(files[0]);
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    const canvas = canvasRef.current ?? document.createElement('canvas');
    canvasRef.current = canvas;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth',
      });
      if (code) {
        setResult(code.data);
      } else {
        setError('No QR code found in the image.');
      }
    }
    URL.revokeObjectURL(img.src);
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<QrCode className="h-6 w-6" aria-hidden="true" />}
        title="QR code scanner"
        description="Scan QR codes using your camera or upload an image file."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="mb-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={scanning ? stopCamera : startCamera}
            disabled={!!stream && !scanning}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium ${
              scanning
                ? 'border-red-500 bg-red-500/10 text-red-600 hover:bg-red-500/20'
                : 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {scanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Stop camera
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" />
                Start camera
              </>
            )}
          </button>
          {scanning && (
            <button
              type="button"
              onClick={switchCamera}
              className="border-border bg-background hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
            >
              <RotateCcw className="h-4 w-4" />
              Switch camera
            </button>
          )}
        </div>

        {stream && scanning && (
          <div className="relative mx-auto mb-4 aspect-video max-w-full">
            <video
              ref={videoRef}
              className="h-full w-full rounded-lg object-cover"
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="border-primary/50 h-48 w-48 rounded-lg border-2" />
            </div>
          </div>
        )}

        <div className="border-border rounded-lg p-4">
          <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
            Or upload an image
          </p>
          <FileDropzone onFiles={handleImageUpload} accept="image/*" maxFiles={1} />
        </div>

        {error && (
          <p className="mt-3 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <X className="h-4 w-4" />
            {error}
          </p>
        )}
      </div>

      {result && (
        <div className="border-border bg-card rounded-xl border p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Result
            </p>
            <button
              type="button"
              onClick={clearResult}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-muted mb-4 rounded-lg p-4 font-mono text-sm break-all whitespace-pre-wrap">
            {result}
          </div>
          <div className="flex flex-wrap gap-3">
            <CopyButton value={result} label="Copy" iconOnly={false} size="sm" />
            {/^https?:\/\//.test(result) && (
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
              >
                <Camera className="h-4 w-4" />
                Open link
              </a>
            )}
            <DownloadButton
              content={result}
              fileName="qr-result.txt"
              contentType="text/plain;charset=utf-8"
              label="Download"
              size="sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

QrCodeScanner.displayName = 'QrCodeScanner';

export { QrCodeScanner };
