export const MAX_PDF_BYTES = 100 * 1024 * 1024;
export const MAX_PDF_PAGES = 2000;

export type PdfProgressHandler = (progress: {
  loaded: number;
  total: number;
  percent: number;
}) => void;

export function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

export function assertPdfFile(file: File): string | null {
  if (!isPdfFile(file)) {
    return 'Unsupported file type. Choose a PDF document.';
  }
  if (file.size === 0) {
    return 'The PDF file is empty.';
  }
  if (file.size > MAX_PDF_BYTES) {
    return 'PDF is too large. The limit is 100 MB.';
  }
  return null;
}

type PdfJsModule = typeof import('pdfjs-dist');
import type { PDFDocumentProxy } from 'pdfjs-dist';
export { downloadBlob } from './files';

let pdfjsPromise: Promise<PdfJsModule> | null = null;

export function loadPdfjs(): Promise<PdfJsModule> {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist').then((module) => {
      if (typeof window !== 'undefined') {
        module.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();
      }
      return module;
    });
  }
  return pdfjsPromise;
}

export async function readPdfBytes(
  file: File,
  onProgress?: PdfProgressHandler
): Promise<ArrayBuffer> {
  const chunks: Uint8Array[] = [];
  let bytesRead = 0;
  const chunkSize = 4 * 1024 * 1024;
  while (bytesRead < file.size) {
    const slice = file.slice(bytesRead, Math.min(bytesRead + chunkSize, file.size));
    const chunk = new Uint8Array(await slice.arrayBuffer());
    chunks.push(chunk);
    bytesRead += chunk.length;
    onProgress?.({ loaded: bytesRead, total: file.size, percent: bytesRead / file.size });
  }
  const combined = new Uint8Array(bytesRead);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }
  return combined.buffer as ArrayBuffer;
}

export function readPdfVersion(buffer: Uint8Array): string {
  if (buffer.length < 8) return 'Unknown';
  const header = new TextDecoder('latin1').decode(buffer.slice(0, 8));
  const match = /%PDF-(\d+\.\d+)/.exec(header);
  return match ? match[1] : 'Unknown';
}

export interface PdfDocumentInfo {
  fileName: string;
  fileSize: number;
  pdfVersion: string;
  numPages: number;
  title: string | null;
  author: string | null;
  subject: string | null;
  keywords: string | null;
  creator: string | null;
  producer: string | null;
  creationDate: string | null;
  modificationDate: string | null;
  isLinearized: boolean;
}

function formatPdfDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const match = /^D:(\d{4})(\d{2})?(\d{2})?(\d{2})?(\d{2})?(\d{2})?/.exec(value);
  if (!match) return value;
  const year = match[1];
  const month = match[2] ?? '01';
  const day = match[3] ?? '01';
  const hour = match[4] ?? '00';
  const minute = match[5] ?? '00';
  const second = match[6] ?? '00';
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  );
  return Number.isNaN(date.getTime())
    ? value
    : date.toISOString().replace('T', ' ').replace('.000Z', ' UTC');
}

export async function getPdfInfo(
  file: File,
  onProgress?: PdfProgressHandler
): Promise<PdfDocumentInfo> {
  const pdfjs = await loadPdfjs();
  const data = await readPdfBytes(file, onProgress);
  const loadingTask = pdfjs.getDocument({ data });
  const doc = await loadingTask.promise;
  try {
    const metadata = await doc.getMetadata().catch(() => null);
    const info = (metadata?.info ?? {}) as Record<string, unknown>;
    return {
      fileName: file.name,
      fileSize: file.size,
      pdfVersion: readPdfVersion(new Uint8Array(data)),
      numPages: doc.numPages,
      title: typeof info['Title'] === 'string' ? info['Title'] : null,
      author: typeof info['Author'] === 'string' ? info['Author'] : null,
      subject: typeof info['Subject'] === 'string' ? info['Subject'] : null,
      keywords: typeof info['Keywords'] === 'string' ? info['Keywords'] : null,
      creator: typeof info['Creator'] === 'string' ? info['Creator'] : null,
      producer: typeof info['Producer'] === 'string' ? info['Producer'] : null,
      creationDate: formatPdfDate(
        typeof info['CreationDate'] === 'string' ? info['CreationDate'] : null
      ),
      modificationDate: formatPdfDate(typeof info['ModDate'] === 'string' ? info['ModDate'] : null),
      isLinearized: Boolean(info['Linearized']),
    };
  } finally {
    void loadingTask.destroy();
  }
}

