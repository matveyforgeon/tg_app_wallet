/**
 * Buy/Sell sparkline geometry.
 *
 * Real 7-day CoinGecko data is used when available; the deterministic generator
 * below is the fallback. Either way each asset gets a distinct, organic-looking
 * shape rather than a uniform mechanical zigzag (spec §3, Buy/Sell).
 */

export const CHART_WIDTH = 300;
export const CHART_HEIGHT = 90;
const Y_MIN = 8;
const Y_MAX = 84;
const SAMPLES = 13;

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h;
}

function seededRandom(seed: number): number {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** Deterministic per-asset shape, used until (or instead of) real history. */
export function seededChartPoints(code: string): number[] {
  const seed = Math.abs(hashCode(code));
  let y = 45 + (seededRandom(seed) - 0.5) * 20;
  const points = [y];
  for (let i = 1; i < SAMPLES; i += 1) {
    const r = seededRandom(seed + i * 17);
    const trend = (seededRandom(seed + 999) - 0.42) * 1.1;
    const step = (r - 0.5) * 24 + trend * 6;
    y = Math.min(Y_MAX, Math.max(Y_MIN, y + step));
    points.push(y);
  }
  return points;
}

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
