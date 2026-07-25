import { useEffect, useState } from 'react';
import { findCrypto } from '@/data/cryptoCatalog';
import { pointsFromSeries, seededChartPoints } from '@/lib/chart';
import { fetchMarketChart } from '@/services/coingecko';

/** Session cache — the 7-day series barely moves, and CoinGecko rate-limits. */
const cache = new Map<string, number[]>();

/**
 * Chart points for an asset: real 7-day history when CoinGecko answers, the
 * deterministic per-asset shape otherwise. Fetched lazily when the Buy sheet
 * opens for a given asset, never on keystroke.
 */
export function useAssetChart(code: string): { points: number[]; isRealData: boolean } {
  const [points, setPoints] = useState<number[]>(() => cache.get(code) ?? seededChartPoints(code));
  const [isRealData, setIsRealData] = useState(() => cache.has(code));

  useEffect(() => {
    const cached = cache.get(code);
    if (cached) {
      setPoints(cached);
      setIsRealData(true);
      return;
    }

    setPoints(seededChartPoints(code));
    setIsRealData(false);

    const coingeckoId = findCrypto(code)?.coingeckoId;
    if (!coingeckoId) return;

    let cancelled = false;
    void (async () => {
      try {
        const series = await fetchMarketChart(coingeckoId);
        const mapped = pointsFromSeries(series);
        if (mapped.length < 2 || cancelled) return;
        cache.set(code, mapped);
        setPoints(mapped);
        setIsRealData(true);
      } catch {
        // Keep the generated shape — a missing chart must not break the sheet.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code]);

  return { points, isRealData };
}
