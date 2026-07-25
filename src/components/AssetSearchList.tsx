import { useMemo, useState, type ReactNode } from 'react';
import { AssetIcon } from '@/components/icons/AssetIcons';
import { useTranslation } from '@/i18n/useTranslation';
import { haptics } from '@/telegram/telegram';
import type { CryptoAsset } from '@/types/assets';

interface AssetSearchListProps {
  assets: readonly CryptoAsset[];
  selected: string;
  onSelect: (code: string) => void;
  /** Optional right-hand column, e.g. the holding balance in the Send sheet. */
  meta?: (asset: CryptoAsset) => ReactNode;
  /** Rendered between the search field and the list — used for the TON notice. */
  children?: ReactNode;
  /** Caps the list height so whatever follows it stays reachable. */
  maxHeight: number;
}

/**
 * Searchable asset picker shared by the Receive, Send and Buy sheets.
 *
 * Replaces the mockup's fixed chip rows: with a 60-asset catalog, scrolling a
 * horizontal strip to find a coin is worse than typing two letters. Matches on
 * both ticker and name.
 */
export function AssetSearchList({
  assets,
  selected,
  onSelect,
  meta,
  children,
  maxHeight,
}: AssetSearchListProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return assets;
    return assets.filter(
      (asset) => asset.code.toLowerCase().includes(q) || asset.name.toLowerCase().includes(q),
    );
  }, [assets, query]);

  return (
    <>
      <input
        className="picker-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('searchPlaceholder')}
        autoComplete="off"
        spellCheck={false}
      />

      {children}

      <div className="picker-list" style={{ maxHeight }}>
        {results.length === 0 ? (
          <div className="picker-empty">{t('nothingFound')}</div>
        ) : (
          results.map((asset) => (
            <button
              key={asset.code}
              type="button"
              className={`picker-item${asset.code === selected ? ' active' : ''}`}
              onClick={() => {
                if (asset.code === selected) return;
                haptics.select();
                onSelect(asset.code);
              }}
              aria-pressed={asset.code === selected}
            >
              <div className="token-icon token-icon-sm" style={{ background: asset.bg }}>
                <AssetIcon code={asset.code} />
              </div>
              <div className="picker-item-text">
                <div className="picker-item-name">{asset.code}</div>
                <div className="picker-item-sub">
                  {asset.wrappedOf ? `${asset.name} · ${t('wrapped')} ${asset.wrappedOf}` : asset.name}
                </div>
              </div>
              {meta ? <div className="picker-item-meta">{meta(asset)}</div> : null}
            </button>
          ))
        )}
      </div>
    </>
  );
}
