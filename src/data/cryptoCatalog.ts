import type { CryptoAsset } from '@/types/assets';

/**
 * Crypto catalog. `fallbackRate` values are the mockup's hardcoded snapshot
 * (late Jul 2026) and exist only so the UI has something to render before the
 * first CoinGecko response — and if that call fails (spec §8).
 */
export const cryptoCatalog: readonly CryptoAsset[] = [
  { code: 'TON', name: 'Toncoin', bg: 'linear-gradient(135deg,#7fd4ff,#0088cc)', coingeckoId: 'the-open-network', fallbackRate: 3.03 },
  { code: 'BTC', name: 'Bitcoin', bg: 'linear-gradient(135deg,#ffcf7a,#f7931a)', coingeckoId: 'bitcoin', fallbackRate: 117744 },
  { code: 'ETH', name: 'Ethereum', bg: 'linear-gradient(135deg,#c8c9ff,#6b7cff)', coingeckoId: 'ethereum', fallbackRate: 4413.36 },
  { code: 'DOGE', name: 'Dogecoin', bg: 'linear-gradient(135deg,#d4b3ff,#8247e5)', coingeckoId: 'dogecoin', fallbackRate: 0.23 },
  { code: 'PEPE', name: 'Pepe', bg: 'linear-gradient(135deg,#a6f7c1,#3fce6b)', coingeckoId: 'pepe', fallbackRate: 0.0000037 },
  { code: 'SHIB', name: 'Shiba Inu', bg: 'linear-gradient(135deg,#ffb199,#ff5e3a)', coingeckoId: 'shiba-inu', fallbackRate: 0.0000089 },
  { code: 'SOL', name: 'Solana', bg: 'linear-gradient(135deg,#c9f7e0,#14f195)', coingeckoId: 'solana', fallbackRate: 188.28 },
  { code: 'USDT', name: 'Tether', bg: 'linear-gradient(135deg,#a6f7c1,#26a17b)', coingeckoId: 'tether', fallbackRate: 1 },
  { code: 'USDC', name: 'USD Coin', bg: 'linear-gradient(135deg,#c8e3ff,#2775ca)', coingeckoId: 'usd-coin', fallbackRate: 1 },
  { code: 'BNB', name: 'BNB', bg: 'linear-gradient(135deg,#ffe9a8,#f3ba2f)', coingeckoId: 'binancecoin', fallbackRate: 834.95 },
  { code: 'XRP', name: 'XRP', bg: 'linear-gradient(135deg,#e6e6e6,#8a8a8a)', coingeckoId: 'ripple', fallbackRate: 3.1 },
  { code: 'ADA', name: 'Cardano', bg: 'linear-gradient(135deg,#a0c9ff,#1e5bcf)', coingeckoId: 'cardano', fallbackRate: 0.92 },
  { code: 'LTC', name: 'Litecoin', bg: 'linear-gradient(135deg,#dfe6ec,#a6b3bd)', coingeckoId: 'litecoin', fallbackRate: 102.89 },
  { code: 'TRX', name: 'Tron', bg: 'linear-gradient(135deg,#ffd0d0,#ff3b3b)', coingeckoId: 'tron', fallbackRate: 0.35 },
];

/** Coins offered as quick-select chips in the Receive / Send / Buy sheets. */
export const quickAssetCodes = ['TON', 'BTC', 'ETH', 'DOGE', 'PEPE', 'SOL'] as const;

export function findCrypto(code: string): CryptoAsset | undefined {
  return cryptoCatalog.find((asset) => asset.code === code);
}
