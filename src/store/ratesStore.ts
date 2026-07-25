import { create } from 'zustand';
import { cryptoCatalog } from '@/data/cryptoCatalog';
import { fiatCatalog } from '@/data/fiatCatalog';
import { fetchCryptoQuotes } from '@/services/coingecko';
import { HttpError } from '@/services/http';

export type RatesStatus = 'idle' | 'loading' | 'live' | 'stale';

interface LiveQuote {
  usd: number;
  change24h: number;
}

interface RatesState {
  /** Live USD price + 24h change per crypto code. Absent = use the snapshot. */
  cryptoUsd: Record<string, LiveQuote>;
  /** Live USD value per 1 unit of fiat. Populated by the FX feed in Phase 4. */
  fiatUsd: Record<string, number>;
  status: RatesStatus;
  lastUpdated: number | null;
  /** True once a fetch has failed and we are serving cached/snapshot values. */
  usingFallback: boolean;

  refreshCrypto: () => Promise<void>;
}

const CODE_BY_ID = new Map(cryptoCatalog.map((asset) => [asset.coingeckoId, asset.code]));
const ALL_IDS = cryptoCatalog.map((asset) => asset.coingeckoId);

export const useRatesStore = create<RatesState>((set, get) => ({
  cryptoUsd: {},
  fiatUsd: {},
  status: 'idle',
  lastUpdated: null,
  usingFallback: false,

  refreshCrypto: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading' });

    try {
      const quotes = await fetchCryptoQuotes(ALL_IDS);
      // Merge rather than replace: a partial response must not wipe known prices.
      const next = { ...get().cryptoUsd };
      for (const [id, quote] of Object.entries(quotes)) {
        const code = CODE_BY_ID.get(id);
        if (code) next[code] = { usd: quote.usd, change24h: quote.change24h };
      }

      const gotAnything = Object.keys(next).length > 0;
      set({
        cryptoUsd: next,
        status: gotAnything ? 'live' : 'stale',
        usingFallback: !gotAnything,
        lastUpdated: gotAnything ? Date.now() : get().lastUpdated,
      });
    } catch (error) {
      // Rate limits and transient failures must never blank the UI — keep the
      // last known prices and fall back to the snapshot for anything missing.
      if (import.meta.env.DEV) {
        const detail = error instanceof HttpError ? `${error.status}` : String(error);
        console.warn(`[rates] crypto refresh failed (${detail}); serving cached/snapshot values`);
      }
      set({ status: 'stale', usingFallback: true });
    }
  },
}));

const CRYPTO_FALLBACK = new Map(cryptoCatalog.map((a) => [a.code, a.fallbackRate]));
const FIAT_FALLBACK = new Map(fiatCatalog.map((a) => [a.code, a.fallbackRate]));

/** USD price for a crypto code: live if we have it, catalog snapshot otherwise. */
export function cryptoUsdRate(code: string): number {
  const live = useRatesStore.getState().cryptoUsd[code];
  return live ? live.usd : (CRYPTO_FALLBACK.get(code) ?? 0);
}

/** USD value of one unit of a fiat currency, live or snapshot. */
export function fiatUsdRate(code: string): number {
  const live = useRatesStore.getState().fiatUsd[code];
  return typeof live === 'number' ? live : (FIAT_FALLBACK.get(code) ?? 0);
}

/** 24h change % for a crypto code; 0 until the first live response. */
export function cryptoChange24h(code: string): number {
  return useRatesStore.getState().cryptoUsd[code]?.change24h ?? 0;
}

/**
 * Reactive lookups. The imperative helpers above read a snapshot and will not
 * re-render on a refresh, so components must use these instead.
 */
export function useCryptoRate(): (code: string) => number {
  const cryptoUsd = useRatesStore((state) => state.cryptoUsd);
  return (code) => cryptoUsd[code]?.usd ?? CRYPTO_FALLBACK.get(code) ?? 0;
}

export function useCryptoChange(): (code: string) => number {
  const cryptoUsd = useRatesStore((state) => state.cryptoUsd);
  return (code) => cryptoUsd[code]?.change24h ?? 0;
}

export function useFiatRate(): (code: string) => number {
  const fiatUsd = useRatesStore((state) => state.fiatUsd);
  return (code) => fiatUsd[code] ?? FIAT_FALLBACK.get(code) ?? 0;
}
