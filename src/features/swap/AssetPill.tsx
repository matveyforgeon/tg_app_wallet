import { AssetIcon } from '@/components/icons/AssetIcons';
import { findFiat } from '@/data/fiatCatalog';
import { haptics } from '@/telegram/telegram';
import type { AssetRef } from '@/types/assets';

interface AssetPillProps {
  asset: AssetRef;
  onTap: () => void;
}

/** A tappable from/to pill in the Swap row — icon, code, and a select caret. */
export function AssetPill({ asset, onTap }: AssetPillProps) {
  const icon =
    asset.type === 'crypto' ? (
      <AssetIcon code={asset.code} />
    ) : (
      <span style={{ fontSize: 15 }}>{findFiat(asset.code)?.flag}</span>
    );

  return (
    <button
      type="button"
      className="swap-token-pill"
      onClick={() => {
        haptics.select();
        onTap();
      }}
    >
      {icon}
      <span>{asset.code} ▾</span>
    </button>
  );
}
