import { useCryptoRate, useFiatRate } from '@/store/ratesStore';
import type { AssetRef } from '@/types/assets';

/** Reactive USD rate lookup that works across both catalogs, for Swap. */
export function useAssetRate(): (asset: AssetRef) => number {
  const cryptoRate = useCryptoRate();
  const fiatRate = useFiatRate();
  return (asset) => (asset.type === 'crypto' ? cryptoRate(asset.code) : fiatRate(asset.code));
}
