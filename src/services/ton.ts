import { env } from '@/config/env';
import { getJson } from './http';

const NANOTON = 1_000_000_000;

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
