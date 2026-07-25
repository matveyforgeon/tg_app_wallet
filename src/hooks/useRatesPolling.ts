import { useEffect } from 'react';
import { env } from '@/config/env';
import { useRatesStore } from '@/store/ratesStore';

/**
 * Polls live crypto prices while the app is open (spec §1: every 30-60s).
 *
 * Refreshes are paused while the document is hidden and resumed on return, so a
 * backgrounded Mini App does not keep burning the CoinGecko rate limit.
 */
export function useRatesPolling(): void {
  const refreshCrypto = useRatesStore((state) => state.refreshCrypto);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (timer !== null) return;
      void refreshCrypto();
      timer = globalThis.setInterval(() => void refreshCrypto(), env.ratesRefreshMs);
    };

    const stop = () => {
      if (timer === null) return;
      clearInterval(timer);
      timer = null;
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refreshCrypto]);
}
