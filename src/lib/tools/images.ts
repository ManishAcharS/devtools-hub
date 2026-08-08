export const MAX_IMAGE_BYTES = 100 * 1024 * 1024;
export const MAX_IMAGE_DIMENSION = 16384;

export type ImageOutputFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';

export const IMAGE_FORMATS: ImageOutputFormat[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];

export function formatLabel(format: ImageOutputFormat | string): string {
  switch (format) {
    case 'image/jpeg':
      return 'JPEG';
    case 'image/png':
      return 'PNG';
    case 'image/webp':
      return 'WebP';
    case 'image/avif':
      return 'AVIF';
    case 'image/gif':
      return 'GIF';
    case 'image/svg+xml':
      return 'SVG';
    case 'image/bmp':
      return 'BMP';
    default:
      return format;
  }
}

export function extensionFor(format: ImageOutputFormat): string {
  switch (format) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/avif':
      return 'avif';
  }
}

export function isSupportedImageFile(file: File): boolean {
  return (
    file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|bmp|avif|svg)$/i.test(file.name)
  );
}

export function assertImageFile(file: File): string | null {
  if (!isSupportedImageFile(file)) {
    return 'Unsupported file type. Choose a JPEG, PNG, WebP, GIF, BMP, AVIF, or SVG image.';
  }
  if (file.size === 0) {
    return 'The image file is empty.';
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Image is too large. The limit is 100 MB.';
  }
  return null;
}

export interface DecodedImage {
  image: HTMLImageElement;
  width: number;
  height: number;
  objectUrl: string;
}

export async function decodeImageFile(file: File): Promise<DecodedImage> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = 'async';
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(
          new Error(
            'The browser could not decode this image. The file may be corrupt or in an unsupported format.'
          )
        );
      image.src = objectUrl;
    });
    if (image.naturalWidth === 0 || image.naturalHeight === 0) {
      throw new Error('The image has no dimensions and cannot be processed.');
    }
    return { image, width: image.naturalWidth, height: image.naturalHeight, objectUrl };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

export function revokeDecodedImage(decoded: DecodedImage): void {
  URL.revokeObjectURL(decoded.objectUrl);
}

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageOutputFormat,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else
          reject(
            new Error(
              `Could not encode the image as ${formatLabel(format)}. Your browser may not support this format.`
            )
          );
      },
      format,
      quality
    );
  });
}

export interface ProcessedImage {
  blob: Blob;
  width: number;
  height: number;
}

export async function renderToCanvas(
  decoded: DecodedImage,
  width: number,
  height: number
): Promise<{ canvas: HTMLCanvasElement; width: number; height: number }> {
  const targetWidth = Math.min(Math.round(width), MAX_IMAGE_DIMENSION);
  const targetHeight = Math.min(Math.round(height), MAX_IMAGE_DIMENSION);
  if (targetWidth <= 0 || targetHeight <= 0) {
    throw new Error('Target dimensions must be at least 1 pixel.');
  }
  const canvas = createCanvas(targetWidth, targetHeight);
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not create a 2D canvas context.');
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(decoded.image, 0, 0, targetWidth, targetHeight);
  return { canvas, width: targetWidth, height: targetHeight };
}

export interface FitResult {
  width: number;
  height: number;
}

export function fitDimensions(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number | null,
  targetHeight: number | null,
  fit: 'fill' | 'contain' | 'cover'
): FitResult {
  if (!targetWidth && !targetHeight) {
    return { width: sourceWidth, height: sourceHeight };
  }
  const ratio = sourceWidth / sourceHeight;
  if (fit === 'fill') {
    return {
      width: Math.max(1, Math.round(targetWidth ?? targetHeight! * ratio)),
      height: Math.max(1, Math.round(targetHeight ?? targetWidth! / ratio)),
    };
  }
  let width = targetWidth ?? (targetHeight ? Math.round(targetHeight * ratio) : sourceWidth);
  let height = targetHeight ?? (targetWidth ? Math.round(targetWidth / ratio) : sourceHeight);
  if (fit === 'contain') {
    if (targetWidth !== null && width > targetWidth) {
      width = targetWidth;
      height = Math.round(width / ratio);
    }
    if (targetHeight !== null && height > targetHeight) {
      height = targetHeight;
      width = Math.round(height * ratio);
    }
  } else {
    if (targetWidth !== null && width < targetWidth) {
      width = targetWidth;
      height = Math.round(width / ratio);
    }
    if (targetHeight !== null && height < targetHeight) {
      height = targetHeight;
      width = Math.round(height * ratio);
    }
  }
  return { width: Math.max(1, width), height: Math.max(1, height) };
}

