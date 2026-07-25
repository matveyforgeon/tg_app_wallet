import { useState } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { AssetChips } from '@/components/AssetChips';
import { BottomSheet } from '@/components/BottomSheet';
import { placeholderAddress } from '@/data/addresses';
import { useTranslation } from '@/i18n/useTranslation';
import { copyText } from '@/lib/clipboard';
import { toast } from '@/store/uiStore';
import { haptics } from '@/telegram/telegram';

interface ReceiveSheetProps {
  onClose: () => void;
}

/**
 * Receive sheet (spec §3). Selecting an asset switches the displayed address to
 * that chain's format. TON shows the genuinely connected wallet address when
 * one is available; the other chains still show format-accurate placeholders
 * until per-chain derivation exists.
 *
 * There is no separate copy button — the design dropped it (spec §3). Tapping
 * the address itself copies it and confirms with a toast.
 */
export function ReceiveSheet({ onClose }: ReceiveSheetProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState('TON');
  const tonAddress = useTonAddress();

  const address = selected === 'TON' && tonAddress ? tonAddress : placeholderAddress(selected);

  const onCopy = async () => {
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
      <div className="sheet-body">
        <AssetChips selected={selected} onSelect={setSelected} />

        <div className="field-label">{t('yourAddress')}</div>
        <button type="button" className="address-box" onClick={() => void onCopy()} aria-label={t('tapToCopy')}>
          <span className="address-text">{address}</span>
        </button>
        <div className="hint">{t('tapToCopy')}</div>
        <div className="hint">{t('receiveHint')}</div>
      </div>
    </BottomSheet>
  );
}
