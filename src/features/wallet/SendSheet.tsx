import { useState } from 'react';
import { AssetChips } from '@/components/AssetChips';
import { BottomSheet } from '@/components/BottomSheet';
import { useTranslation } from '@/i18n/useTranslation';
import { shortenAddress } from '@/lib/format';
import { confirm } from '@/store/confirmStore';
import { usePortfolioStore } from '@/store/portfolioStore';
import { toast } from '@/store/uiStore';
import { haptics } from '@/telegram/telegram';

interface SendSheetProps {
  onClose: () => void;
}

/**
 * Send sheet (spec §3): validate the balance inline, then route the actual
 * transfer through the shared confirm dialog before debiting.
 *
 * The debit is still local. Real transfers need the transaction to be signed
 * through TON Connect (and per-chain equivalents for everything else).
 */
export function SendSheet({ onClose }: SendSheetProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState('TON');
  const [recipient, setRecipient] = useState('');
  const [amountText, setAmountText] = useState('');

  const adjust = usePortfolioStore((state) => state.adjust);
  const getCryptoAmount = usePortfolioStore((state) => state.getCryptoAmount);

  // No reset effect needed: the sheet is mounted fresh on every open, so the
  // initial state above *is* the reset.

  const submit = () => {
    const amount = Number.parseFloat(amountText);
    if (!Number.isFinite(amount) || amount <= 0) {
      haptics.notify('error');
      toast.error(t('enterValidAmount'));
      return;
    }
    if (amount > getCryptoAmount(code)) {
      haptics.notify('error');
      toast.error(t('insufficientBalance'));
      return;
    }

    const destination = recipient.trim();
    confirm({
      title: t('confirmSendTitle'),
      message: `${amount} ${code} → ${destination ? shortenAddress(destination) : '—'}`,
      onConfirm: () => {
        adjust({ type: 'crypto', code }, -amount);
        haptics.notify('success');
        toast.success(t('sentSuccess'));
        onClose();
      },
    });
  };

  return (
    <BottomSheet title={t('sendTitle')} onClose={onClose}>
      <div className="sheet-body">
        <AssetChips selected={code} onSelect={setCode} />

        <div className="field-label">{t('recipient')}</div>
        <input
          className="field-input"
          value={recipient}
          onChange={(event) => setRecipient(event.target.value)}
          placeholder="UQ..."
          autoComplete="off"
          spellCheck={false}
        />

        <div className="field-label">{t('amount')}</div>
        <input
          className="field-input"
          type="number"
          inputMode="decimal"
          value={amountText}
          onChange={(event) => setAmountText(event.target.value)}
          placeholder="0.0"
        />

        <button type="button" className="primary-btn" onClick={submit}>
          {t('confirm')}
        </button>
      </div>
    </BottomSheet>
  );
}