export async function getPdfPageCount(
  file: File,
  onProgress?: PdfProgressHandler
): Promise<number> {
  const pdfjs = await loadPdfjs();
  const data = await readPdfBytes(file, onProgress);
  const loadingTask = pdfjs.getDocument({ data });
  const doc = await loadingTask.promise;
  try {
    return doc.numPages;
  } finally {
    void loadingTask.destroy();
  }
}

export interface PdfPageText {
  pageNumber: number;
  text: string;
}

export async function extractPdfPageText(
  doc: PDFDocumentProxy,
  pageNumber: number
): Promise<string> {
  const page = await doc.getPage(pageNumber);
  try {
    const content = await page.getTextContent();
    return content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join('')
      .replace(/\u0000/g, '')
      .trim();
  } finally {
    void page.cleanup();
  }
}

export async function extractPdfText(
  file: File,
  onProgress?: PdfProgressHandler
): Promise<PdfPageText[]> {
  const pdfjs = await loadPdfjs();
  const data = await readPdfBytes(file, onProgress);
  const loadingTask = pdfjs.getDocument({ data });
  const doc = await loadingTask.promise;
  try {
    const pages: PdfPageText[] = [];
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
      const text = await extractPdfPageText(doc, pageNumber);
      pages.push({ pageNumber, text });
      onProgress?.({
        loaded: pageNumber,
        total: doc.numPages,
        percent: pageNumber / doc.numPages,
      });
    }
    return pages;
  } finally {
    void loadingTask.destroy();
  }
}

export interface RenderedPdfPage {
  blob: Blob;
  width: number;
  height: number;
  pageNumber: number;
}

export async function renderPdfPageToJpeg(
  doc: PDFDocumentProxy,
  pageNumber: number,
  scale = 1.5
): Promise<RenderedPdfPage> {
  const page = await doc.getPage(pageNumber);
  try {
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not create a 2D canvas context.');
    }
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) =>
          result ? resolve(result) : reject(new Error('Could not encode the rendered page.')),
        'image/jpeg',
        0.85
      );
    });
    return { blob, width: canvas.width, height: canvas.height, pageNumber };
  } finally {
    void page.cleanup();
  }
}

export async function renderPdfPages(
  file: File,
  pageNumbers: number[],
  scale = 1.5,
  onProgress?: PdfProgressHandler
): Promise<RenderedPdfPage[]> {
  const pdfjs = await loadPdfjs();
  const data = await readPdfBytes(file, onProgress);
  const loadingTask = pdfjs.getDocument({ data });
  const doc = await loadingTask.promise;
  try {
    const uniquePages = [...new Set(pageNumbers)]
      .filter((pageNumber) => pageNumber >= 1 && pageNumber <= doc.numPages)
      .sort((a, b) => a - b);
    const rendered: RenderedPdfPage[] = [];
    for (let index = 0; index < uniquePages.length; index += 1) {
      const pageNumber = uniquePages[index];
      rendered.push(await renderPdfPageToJpeg(doc, pageNumber, scale));
      onProgress?.({
        loaded: index + 1,
        total: uniquePages.length,
        percent: (index + 1) / uniquePages.length,
      });
    }
    return rendered;
  } finally {
    void loadingTask.destroy();
  }
}

function escapePdfString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

export interface PdfImagePage {
  blob: Blob;
  width: number;
  height: number;
}

export interface PdfCreationOptions {
  title?: string;
  author?: string;
  producer?: string;
}