export interface ResizeOptions {
  width?: number;
  height?: number;
  fit?: 'fill' | 'contain' | 'cover';
  format?: ImageOutputFormat;
  quality?: number;
}

export async function processImageFile(
  file: File,
  options: {
    targetWidth?: number;
    targetHeight?: number;
    fit?: 'fill' | 'contain' | 'cover';
    format?: ImageOutputFormat;
    quality?: number;
    crop?: { x: number; y: number; width: number; height: number };
  }
): Promise<ProcessedImage> {
  const decoded = await decodeImageFile(file);
  try {
    const format = options.format ?? (file.type as ImageOutputFormat);
    const quality = options.quality ?? 0.85;
    let width = decoded.width;
    let height = decoded.height;
    let canvas: HTMLCanvasElement;
    if (options.crop) {
      const { x, y, width: cropWidth, height: cropHeight } = options.crop;
      if (cropWidth <= 0 || cropHeight <= 0) {
        throw new Error('Crop dimensions must be at least 1 pixel.');
      }
      if (x < 0 || y < 0 || x + cropWidth > decoded.width || y + cropHeight > decoded.height) {
        throw new Error('Crop area is outside the image bounds.');
      }
      canvas = createCanvas(cropWidth, cropHeight);
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not create a 2D canvas context.');
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(decoded.image, x, y, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      width = cropWidth;
      height = cropHeight;
    } else {
      const fitted = fitDimensions(
        decoded.width,
        decoded.height,
        options.targetWidth ?? null,
        options.targetHeight ?? null,
        options.fit ?? 'fill'
      );
      const rendered = await renderToCanvas(decoded, fitted.width, fitted.height);
      canvas = rendered.canvas;
      width = rendered.width;
      height = rendered.height;
    }
    const blob = await canvasToBlob(canvas, format, quality);
    return { blob, width, height };
  } finally {
    revokeDecodedImage(decoded);
  }
}

export interface CompressionResult extends ProcessedImage {
  originalSize: number;
  newSize: number;
  reductionPercent: number;
}

export async function compressImageFile(
  file: File,
  format: ImageOutputFormat,
  quality: number
): Promise<CompressionResult> {
  const decoded = await decodeImageFile(file);
  try {
    const rendered = await renderToCanvas(decoded, decoded.width, decoded.height);
    const blob = await canvasToBlob(rendered.canvas, format, quality);
    return {
      blob,
      width: rendered.width,
      height: rendered.height,
      originalSize: file.size,
      newSize: blob.size,
      reductionPercent:
        file.size === 0 ? 0 : Math.round(((file.size - blob.size) / file.size) * 100),
    };
  } finally {
    revokeDecodedImage(decoded);
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.readAsDataURL(file);
  });
}

export function dataUrlToBlob(dataUrl: string): Blob | null {
  const match = /^data:([^;,]+)?(;base64)?,([\s\S]*)$/.exec(dataUrl.trim());
  if (!match) return null;
  const mimeType = match[1] || 'text/plain';
  const isBase64 = match[2] === ';base64';
  const data = match[3] ?? '';
  try {
    if (isBase64) {
      const binary = atob(data.replace(/\s+/g, ''));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new Blob([bytes], { type: mimeType });
    }
    return new Blob([decodeURIComponent(data)], { type: mimeType });
  } catch {
    return null;
  }
}

