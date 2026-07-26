import { useMemo, useState } from 'react';
import { BottomSheet } from '@/components/BottomSheet';
import { AssetIcon } from '@/components/icons/AssetIcons';
import { cryptoCatalog } from '@/data/cryptoCatalog';
import { fiatCatalog } from '@/data/fiatCatalog';
import { useTranslation } from '@/i18n/useTranslation';
import { haptics } from '@/telegram/telegram';
import { useSwapStore } from '@/store/swapStore';

type Catalog = 'crypto' | 'fiat';

/**
 * The Swap tab's unified asset picker (spec §3): one sheet, two independently
 * searchable tabs — Crypto and Currency — so any combination (crypto↔crypto,
 * crypto↔fiat, fiat↔fiat) comes from a single picker rather than separate
 * "mode" buttons.
 *
 * Rendered at app-shell level (a sibling of `.content`, see `swapStore`), and
 * only while open — mounting fresh each time is what resets the tab/search
 * state, matching every other sheet in the app.
 */
export function SwapAssetPicker() {
  const { t } = useTranslation();
  const pickerOpen = useSwapStore((state) => state.pickerOpen);
  const closePicker = useSwapStore((state) => state.closePicker);
  const selectAsset = useSwapStore((state) => state.selectAsset);

  const [tab, setTab] = useState<Catalog>('crypto');
  const [query, setQuery] = useState('');

  const cryptoResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cryptoCatalog;
    return cryptoCatalog.filter(
      (asset) => asset.code.toLowerCase().includes(q) || asset.name.toLowerCase().includes(q),
    );
  }, [query]);

  const fiatResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return fiatCatalog;
    return fiatCatalog.filter(
      (asset) => asset.code.toLowerCase().includes(q) || asset.name.toLowerCase().includes(q),
    );
  }, [query]);

  if (!pickerOpen) return null;

  return (
    <BottomSheet title={t('selectAsset')} onClose={closePicker}>
      <div className="picker-tabs">
        <button
          type="button"
          className={`picker-tab-btn${tab === 'crypto' ? ' active' : ''}`}
          onClick={() => {
            haptics.select();
            setTab('crypto');
          }}
        >
          {t('pickerCrypto')}
        </button>
        <button
          type="button"
          className={`picker-tab-btn${tab === 'fiat' ? ' active' : ''}`}
          onClick={() => {
            haptics.select();
            setTab('fiat');
          }}
        >
          {t('pickerCurrency')}
        </button>
      </div>

      <input
        className="picker-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('searchPlaceholder')}
        autoComplete="off"
        spellCheck={false}
      />

      <div className="picker-list">
        {tab === 'crypto' ? (
          cryptoResults.length === 0 ? (
            <div className="picker-empty">{t('nothingFound')}</div>
          ) : (
            cryptoResults.map((asset) => (
              <button
                key={asset.code}
                type="button"
                className="picker-item"
                onClick={() => {
                  haptics.select();
                  selectAsset({ type: 'crypto', code: asset.code });
                }}
              >
                <div className="token-icon token-icon-sm" style={{ background: asset.bg }}>
                  <AssetIcon code={asset.code} />
                </div>
                <div>
                  <div className="picker-item-name">{asset.code}</div>
                  <div className="picker-item-sub">{asset.name}</div>
                </div>
              </button>
            ))
          )
        ) : fiatResults.length === 0 ? (
          <div className="picker-empty">{t('nothingFound')}</div>
        ) : (
          fiatResults.map((asset) => (
            <button
              key={asset.code}
              type="button"
              className="picker-item"
              onClick={() => {
                haptics.select();
                selectAsset({ type: 'fiat', code: asset.code });
              }}
            >
              <span className="flag">{asset.flag}</span>
              <div>
                <div className="picker-item-name">{asset.code}</div>
                <div className="picker-item-sub">{asset.name}</div>
              </div>
            </button>
          ))
        )}
      </div>
    </BottomSheet>
  );
}
