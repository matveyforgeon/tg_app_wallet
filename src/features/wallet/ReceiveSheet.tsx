import { useMemo, useState } from 'react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { BottomSheet } from '@/components/BottomSheet';
import { AssetIcon } from '@/components/icons/AssetIcons';
import { tonNetworkAssets } from '@/data/cryptoCatalog';
import { useTranslation } from '@/i18n/useTranslation';
import { copyText } from '@/lib/clipboard';
import { toast } from '@/store/uiStore';
import { haptics } from '@/telegram/telegram';

interface ReceiveSheetProps {
  onClose: () => void;
}

/**
 * Receive sheet.
 *
 * TON Connect gives the app exactly one address, so this lists only assets that
 * actually live on the TON network — native TON and jettons. Offering BTC or
 * ETH here would mean showing an address that cannot receive them, which is how
 * people lose funds. Spec §3 asks for per-chain addresses; that needs per-chain
 * key derivation the wallet connection does not provide, so it is deferred
 * rather than faked.
 *
 * For the same reason the address is only shown once a wallet is connected —
 * there is no placeholder to send real money to.
 *
 * There is no copy button (spec §3 removed it); tapping the address copies it.
 */
export function ReceiveSheet({ onClose }: ReceiveSheetProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('TON');
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tonNetworkAssets;
    return tonNetworkAssets.filter(
      (asset) => asset.code.toLowerCase().includes(q) || asset.name.toLowerCase().includes(q),
    );
  }, [query]);

  const onCopy = async () => {
    if (!address) return;
    const copied = await copyText(address);
    if (copied) {
      haptics.notify('success');
      toast.success(t('addressCopied'));
    } else {
      haptics.notify('error');
      toast.error(t('copyFailed'));
    }
  };

  return (
    <BottomSheet title={t('receiveTitle')} onClose={onClose}>
      <input
        className="picker-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('searchPlaceholder')}
        autoComplete="off"
        spellCheck={false}
      />

      <div className="notice">
        <div className="notice-title">{t('tonOnlyTitle')}</div>
        <div className="notice-body">{t('tonOnlyBody')}</div>
      </div>

      <div className="picker-list receive-list">
        {results.length === 0 ? (
          <div className="picker-empty">{t('nothingFound')}</div>
        ) : (
          results.map((asset) => (
            <button
              key={asset.code}
              type="button"
              className={`picker-item${asset.code === selected ? ' active' : ''}`}
              onClick={() => {
                haptics.select();
                setSelected(asset.code);
              }}
              aria-pressed={asset.code === selected}
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
        )}
      </div>

      <div className="sheet-body">
        <div className="field-label">{t('yourAddress')}</div>
        {address ? (
          <>
            <button
              type="button"
              className="address-box"
              onClick={() => void onCopy()}
              aria-label={t('tapToCopy')}
            >
              <span className="address-text">{address}</span>
            </button>
            <div className="hint">{t('tapToCopy')}</div>
          </>
        ) : (
          <>
            <div className="hint" style={{ marginTop: 0 }}>
              {t('connectToSeeAddress')}
            </div>
            <button type="button" className="primary-btn" onClick={() => void tonConnectUI.openModal()}>
              {t('connectWallet')}
            </button>
          </>
        )}
      </div>
    </BottomSheet>
  );
}
