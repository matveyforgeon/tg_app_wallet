import { findFiat } from '@/data/fiatCatalog';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useCryptoChange, useCryptoRate, useFiatRate } from '@/store/ratesStore';
import { useSettingsStore } from '@/store/settingsStore';

export interface PortfolioTotals {
  /** Total portfolio value expressed in the selected base currency. */
  totalInBase: number;
  baseSymbol: string;
  /** Value-weighted 24h change across crypto holdings, in percent. */
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
    change24h: cryptoUsd > 0 ? weightedChange / cryptoUsd : 0,
  };
}
