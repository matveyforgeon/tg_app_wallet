/**
 * Local passcode hashing.
 *
 * The passcode gates a specific action (sending crypto) — it is never an
 * app-entry lock, which spec §10 forbids. It is stored as a PBKDF2-SHA256
 * digest with a random per-device salt, so the stored value cannot be read
 * back as the code itself.
 *
 * Honest scope: this protects against someone picking up an unlocked phone.
 * It is not server-verified, so it cannot protect against an attacker who can
 * already run code in this browser profile. Real account-level security needs
 * a backend.
 */

const ITERATIONS = 210_000;
const KEY_LENGTH_BITS = 256;

function subtle(): SubtleCrypto | null {
  const c = globalThis.crypto;
  // Requires a secure context; Telegram Mini Apps are always served over HTTPS.
  return c && 'subtle' in c ? c.subtle : null;
}

export function passcodeSupported(): boolean {
  return subtle() !== null;
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function randomSalt(): string {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPasscode(code: string, salt: string): Promise<string> {
  const api = subtle();
  if (!api) throw new Error('WebCrypto unavailable');

  const encoder = new TextEncoder();
  const key = await api.importKey('raw', encoder.encode(code), 'PBKDF2', false, ['deriveBits']);
  const bits = await api.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: ITERATIONS, hash: 'SHA-256' },
    key,
    KEY_LENGTH_BITS,
  );
  return toHex(bits);
}

/** Constant-time-ish compare, so a wrong code cannot be narrowed by timing. */
export function digestsMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const PASSCODE_LENGTH = 4;
