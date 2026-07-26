import { useEffect, useRef } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { fmtAmount } from '@/lib/format';
import { notifyTransaction } from '@/services/notify';
import { usePortfolioStore } from '@/store/portfolioStore';
import { toast } from '@/store/uiStore';
import { haptics } from '@/telegram/telegram';

/**
 * Detects incoming TON and reports it as a received-crypto notification.
 *
 * The on-chain balance is already polled for the connected wallet, so an
 * increase between two reads means funds arrived. Only genuine on-chain reads
 * count (`tonIsOnChain`) — the seeded demo balance must never fire this.
 *
 * Decreases are ignored here: an outgoing transfer is reported by the Send
 * flow itself, and reporting it twice would be worse than not at all.
 */
export function useIncomingTonAlert(): void {
  const { t } = useTranslation();
  const crypto = usePortfolioStore((state) => state.crypto);
  const tonIsOnChain = usePortfolioStore((state) => state.tonIsOnChain);

  const previous = useRef<number | null>(null);

  useEffect(() => {
    const amount = crypto.find((holding) => holding.code === 'TON')?.amount ?? 0;

    if (!tonIsOnChain) {
      previous.current = null;
      return;
    }

    // First on-chain read establishes the baseline; it is not an arrival.
    if (previous.current === null) {
      previous.current = amount;
      return;
    }

    const delta = amount - previous.current;
    previous.current = amount;

    // Ignore dust from fee refunds and floating-point noise.
    if (delta <= 1e-9) return;

    const summary = `+${fmtAmount(delta)} TON`;
    haptics.notify('success');
    toast.success(`${t('txNotifyReceive')}: ${summary}`);
    void notifyTransaction({ kind: 'receive', summary, asset: 'TON', amount: delta });
  }, [crypto, tonIsOnChain, t]);
}
