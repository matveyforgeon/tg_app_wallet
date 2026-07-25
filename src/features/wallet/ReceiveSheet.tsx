import { useState } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { AssetChips } from '@/components/AssetChips';
import { BottomSheet } from '@/components/BottomSheet';
import { placeholderAddress } from '@/data/addresses';
import { useTranslation } from '@/i18n/useTranslation';

interface ReceiveSheetProps {
  onClose: () => void;
}

/**
 * Receive sheet (spec §3). Selecting an asset switches the displayed address to
 * that chain's format. TON shows the genuinely connected wallet address when
 * one is available; the other chains still show format-accurate placeholders
 * until per-chain derivation exists.
 *
 * There is deliberately no copy button — it was removed from the design, and
 * spec §3 says to ask before reintroducing one.
 */
export function ReceiveSheet({ onClose }: ReceiveSheetProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState('TON');
  const tonAddress = useTonAddress();

  const address = selected === 'TON' && tonAddress ? tonAddress : placeholderAddress(selected);

  return (
    <BottomSheet title={t('receiveTitle')} onClose={onClose}>
      <div className="sheet-body">
        <AssetChips selected={selected} onSelect={setSelected} />

        <div className="field-label">{t('yourAddress')}</div>
        <div className="address-box">
          <span className="address-text">{address}</span>
        </div>
        <div className="hint">{t('receiveHint')}</div>
      </div>
    </BottomSheet>
  );
}
