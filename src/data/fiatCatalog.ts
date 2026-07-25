import type { FiatAsset } from '@/types/assets';

/**
 * Fiat catalog. `fallbackRate` is USD per 1 unit, snapshotted 2026-07-25, and
 * is replaced by the live FX feed as soon as it responds (spec §8).
 */
export const fiatCatalog: readonly FiatAsset[] = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', symbol: '$', fallbackRate: 1.0 },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€', fallbackRate: 1.13769267 },
  { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺', symbol: '₽', fallbackRate: 0.01278012 },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$', fallbackRate: 0.77467495 },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£', fallbackRate: 1.33236515 },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥', fallbackRate: 0.00610416 },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥', fallbackRate: 0.14745124 },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', symbol: 'د.إ', fallbackRate: 0.27229408 },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', symbol: 'Fr', fallbackRate: 1.22262542 },
  { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷', symbol: '₺', fallbackRate: 0.02112968 },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹', fallbackRate: 0.01035049 },
  { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷', symbol: 'R$', fallbackRate: 0.19692281 },
  { code: 'KZT', name: 'Kazakh Tenge', flag: '🇰🇿', symbol: '₸', fallbackRate: 0.00212707 },
];

/** The three options offered as a base currency (spec §3, Settings). */
export const baseCurrencyCodes = ['RUB', 'USD', 'EUR'] as const;
export type BaseCurrency = (typeof baseCurrencyCodes)[number];

export function findFiat(code: string): FiatAsset | undefined {
  return fiatCatalog.find((asset) => asset.code === code);
}

export function isBaseCurrency(value: unknown): value is BaseCurrency {
  return typeof value === 'string' && (baseCurrencyCodes as readonly string[]).includes(value);
}
