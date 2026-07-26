/** Number formatting, ported from the mockup so figures read identically. */

/** Holding amounts: 88.2M / 4,120 / 128.400 / 0.021000 / 0.000004 */
export function fmtAmount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (n >= 1) return n.toFixed(n < 10 ? 3 : 2);
  return n.toFixed(6);
}

/** Fiat-style two-decimal value with thousands separators. */
export function fmtMoney(n: number): string {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** A USD price, widening the decimals for sub-dollar and micro-cap assets. */
export function fmtUsdPrice(rate: number): string {
  if (rate >= 1) return `$${rate.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  return `$${rate.toFixed(rate < 0.0001 ? 8 : 6)}`;
}

/** Swap output: enough precision to stay meaningful for micro-priced assets. */
export function fmtSwapResult(n: number): string {
  return n < 1 ? n.toFixed(6) : n.toFixed(2);
}

/** Signed 24h change, e.g. "+10.6%" / "-3.2%". */
export function fmtChange(change: number): string {
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
}

/** Shortens an address for summaries: "0x8f3Cc1B4…E0a7F". */
export function shortenAddress(address: string, lead = 6, tail = 5): string {
  if (address.length <= lead + tail + 1) return address;
  return `${address.slice(0, lead)}…${address.slice(-tail)}`;
}
