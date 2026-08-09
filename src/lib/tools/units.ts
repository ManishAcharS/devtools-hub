export interface ConversionUnit {
  id: string;
  label: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

export interface UnitCategory {
  id: string;
  label: string;
  baseLabel: string;
  units: ConversionUnit[];
}

const linear = (factor: number): Pick<ConversionUnit, 'toBase' | 'fromBase'> => ({
  toBase: (value: number) => value * factor,
  fromBase: (value: number) => value / factor,
});

const celsiusToKelvin = (value: number): number => value + 273.15;
const kelvinToCelsius = (value: number): number => value - 273.15;

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'currency',
    label: 'Currency',
    baseLabel: 'USD',
    units: [
      { id: 'usd', label: 'US Dollar (USD)', ...linear(1) },
      { id: 'eur', label: 'Euro (EUR)', ...linear(0.92) },
      { id: 'gbp', label: 'British Pound (GBP)', ...linear(0.79) },
      { id: 'jpy', label: 'Japanese Yen (JPY)', ...linear(150.5) },
      { id: 'cad', label: 'Canadian Dollar (CAD)', ...linear(1.35) },
      { id: 'aud', label: 'Australian Dollar (AUD)', ...linear(1.52) },
      { id: 'chf', label: 'Swiss Franc (CHF)', ...linear(0.89) },
      { id: 'cny', label: 'Chinese Yuan (CNY)', ...linear(7.24) },
      { id: 'inr', label: 'Indian Rupee (INR)', ...linear(83.12) },
      { id: 'btc', label: 'Bitcoin (BTC)', ...linear(0.000016) },
      { id: 'eth', label: 'Ethereum (ETH)', ...linear(0.00026) },
    ],
  },
  {
    id: 'length',
    label: 'Length',
    baseLabel: 'meters',
    units: [
      { id: 'mm', label: 'Millimeters (mm)', ...linear(0.001) },
      { id: 'cm', label: 'Centimeters (cm)', ...linear(0.01) },
      { id: 'm', label: 'Meters (m)', ...linear(1) },
      { id: 'km', label: 'Kilometers (km)', ...linear(1000) },
      { id: 'in', label: 'Inches (in)', ...linear(0.0254) },
      { id: 'ft', label: 'Feet (ft)', ...linear(0.3048) },
      { id: 'yd', label: 'Yards (yd)', ...linear(0.9144) },
      { id: 'mi', label: 'Miles (mi)', ...linear(1609.344) },
      { id: 'nmi', label: 'Nautical miles (nmi)', ...linear(1852) },
    ],
  },
  {
    id: 'weight',
    label: 'Weight / Mass',
    baseLabel: 'kilograms',
    units: [
      { id: 'mg', label: 'Milligrams (mg)', ...linear(0.000001) },
      { id: 'g', label: 'Grams (g)', ...linear(0.001) },
      { id: 'kg', label: 'Kilograms (kg)', ...linear(1) },
      { id: 't', label: 'Metric tons (t)', ...linear(1000) },
      { id: 'oz', label: 'Ounces (oz)', ...linear(0.028349523125) },
      { id: 'lb', label: 'Pounds (lb)', ...linear(0.45359237) },
      { id: 'st', label: 'Stones (st)', ...linear(6.35029318) },
    ],
  },
  {
    id: 'data',
    label: 'Data Size',
    baseLabel: 'bytes',
    units: [
      { id: 'bit', label: 'Bits (b)', ...linear(0.125) },
      { id: 'byte', label: 'Bytes (B)', ...linear(1) },
      { id: 'kb', label: 'Kilobytes (KB, decimal)', ...linear(1000) },
      { id: 'mb', label: 'Megabytes (MB, decimal)', ...linear(1000 * 1000) },
      { id: 'gb', label: 'Gigabytes (GB, decimal)', ...linear(1000 * 1000 * 1000) },
      { id: 'tb', label: 'Terabytes (TB, decimal)', ...linear(1000 * 1000 * 1000 * 1000) },
      { id: 'kib', label: 'Kibibytes (KiB, binary)', ...linear(1024) },
      { id: 'mib', label: 'Mebibytes (MiB, binary)', ...linear(1024 * 1024) },
      { id: 'gib', label: 'Gibibytes (GiB, binary)', ...linear(1024 * 1024 * 1024) },
      { id: 'tib', label: 'Tebibytes (TiB, binary)', ...linear(1024 * 1024 * 1024 * 1024) },
    ],
  },
  {
    id: 'temperature',
    label: 'Temperature',
    baseLabel: 'kelvin',
    units: [
      { id: 'c', label: 'Celsius (°C)', toBase: celsiusToKelvin, fromBase: kelvinToCelsius },
      {
        id: 'f',
        label: 'Fahrenheit (°F)',
        toBase: (value) => ((value - 32) * 5) / 9 + 273.15,
        fromBase: (value) => ((value - 273.15) * 9) / 5 + 32,
      },
      { id: 'k', label: 'Kelvin (K)', toBase: (value) => value, fromBase: (value) => value },
      {
        id: 'r',
        label: 'Rankine (°R)',
        toBase: (value) => (value * 5) / 9,
        fromBase: (value) => (value * 9) / 5,
      },
    ],
  },
  {
    id: 'speed',
    label: 'Speed',
    baseLabel: 'meters per second',
    units: [
      { id: 'mps', label: 'Meters/second (m/s)', ...linear(1) },
      { id: 'kmh', label: 'Kilometers/hour (km/h)', ...linear(1 / 3.6) },
      { id: 'mph', label: 'Miles/hour (mph)', ...linear(0.44704) },
      { id: 'knot', label: 'Knots (kn)', ...linear(0.5144444444) },
      { id: 'fps', label: 'Feet/second (ft/s)', ...linear(0.3048) },
      { id: 'mach', label: 'Mach (at sea level)', ...linear(340.29) },
    ],
  },
];

export interface UnitConversionResult {
  value: number | null;
  error: string | null;
}

export function convertUnits(
  value: string,
  fromId: string,
  toId: string,
  categoryId: string
): UnitConversionResult {
  const category = UNIT_CATEGORIES.find((candidate) => candidate.id === categoryId);
  if (!category) return { value: null, error: 'Unknown category.' };
  const from = category.units.find((unit) => unit.id === fromId);
  const to = category.units.find((unit) => unit.id === toId);
  if (!from || !to) return { value: null, error: 'Unknown unit.' };
  const trimmed = value.trim();
  if (trimmed.length === 0) return { value: null, error: null };
  const numeric = Number(trimmed);
  if (!Number.isFinite(numeric)) {
    return { value: null, error: 'Enter a valid number.' };
  }
  return { value: to.fromBase(from.toBase(numeric)), error: null };
}

export function formatUnitValue(value: number | null): string {
  if (value === null) return '';
  if (Math.abs(value) >= 1e15 || (Math.abs(value) < 1e-9 && value !== 0)) {
    return value.toExponential(8);
  }
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 10 }).format(value);
}
