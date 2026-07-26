import { useEffect, useState } from 'react';
import { findCrypto } from '@/data/cryptoCatalog';
import { pointsFromSeries } from '@/lib/chart';
import { fetchMarketChart } from '@/services/coingecko';

/** Session cache — the 7-day series barely moves, and CoinGecko rate-limits. */
const cache = new Map<string, number[]>();

export type ChartStatus = 'loading' | 'ready' | 'unavailable';

export interface AssetChart {
  points: number[];
  status: ChartStatus;
}

/**
 * Real 7-day price history for an asset, fetched lazily when the Buy sheet
 * opens for it and cached for the session.
 *
 * If CoinGecko is unreachable or rate-limited the hook reports `unavailable`
 * rather than substituting a generated shape — a made-up curve sitting beside a
 * live price would read as real market history.
 */
export function useAssetChart(code: string): AssetChart {
  const [points, setPoints] = useState<number[]>(() => cache.get(code) ?? []);
  const [status, setStatus] = useState<ChartStatus>(() => (cache.has(code) ? 'ready' : 'loading'));

  useEffect(() => {
    const cached = cache.get(code);
    if (cached) {
      setPoints(cached);
      setStatus('ready');
      return;
    }

    setPoints([]);
    setStatus('loading');

    const coingeckoId = findCrypto(code)?.coingeckoId;
    if (!coingeckoId) {
      setStatus('unavailable');
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const series = await fetchMarketChart(coingeckoId);
        const mapped = pointsFromSeries(series);
        if (cancelled) return;
        if (mapped.length < 2) {
          setStatus('unavailable');
          return;
        }
        cache.set(code, mapped);
        setPoints(mapped);
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('unavailable');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code]);

  return { points, status };
}
