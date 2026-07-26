import { useState } from 'react';
import { useTonAddress, useTonConnectUI, UserRejectsError } from '@tonconnect/ui-react';
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
import { isValidTonAddress, toNano } from '@/services/ton';
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
 * GRAM (the native coin) is a real, signed TonConnect transaction — the one
 * genuinely on-chain send in this app. Every other asset here is a jetton;
 * sending one for real needs its jetton-wallet address resolved and a
 * transfer body built (op 0xf8a7ea5), which needs a TON contract library
 * this app doesn't carry yet, so those debits stay local-only, same as
 * before. `jettonLocalOnlyHint` says so in the sheet itself, not just here.
 */
export function SendSheet({ onClose }: SendSheetProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState('GRAM');
  const [recipient, setRecipient] = useState('');
  const [amountText, setAmountText] = useState('');
  const [sending, setSending] = useState(false);

  const adjust = usePortfolioStore((state) => state.adjust);
  const getCryptoAmount = usePortfolioStore((state) => state.getCryptoAmount);
  const guard = useSensitiveAction();
  const walletAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const sendOnChain = async (destination: string, amount: number, summary: string) => {
    setSending(true);
    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [{ address: destination, amount: toNano(amount) }],
      });
      adjust({ type: 'crypto', code }, -amount);
      haptics.notify('success');
      toast.success(t('sentSuccess'));
      void notifyTransaction({ kind: 'send', summary, asset: code, amount });
      onClose();
    } catch (error) {
      // A cancel inside the wallet app is not a failure — nothing to report.
      if (error instanceof UserRejectsError) return;
      haptics.notify('error');
      toast.error(t('sendFailed'));
    } finally {
      setSending(false);
    }
  };

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
    if (!isValidTonAddress(destination)) {
      haptics.notify('error');
      toast.error(t('invalidAddress'));
      return;
    }

    const isOnChain = code === 'GRAM';
    if (isOnChain && !walletAddress) {
      haptics.notify('error');
      toast.error(t('connectWalletFirst'));
      void tonConnectUI.openModal();
      return;
    }

    const summary = `${amount} ${code} → ${shortenAddress(destination)}`;
    guard({
      title: t('confirmSendTitle'),
      message: summary,
      // The one action that moves funds out irreversibly.
      requirePasscode: true,
      onConfirm: () => {
        if (isOnChain) {
          void sendOnChain(destination, amount, summary);
          return;
        }
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

      {code !== 'GRAM' ? <div className="hint">{t('jettonLocalOnlyHint')}</div> : null}

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

        <button type="button" className="primary-btn" onClick={submit} disabled={sending}>
          {sending ? '…' : t('confirm')}
        </button>
      </div>
    </BottomSheet>
  );
}
