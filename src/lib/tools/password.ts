export type PasswordStrengthLabel = 'Very weak' | 'Weak' | 'Fair' | 'Strong' | 'Very strong';

export interface PasswordCheck {
  label: string;
  passed: boolean;
}

export interface PasswordStrengthResult {
  score: number;
  label: PasswordStrengthLabel;
  entropy: number;
  timeToCrack: string;
  checks: PasswordCheck[];
}

const COMMON_PASSWORDS = new Set([
  '123456',
  'password',
  '123456789',
  '12345678',
  '12345',
  'qwerty',
  'abc123',
  '111111',
  '123123',
  'admin',
  'letmein',
  'welcome',
  'monkey',
  'dragon',
  'password1',
  '1234567',
  '1234567890',
  'qwerty123',
  '1q2w3e4r',
  'iloveyou',
  'sunshine',
  'princess',
  'football',
  'baseball',
  'superman',
  'trustno1',
]);

function charsetSize(password: string): number {
  let size = 0;
  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/[0-9]/.test(password)) size += 10;
  if (/[^a-zA-Z0-9]/.test(password)) size += 33;
  return Math.max(size, 1);
}

function hasSequentialChars(password: string): boolean {
  for (let index = 0; index < password.length - 2; index += 1) {
    const first = password.charCodeAt(index);
    const second = password.charCodeAt(index + 1);
    const third = password.charCodeAt(index + 2);
    if (second === first + 1 && third === first + 2) return true;
    if (second === first - 1 && third === first - 2) return true;
  }
  return false;
}

function hasRepeatedChars(password: string): boolean {
  return /(.)\1{2,}/.test(password);
}

function formatSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return 'instantly';
  const units: [number, string][] = [
    [31_536_000, 'years'],
    [86_400, 'days'],
    [3_600, 'hours'],
    [60, 'minutes'],
    [1, 'seconds'],
  ];
  for (const [size, label] of units) {
    if (seconds >= size) {
      const count = seconds / size;
      return count >= 100 ? `${count.toFixed(0)} ${label}` : `${count.toFixed(1)} ${label}`;
    }
  }
  return `${Math.ceil(seconds)} seconds`;
}

export function checkPasswordStrength(password: string): PasswordStrengthResult {
  const checks: PasswordCheck[] = [
    { label: 'At least 8 characters', passed: password.length >= 8 },
    { label: 'At least 12 characters', passed: password.length >= 12 },
    { label: 'Contains uppercase letters', passed: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letters', passed: /[a-z]/.test(password) },
    { label: 'Contains numbers', passed: /[0-9]/.test(password) },
    { label: 'Contains symbols', passed: /[^a-zA-Z0-9]/.test(password) },
    { label: 'Not a common password', passed: !COMMON_PASSWORDS.has(password.toLowerCase()) },
    { label: 'No obvious sequences (abc, 123…)', passed: !hasSequentialChars(password) },
    { label: 'No long repeated characters (aaa)', passed: !hasRepeatedChars(password) },
  ];

  const entropy = password.length === 0 ? 0 : password.length * Math.log2(charsetSize(password));
  const guessesPerSecond = 1e10;
  const timeToCrack = formatSeconds(2 ** entropy / 2 / guessesPerSecond);

  const passed = checks.filter((check) => check.passed).length;
  const score = Math.min(4, Math.floor((passed / checks.length) * 5));
  const label: PasswordStrengthLabel =
    password.length === 0
      ? 'Very weak'
      : score === 0
        ? 'Very weak'
        : score === 1
          ? 'Weak'
          : score === 2
            ? 'Fair'
            : score === 3
              ? 'Strong'
              : 'Very strong';

  return { score, label, entropy, timeToCrack, checks };
}
