/**
 * Buy/Sell sparkline geometry.
 *
 * Points always come from a real CoinGecko 7-day series. There is deliberately
 * no synthetic generator: a fabricated curve next to a live price reads as
 * market data, and the app must not invent price history (spec §8). When the
 * series is unavailable the sheet says so instead.
 */

export const CHART_WIDTH = 300;
export const CHART_HEIGHT = 90;
const Y_MIN = 8;
const Y_MAX = 84;

/** Maps a real price series onto the chart's y-range (higher price = higher line). */
export function pointsFromSeries(prices: readonly number[]): number[] {
  if (prices.length < 2) return [];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  // A perfectly flat series (e.g. a stablecoin) would divide by zero.
  if (max - min < Number.EPSILON) return prices.map(() => (Y_MIN + Y_MAX) / 2);
  return prices.map((price) => Y_MAX - ((price - min) / (max - min)) * (Y_MAX - Y_MIN));
}

export interface ChartGeometry {
  line: string;
  area: string;
}

export function chartGeometry(points: readonly number[]): ChartGeometry {
  const n = points.length;
  if (n < 2) return { line: '', area: '' };
  const coords = points.map((y, i) => `${((i * CHART_WIDTH) / (n - 1)).toFixed(1)},${y.toFixed(1)}`);
  return {
    line: coords.join(' '),
    area: `0,${CHART_HEIGHT} ${coords.join(' ')} ${CHART_WIDTH},${CHART_HEIGHT}`,
  };
}
