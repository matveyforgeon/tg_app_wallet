import type { CryptoAsset } from '@/types/assets';

/**
 * Crypto catalog — TON network only.
 *
 * The wallet connects through TON Connect, which yields exactly one address on
 * one chain. Assets that do not exist on TON were removed rather than shown
 * against an address that cannot receive them.
 *
 * Bitcoin and Ether are present as their TON representations (tgBTC, jETH),
 * which are pegged 1:1 to the underlying asset — so their price is read from
 * the underlying's CoinGecko id. `wrappedOf` records that relationship.
 *
 * `fallbackRate` is a USD snapshot taken 2026-07-25. It exists only so the UI
 * has something to render before the first CoinGecko response and if that
 * response fails; live prices always win (spec §8).
 */
export const cryptoCatalog: readonly CryptoAsset[] = [
  // Native token renamed Toncoin (TON) -> Gram (GRAM) by community vote, June 2026.
  // The network itself is still The Open Network (TON) — see TonConnect, tonOnly* strings.
  { code: 'GRAM', name: 'Gram', bg: 'linear-gradient(135deg,#7fd4ff,#0088cc)', coingeckoId: 'the-open-network', fallbackRate: 1.47 },
  { code: 'tgBTC', name: 'Bitcoin', bg: 'linear-gradient(135deg,#ffcf7a,#f7931a)', coingeckoId: 'bitcoin', wrappedOf: 'BTC', fallbackRate: 64044 },
  { code: 'jETH', name: 'Ether', bg: 'linear-gradient(135deg,#c8c9ff,#6b7cff)', coingeckoId: 'ethereum', wrappedOf: 'ETH', fallbackRate: 1857.76 },
  { code: 'USDT', name: 'Tether', bg: 'linear-gradient(135deg,#a6f7c1,#26a17b)', coingeckoId: 'tether', fallbackRate: 0.99916 },
  { code: 'jUSDC', name: 'USD Coin', bg: 'linear-gradient(135deg,#c8e3ff,#2775ca)', coingeckoId: 'bridged-usd-coin-ton-bridge', wrappedOf: 'USDC', fallbackRate: 0.97681 },
  { code: 'tsTON', name: 'Tonstakers TON', bg: 'linear-gradient(135deg,#a8dcff,#2f7fd6)', coingeckoId: 'tonstakers', fallbackRate: 1.67 },
  { code: 'stTON', name: 'bemo Staked TON', bg: 'linear-gradient(135deg,#bfe8ea,#2fa3a8)', coingeckoId: 'bemo-staked-ton', fallbackRate: 1.69 },
  { code: 'hTON', name: 'Hipo Staked TON', bg: 'linear-gradient(135deg,#c9d8ff,#4a63c9)', coingeckoId: 'hipo-staked-ton', fallbackRate: 1.55 },
  { code: 'STON', name: 'STON.fi', bg: 'linear-gradient(135deg,#bfe6ff,#2f8fd6)', coingeckoId: 'ston-2', fallbackRate: 0.504017 },
  { code: 'DUST', name: 'DeDust', bg: 'linear-gradient(135deg,#ffe0c2,#c98a4e)', coingeckoId: 'scaleton', fallbackRate: 0.648587 },
  { code: 'STORM', name: 'Storm Trade', bg: 'linear-gradient(135deg,#c8d4f0,#4a5f9e)', coingeckoId: 'storm-trade', fallbackRate: 0.00469682 },
  { code: 'EVAA', name: 'EVAA Protocol', bg: 'linear-gradient(135deg,#d5f0e0,#3fa877)', coingeckoId: 'evaa-protocol', fallbackRate: 0.916564 },
  // Was mislabeled 'GRAM'/'Gram' — CoinGecko's actual symbol/name for this id
  // is GRM/Grm, an unrelated, much smaller jetton. Corrected, and it also
  // clears the collision with the native coin's real GRAM rename above.
  { code: 'GRM', name: 'Grm', bg: 'linear-gradient(135deg,#d6f0e0,#3fa877)', coingeckoId: 'gram-2', fallbackRate: 0.00110366 },
  { code: 'GOMINING', name: 'GoMining', bg: 'linear-gradient(135deg,#ffe4b8,#d69a2e)', coingeckoId: 'gmt-token', fallbackRate: 0.289769 },
  { code: 'DUCK', name: 'DuckChain', bg: 'linear-gradient(135deg,#ffeeb8,#e0b53c)', coingeckoId: 'duckchain-token', fallbackRate: 6.63e-05 },
  { code: 'NOT', name: 'Notcoin', bg: 'linear-gradient(135deg,#f3dfa8,#8a6b1f)', coingeckoId: 'notcoin', fallbackRate: 0.00035079 },
  { code: 'DOGS', name: 'Dogs', bg: 'linear-gradient(135deg,#cfe4ff,#3f7fd6)', coingeckoId: 'dogs-2', fallbackRate: 3.574e-05 },
  { code: 'HMSTR', name: 'Hamster Kombat', bg: 'linear-gradient(135deg,#ffe2b8,#c98a2e)', coingeckoId: 'hamster-kombat', fallbackRate: 0.00018277 },
  { code: 'CATI', name: 'Catizen', bg: 'linear-gradient(135deg,#ffd8b8,#e08a3c)', coingeckoId: 'catizen', fallbackRate: 0.03748354 },
  { code: 'MAJOR', name: 'Major', bg: 'linear-gradient(135deg,#e8d6ff,#7a52c9)', coingeckoId: 'major', fallbackRate: 0.03517903 },
  { code: 'BLUM', name: 'Blum', bg: 'linear-gradient(135deg,#bfe0ff,#2f7ad6)', coingeckoId: 'blum', fallbackRate: 0.00167881 },
  { code: 'CATS', name: 'TON Cats', bg: 'linear-gradient(135deg,#ffd6e0,#d64f7a)', coingeckoId: 'ton-cats-jetton', fallbackRate: 2.683e-05 },
  { code: 'GOATS', name: 'Goats', bg: 'linear-gradient(135deg,#e0e8c2,#8a9e3c)', coingeckoId: 'goats-2', fallbackRate: 8.684e-05 },
  { code: 'REDO', name: 'Resistance Dog', bg: 'linear-gradient(135deg,#ffd4cc,#c9563f)', coingeckoId: 'resistance-dog', fallbackRate: 0.100484 },
  { code: 'WIF', name: 'dogwifhood', bg: 'linear-gradient(135deg,#ffe0b8,#d18f4e)', coingeckoId: 'dogwifhood', fallbackRate: 6.093e-05 },
  { code: 'JETTON', name: 'JetTon Games', bg: 'linear-gradient(135deg,#d8c2ff,#6b3fc9)', coingeckoId: 'jetton', fallbackRate: 0.02460458 },
  { code: 'PUNK', name: 'PunkCity', bg: 'linear-gradient(135deg,#ffc2d8,#c93f7a)', coingeckoId: 'punk-2', fallbackRate: 0.00771655 },
  { code: 'ANON', name: 'ANON', bg: 'linear-gradient(135deg,#d0d0d8,#43434f)', coingeckoId: 'anon-ton', fallbackRate: 0.00048182 },
  { code: 'ARBUZ', name: 'ARBUZ', bg: 'linear-gradient(135deg,#ffc2c2,#3fa85c)', coingeckoId: 'arbuz', fallbackRate: 0.01088331 },
  { code: 'BOLT', name: 'Huebel Bolt', bg: 'linear-gradient(135deg,#fff0b8,#d6b02e)', coingeckoId: 'huebel-bolt', fallbackRate: 0.02412451 },
  { code: 'GEMSTON', name: 'GEMSTON', bg: 'linear-gradient(135deg,#c2f0ff,#2fb0d6)', coingeckoId: 'gemston', fallbackRate: 0.102156 },
  { code: 'WEB3', name: 'Web3 TON', bg: 'linear-gradient(135deg,#d8d8ff,#5a5ad6)', coingeckoId: 'web3-ton-token', fallbackRate: 0.00576603 },
  { code: 'GLINT', name: 'Glint Coin', bg: 'linear-gradient(135deg,#ffeec2,#d6a92e)', coingeckoId: 'glint-coin', fallbackRate: 0.00373174 },
];

const BY_CODE = new Map(cryptoCatalog.map((asset) => [asset.code, asset]));

export function findCrypto(code: string): CryptoAsset | undefined {
  return BY_CODE.get(code);
}