export function detectImageFormat(buffer: Uint8Array): string {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'JPEG';
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'PNG';
  }
  if (buffer.length >= 6) {
    const ascii = String.fromCharCode(...buffer.slice(0, 6));
    if (ascii === 'GIF87a' || ascii === 'GIF89a') return 'GIF';
  }
  if (buffer.length >= 12) {
    const riff = String.fromCharCode(...buffer.slice(0, 4));
    const webp = String.fromCharCode(...buffer.slice(8, 12));
    if (riff === 'RIFF' && webp === 'WEBP') return 'WebP';
  }
  if (buffer.length >= 2 && buffer[0] === 0x42 && buffer[1] === 0x4d) {
    return 'BMP';
  }
  if (buffer.length >= 12) {
    const ftyp = String.fromCharCode(...buffer.slice(4, 8));
    const major = String.fromCharCode(...buffer.slice(8, 12));
    if (ftyp === 'ftyp' && (major.includes('avif') || major.includes('avis'))) return 'AVIF';
  }
  if (buffer.length >= 4) {
    const ascii = String.fromCharCode(...buffer.slice(0, 4))
      .trim()
      .toLowerCase();
    if (ascii === '<svg' || ascii === '<?xm') return 'SVG';
  }
  return 'Unknown';
}

export function readImageHeader(file: File): Promise<Uint8Array> {
  return file
    .slice(0, 4096)
    .arrayBuffer()
    .then((buffer) => new Uint8Array(buffer));
}

