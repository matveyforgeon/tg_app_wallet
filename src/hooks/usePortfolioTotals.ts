import { findFiat } from '@/data/fiatCatalog';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useCryptoChange, useCryptoRate, useFiatRate } from '@/store/ratesStore';
import { useSettingsStore } from '@/store/settingsStore';

export interface PortfolioTotals {
  /** Total portfolio value expressed in the selected base currency. */
  totalInBase: number;
  baseSymbol: string;
  /** 24h change weighted across the whole balance (crypto + fiat), in percent. */
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
  const totalUsd = cryptoUsd + fiatUsd;

  return {
    totalInBase: totalUsd / baseRate,
    baseSymbol: findFiat(baseCurrency)?.symbol ?? '$',
    // Weighted against the full balance, not just the crypto slice — fiat
    // holdings hold their value today, so they dilute the swing exactly as
    // they dilute the total the percentage sits under.
    change24h: totalUsd > 0 ? weightedChange / totalUsd : 0,
  };
}
