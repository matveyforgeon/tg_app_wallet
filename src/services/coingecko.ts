import { env } from '@/config/env';
import { getJson } from './http';

/**
 * CoinGecko client. The free tier rate-limits hard (roughly 10-30 req/min), so
 * every consumer batches ids into a single request and polls on a slow timer
 * rather than on interaction (spec §8).
 */

export interface CryptoQuote {
  usd: number;
  change24h: number;
}

function headers(): Record<string, string> {
  if (!env.coinGecko.apiKey) return {};
  // Demo and Pro keys use different header names.
  return env.coinGecko.base.includes('pro-api')
    ? { 'x-cg-pro-api-key': env.coinGecko.apiKey }
    : { 'x-cg-demo-api-key': env.coinGecko.apiKey };
}

interface SimplePriceResponse {
  [id: string]: { usd?: number; usd_24h_change?: number } | undefined;
}

/**
 * One batched call for every tracked coin.
 * Returns a map keyed by CoinGecko id; ids the API omits are simply absent, and
 * the caller keeps its previous value for those.
 */
export async function fetchCryptoQuotes(ids: readonly string[]): Promise<Record<string, CryptoQuote>> {
  if (ids.length === 0) return {};

  const url =
    `${env.coinGecko.base}/simple/price` +
    `?ids=${encodeURIComponent(ids.join(','))}` +
    `&vs_currencies=usd&include_24hr_change=true`;

  const data = await getJson<SimplePriceResponse>(url, { headers: headers() });

  const quotes: Record<string, CryptoQuote> = {};
  for (const id of ids) {
    const entry = data[id];
    if (entry && typeof entry.usd === 'number' && Number.isFinite(entry.usd)) {
      quotes[id] = {
        usd: entry.usd,
        change24h: typeof entry.usd_24h_change === 'number' ? entry.usd_24h_change : 0,
      };
    }
  }
  return quotes;
}

interface MarketChartResponse {
  prices?: [number, number][];
}

/**
 * 7-day price series for the Buy/Sell chart. Downsampled to `points` samples so
 * the chart keeps the organic shape of real data without carrying hundreds of
 * values into the SVG (spec §3, Buy/Sell).
 */
export async function fetchMarketChart(coingeckoId: string, points = 13): Promise<number[]> {
  const url =
    `${env.coinGecko.base}/coins/${encodeURIComponent(coingeckoId)}/market_chart` +
    `?vs_currency=usd&days=7&interval=daily`;

  const data = await getJson<MarketChartResponse>(url, { headers: headers() });
  const series = (data.prices ?? []).map(([, price]) => price).filter((p) => Number.isFinite(p));
  if (series.length < 2) return [];

  if (series.length <= points) return series;
  const step = (series.length - 1) / (points - 1);
  return Array.from({ length: points }, (_, i) => series[Math.round(i * step)] ?? 0);
}
