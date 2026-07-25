import type { CryptoAsset } from '@/types/assets';

/**
 * Crypto catalog.
 *
 * `fallbackRate` is a USD snapshot taken on 2026-07-25. It exists only so the
 * UI has something to render before the first CoinGecko response and if that
 * response fails; live prices always win (spec §8). Never present these as
 * current prices.
 */
export const cryptoCatalog: readonly CryptoAsset[] = [
  { code: 'TON', name: 'Toncoin', bg: 'linear-gradient(135deg,#7fd4ff,#0088cc)', coingeckoId: 'the-open-network', fallbackRate: 1.47, tonNetwork: true },
  { code: 'BTC', name: 'Bitcoin', bg: 'linear-gradient(135deg,#ffcf7a,#f7931a)', coingeckoId: 'bitcoin', fallbackRate: 64002 },
  { code: 'ETH', name: 'Ethereum', bg: 'linear-gradient(135deg,#c8c9ff,#6b7cff)', coingeckoId: 'ethereum', fallbackRate: 1856.92 },
  { code: 'DOGE', name: 'Dogecoin', bg: 'linear-gradient(135deg,#d4b3ff,#8247e5)', coingeckoId: 'dogecoin', fallbackRate: 0.069441 },
  { code: 'PEPE', name: 'Pepe', bg: 'linear-gradient(135deg,#a6f7c1,#3fce6b)', coingeckoId: 'pepe', fallbackRate: 2.68e-06 },
  { code: 'SHIB', name: 'Shiba Inu', bg: 'linear-gradient(135deg,#ffb199,#ff5e3a)', coingeckoId: 'shiba-inu', fallbackRate: 4.25e-06 },
  { code: 'SOL', name: 'Solana', bg: 'linear-gradient(135deg,#c9f7e0,#14f195)', coingeckoId: 'solana', fallbackRate: 73.83 },
  { code: 'USDT', name: 'Tether', bg: 'linear-gradient(135deg,#a6f7c1,#26a17b)', coingeckoId: 'tether', fallbackRate: 0.999158, tonNetwork: true },
  { code: 'USDC', name: 'USD Coin', bg: 'linear-gradient(135deg,#c8e3ff,#2775ca)', coingeckoId: 'usd-coin', fallbackRate: 0.999701 },
  { code: 'BNB', name: 'BNB', bg: 'linear-gradient(135deg,#ffe9a8,#f3ba2f)', coingeckoId: 'binancecoin', fallbackRate: 565.11 },
  { code: 'XRP', name: 'XRP', bg: 'linear-gradient(135deg,#e6e6e6,#8a8a8a)', coingeckoId: 'ripple', fallbackRate: 1.089 },
  { code: 'ADA', name: 'Cardano', bg: 'linear-gradient(135deg,#a0c9ff,#1e5bcf)', coingeckoId: 'cardano', fallbackRate: 0.162539 },
  { code: 'LTC', name: 'Litecoin', bg: 'linear-gradient(135deg,#dfe6ec,#a6b3bd)', coingeckoId: 'litecoin', fallbackRate: 45.93 },
  { code: 'TRX', name: 'Tron', bg: 'linear-gradient(135deg,#ffd0d0,#ff3b3b)', coingeckoId: 'tron', fallbackRate: 0.329717 },
  { code: 'XMR', name: 'Monero', bg: 'linear-gradient(135deg,#ffc9a8,#ff6600)', coingeckoId: 'monero', fallbackRate: 365.38 },
  { code: 'BCH', name: 'Bitcoin Cash', bg: 'linear-gradient(135deg,#c2f0d8,#0ac18e)', coingeckoId: 'bitcoin-cash', fallbackRate: 210.74 },
  { code: 'ETC', name: 'Ethereum Classic', bg: 'linear-gradient(135deg,#b6e8c8,#3ab760)', coingeckoId: 'ethereum-classic', fallbackRate: 6.59 },
  { code: 'DOT', name: 'Polkadot', bg: 'linear-gradient(135deg,#ffb3d9,#e6007a)', coingeckoId: 'polkadot', fallbackRate: 0.812881 },
  { code: 'AVAX', name: 'Avalanche', bg: 'linear-gradient(135deg,#ffb3b3,#e84142)', coingeckoId: 'avalanche-2', fallbackRate: 6.29 },
  { code: 'ATOM', name: 'Cosmos', bg: 'linear-gradient(135deg,#c5c9f0,#3b3f5c)', coingeckoId: 'cosmos', fallbackRate: 1.38 },
  { code: 'NEAR', name: 'NEAR Protocol', bg: 'linear-gradient(135deg,#d5f5c8,#00c08b)', coingeckoId: 'near', fallbackRate: 1.79 },
  { code: 'APT', name: 'Aptos', bg: 'linear-gradient(135deg,#cfd6dd,#2b3644)', coingeckoId: 'aptos', fallbackRate: 0.601741 },
  { code: 'SUI', name: 'Sui', bg: 'linear-gradient(135deg,#a8dcff,#4da2ff)', coingeckoId: 'sui', fallbackRate: 0.703854 },
  { code: 'XLM', name: 'Stellar', bg: 'linear-gradient(135deg,#dfe4ea,#7d8998)', coingeckoId: 'stellar', fallbackRate: 0.177455 },
  { code: 'ALGO', name: 'Algorand', bg: 'linear-gradient(135deg,#e5e5e5,#4a4a4a)', coingeckoId: 'algorand', fallbackRate: 0.084324 },
  { code: 'HBAR', name: 'Hedera', bg: 'linear-gradient(135deg,#cdd6e8,#2a3446)', coingeckoId: 'hedera-hashgraph', fallbackRate: 0.069965 },
  { code: 'VET', name: 'VeChain', bg: 'linear-gradient(135deg,#bfe3ff,#15bdff)', coingeckoId: 'vechain', fallbackRate: 0.00458846 },
  { code: 'KAS', name: 'Kaspa', bg: 'linear-gradient(135deg,#b8ede4,#49c5b1)', coingeckoId: 'kaspa', fallbackRate: 0.02760361 },
  { code: 'ICP', name: 'Internet Computer', bg: 'linear-gradient(135deg,#f7c3e0,#8a3ffc)', coingeckoId: 'internet-computer', fallbackRate: 2.12 },
  { code: 'FIL', name: 'Filecoin', bg: 'linear-gradient(135deg,#a8e0ff,#0090ff)', coingeckoId: 'filecoin', fallbackRate: 0.71809 },
  { code: 'TIA', name: 'Celestia', bg: 'linear-gradient(135deg,#dcc6ff,#7b2bf9)', coingeckoId: 'celestia', fallbackRate: 0.336254 },
  { code: 'SEI', name: 'Sei', bg: 'linear-gradient(135deg,#ffcfc4,#b4482f)', coingeckoId: 'sei-network', fallbackRate: 0.04401687 },
  { code: 'INJ', name: 'Injective', bg: 'linear-gradient(135deg,#bfe0ff,#00a3ff)', coingeckoId: 'injective-protocol', fallbackRate: 5.16 },
  { code: 'ARB', name: 'Arbitrum', bg: 'linear-gradient(135deg,#a9c9ff,#28405c)', coingeckoId: 'arbitrum', fallbackRate: 0.082946 },
  { code: 'OP', name: 'Optimism', bg: 'linear-gradient(135deg,#ffb3b8,#ff0420)', coingeckoId: 'optimism', fallbackRate: 0.091948 },
  { code: 'POL', name: 'Polygon', bg: 'linear-gradient(135deg,#c9b3ff,#8247e5)', coingeckoId: 'polygon-ecosystem-token', fallbackRate: 0.076933 },
  { code: 'IMX', name: 'Immutable', bg: 'linear-gradient(135deg,#bfe8ff,#0b7fd4)', coingeckoId: 'immutable-x', fallbackRate: 0.123946 },
  { code: 'UNI', name: 'Uniswap', bg: 'linear-gradient(135deg,#ffc2e0,#ff007a)', coingeckoId: 'uniswap', fallbackRate: 3.67 },
  { code: 'AAVE', name: 'Aave', bg: 'linear-gradient(135deg,#c6ecf5,#2ebac6)', coingeckoId: 'aave', fallbackRate: 90.8 },
  { code: 'MKR', name: 'Maker', bg: 'linear-gradient(135deg,#a9e5d8,#1aab9b)', coingeckoId: 'maker', fallbackRate: 1356.63 },
  { code: 'DAI', name: 'Dai', bg: 'linear-gradient(135deg,#ffe3a8,#f5ac37)', coingeckoId: 'dai', fallbackRate: 1 },
  { code: 'GRT', name: 'The Graph', bg: 'linear-gradient(135deg,#c9c2ff,#6747ed)', coingeckoId: 'the-graph', fallbackRate: 0.01575574 },
  { code: 'CAKE', name: 'PancakeSwap', bg: 'linear-gradient(135deg,#ffe4c2,#d1884f)', coingeckoId: 'pancakeswap-token', fallbackRate: 1.4 },
  { code: 'JUP', name: 'Jupiter', bg: 'linear-gradient(135deg,#c9f7e8,#3fd1b0)', coingeckoId: 'jupiter-exchange-solana', fallbackRate: 0.184691 },
  { code: 'ONDO', name: 'Ondo', bg: 'linear-gradient(135deg,#c2d8ff,#3b5fd9)', coingeckoId: 'ondo-finance', fallbackRate: 0.379951 },
  { code: 'ENA', name: 'Ethena', bg: 'linear-gradient(135deg,#e8e0ff,#6b5bd6)', coingeckoId: 'ethena', fallbackRate: 0.086185 },
  { code: 'RNDR', name: 'Render', bg: 'linear-gradient(135deg,#e2e2e2,#5b5b5b)', coingeckoId: 'render-token', fallbackRate: 1.44 },
  { code: 'WLD', name: 'Worldcoin', bg: 'linear-gradient(135deg,#e0e0e0,#4d4d4d)', coingeckoId: 'worldcoin-wld', fallbackRate: 0.343145 },
  { code: 'WIF', name: 'dogwifhat', bg: 'linear-gradient(135deg,#ffe0b8,#d18f4e)', coingeckoId: 'dogwifcoin', fallbackRate: 0.147633 },
  { code: 'BONK', name: 'Bonk', bg: 'linear-gradient(135deg,#ffe08a,#e8a317)', coingeckoId: 'bonk', fallbackRate: 2.95e-06 },
  { code: 'FLOKI', name: 'Floki', bg: 'linear-gradient(135deg,#ffd6a8,#e8763a)', coingeckoId: 'floki', fallbackRate: 2.088e-05 },
  { code: 'NOT', name: 'Notcoin', bg: 'linear-gradient(135deg,#f3dfa8,#8a6b1f)', coingeckoId: 'notcoin', fallbackRate: 0.00034984, tonNetwork: true },
  { code: 'DOGS', name: 'Dogs', bg: 'linear-gradient(135deg,#cfe4ff,#3f7fd6)', coingeckoId: 'dogs-2', fallbackRate: 3.575e-05, tonNetwork: true },
  { code: 'HMSTR', name: 'Hamster Kombat', bg: 'linear-gradient(135deg,#ffe2b8,#c98a2e)', coingeckoId: 'hamster-kombat', fallbackRate: 0.0001816, tonNetwork: true },
  { code: 'CATI', name: 'Catizen', bg: 'linear-gradient(135deg,#ffd8b8,#e08a3c)', coingeckoId: 'catizen', fallbackRate: 0.03758759, tonNetwork: true },
  { code: 'MAJOR', name: 'Major', bg: 'linear-gradient(135deg,#e8d6ff,#7a52c9)', coingeckoId: 'major', fallbackRate: 0.03518858, tonNetwork: true },
  { code: 'STON', name: 'STON.fi', bg: 'linear-gradient(135deg,#bfe6ff,#2f8fd6)', coingeckoId: 'ston', fallbackRate: 4.71e-06, tonNetwork: true },
  { code: 'STORM', name: 'Storm', bg: 'linear-gradient(135deg,#c8d4f0,#4a5f9e)', coingeckoId: 'storm', fallbackRate: 3.262e-05, tonNetwork: true },
  { code: 'GRAM', name: 'Gram', bg: 'linear-gradient(135deg,#d6f0e0,#3fa877)', coingeckoId: 'gram-2', fallbackRate: 0.00101273, tonNetwork: true },
  { code: 'REDO', name: 'Resistance Dog', bg: 'linear-gradient(135deg,#ffd4cc,#c9563f)', coingeckoId: 'resistance-dog', fallbackRate: 0.100861, tonNetwork: true },
];

/**
 * Coins offered as quick-select chips in the Send / Buy sheets.
 * The chip row scrolls horizontally, so this can grow without breaking layout.
 * Receive does not use chips — it has its own searchable TON-network list.
 */
export const quickAssetCodes = ['TON', 'BTC', 'ETH', 'SOL', 'DOGE', 'PEPE', 'USDT', 'NOT', 'BNB', 'XRP'] as const;

/**
 * Assets that actually exist on the TON network — the only ones the Receive
 * sheet can offer, since TON Connect gives us exactly one address (spec §3 asks
 * for per-chain addresses, which needs per-chain key derivation we do not have).
 */
export const tonNetworkAssets: readonly CryptoAsset[] = cryptoCatalog.filter((a) => a.tonNetwork === true);

const BY_CODE = new Map(cryptoCatalog.map((asset) => [asset.code, asset]));

export function findCrypto(code: string): CryptoAsset | undefined {
  return BY_CODE.get(code);
}
