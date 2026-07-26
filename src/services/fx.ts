import { env } from '@/config/env';
import { fiatCatalog } from '@/data/fiatCatalog';
import { getJson } from './http';

/**
 * FX client. Returns USD value per 1 unit of each currency — the same
 * orientation the catalog's `fallbackRate` uses, so the two are interchangeable.
 *
 * Three providers are supported because they disagree on both shape and
 * auth: `er-api` needs no key (the default), the other two do.
 */

interface ErApiResponse {
  result?: string;
  rates?: Record<string, number>;
}

interface OpenExchangeResponse {
  rates?: Record<string, number>;
}

interface ExchangerateHostResponse {
  success?: boolean;
  quotes?: Record<string, number>;
}

const WANTED = fiatCatalog.map((asset) => asset.code);

/** Converts a "units per USD" map into "USD per unit", keeping only our codes. */
function invert(perUsd: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const code of WANTED) {
    const rate = perUsd[code];
    if (typeof rate === 'number' && Number.isFinite(rate) && rate > 0) {
      out[code] = 1 / rate;
    }
  }
  return out;
}

export async function fetchFiatRates(): Promise<Record<string, number>> {
  const { provider, base, apiKey } = env.fx;

  if (provider === 'open') {
    const url = `${base}/latest.json?app_id=${encodeURIComponent(apiKey ?? '')}&base=USD`;
    const data = await getJson<OpenExchangeResponse>(url);
    return invert(data.rates ?? {});
  }

  if (provider === 'exchangerate-host') {
    const url = `${base}/live?access_key=${encodeURIComponent(apiKey ?? '')}&source=USD`;
    const data = await getJson<ExchangerateHostResponse>(url);
    // Quotes are keyed "USDEUR", "USDRUB", … — strip the source prefix.
    const perUsd: Record<string, number> = {};
    for (const [pair, rate] of Object.entries(data.quotes ?? {})) {
      if (pair.startsWith('USD') && pair.length === 6) perUsd[pair.slice(3)] = rate;
    }
    return invert(perUsd);
  }

  const data = await getJson<ErApiResponse>(`${base}/latest/USD`);
  if (data.result && data.result !== 'success') {
    throw new Error(`FX provider reported "${data.result}"`);
  }
  return invert(data.rates ?? {});
}
