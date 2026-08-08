export interface DecodedSegment {
  raw: string;
  json: string;
  object: Record<string, unknown> | null;
  error: string | null;
}

export interface JwtDecodeResult {
  header: DecodedSegment;
  payload: DecodedSegment;
  signature: string;
  signatureBytes: string;
  error: string | null;
}

export type ClaimState = 'ok' | 'warn' | 'danger' | 'info';

export interface ClaimRow {
  label: string;
  value: string;
  state: ClaimState;
  detail: string;
}

export interface JwtAnalysis {
  algorithm: string;
  type: string;
  rows: ClaimRow[];
  summary: string[];
}

export interface JwtVerifyResult {
  verified: boolean;
  detail: string;
}

function base64UrlToBytes(segment: string): Uint8Array | null {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  try {
    if (typeof atob !== 'function') return null;
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

export function decodeJwtSegment(segment: string): DecodedSegment {
  if (segment.length === 0) {
    return { raw: '', json: '', object: null, error: 'Segment is empty.' };
  }
  const bytes = base64UrlToBytes(segment);
  if (!bytes) {
    return { raw: segment, json: '', object: null, error: 'Not valid base64url.' };
  }
  let text: string;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return {
      raw: segment,
      json: '',
      object: null,
      error: 'Decoded bytes are not valid UTF-8 text.',
    };
  }
  try {
    const object = JSON.parse(text) as Record<string, unknown>;
    return { raw: segment, json: JSON.stringify(object, null, 2), object, error: null };
  } catch {
    return {
      raw: segment,
      json: text,
      object: null,
      error: 'Segment decodes but is not valid JSON.',
    };
  }
}

export function decodeJwt(token: string): JwtDecodeResult {
  const trimmed = token.trim();
  if (trimmed.length === 0) {
    return emptyJwt('Input is empty. Paste a JWT to decode it.');
  }
  const segments = trimmed.split('.');
  if (segments.length !== 3) {
    return emptyJwt(
      `A JWT has three dot-separated parts (header.payload.signature), but this input has ${segments.length}.`
    );
  }
  const header = decodeJwtSegment(segments[0] ?? '');
  const payload = decodeJwtSegment(segments[1] ?? '');
  const signature = segments[2] ?? '';
  if (!header.object) {
    return {
      header,
      payload,
      signature,
      signatureBytes: '',
      error: `Header: ${header.error ?? 'unreadable'}`,
    };
  }
  if (!payload.object) {
    return {
      header,
      payload,
      signature,
      signatureBytes: '',
      error: `Payload: ${payload.error ?? 'unreadable'}`,
    };
  }
  const bytes = base64UrlToBytes(signature);
  const signatureBytes = bytes ? `${bytes.length} bytes` : 'unreadable';
  return { header, payload, signature, signatureBytes, error: null };
}

function emptyJwt(error: string): JwtDecodeResult {
  return {
    header: { raw: '', json: '', object: null, error: null },
    payload: { raw: '', json: '', object: null, error: null },
    signature: '',
    signatureBytes: '',
    error,
  };
}

function formatSecondsAgo(seconds: number): string {
  const abs = Math.abs(seconds);
  if (abs < 60) return `${seconds} seconds`;
  if (abs < 3600) return `${Math.floor(abs / 60)} minutes`;
  if (abs < 86400) return `${Math.floor(abs / 3600)} hours`;
  if (abs < 31536000) return `${Math.floor(abs / 86400)} days`;
  return `${Math.floor(abs / 31536000)} years`;
}

export function analyzeJwt(
  payload: Record<string, unknown>,
  header: Record<string, unknown>,
  now: number = Date.now()
): JwtAnalysis {
  const algorithm = typeof header.alg === 'string' ? header.alg : 'unknown';
  const type = typeof header.typ === 'string' ? header.typ : 'JWT';
  const rows: ClaimRow[] = [];
  const summary: string[] = [];

  if (algorithm === 'none') {
    rows.push({
      label: 'Algorithm',
      value: 'none',
      state: 'danger',
      detail: 'Signed with no algorithm — anyone can forge the token. Reject it.',
    });
  } else {
    rows.push({
      label: 'Algorithm',
      value: algorithm,
      state: /^HS|^RS|^ES|^PS/.test(algorithm) ? 'info' : 'warn',
      detail: 'Signing algorithm from the header.',
    });
  }

  const exp = typeof payload.exp === 'number' ? payload.exp : null;
  if (exp !== null) {
    const secondsLeft = exp - Math.floor(now / 1000);
    if (secondsLeft <= 0) {
      rows.push({
        label: 'Expiration (exp)',
        value: new Date(exp * 1000).toISOString(),
        state: 'danger',
        detail: `Expired ${formatSecondsAgo(secondsLeft)} ago.`,
      });
      summary.push('This token has expired.');
    } else {
      rows.push({
        label: 'Expiration (exp)',
        value: new Date(exp * 1000).toISOString(),
        state: 'ok',
        detail: `Valid for another ${formatSecondsAgo(secondsLeft)}.`,
      });
    }
  }

  const nbf = typeof payload.nbf === 'number' ? payload.nbf : null;
  if (nbf !== null) {
    const secondsUntil = nbf - Math.floor(now / 1000);
    rows.push({
      label: 'Not before (nbf)',
      value: new Date(nbf * 1000).toISOString(),
      state: secondsUntil > 0 ? 'warn' : 'ok',
      detail:
        secondsUntil > 0
          ? `Not usable for another ${formatSecondsAgo(secondsUntil)}.`
          : 'Already usable.',
    });
  }

  const iat = typeof payload.iat === 'number' ? payload.iat : null;
  if (iat !== null) {
    rows.push({
      label: 'Issued at (iat)',
      value: new Date(iat * 1000).toISOString(),
      state: 'info',
      detail: `Issued ${formatSecondsAgo(Math.floor(now / 1000) - iat)} ago.`,
    });
  }

  const claims: [string, unknown, ClaimState][] = [
    [
      'Issuer (iss)',
      payload.iss,
      typeof payload.iss === 'string' && payload.iss.length > 0 ? 'info' : 'warn',
    ],
    [
      'Subject (sub)',
      payload.sub,
      typeof payload.sub === 'string' && payload.sub.length > 0 ? 'info' : 'warn',
    ],
    ['Audience (aud)', payload.aud, payload.aud !== undefined ? 'info' : 'warn'],
    ['JWT ID (jti)', payload.jti, typeof payload.jti === 'string' ? 'info' : 'info'],
  ];
  for (const [label, value, state] of claims) {
    rows.push({
      label,
      value:
        value === undefined
          ? '(missing)'
          : typeof value === 'string'
            ? value
            : JSON.stringify(value),
      state: value === undefined ? (state === 'info' ? 'info' : 'warn') : 'info',
      detail: value === undefined ? 'Not present in this token.' : 'Present in the payload.',
    });
  }

  return { algorithm, type, rows, summary };
}

export async function verifyJwtSignature(token: string, secret: string): Promise<JwtVerifyResult> {
  const decoded = decodeJwt(token);
  if (decoded.error || !decoded.header.object || !decoded.payload.object) {
    return { verified: false, detail: 'Cannot verify: the token could not be decoded.' };
  }
  const algorithm = typeof decoded.header.object.alg === 'string' ? decoded.header.object.alg : '';
  if (!/^HS(256|384|512)$/.test(algorithm)) {
    return {
      verified: false,
      detail:
        algorithm === 'none' || algorithm === ''
          ? 'This token claims to be unsigned. Do not trust it.'
          : `Signature verification is only supported for HMAC (HS256/384/512), not "${algorithm || 'unknown'}".`,
    };
  }
  if (secret.trim().length === 0) {
    return { verified: false, detail: 'Enter the HMAC secret to verify the signature.' };
  }
  if (typeof crypto === 'undefined' || typeof crypto.subtle === 'undefined') {
    return { verified: false, detail: 'WebCrypto is not available in this environment.' };
  }
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      {
        name: 'HMAC',
        hash: algorithm === 'HS512' ? 'SHA-512' : algorithm === 'HS384' ? 'SHA-384' : 'SHA-256',
      },
      false,
      ['sign']
    );
    const signatureBytes = base64UrlToBytes(decoded.signature);
    if (!signatureBytes) {
      return { verified: false, detail: 'The signature segment is not valid base64url.' };
    }
    const computed = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(`${decoded.header.raw}.${decoded.payload.raw}`)
    );
    if (computed.byteLength !== signatureBytes.length) {
      return {
        verified: false,
        detail: 'Signature length does not match. The secret is probably wrong.',
      };
    }
    const computedView = new Uint8Array(computed);
    let difference = 0;
    for (let i = 0; i < computedView.length; i += 1) {
      difference |= (computedView[i] ?? 0) ^ (signatureBytes[i] ?? 0);
    }
    return difference === 0
      ? { verified: true, detail: 'Signature verified with the provided secret.' }
      : {
          verified: false,
          detail: 'Signature does not match. The secret is wrong or the token was tampered with.',
        };
  } catch (error) {
    return {
      verified: false,
      detail:
        error instanceof Error ? `Verification failed: ${error.message}` : 'Verification failed.',
    };
  }
}
