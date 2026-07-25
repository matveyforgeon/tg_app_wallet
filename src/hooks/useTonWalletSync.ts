import { useEffect } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { env } from '@/config/env';
import { fetchTonBalance } from '@/services/ton';
import { usePortfolioStore } from '@/store/portfolioStore';

/**
 * Keeps the TON holding in sync with the connected wallet's on-chain balance,
 * and restores the local seed position on disconnect.
 *
 * A failed read leaves the previous amount in place rather than showing zero —
 * a wallet that momentarily reads as empty is worse than a slightly stale one.
 */
export function useTonWalletSync(): void {
  const address = useTonAddress();
  const setTonBalance = usePortfolioStore((state) => state.setTonBalance);
  const clearOnChainBalance = usePortfolioStore((state) => state.clearOnChainBalance);

  useEffect(() => {
    if (!address) {
      clearOnChainBalance();
      return;
    }

    let cancelled = false;

    const read = async () => {
      try {
        const balance = await fetchTonBalance(address);
        if (!cancelled) setTonBalance(balance);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('[ton] balance read failed; keeping previous amount', error);
        }
      }
    };

    void read();
    const timer = globalThis.setInterval(() => void read(), env.ratesRefreshMs);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [address, setTonBalance, clearOnChainBalance]);
}
