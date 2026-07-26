import { findFiat } from '@/data/fiatCatalog';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useCryptoChange, useCryptoRate, useFiatRate } from '@/store/ratesStore';
import { useSettingsStore } from '@/store/settingsStore';

export interface PortfolioTotals {
  /** Total portfolio value expressed in the selected base currency. */
  totalInBase: number;
  baseSymbol: string;
  /** 24h change value-weighted across the crypto holdings shown on this screen, in percent. */
  change24h: number;
}

/**
 * Hero total (spec §3): `sum(crypto × price) + sum(fiat × FX)`, converted into
 * the base currency. Recomputed whenever holdings or live rates change — it is
 * never a static figure.
 */
export function usePortfolioTotals(): PortfolioTotals {
  const crypto = usePortfolioStore((state) => state.crypto);
  const fiat = usePortfolioStore((state) => state.fiat);
  const baseCurrency = useSettingsStore((state) => state.baseCurrency);

  const cryptoRate = useCryptoRate();
  const cryptoChange = useCryptoChange();
  const fiatRate = useFiatRate();

  let cryptoUsd = 0;
  let weightedChange = 0;
  for (const holding of crypto) {
    const value = holding.amount * cryptoRate(holding.code);
    cryptoUsd += value;
    weightedChange += value * cryptoChange(holding.code);
  }

  let fiatUsd = 0;
  for (const balance of fiat) {
    fiatUsd += balance.amount * fiatRate(balance.code);
  }

  const baseRate = fiatRate(baseCurrency) || 1;

  return {
    totalInBase: (cryptoUsd + fiatUsd) / baseRate,
    baseSymbol: findFiat(baseCurrency)?.symbol ?? '$',
    // Weighted against the crypto slice only, not the full balance. Fiat
    // holdings (Bank tab, not shown on this screen) never move day to day in
    // this app, so folding them into the denominator dilutes the percentage
    // toward zero without anything on screen explaining why — with fiat
    // usually the larger share of total value, a real +2% day across every
    // crypto row read as a barely-visible +0.4% header. Weighting by the
    // assets actually listed below it is what "today" on this screen means.
    change24h: cryptoUsd > 0 ? weightedChange / cryptoUsd : 0,
  };
}
