import { Address, beginCell } from '@ton/core';
import { env } from '@/config/env';
import { getJson } from './http';

/**
 * Builds and locates what a real jetton transfer needs (spec §3, Send):
 * the sender's own jetton-wallet contract address, and the transfer message
 * body that wallet forwards on to the recipient.
 *
 * A jetton transfer is never sent to the jetton master or the recipient
 * directly — it goes to the *sender's own* jetton wallet (a contract derived
 * from owner + jetton master), which then moves the balance and deploys the
 * recipient's jetton wallet if it doesn't exist yet.
 */

function tonApiUrl(subPath: string): string {
  const base = env.tonApi.base;
  return base.startsWith('/') ? `${base}?path=${encodeURIComponent(subPath)}` : `${base}/${subPath}`;
}

interface JettonWalletResponse {
  wallet_address?: { address?: string };
}

/** Resolves the connected wallet's own jetton-wallet address for a given jetton master. */
export async function resolveJettonWallet(owner: string, jettonMaster: string): Promise<string> {
  const headers = env.tonApi.apiKey ? { Authorization: `Bearer ${env.tonApi.apiKey}` } : {};
  const data = await getJson<JettonWalletResponse>(
    tonApiUrl(`accounts/${owner}/jettons/${jettonMaster}`),
    { headers },
  );
  const address = data.wallet_address?.address;
  if (!address) throw new Error('Could not resolve jetton wallet address');
  return address;
}

/** Whole-unit amount to the jetton's own base-unit integer, per its actual decimals (not always 9). */
export function toJettonUnits(amount: number, decimals: number): bigint {
  return BigInt(Math.round(amount * 10 ** decimals));
}

/**
 * The standard jetton transfer body (TEP-74, op `0xf8a7ea5`): amount,
 * destination, and a response destination for any leftover attached TON.
 * No custom or forward payload — this is a plain wallet-to-wallet send, not a
 * call into a DEX or other contract that would need one.
 */
export function buildJettonTransferBody(params: {
  amountUnits: bigint;
  destination: string;
  responseDestination: string;
}): string {
  const body = beginCell()
    .storeUint(0xf8a7ea5, 32)
    .storeUint(BigInt(Date.now()), 64) // query_id — only needs to be unique-ish, never reused for correctness
    .storeCoins(params.amountUnits)
    .storeAddress(Address.parse(params.destination))
    .storeAddress(Address.parse(params.responseDestination))
    .storeBit(false) // no custom payload
    .storeCoins(0n) // no forward_ton_amount — nothing needs a transfer-notification here
    .storeBit(false) // no forward payload
    .endCell();
  return body.toBoc().toString('base64');
}

/** Gas + the recipient's jetton-wallet deployment if it doesn't exist yet. Excess is refunded. */
export const JETTON_TRANSFER_GAS_NANOTON = '50000000'; // 0.05 TON
