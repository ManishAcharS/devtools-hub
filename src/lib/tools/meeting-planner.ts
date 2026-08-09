export interface TimeZoneOffset {
  name: string;
  offsetMinutes: number;
}

export interface OverlapWindow {
  startHour: number;
  endHour: number;
}

export function zoneOffsetMinutes(zone: string, date: Date = new Date()): number | null {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      timeZoneName: 'longOffset',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).formatToParts(date);
    const name = parts.find((part) => part.type === 'timeZoneName')?.value ?? '';
    if (name === 'UTC' || name === 'GMT') return 0;
    const match = name.match(/^GMT([+-])(\d{1,2})(?::(\d{2}))?$/);
    if (match) {
      const sign = match[1] === '-' ? -1 : 1;
      const hours = Number(match[2]);
      const minutes = Number(match[3] ?? '0');
      return sign * (hours * 60 + minutes);
    }
    return null;
  } catch {
    return null;
  }
}

function intersectRanges(
  rangesA: [number, number][],
  rangesB: [number, number][]
): [number, number][] {
  const result: [number, number][] = [];
  for (const [aStart, aEnd] of rangesA) {
    for (const [bStart, bEnd] of rangesB) {
      const start = Math.max(aStart, bStart);
      const end = Math.min(aEnd, bEnd);
      if (end - start > 0.0001) {
        result.push([start, end]);
      }
    }
  }
  return result.sort((a, b) => a[0] - b[0]);
}

export function workingRangesForZone(
  zone: TimeZoneOffset,
  startHour: number,
  endHour: number
): [number, number][] {
  const shift = zone.offsetMinutes / 60;
  const start = (startHour - shift + 48) % 24;
  const end = (endHour - shift + 48) % 24;
  if (Math.abs(end - start) < 0.0001) {
    return [[0, 24]];
  }
  if (start <= end) {
    return [[start, end]];
  }
  return [
    [start, 24],
    [0, end],
  ];
}

export function findOverlaps(
  zones: TimeZoneOffset[],
  startHour: number,
  endHour: number
): [number, number][] {
  if (zones.length === 0 || endHour <= startHour || startHour < 0 || endHour > 24) {
    return [];
  }
  const utcRanges = zones.map((zone) => workingRangesForZone(zone, startHour, endHour));
  let overlaps = utcRanges[0] ?? [];
  for (let index = 1; index < utcRanges.length; index += 1) {
    overlaps = intersectRanges(overlaps, utcRanges[index] ?? []);
    if (overlaps.length === 0) break;
  }
  return overlaps;
}

export function shiftWindowToZone(
  window: [number, number],
  fromOffsetMinutes: number,
  toOffsetMinutes: number
): [number, number][] {
  const shift = (toOffsetMinutes - fromOffsetMinutes) / 60;
  const start = (window[0] + shift + 48) % 24;
  const end = (window[1] + shift + 48) % 24;
  if (start <= end) {
    return [[start, end]];
  }
  return [
    [start, 24],
    [0, end],
  ];
}

export function workingHourSet(
  zone: TimeZoneOffset,
  reference: TimeZoneOffset,
  startHour: number,
  endHour: number
): Set<number> {
  const shift = (reference.offsetMinutes - zone.offsetMinutes) / 60;
  const start = (startHour + shift + 48) % 24;
  const end = (endHour + shift + 48) % 24;
  const set = new Set<number>();
  if (Math.abs(end - start) < 0.0001) {
    for (let hour = 0; hour < 24; hour += 1) set.add(hour);
    return set;
  }
  if (start <= end) {
    for (let hour = Math.ceil(start); hour < end; hour += 1) set.add(((hour % 24) + 24) % 24);
  } else {
    for (let hour = Math.ceil(start); hour < 24; hour += 1) set.add(hour);
    for (let hour = 0; hour < end; hour += 1) set.add(hour);
  }
  return set;
}

export function formatOverlapWindow(window: OverlapWindow): string {
  const formatHour = (hour: number): string => {
    const rounded = Math.round(hour * 2) / 2;
    const whole = Math.floor(rounded);
    const minutes = Math.round((rounded - whole) * 60);
    const period = whole >= 12 ? 'PM' : 'AM';
    const hour12 = whole % 12 === 0 ? 12 : whole % 12;
    return minutes === 0
      ? `${hour12}:00 ${period}`
      : `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  return `${formatHour(window.startHour)} \u2013 ${formatHour(window.endHour)}`;
}
