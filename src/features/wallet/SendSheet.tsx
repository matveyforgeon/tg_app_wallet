import { useState } from 'react';
import { AssetSearchList } from '@/components/AssetSearchList';
import { BottomSheet } from '@/components/BottomSheet';
import { TonNotice } from '@/components/TonNotice';
import { cryptoCatalog } from '@/data/cryptoCatalog';
import { useTranslation } from '@/i18n/useTranslation';
import { fmtAmount, shortenAddress } from '@/lib/format';
import { useSensitiveAction } from '@/hooks/useSensitiveAction';
import { usePortfolioStore } from '@/store/portfolioStore';
import { toast } from '@/store/uiStore';
import { notifyTransaction } from '@/services/notify';
import { haptics } from '@/telegram/telegram';

interface SendSheetProps {
  onClose: () => void;
}

/**
 * Send sheet (spec §3): validate the balance inline, then route the actual
 * transfer through the shared confirm dialog before debiting.
 *
 * Every asset is on TON, so the recipient must be a TON address — the notice
 * says so, because a transfer sent to an address on another chain is gone.
 *
 * The debit is still local. Real transfers need the transaction signed through
 * TON Connect.
 */
export function SendSheet({ onClose }: SendSheetProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState('TON');
  const [recipient, setRecipient] = useState('');
  const [amountText, setAmountText] = useState('');

  const adjust = usePortfolioStore((state) => state.adjust);
  const getCryptoAmount = usePortfolioStore((state) => state.getCryptoAmount);
  const guard = useSensitiveAction();

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
    const summary = `${amount} ${code} → ${destination ? shortenAddress(destination) : '—'}`;
    guard({
      title: t('confirmSendTitle'),
      message: summary,
      // The one action that moves funds out irreversibly.
      requirePasscode: true,
      onConfirm: () => {
        adjust({ type: 'crypto', code }, -amount);
        haptics.notify('success');
        toast.success(t('sentSuccess'));
        void notifyTransaction({ kind: 'send', summary, asset: code, amount });
        onClose();
      },
    });
  };

  return (
    <BottomSheet title={t('sendTitle')} onClose={onClose}>
      <AssetSearchList
        assets={cryptoCatalog}
        selected={code}
        onSelect={setCode}
        maxHeight={150}
        meta={(asset) => {
          const held = getCryptoAmount(asset.code);
          return held > 0 ? <span className="picker-item-balance">{fmtAmount(held)}</span> : null;
        }}
      >
        <TonNotice bodyKey="tonOnlySendBody" />
      </AssetSearchList>

      <div className="sheet-body">
        <div className="field-label">{t('recipient')}</div>
        <input
          className="field-input"
          value={recipient}
          onChange={(event) => setRecipient(event.target.value)}
          placeholder="UQ..."
          autoComplete="off"
          spellCheck={false}
        />

        <div className="field-label">
          {t('amount')} · {fmtAmount(getCryptoAmount(code))} {code}
        </div>
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
