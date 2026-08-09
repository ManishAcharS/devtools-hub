export type Hemisphere = 'N' | 'S' | 'E' | 'W';

export interface DmsPart {
  degrees: number;
  minutes: number;
  seconds: number;
  hemisphere: Hemisphere;
}

export interface DmsCoordinate {
  latitude: DmsPart;
  longitude: DmsPart;
}

export interface CoordinateParseResult {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

export function parseDecimalCoordinate(
  latitudeValue: string,
  longitudeValue: string
): CoordinateParseResult {
  const latitude = Number(latitudeValue.trim());
  const longitude = Number(longitudeValue.trim());
  if (latitudeValue.trim().length === 0 || longitudeValue.trim().length === 0) {
    return { latitude: null, longitude: null, error: 'Enter both latitude and longitude.' };
  }
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { latitude: null, longitude: null, error: 'Coordinates must be numbers.' };
  }
  if (latitude < -90 || latitude > 90) {
    return { latitude: null, longitude: null, error: 'Latitude must be between -90 and 90.' };
  }
  if (longitude < -180 || longitude > 180) {
    return { latitude: null, longitude: null, error: 'Longitude must be between -180 and 180.' };
  }
  return { latitude, longitude, error: null };
}

export function decimalToDms(value: number, isLatitude: boolean): DmsPart {
  const hemisphere: Hemisphere = value < 0 ? (isLatitude ? 'S' : 'W') : isLatitude ? 'N' : 'E';
  const absolute = Math.abs(value);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;
  return { degrees, minutes, seconds, hemisphere };
}

export function dmsToDecimal(
  degrees: number,
  minutes: number,
  seconds: number,
  hemisphere: Hemisphere
): number {
  const sign = hemisphere === 'S' || hemisphere === 'W' ? -1 : 1;
  const safeMinutes = Math.max(0, Math.min(59.999999, minutes));
  const safeSeconds = Math.max(0, Math.min(59.999999, seconds));
  return sign * (Math.abs(degrees) + safeMinutes / 60 + safeSeconds / 3600);
}

export function formatDms(part: DmsPart, precision = 2): string {
  const seconds = Number(part.seconds.toFixed(precision));
  return `${part.degrees}\u00b0 ${part.minutes}\u2032 ${seconds}\u2033 ${part.hemisphere}`;
}

export function formatDecimal(latitude: number, longitude: number): string {
  return `${Number(latitude.toFixed(6))}\u00b0, ${Number(longitude.toFixed(6))}\u00b0`;
}
