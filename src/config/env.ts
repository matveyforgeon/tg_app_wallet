/**
 * Typed access to the `VITE_*` environment surface described in `.env.example`.
 * Everything is optional — each getter falls back to a public endpoint so the
 * app still runs (with the bundled offline snapshot) on a bare checkout.
 */

const raw = import.meta.env;

function str(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

function optionalStr(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function num(value: unknown, fallback: number, min: number): number {
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : Number.NaN;
  return Number.isFinite(parsed) ? Math.max(min, parsed) : fallback;
}

export type FxProvider = 'exchangerate-host' | 'open';

function fxProvider(value: unknown): FxProvider {
  return value === 'open' ? 'open' : 'exchangerate-host';
}

export const env = {
  appVersion: str(raw.VITE_APP_VERSION, '1.0.0'),
  isDev: raw.DEV,

  tonConnect: {
    /** Falls back to the manifest served from `public/` (fine for local dev). */
    manifestUrl: str(
      raw.VITE_TONCONNECT_MANIFEST_URL,
      `${globalThis.location?.origin ?? ''}/tonconnect-manifest.json`,
    ),
  },

  tonCenter: {
    base: str(raw.VITE_TONCENTER_API_BASE, 'https://toncenter.com/api/v2'),
    apiKey: optionalStr(raw.VITE_TONCENTER_API_KEY),
  },

  coinGecko: {
    base: str(raw.VITE_COINGECKO_API_BASE, 'https://api.coingecko.com/api/v3'),
    apiKey: optionalStr(raw.VITE_COINGECKO_API_KEY),
  },

  fx: {
    provider: fxProvider(raw.VITE_FX_PROVIDER),
    base: str(raw.VITE_FX_API_BASE, 'https://api.exchangerate.host'),
    apiKey: optionalStr(raw.VITE_FX_API_KEY),
  },

  /** Live-rate refresh cadence. Spec §1 asks for 30-60s. */
  ratesRefreshMs: num(raw.VITE_RATES_REFRESH_MS, 45_000, 30_000),
} as const;
