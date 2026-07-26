import { useState } from 'react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { AssetSearchList } from '@/components/AssetSearchList';
import { BottomSheet } from '@/components/BottomSheet';
import { TonNotice } from '@/components/TonNotice';
import { cryptoCatalog } from '@/data/cryptoCatalog';
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
 * The whole catalog is TON-network, so every asset here resolves to the one
 * address TON Connect gives us. The address is shown only once a wallet is
 * connected — with a warning that implies the address is real, a placeholder
 * someone could send funds to is worse than none.
 *
 * There is no copy button (spec §3 removed it); tapping the address copies it.
 */
export function ReceiveSheet({ onClose }: ReceiveSheetProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState('TON');
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

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
      <AssetSearchList
        assets={cryptoCatalog}
        selected={selected}
        onSelect={setSelected}
        maxHeight={172}
      >
        <TonNotice bodyKey="tonOnlyReceiveBody" />
      </AssetSearchList>

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