export async function createPdfFromImages(
  pages: PdfImagePage[],
  options: PdfCreationOptions = {}
): Promise<Blob> {
  if (pages.length === 0) {
    throw new Error('Select at least one page first.');
  }
  if (pages.length > MAX_PDF_PAGES) {
    throw new Error('Too many pages. The limit is ' + MAX_PDF_PAGES + '.');
  }

  const objects: Uint8Array[] = [];
  const encoder = new TextEncoder();

  const pagesTreeNumber = 2;
  const infoNumber = pages.length * 3 + 3;

  objects.push(encoder.encode('<< /Type /Catalog /Pages ' + pagesTreeNumber + ' 0 R >>'));
  const kids = pages.map((_, index) => 3 + index * 3 + ' 0 R').join(' ');
  objects.push(
    encoder.encode('<< /Type /Pages /Kids [' + kids + '] /Count ' + pages.length + ' >>')
  );

  for (let index = 0; index < pages.length; index += 1) {
    const pageNumber = 3 + index * 3;
    const imageNumber = pageNumber + 1;
    const contentNumber = pageNumber + 2;
    const page = pages[index];
    const width = Math.max(1, Math.round(page.width));
    const height = Math.max(1, Math.round(page.height));
    objects.push(
      encoder.encode(
        '<< /Type /Page /Parent ' +
          pagesTreeNumber +
          ' 0 R /MediaBox [0 0 ' +
          width +
          ' ' +
          height +
          '] /Resources << /XObject << /Im0 ' +
          imageNumber +
          ' 0 R >> >> /Contents ' +
          contentNumber +
          ' 0 R >>'
      )
    );
    const imageBytes = new Uint8Array(await page.blob.arrayBuffer());
    objects.push(
      encoder.encode(
        '<< /Type /XObject /Subtype /Image /Width ' +
          width +
          ' /Height ' +
          height +
          ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' +
          imageBytes.length +
          ' >> stream\n'
      )
    );
    objects.push(imageBytes);
    objects.push(encoder.encode('\nendstream'));
    const content = 'q ' + width + ' 0 0 ' + height + ' 0 0 cm /Im0 Do Q';
    objects.push(
      encoder.encode('<< /Length ' + content.length + ' >> stream\n' + content + '\nendstream')
    );
  }

  const title = options.title ?? 'Merged document';
  const author = options.author ?? 'Toolbox for Devs';
  const producer = options.producer ?? 'Toolbox for Devs PDF Utilities';
  const now = new Date();
  const dateStamp = 'D:' + now.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
  objects.push(
    encoder.encode(
      '<< /Title (' +
        escapePdfString(title) +
        ') /Author (' +
        escapePdfString(author) +
        ') /Producer (' +
        escapePdfString(producer) +
        ') /Creator (' +
        escapePdfString(producer) +
        ') /CreationDate (' +
        dateStamp +
        ') >>'
    )
  );

  const header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const parts: Uint8Array[] = [encoder.encode(header)];
  let cursor = header.length;
  const xrefOffsets: number[] = [0];
  objects.forEach((object, index) => {
    xrefOffsets.push(cursor);
    const objectPrefix = encoder.encode(index + 1 + ' 0 obj\n');
    const objectSuffix = encoder.encode('\nendobj\n');
    parts.push(objectPrefix, object, objectSuffix);
    cursor += objectPrefix.length + object.length + objectSuffix.length;
  });
  const xrefOffset = cursor;

  const xrefText =
    'xref\n0 ' +
    (objects.length + 1) +
    '\n0000000000 65535 f \n' +
    xrefOffsets.map((offset) => String(offset).padStart(10, '0') + ' 00000 n \n').join('');
  const trailerText =
    'trailer\n<< /Size ' +
    (objects.length + 1) +
    ' /Root 1 0 R /Info ' +
    infoNumber +
    ' 0 R >>\nstartxref\n' +
    xrefOffset +
    '\n%%EOF';

  parts.push(encoder.encode(xrefText));
  parts.push(encoder.encode(trailerText));
  return new Blob(
    parts.map((part) => new Uint8Array(part)),
    { type: 'application/pdf' }
  );
}