export function parseSvgDimensions(text: string): { width: number; height: number } | null {
  const widthMatch = /(?:<svg[^>]*\swidth=["'])([\d.]+)(?:px)?(["'])/i.exec(text);
  const heightMatch = /(?:<svg[^>]*\sheight=["'])([\d.]+)(?:px)?(["'])/i.exec(text);
  const viewBoxMatch = /viewBox=["']([\d.\s-]+)["']/i.exec(text);
  if (widthMatch && heightMatch) {
    return { width: Number(widthMatch[1]), height: Number(heightMatch[1]) };
  }
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].trim().split(/\s+/).map(Number);
    if (parts.length === 4 && parts.every(Number.isFinite)) {
      return { width: parts[2], height: parts[3] };
    }
  }
  return null;
}

export interface PngTextChunk {
  key: string;
  value: string;
}

export interface ImageMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  format: string;
  width: number;
  height: number;
  depth?: number;
  colorType?: string;
  interlace?: boolean;
  dpi?: { x: number; y: number };
  animation?: boolean;
  textChunks?: PngTextChunk[];
  creationTime?: string;
  exif?: Record<string, string>;
  gps?: { latitude: number; longitude: number } | null;
  orientation?: number;
}

const EXIF_TAGS: Record<number, string> = {
  0x010f: 'Make',
  0x0110: 'Model',
  0x0112: 'Orientation',
  0x011a: 'XResolution',
  0x011b: 'YResolution',
  0x0128: 'ResolutionUnit',
  0x0131: 'Software',
  0x0132: 'DateTime',
  0x013b: 'Artist',
  0x013e: 'WhitePoint',
  0x8298: 'Copyright',
  0x829a: 'ExposureTime',
  0x829d: 'FNumber',
  0x8827: 'ISOSpeedRatings',
  0x9003: 'DateTimeOriginal',
  0x9004: 'DateTimeDigitized',
  0x920a: 'FocalLength',
  0xa002: 'PixelXDimension',
  0xa003: 'PixelYDimension',
};

const PNG_COLOR_TYPES: Record<number, string> = {
  0: 'Grayscale',
  2: 'RGB',
  3: 'Indexed color',
  4: 'Grayscale + alpha',
  6: 'RGBA',
};

function readUint16(view: DataView, offset: number, littleEndian: boolean): number {
  return view.getUint16(offset, littleEndian);
}

function readUint32(view: DataView, offset: number, littleEndian: boolean): number {
  return view.getUint32(offset, littleEndian);
}

function formatRational(view: DataView, offset: number, littleEndian: boolean): string {
  const numerator = readUint32(view, offset, littleEndian);
  const denominator = readUint32(view, offset + 4, littleEndian);
  if (denominator === 0) return String(numerator);
  return (numerator / denominator).toFixed(numerator % denominator === 0 ? 0 : 2);
}

function parseExif(buffer: Uint8Array): {
  exif: Record<string, string>;
  gps: { latitude: number; longitude: number } | null;
} {
  const exif: Record<string, string> = {};
  let gps: { latitude: number; longitude: number } | null = null;
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  if (buffer.length < 8) return { exif, gps };
  const littleEndian = buffer[0] === 0x49 && buffer[1] === 0x49;
  if (!littleEndian && !(buffer[0] === 0x4d && buffer[1] === 0x4d)) return { exif, gps };
  const magic = readUint16(view, 2, littleEndian);
  if (magic !== 0x2a) return { exif, gps };
  const ifd0Offset = readUint32(view, 4, littleEndian);
  if (ifd0Offset + 2 > buffer.length) return { exif, gps };

  const readIfd = (offset: number, depth: number): number | null => {
    if (offset + 2 > buffer.length || depth > 3) return null;
    const count = readUint16(view, offset, littleEndian);
    let gpsIfdOffset: number | null = null;
    for (let i = 0; i < count; i += 1) {
      const entryOffset = offset + 2 + i * 12;
      if (entryOffset + 12 > buffer.length) break;
      const tag = readUint16(view, entryOffset, littleEndian);
      const type = readUint16(view, entryOffset + 2, littleEndian);
      const valueCount = readUint32(view, entryOffset + 4, littleEndian);
      const name = EXIF_TAGS[tag];
      if (tag === 0x8825) {
        gpsIfdOffset = readUint32(view, entryOffset + 8, littleEndian);
        continue;
      }
      if (!name) continue;
      const sizePer =
        type === 1 || type === 7 ? 1 : type === 3 ? 2 : type === 4 || type === 9 ? 4 : 8;
      const valueBytes = sizePer * valueCount;
      let value: string;
      if (type === 2) {
        const start =
          valueBytes > 4 ? readUint32(view, entryOffset + 8, littleEndian) : entryOffset + 8;
        let end = start;
        while (end < buffer.length && buffer[end] !== 0) end += 1;
        value = new TextDecoder('latin1').decode(buffer.slice(start, end)).trim();
      } else if (type === 5) {
        const start =
          valueBytes > 4 ? readUint32(view, entryOffset + 8, littleEndian) : entryOffset + 8;
        value = formatRational(view, start, littleEndian);
      } else if (type === 3) {
        value =
          valueBytes > 4
            ? String(readUint32(view, entryOffset + 8, littleEndian))
            : String(readUint16(view, entryOffset + 8, littleEndian));
      } else if (type === 4) {
        value =
          valueBytes > 4
            ? String(readUint32(view, entryOffset + 8, littleEndian))
            : String(readUint32(view, entryOffset + 8, littleEndian));
      } else if (type === 1) {
        value = String(buffer[entryOffset + 8]);
      } else {
        continue;
      }
      if (value.length > 0) exif[name] = value;
    }
    if (gpsIfdOffset !== null) {
      const gpsCount = readUint16(view, gpsIfdOffset, littleEndian);
      let latRef: 'N' | 'S' | null = null;
      let lonRef: 'E' | 'W' | null = null;
      let latValues: number[] = [];
      let lonValues: number[] = [];
      for (let i = 0; i < gpsCount; i += 1) {
        const entryOffset = gpsIfdOffset + 2 + i * 12;
        if (entryOffset + 12 > buffer.length) break;
        const tag = readUint16(view, entryOffset, littleEndian);
        const type = readUint16(view, entryOffset + 2, littleEndian);
        const start = entryOffset + 8;
        if (tag === 1 && type === 2) {
          latRef = buffer[start] === 0x4e ? 'N' : buffer[start] === 0x53 ? 'S' : null;
        } else if (tag === 3 && type === 2) {
          lonRef = buffer[start] === 0x45 ? 'E' : buffer[start] === 0x57 ? 'W' : null;
        } else if (tag === 2 && type === 5) {
          latValues = [0, 1, 2].map((index) =>
            Number(formatRational(view, start + index * 8, littleEndian))
          );
        } else if (tag === 4 && type === 5) {
          lonValues = [0, 1, 2].map((index) =>
            Number(formatRational(view, start + index * 8, littleEndian))
          );
        }
      }
      if (latValues.length === 3 && lonValues.length === 3 && latRef && lonRef) {
        const latitude = latValues[0] + latValues[1] / 60 + latValues[2] / 3600;
        const longitude = lonValues[0] + lonValues[1] / 60 + lonValues[2] / 3600;
        gps = {
          latitude: latRef === 'S' ? -latitude : latitude,
          longitude: lonRef === 'W' ? -longitude : longitude,
        };
      }
    }
    const nextOffset = offset + 2 + count * 12;
    if (nextOffset + 4 <= buffer.length && depth < 3) {
      const next = readUint32(view, nextOffset, littleEndian);
      if (next > 0 && next < buffer.length) readIfd(next, depth + 1);
    }
    return gpsIfdOffset;
  };

  readIfd(ifd0Offset, 0);
  return { exif, gps };
}

export async function readImageMetadata(file: File): Promise<ImageMetadata> {
  const header = await readImageHeader(file);
  const format = detectImageFormat(header);
  const metadata: ImageMetadata = {
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || 'unknown',
    format,
    width: 0,
    height: 0,
  };

  if (format === 'PNG') {
    if (header.length >= 33) {
      const view = new DataView(header.buffer, header.byteOffset, header.byteLength);
      metadata.width = readUint32(view, 16, false);
      metadata.height = readUint32(view, 20, false);
      metadata.depth = header[24];
      metadata.colorType = PNG_COLOR_TYPES[header[25]] ?? `Type ${header[25]}`;
      metadata.interlace = header[28] === 1;
    }
  } else if (format === 'GIF') {
    if (header.length >= 10) {
      const view = new DataView(header.buffer, header.byteOffset, header.byteLength);
      metadata.width = readUint16(view, 6, true);
      metadata.height = readUint16(view, 8, true);
    }
    metadata.animation = String.fromCharCode(...header.slice(0, 6)) === 'GIF89a';
  } else if (format === 'JPEG') {
    let offset = 2;
    const segments = header.length;
    while (offset + 4 <= segments) {
      if (header[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = header[offset + 1];
      if (marker === 0xd9 || marker === 0xda) break;
      const length = readUint16(
        new DataView(header.buffer, header.byteOffset, header.byteLength),
        offset + 2,
        false
      );
      if (length < 2 || offset + 2 + length > segments) break;
      const segmentData = header.slice(offset + 4, offset + 2 + length);
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc
      ) {
        const view = new DataView(
          segmentData.buffer,
          segmentData.byteOffset,
          segmentData.byteLength
        );
        metadata.depth = view.getUint8(0);
        metadata.height = view.getUint16(1, false);
        metadata.width = view.getUint16(3, false);
      } else if (marker === 0xe1 && segmentData.length >= 6) {
        const exifMarker = String.fromCharCode(...segmentData.slice(0, 6));
        if (exifMarker === 'Exif\x00\x00') {
          const parsed = parseExif(segmentData.slice(6));
          if (Object.keys(parsed.exif).length > 0) metadata.exif = parsed.exif;
          if (parsed.gps) metadata.gps = parsed.gps;
          const orientation = parsed.exif['Orientation'];
          if (orientation) metadata.orientation = Number(orientation);
        }
      } else if (marker === 0xe0 && segmentData.length >= 5) {
        const jfif = String.fromCharCode(...segmentData.slice(0, 5));
        if (jfif === 'JFIF\x00' && segmentData.length >= 12) {
          const view = new DataView(
            segmentData.buffer,
            segmentData.byteOffset,
            segmentData.byteLength
          );
          const units = view.getUint8(9);
          const xDensity = view.getUint16(10, false);
          const yDensity = view.getUint16(12, false);
          if (units === 1 && xDensity > 0 && yDensity > 0) {
            metadata.dpi = { x: xDensity, y: yDensity };
          }
        }
      }
      offset += 2 + length;
    }
  } else if (format === 'WebP') {
    if (header.length >= 30 && String.fromCharCode(...header.slice(12, 16)) === 'VP8X') {
      const view = new DataView(header.buffer, header.byteOffset, header.byteLength);
      metadata.width = 1 + readUint24(view, 24);
      metadata.height = 1 + readUint24(view, 27);
      metadata.animation = (header[20] & 0x02) === 0x02;
    } else if (header.length >= 30 && String.fromCharCode(...header.slice(12, 16)) === 'VP8L') {
      const bytes = header.slice(21, 25);
      const b1 = bytes[0];
      const b2 = bytes[1];
      const b3 = bytes[2];
      const b4 = bytes[3];
      metadata.width = 1 + (((b2 & 0x3f) << 8) | b1);
      metadata.height = 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6));
    } else if (header.length >= 24) {
      const view = new DataView(header.buffer, header.byteOffset, header.byteLength);
      metadata.width = view.getUint16(26, true);
      metadata.height = view.getUint16(28, true);
    }
  } else if (format === 'BMP') {
    if (header.length >= 26) {
      const view = new DataView(header.buffer, header.byteOffset, header.byteLength);
      const headerSize = view.getUint32(14, true);
      if (headerSize >= 40) {
        metadata.width = view.getInt32(18, true);
        metadata.height = Math.abs(view.getInt32(22, true));
        metadata.depth = view.getUint16(28, true);
      }
    }
  } else if (format === 'SVG') {
    const text = new TextDecoder().decode(header);
    const dimensions = parseSvgDimensions(text);
    if (dimensions) {
      metadata.width = dimensions.width;
      metadata.height = dimensions.height;
    }
  }

  if (format === 'PNG' && file.size > 8) {
    const textChunks: PngTextChunk[] = [];
    const fullSize = Math.min(file.size, 2 * 1024 * 1024);
    const buffer = new Uint8Array(await file.slice(0, fullSize).arrayBuffer());
    let offset = 8;
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    while (offset + 8 <= buffer.length) {
      const length = view.getUint32(offset, false);
      const type = String.fromCharCode(...buffer.slice(offset + 4, offset + 8));
      if (length < 0 || offset + 8 + length > buffer.length) break;
      const dataStart = offset + 8;
      const data = buffer.slice(dataStart, dataStart + length);
      if (type === 'tEXt') {
        const nullIndex = data.indexOf(0);
        if (nullIndex > -1) {
          textChunks.push({
            key: new TextDecoder('latin1').decode(data.slice(0, nullIndex)),
            value: new TextDecoder('latin1').decode(data.slice(nullIndex + 1)),
          });
        }
      } else if (type === 'iTXt') {
        const parts = data.indexOf(0);
        if (parts > -1) {
          const key = new TextDecoder('latin1').decode(data.slice(0, parts));
          const rest = data.slice(parts + 1);
          const langEnd = rest.indexOf(0);
          if (langEnd > -1) {
            const translatedEnd = rest.indexOf(0, langEnd + 1);
            if (translatedEnd > -1) {
              const value = new TextDecoder('utf-8').decode(rest.slice(translatedEnd + 1));
              textChunks.push({ key, value });
            }
          }
        }
      } else if (type === 'tIME') {
        if (data.length >= 7) {
          const year = view.getUint16(dataStart, false);
          const month = data[2];
          const day = data[3];
          const hour = data[4];
          const minute = data[5];
          const second = data[6];
          metadata.creationTime = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
        }
      } else if (type === 'pHYs') {
        if (data.length >= 9) {
          const xPixels = view.getUint32(dataStart, false);
          const yPixels = view.getUint32(dataStart + 4, false);
          const unit = data[8];
          if (unit === 1 && xPixels > 0 && yPixels > 0) {
            metadata.dpi = {
              x: Math.round(xPixels * 0.0254 * 100) / 100,
              y: Math.round(yPixels * 0.0254 * 100) / 100,
            };
          }
        }
      } else if (type === 'acTL') {
        metadata.animation = true;
      }
      offset += 8 + length;
    }
    if (textChunks.length > 0) metadata.textChunks = textChunks;
  }

  if (metadata.width === 0 && metadata.height === 0 && format !== 'Unknown') {
    try {
      const decoded = await decodeImageFile(file);
      metadata.width = decoded.width;
      metadata.height = decoded.height;
      revokeDecodedImage(decoded);
    } catch {
      metadata.width = -1;
      metadata.height = -1;
    }
  }

  return metadata;
}

function readUint24(view: DataView, offset: number): number {
  return (
    view.getUint8(offset) | (view.getUint8(offset + 1) << 8) | (view.getUint8(offset + 2) << 16)
  );
}
