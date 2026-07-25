import { findCrypto } from './cryptoCatalog';
import type { AddressFormat } from '@/types/assets';

/**
 * Per-format receive addresses.
 *
 * These are placeholders, kept so each chain's address *shape* is visibly
 * different — TON base64url vs BTC bech32 vs EVM hex vs Solana base58 vs
 * Cosmos bech32, and so on (spec §3, Receive).
 *
 * Only TON is real, and only when a wallet is connected — see `ReceiveSheet`.
 * Everything else needs per-chain key derivation before it can show a user's
 * own address.
 */
const BY_FORMAT: Readonly<Record<AddressFormat, string>> = {
  ton: 'UQAb3f8x9K2mQnZp7cJ4h1sYtR6vLd9f2',
  evm: '0x8f3Cc1B4e6D2a9F17c0B5E3d4A2F6C8b1D9E0a7F',
  btc: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  bch: 'bitcoincash:qr95sy3j9xwd2ap32xkykttr4cvcu7as4y0qverfuy',
  ltc: 'ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjc9j8n',
  doge: 'D8s7Kx2mQpL4vN6rT9yU1wZ3aC5bE7fH2j',
  solana: '7xKXtg2CW3ed1Q4NVLNJynz3aBHb9pM9SdYrFpP6mQY',
  bnb: 'bnb1x9k2m4p7q1r3t5v8w0y2a4b6c8d0e2f',
  xrp: 'rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh',
  ada: 'addr1qx2k9m4p7q1r3t5v8w0y2a4b6c8d0e2f5g7h9j',
  tron: 'TQn9Y2khDD95J42FQtQTdwVVR93aQ7wF8m',
  dot: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
  atom: 'cosmos1x9k2m4p7q1r3t5v8w0y2a4b6c8d0e2f5g7h9j',
  near: 'wallet.near',
  apt: '0x1f2e3d4c5b6a798877665544332211009f8e7d6c5b4a39281706f5e4d3c2b1a0',
  sui: '0x9a8b7c6d5e4f30291827364554637281f0e9d8c7b6a5948372615043b2c1d0e9',
  xlm: 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H',
  algo: 'RTBRC3PYFYRQ6NPO7VNBGVDRHKQ3JLR7RRUYJQ2G4KYCWKBBUXWMKPTVEE',
  hbar: '0.0.4815162',
  kas: 'kaspa:qz0s3m4p7q1r3t5v8w0y2a4b6c8d0e2f5g7h9j1k3m5p7q9r',
  icp: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
  fil: 'f1x9k2m4p7q1r3t5v8w0y2a4b6c8d0e2f5g7h9j',
  tia: 'celestia1x9k2m4p7q1r3t5v8w0y2a4b6c8d0e2f5g7h9j',
  sei: 'sei1x9k2m4p7q1r3t5v8w0y2a4b6c8d0e2f5g7h9j',
  inj: 'inj1x9k2m4p7q1r3t5v8w0y2a4b6c8d0e2f5g7h9j',
  xmr: '48jewbtxe4jU3MnzJFjTs3gVFWh2nRrAMLLXQAQPZeZ8VYnhrjhFAicKpBpyKW1G',
};

export function placeholderAddress(code: string): string {
  const format = findCrypto(code)?.addressFormat ?? 'ton';
  return BY_FORMAT[format];
}
