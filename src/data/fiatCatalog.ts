import type { FiatAsset } from '@/types/assets';

/**
 * Fiat catalog. As with crypto, `fallbackRate` (USD per 1 unit) is the mockup's
 * snapshot and is replaced by the live FX feed as soon as it responds.
 */
export const fiatCatalog: readonly FiatAsset[] = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', symbol: '$', fallbackRate: 1 },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€', fallbackRate: 1.14 },
  { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺', symbol: '₽', fallbackRate: 1 / 78 },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$', fallbackRate: 0.746 },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£', fallbackRate: 1.27 },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥', fallbackRate: 1 / 156 },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥', fallbackRate: 0.138 },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', symbol: 'د.إ', fallbackRate: 0.272 },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', symbol: 'Fr', fallbackRate: 1.13 },
  { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷', symbol: '₺', fallbackRate: 0.026 },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹', fallbackRate: 0.0114 },
  { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷', symbol: 'R$', fallbackRate: 0.176 },
  { code: 'KZT', name: 'Kazakh Tenge', flag: '🇰🇿', symbol: '₸', fallbackRate: 0.0019 },
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
