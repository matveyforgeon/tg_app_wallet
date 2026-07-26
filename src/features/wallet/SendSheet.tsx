import { useState } from 'react';
import { useTonAddress, useTonConnectUI, UserRejectsError } from '@tonconnect/ui-react';
import { AssetSearchList } from '@/components/AssetSearchList';
import { BottomSheet } from '@/components/BottomSheet';
import { TonNotice } from '@/components/TonNotice';
import { cryptoCatalog, findCrypto } from '@/data/cryptoCatalog';
import { useTranslation } from '@/i18n/useTranslation';
import { fmtAmount, shortenAddress } from '@/lib/format';
import { useSensitiveAction } from '@/hooks/useSensitiveAction';
import { usePortfolioStore } from '@/store/portfolioStore';
import { toast } from '@/store/uiStore';
import { notifyTransaction } from '@/services/notify';
import { isValidTonAddress, toNano } from '@/services/ton';
import { buildJettonTransferBody, JETTON_TRANSFER_GAS_NANOTON, resolveJettonWallet, toJettonUnits } from '@/services/jetton';
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
 * Every asset in the catalog sends for real: GRAM is a plain TonConnect
 * transaction; every jetton resolves the sender's own jetton-wallet address
 * first, then sends a standard transfer body (op 0xf8a7ea5) to it. Assets
 * without a verified `jettonMaster` were removed from the catalog rather than
 * offered here with a fake send (see `cryptoCatalog.ts`).
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

  const sendNative = async (destination: string, amount: number, summary: string) => {
    await tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [{ address: destination, amount: toNano(amount) }],
    });
    adjust({ type: 'crypto', code }, -amount);
    haptics.notify('success');
    toast.success(t('sentSuccess'));
    void notifyTransaction({ kind: 'send', summary, asset: code, amount });
    onClose();
  };

  const sendJetton = async (
    owner: string,
    jettonMaster: string,
    decimals: number,
    destination: string,
    amount: number,
    summary: string,
  ) => {
    const senderJettonWallet = await resolveJettonWallet(owner, jettonMaster);
    const body = buildJettonTransferBody({
      amountUnits: toJettonUnits(amount, decimals),
      destination,
      responseDestination: owner,
    });
    await tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [{ address: senderJettonWallet, amount: JETTON_TRANSFER_GAS_NANOTON, payload: body }],
    });
    adjust({ type: 'crypto', code }, -amount);
    haptics.notify('success');
    toast.success(t('sentSuccess'));
    void notifyTransaction({ kind: 'send', summary, asset: code, amount });
    onClose();
  };

  const submit = () => {
    const asset = findCrypto(code);
    if (!asset) return;

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

    if (!walletAddress) {
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
        setSending(true);
        const send =
          code === 'GRAM'
            ? sendNative(destination, amount, summary)
            : sendJetton(walletAddress, asset.jettonMaster ?? '', asset.decimals ?? 9, destination, amount, summary);
        void send
          .catch((error: unknown) => {
            // A cancel inside the wallet app is not a failure — nothing to report.
            if (error instanceof UserRejectsError) return;
            haptics.notify('error');
            toast.error(t('sendFailed'));
          })
          .finally(() => setSending(false));
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

        <button type="button" className="primary-btn" onClick={submit} disabled={sending}>
          {sending ? '…' : t('confirm')}
        </button>
      </div>
    </BottomSheet>
  );
}
