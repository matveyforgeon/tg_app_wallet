import { findCrypto } from '@/data/cryptoCatalog';
import { findFiat } from '@/data/fiatCatalog';
import type { AssetRef } from '@/types/assets';

export interface AssetDisplay {
  code: string;
  name: string;
}

/** Resolves an `AssetRef` against whichever catalog it points at. */
export function describeAsset(asset: AssetRef): AssetDisplay {
  if (asset.type === 'crypto') {
    const found = findCrypto(asset.code);
    return { code: asset.code, name: found?.name ?? asset.code };
  }
  const found = findFiat(asset.code);
  return { code: asset.code, name: found?.name ?? asset.code };
}

export function sameAsset(a: AssetRef, b: AssetRef): boolean {
  return a.type === b.type && a.code === b.code;
}
