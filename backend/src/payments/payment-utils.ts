import { createHash } from 'crypto';

export function stableStringify(input: unknown): string {
  if (Array.isArray(input)) {
    return `[${input.map((item) => stableStringify(item)).join(',')}]`;
  }

  if (input !== null && typeof input === 'object') {
    const objectValue = input as Record<string, unknown>;
    const keys = Object.keys(objectValue).sort();
    const entries = keys.map((key) => `"${key}":${stableStringify(objectValue[key])}`);
    return `{${entries.join(',')}}`;
  }

  return JSON.stringify(input);
}

export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
