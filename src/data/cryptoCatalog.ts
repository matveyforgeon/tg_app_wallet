import type { CryptoAsset } from '@/types/assets';

/**
 * Crypto catalog — TON network only.
 *
 * The wallet connects through TON Connect, which yields exactly one address on
 * one chain. Assets that do not exist on TON were removed rather than shown
 * against an address that cannot receive them.
 *
 * Every jetton here carries `jettonMaster` (its master contract address) and
 * `decimals`, both cross-checked against CoinGecko's own listed contract and
 * TonAPI's on-chain, whitelist-verified metadata — real requirements for
 * `SendSheet` to broadcast an actual jetton transfer rather than a local-only
 * debit. tgBTC, jETH and MAJOR were dropped: none of their CoinGecko listings
 * carry a TON platform contract, so there is nothing to verify a transfer
 * against, and shipping a guessed address for a real-money send is worse than
 * not offering the asset at all.
 *
 * `fallbackRate` is a USD snapshot taken 2026-07-25. It exists only so the UI
 * has something to render before the first CoinGecko response and if that
 * response fails; live prices always win (spec §8).
 */
export const cryptoCatalog: readonly CryptoAsset[] = [
  // Native token renamed Toncoin (TON) -> Gram (GRAM) by community vote, June 2026.
  // The network itself is still The Open Network (TON) — see TonConnect, tonOnly* strings.
  { code: 'GRAM', name: 'Gram', bg: 'linear-gradient(135deg,#7fd4ff,#0088cc)', coingeckoId: 'the-open-network', fallbackRate: 1.47 },
  { code: 'USDT', name: 'Tether', bg: 'linear-gradient(135deg,#a6f7c1,#26a17b)', coingeckoId: 'tether', jettonMaster: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs', decimals: 6, fallbackRate: 0.99916 },
  { code: 'jUSDC', name: 'USD Coin', bg: 'linear-gradient(135deg,#c8e3ff,#2775ca)', coingeckoId: 'bridged-usd-coin-ton-bridge', wrappedOf: 'USDC', jettonMaster: 'EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728', decimals: 6, fallbackRate: 0.97681 },
  { code: 'tsTON', name: 'Tonstakers TON', bg: 'linear-gradient(135deg,#a8dcff,#2f7fd6)', coingeckoId: 'tonstakers', jettonMaster: 'EQC98_qAmNEptUtPc7W6xdHh_ZHrBUFpw5Ft_IzNU20QAJav', decimals: 9, fallbackRate: 1.67 },
  { code: 'stTON', name: 'bemo Staked TON', bg: 'linear-gradient(135deg,#bfe8ea,#2fa3a8)', coingeckoId: 'bemo-staked-ton', jettonMaster: 'EQDNhy-nxYFgUqzfUzImBEP67JqsyMIcyk2S5_RwNNEYku0k', decimals: 9, fallbackRate: 1.69 },
  { code: 'hTON', name: 'Hipo Staked TON', bg: 'linear-gradient(135deg,#c9d8ff,#4a63c9)', coingeckoId: 'hipo-staked-ton', jettonMaster: 'EQDPdq8xjAhytYqfGSX8KcFWIReCufsB9Wdg0pLlYSO_h76w', decimals: 9, fallbackRate: 1.55 },
  { code: 'STON', name: 'STON.fi', bg: 'linear-gradient(135deg,#bfe6ff,#2f8fd6)', coingeckoId: 'ston-2', jettonMaster: 'EQA2kCVNwVsil2EM2mB0SkXytxCqQjS4mttjDpnXmwG9T6bO', decimals: 9, fallbackRate: 0.504017 },
  { code: 'DUST', name: 'DeDust', bg: 'linear-gradient(135deg,#ffe0c2,#c98a4e)', coingeckoId: 'scaleton', jettonMaster: 'EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE', decimals: 9, fallbackRate: 0.648587 },
  { code: 'STORM', name: 'Storm Trade', bg: 'linear-gradient(135deg,#c8d4f0,#4a5f9e)', coingeckoId: 'storm-trade', jettonMaster: 'EQBsosmcZrD6FHijA7qWGLw5wo_aH8UN435hi935jJ_STORM', decimals: 9, fallbackRate: 0.00469682 },
  { code: 'EVAA', name: 'EVAA Protocol', bg: 'linear-gradient(135deg,#d5f0e0,#3fa877)', coingeckoId: 'evaa-protocol', jettonMaster: 'EQBKMfjX_a_dsOLm-juxyVZytFP7_KKnzGv6J01kGc72gVBp', decimals: 9, fallbackRate: 0.916564 },
  // Was mislabeled 'GRAM'/'Gram' — CoinGecko's actual symbol/name for this id
  // is GRM/Grm, an unrelated, much smaller jetton. Corrected, and it also
  // clears the collision with the native coin's real GRAM rename above.
  { code: 'GRM', name: 'Grm', bg: 'linear-gradient(135deg,#d6f0e0,#3fa877)', coingeckoId: 'gram-2', jettonMaster: 'EQC47093oX5Xhb0xuk2lCr2RhS8rj-vul61u4W2UH5ORmG_O', decimals: 9, fallbackRate: 0.00110366 },
  { code: 'GOMINING', name: 'GoMining', bg: 'linear-gradient(135deg,#ffe4b8,#d69a2e)', coingeckoId: 'gmt-token', jettonMaster: 'EQD0laik0FgHV8aNfRhebi8GDG2rpDyKGXem0MBfya_Ew1-8', decimals: 18, fallbackRate: 0.289769 },
  { code: 'DUCK', name: 'DuckChain', bg: 'linear-gradient(135deg,#ffeeb8,#e0b53c)', coingeckoId: 'duckchain-token', jettonMaster: 'EQDWXjnVWheFemaAaFn-Cp4nDehvGllrXOZ8wqHm8sDEwn_c', decimals: 9, fallbackRate: 6.63e-05 },
  { code: 'NOT', name: 'Notcoin', bg: 'linear-gradient(135deg,#f3dfa8,#8a6b1f)', coingeckoId: 'notcoin', jettonMaster: 'EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT', decimals: 9, fallbackRate: 0.00035079 },
  { code: 'DOGS', name: 'Dogs', bg: 'linear-gradient(135deg,#cfe4ff,#3f7fd6)', coingeckoId: 'dogs-2', jettonMaster: 'EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS', decimals: 9, fallbackRate: 3.574e-05 },
  { code: 'HMSTR', name: 'Hamster Kombat', bg: 'linear-gradient(135deg,#ffe2b8,#c98a2e)', coingeckoId: 'hamster-kombat', jettonMaster: 'EQAJ8uWd7EBqsmpSWaRdf_I-8R8-XHwh3gsNKhy-UrdrPcUo', decimals: 9, fallbackRate: 0.00018277 },
  { code: 'CATI', name: 'Catizen', bg: 'linear-gradient(135deg,#ffd8b8,#e08a3c)', coingeckoId: 'catizen', jettonMaster: 'EQD-cvR0Nz6XAyRBvbhz-abTrRC6sI5tvHvvpeQraV9UAAD7', decimals: 9, fallbackRate: 0.03748354 },
  { code: 'BLUM', name: 'Blum', bg: 'linear-gradient(135deg,#bfe0ff,#2f7ad6)', coingeckoId: 'blum', jettonMaster: 'EQCAj5oiRRrXokYsg_B-e0KG9xMwh5upr5I8HQzErm0_BLUM', decimals: 9, fallbackRate: 0.00167881 },
  { code: 'CATS', name: 'TON Cats', bg: 'linear-gradient(135deg,#ffd6e0,#d64f7a)', coingeckoId: 'ton-cats-jetton', jettonMaster: 'EQBadq9p12uC1KfSiPCAaoEvhpXPHj7hBWq-mqGntuwE2C1C', decimals: 9, fallbackRate: 2.683e-05 },
  { code: 'GOATS', name: 'Goats', bg: 'linear-gradient(135deg,#e0e8c2,#8a9e3c)', coingeckoId: 'goats-2', jettonMaster: 'EQC2CUQqMJuVkO_ioXE9MvW9ckNBuxqFB7Xce7BgwFnWagem', decimals: 9, fallbackRate: 8.684e-05 },
  { code: 'REDO', name: 'Resistance Dog', bg: 'linear-gradient(135deg,#ffd4cc,#c9563f)', coingeckoId: 'resistance-dog', jettonMaster: 'EQBZ_cafPyDr5KUTs0aNxh0ZTDhkpEZONmLJA2SNGlLm4Cko', decimals: 9, fallbackRate: 0.100484 },
  { code: 'WIF', name: 'dogwifhood', bg: 'linear-gradient(135deg,#ffe0b8,#d18f4e)', coingeckoId: 'dogwifhood', jettonMaster: 'EQAuco5ZEPgB19fSTo7EmtLTJysrKxbu6M_XOFDwWQiNjCsQ', decimals: 9, fallbackRate: 6.093e-05 },
  { code: 'JETTON', name: 'JetTon Games', bg: 'linear-gradient(135deg,#d8c2ff,#6b3fc9)', coingeckoId: 'jetton', jettonMaster: 'EQAQXlWJvGbbFfE8F3oS8s87lIgdovS455IsWFaRdmJetTon', decimals: 9, fallbackRate: 0.02460458 },
  { code: 'PUNK', name: 'PunkCity', bg: 'linear-gradient(135deg,#ffc2d8,#c93f7a)', coingeckoId: 'punk-2', jettonMaster: 'EQCdpz6QhJtDtm2s9-krV2ygl45Pwl-KJJCV1-XrP-Xuuxoq', decimals: 9, fallbackRate: 0.00771655 },
  { code: 'ANON', name: 'ANON', bg: 'linear-gradient(135deg,#d0d0d8,#43434f)', coingeckoId: 'anon-ton', jettonMaster: 'EQDv-yr41_CZ2urg2gfegVfa44PDPjIK9F-MilEDKDUIhlwZ', decimals: 9, fallbackRate: 0.00048182 },
  { code: 'ARBUZ', name: 'ARBUZ', bg: 'linear-gradient(135deg,#ffc2c2,#3fa85c)', coingeckoId: 'arbuz', jettonMaster: 'EQAM2KWDp9lN0YvxvfSbI0ryjBXwM70rakpNIHbuETatRWA1', decimals: 9, fallbackRate: 0.01088331 },
  { code: 'BOLT', name: 'Huebel Bolt', bg: 'linear-gradient(135deg,#fff0b8,#d6b02e)', coingeckoId: 'huebel-bolt', jettonMaster: 'EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw', decimals: 9, fallbackRate: 0.02412451 },
  { code: 'GEMSTON', name: 'GEMSTON', bg: 'linear-gradient(135deg,#c2f0ff,#2fb0d6)', coingeckoId: 'gemston', jettonMaster: 'EQBX6K9aXVl3nXINCyPPL86C4ONVmQ8vK360u6dykFKXpHCa', decimals: 9, fallbackRate: 0.102156 },
  { code: 'WEB3', name: 'Web3 TON', bg: 'linear-gradient(135deg,#d8d8ff,#5a5ad6)', coingeckoId: 'web3-ton-token', jettonMaster: 'EQBtcL4JA-PdPiUkB8utHcqdaftmUSTqdL8Z1EeXePLti_nK', decimals: 3, fallbackRate: 0.00576603 },
  // Was mislabeled 'GLINT'/'Glint Coin' — CoinGecko still lists this exact
  // contract under coingeckoId 'glint-coin' (vanity address ends "-GLINT"),
  // but TonAPI's whitelisted on-chain metadata for it now reads "Art Coin"
  // (ART) — the project appears to have rebranded on the same contract, the
  // same way GRAM did. Corrected code/name to match current on-chain truth.
  { code: 'ART', name: 'Art Coin', bg: 'linear-gradient(135deg,#ffeec2,#d6a92e)', coingeckoId: 'glint-coin', jettonMaster: 'EQCBdxpECfEPH2wUxi1a6QiOkSf-5qDjUWqLCUuKtD-GLINT', decimals: 9, fallbackRate: 0.00373174 },
];

const BY_CODE = new Map(cryptoCatalog.map((asset) => [asset.code, asset]));

export function findCrypto(code: string): CryptoAsset | undefined {
  return BY_CODE.get(code);
}
