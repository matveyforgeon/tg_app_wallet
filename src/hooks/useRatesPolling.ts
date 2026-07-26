import { useEffect } from 'react';
import { env } from '@/config/env';
import { useRatesStore } from '@/store/ratesStore';

/**
 * Polls live crypto prices and FX rates while the app is open
 * (spec §1: every 30-60s).
 *
 * Refreshes are paused while the document is hidden and resumed on return, so a
 * backgrounded Mini App does not keep burning the CoinGecko rate limit.
 */
export function useRatesPolling(): void {
  const refreshCrypto = useRatesStore((state) => state.refreshCrypto);
  const refreshFiat = useRatesStore((state) => state.refreshFiat);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (timer !== null) return;
      void refreshCrypto();
      void refreshFiat();
      timer = globalThis.setInterval(() => {
        void refreshCrypto();
        void refreshFiat();
      }, env.ratesRefreshMs);
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
  }, [refreshCrypto, refreshFiat]);
}
