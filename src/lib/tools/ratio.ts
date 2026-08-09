export interface RatioInput {
  width: number;
  height: number;
}

export function gcd(a: number, b: number): number {
  let first = Math.abs(Math.round(a));
  let second = Math.abs(Math.round(b));
  while (second !== 0) {
    const remainder = first % second;
    first = second;
    second = remainder;
  }
  return first === 0 ? 1 : first;
}

function toIntegers(width: number, height: number): [number, number] {
  let factor = 1;
  while ((width * factor) % 1 !== 0 || (height * factor) % 1 !== 0) {
    factor *= 10;
    if (factor > 1_000_000_000) break;
  }
  return [Math.round(width * factor), Math.round(height * factor)];
}

export function simplifyRatio(width: number, height: number): RatioInput {
  const [intWidth, intHeight] = toIntegers(width, height);
  const divisor = gcd(intWidth, intHeight);
  return { width: intWidth / divisor, height: intHeight / divisor };
}

export function scaleToWidth(width: number, height: number, newWidth: number): number {
  return (newWidth * height) / width;
}

export function scaleToHeight(width: number, height: number, newHeight: number): number {
  return (newHeight * width) / height;
}

export function parseRatioInput(value: string): RatioInput | null {
  const trimmed = value.trim();
  const separator = trimmed.indexOf(':');
  const parts =
    separator === -1
      ? trimmed.split(/[xX×]/)
      : [trimmed.slice(0, separator), trimmed.slice(separator + 1)];
  if (parts.length !== 2) return null;
  const width = Number(parts[0]?.trim());
  const height = Number(parts[1]?.trim());
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }
  return { width, height };
}
