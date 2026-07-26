import { create } from 'zustand';
import type { AssetRef, CryptoHolding, FiatBalance } from '@/types/assets';

/**
 * Holdings shared by Wallet, Bank and Swap — a swap has to debit one and credit
 * the other, so they live in one store (spec §1).
 *
 * Starts empty — no demo balances. GRAM is overwritten with the real on-chain
 * balance whenever a wallet is connected (spec §9, step 2); every other
 * holding here (other crypto, all fiat) is a purely local number this app
 * itself tracks, never anything read from or written to a real ledger.
 */

interface PortfolioState {
  crypto: CryptoHolding[];
  fiat: FiatBalance[];
  /** True while TON's amount comes from the connected wallet, not the seed. */
  tonIsOnChain: boolean;

  getCryptoAmount: (code: string) => number;
  getFiatAmount: (code: string) => number;
  getAmount: (asset: AssetRef) => number;
  /** Credits or debits a holding, creating the row if needed. Never goes below 0. */
  adjust: (asset: AssetRef, delta: number) => void;

  setTonBalance: (amount: number) => void;
  clearOnChainBalance: () => void;

  addFiat: (code: string) => void;
  removeFiat: (code: string) => void;
  /** Restores the seed positions (log out). */
  resetAll: () => void;
}

const SEED_CRYPTO: CryptoHolding[] = [];

const SEED_FIAT: FiatBalance[] = [];

/** No seeded GRAM position anymore — disconnecting a wallet now zeroes it. */
const SEED_TON_AMOUNT = 0;

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  crypto: SEED_CRYPTO.map((h) => ({ ...h })),
  fiat: SEED_FIAT.map((b) => ({ ...b })),
  tonIsOnChain: false,

  getCryptoAmount: (code) => get().crypto.find((h) => h.code === code)?.amount ?? 0,
  getFiatAmount: (code) => get().fiat.find((b) => b.code === code)?.amount ?? 0,
  getAmount: (asset) =>
    asset.type === 'crypto' ? get().getCryptoAmount(asset.code) : get().getFiatAmount(asset.code),

  adjust: (asset, delta) => {
    if (asset.type === 'crypto') {
      set((state) => {
        const existing = state.crypto.find((h) => h.code === asset.code);
        if (!existing) {
          return { crypto: [...state.crypto, { code: asset.code, amount: Math.max(0, delta), change: 0 }] };
        }
        return {
          crypto: state.crypto.map((h) =>
            h.code === asset.code ? { ...h, amount: Math.max(0, h.amount + delta) } : h,
          ),
        };
      });
      return;
    }

    set((state) => {
      const existing = state.fiat.find((b) => b.code === asset.code);
      if (!existing) {
        return { fiat: [...state.fiat, { code: asset.code, amount: Math.max(0, delta) }] };
      }
      return {
        fiat: state.fiat.map((b) =>
          b.code === asset.code ? { ...b, amount: Math.max(0, b.amount + delta) } : b,
        ),
      };
    });
  },

  setTonBalance: (amount) =>
    set((state) => ({
      tonIsOnChain: true,
      crypto: state.crypto.some((h) => h.code === 'GRAM')
        ? state.crypto.map((h) => (h.code === 'GRAM' ? { ...h, amount } : h))
        : [{ code: 'GRAM', amount, change: 0 }, ...state.crypto],
    })),

  clearOnChainBalance: () =>
    set((state) => ({
      tonIsOnChain: false,
      crypto: state.crypto.map((h) => (h.code === 'GRAM' ? { ...h, amount: SEED_TON_AMOUNT } : h)),
    })),

  addFiat: (code) =>
    set((state) =>
      state.fiat.some((b) => b.code === code) ? state : { fiat: [...state.fiat, { code, amount: 0 }] },
    ),

  removeFiat: (code) => set((state) => ({ fiat: state.fiat.filter((b) => b.code !== code) })),

  resetAll: () =>
    set({
      crypto: SEED_CRYPTO.map((h) => ({ ...h })),
      fiat: SEED_FIAT.map((b) => ({ ...b })),
      tonIsOnChain: false,
    }),
}));
