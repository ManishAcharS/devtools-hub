export interface EnvEntry {
  key: string;
  value: string;
}

export interface EnvIssue {
  line: number;
  message: string;
}

export interface EnvValidationResult {
  errors: EnvIssue[];
  warnings: EnvIssue[];
}

const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;

export function buildEnvFile(entries: EnvEntry[]): string {
  const lines: string[] = [];
  for (const entry of entries) {
    const key = entry.key.trim();
    if (key.length === 0) continue;
    const value = entry.value;
    const needsQuotes = /[\s#]/.test(value) || value.length === 0;
    const rendered = needsQuotes ? `"${value.replace(/"/g, '\\"')}"` : value;
    lines.push(`${key}=${rendered}`);
  }
  return `${lines.join('\n')}\n`;
}

export function validateEnvFile(content: string): EnvValidationResult {
  const errors: EnvIssue[] = [];
  const warnings: EnvIssue[] = [];
  const seen = new Map<string, number>();

  const lines = content.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const lineNumber = index + 1;
    const line = lines[index] ?? '';
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.startsWith('#')) continue;

    const equalsIndex = line.indexOf('=');
    if (equalsIndex === -1) {
      errors.push({
        line: lineNumber,
        message: 'Line is not a KEY=VALUE assignment and not a comment.',
      });
      continue;
    }

    const keyPart = line.slice(0, equalsIndex);
    const valuePart = line.slice(equalsIndex + 1);

    const hasWhitespace = keyPart !== keyPart.trim() || valuePart !== valuePart.trimStart();
    const key = keyPart.trim();

    if (!KEY_PATTERN.test(key)) {
      if (hasWhitespace) {
        errors.push({
          line: lineNumber,
          message: 'Whitespace around the equals sign is not allowed in .env files.',
        });
      } else {
        errors.push({
          line: lineNumber,
          message: `Invalid key "${keyPart}". Keys must start with a letter or underscore and contain only letters, digits, and underscores.`,
        });
      }
    } else if (hasWhitespace) {
      errors.push({
        line: lineNumber,
        message: 'Whitespace around the equals sign is not allowed in .env files.',
      });
    }

    if (seen.has(key)) {
      errors.push({
        line: lineNumber,
        message: `Duplicate key "${key}" — first defined on line ${seen.get(key)}. Later values silently override earlier ones.`,
      });
    } else {
      seen.set(key, lineNumber);
    }

    if (valuePart.trim().length === 0) {
      warnings.push({ line: lineNumber, message: `Key "${key}" has an empty value.` });
      continue;
    }

    const unquoted = valuePart;
    if (/[\s]/.test(unquoted) && !unquoted.startsWith('"') && !unquoted.startsWith("'")) {
      warnings.push({
        line: lineNumber,
        message: `Value for "${key}" contains unquoted spaces — wrap it in quotes to be parsed safely by all dotenv implementations.`,
      });
    }
  }

  return { errors, warnings };
}
