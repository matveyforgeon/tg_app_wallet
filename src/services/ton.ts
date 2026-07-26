import { env } from '@/config/env';
import { getJson } from './http';

const NANOTON = 1_000_000_000;

/** Whole-TON amount to the nanoton integer string TonConnect's transaction request wants. */
export function toNano(amount: number): string {
  return String(Math.round(amount * NANOTON));
}

// User-friendly (base64url, 48 chars) or raw (`<workchain>:<64 hex chars>`)
// form. This is a shape check, not a checksum/CRC16 validation — the
// connected wallet still rejects a malformed address itself; this only
// catches obvious typos before spending a round trip to the wallet app.
const FRIENDLY_ADDRESS = /^[A-Za-z0-9_-]{48}$/;
const RAW_ADDRESS = /^-?\d:[0-9a-fA-F]{64}$/;

export function isValidTonAddress(address: string): boolean {
  return FRIENDLY_ADDRESS.test(address) || RAW_ADDRESS.test(address);
}

interface AddressInformationResponse {
  ok?: boolean;
  result?: { balance?: string | number };
}

/**
 * On-chain TON balance for a connected wallet, in whole TON.
 *
 * This is the one genuinely real balance in the app (spec §9, step 2) — every
 * other holding stays local until per-chain indexers are wired up.
 */
export async function fetchTonBalance(address: string): Promise<number> {
  const url = `${env.tonCenter.base}/getAddressInformation?address=${encodeURIComponent(address)}`;
  const headers = env.tonCenter.apiKey ? { 'X-API-Key': env.tonCenter.apiKey } : {};

  const data = await getJson<AddressInformationResponse>(url, { headers });
  const raw = data.result?.balance;
  const nano = typeof raw === 'string' ? Number.parseFloat(raw) : raw;

  if (typeof nano !== 'number' || !Number.isFinite(nano)) {
    throw new Error('Malformed balance in toncenter response');
  }
  return nano / NANOTON;
}
