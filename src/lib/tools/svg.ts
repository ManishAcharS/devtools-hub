export interface SvgOptimizeOptions {
  removeComments: boolean;
  collapseWhitespace: boolean;
  removeEmptyAttrs: boolean;
  minifyStyles: boolean;
  removeMetadata: boolean;
  removeTitles: boolean;
  removeDescriptions: boolean;
  removeDimensions: boolean;
}

export const DEFAULT_SVG_OPTIONS: SvgOptimizeOptions = {
  removeComments: true,
  collapseWhitespace: true,
  removeEmptyAttrs: true,
  minifyStyles: true,
  removeMetadata: true,
  removeTitles: false,
  removeDescriptions: false,
  removeDimensions: false,
};

export interface SvgOptimizeResult {
  value: string;
  originalSize: number;
  optimizedSize: number;
  savings: number;
  error: string | null;
}

export function optimizeSvg(
  input: string,
  options: SvgOptimizeOptions = DEFAULT_SVG_OPTIONS
): SvgOptimizeResult {
  const original = input.trim();
  if (original.length === 0) {
    return {
      value: '',
      originalSize: 0,
      optimizedSize: 0,
      savings: 0,
      error: 'Enter an SVG to optimize.',
    };
  }
  if (!original.startsWith('<svg')) {
    return {
      value: '',
      originalSize: 0,
      optimizedSize: 0,
      savings: 0,
      error: 'Input does not appear to be an SVG (missing <svg> root).',
    };
  }

  let output = original;

  if (options.removeComments) {
    output = output.replace(/<!--[\s\S]*?-->/g, '');
  }
  if (options.removeMetadata) {
    output = output.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
  }
  if (options.removeTitles) {
    output = output.replace(/<title[\s\S]*?<\/title>/gi, '');
  }
  if (options.removeDescriptions) {
    output = output.replace(/<desc[\s\S]*?<\/desc>/gi, '');
  }
  if (options.removeDimensions) {
    output = output.replace(/\s(width|height)="[^"]*"/gi, '');
  }
  if (options.removeEmptyAttrs) {
    output = output.replace(/\s\w+=""/g, '');
  }
  if (options.minifyStyles) {
    output = output.replace(/\sstyle="([^"]*)"/gi, (_, style) => {
      const minified = style
        .split(';')
        .map((decl: string) => decl.trim())
        .filter(Boolean)
        .map((decl: string) => decl.replace(/\s*:\s*/, ':'))
        .join(';');
      return minified ? ` style="${minified}"` : '';
    });
  }
  if (options.collapseWhitespace) {
    output = output
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .replace(/>\s+$/g, '>')
      .replace(/^\s+</g, '<')
      .trim();
  }

  const originalSize = original.length;
  const optimizedSize = output.length;
  const savings = originalSize > 0 ? Math.round((1 - optimizedSize / originalSize) * 100) : 0;

  return { value: output, originalSize, optimizedSize, savings, error: null };
}
