/**
 * Per-chain receive addresses.
 *
 * These are the mockup's placeholders, kept so each chain's address *format* is
 * visibly different (TON base64url vs BTC bech32 vs ETH hex vs Solana base58).
 * Only TON is real, and only when a wallet is connected — see
 * `useReceiveAddress`. Everything else needs real per-chain key derivation
 * before it can show a user's own address (spec §3, Receive).
 */
export const PLACEHOLDER_ADDRESSES: Readonly<Record<string, string>> = {
  TON: 'UQAb3f8x9K2mQnZp7cJ4h1sYtR6vLd9f2',
  BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  ETH: '0x8f3Cc1B4e6D2a9F17c0B5E3d4A2F6C8b1D9E0a7F',
  DOGE: 'D8s7Kx2mQpL4vN6rT9yU1wZ3aC5bE7fH2j',
  PEPE: '0x2aC9d4B7e1F3c6A8b0D5E2f4C7A9b1D3E6F8',
  SHIB: '0x5D2c8A1f4B7e9C3d6A0b2E5f8C1a4D7b9E2F',
  SOL: '7xKXtg2CW3ed1Q4NVLNJynz3aBHb9pM9SdYrFpP6mQY',
  USDT: '0x4B7e2A9c1D6f8B3e0A5c7D2f9B4e1A8c6D3F',
  USDC: '0x9C3e6A1b8D5f2C7a4B0e9D6c3A8f1B5e2D7C',
  BNB: 'bnb1x9k2m4p7q1r3t5v8w0y2a4b6c8d0e2f',
  XRP: 'rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh',
  ADA: 'addr1qx2k9m4p7q1r3t5v8w0y2a4b6c8d0e2f5g7h9j',
  LTC: 'ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjc9j8n',
  TRX: 'TQn9Y2khDD95J42FQtQTdwVVR93aQ7wF8m',
};

export function placeholderAddress(code: string): string {
  return PLACEHOLDER_ADDRESSES[code] ?? PLACEHOLDER_ADDRESSES.TON ?? '';
}
