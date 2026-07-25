export type AssetType = 'crypto' | 'fiat';

/** A pointer to a catalog entry. Used everywhere the two catalogs mix (Swap). */
export interface AssetRef {
  type: AssetType;
  code: string;
}

export interface CryptoAsset {
  code: string;
  name: string;
  /** Circular icon background, straight from the mockup. */
  bg: string;
  /** CoinGecko id used to look up the live USD price. */
  coingeckoId: string;
  /**
   * True when the asset is native to TON or a TON jetton — i.e. it can actually
   * be received at the connected wallet's address. Only these appear in the
   * Receive sheet.
   */
  tonNetwork?: boolean;
  /**
   * USD value of one unit. Snapshot from the mockup (late Jul 2026) — used only
   * until the first successful CoinGecko response, and as the offline fallback.
   * Spec §8: never present these as live prices.
   */
  fallbackRate: number;
}

export interface FiatAsset {
  code: string;
  name: string;
  flag: string;
  symbol: string;
  /** USD value of one unit. Same fallback-only semantics as `fallbackRate`. */
  fallbackRate: number;
}

export type CatalogAsset = CryptoAsset | FiatAsset;

/** A holding of a crypto asset in the wallet. */
export interface CryptoHolding {
  code: string;
  amount: number;
  /** 24h change %, refreshed from CoinGecko. */
  change: number;
}

/** A fiat balance shown on the Bank tab. */
export interface FiatBalance {
  code: string;
  amount: number;
}
