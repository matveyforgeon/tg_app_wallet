import { useTonConnectUI } from '@tonconnect/ui-react';
import { useTranslation } from '@/i18n/useTranslation';
import { confirm } from '@/store/confirmStore';
import { useCardStore } from '@/store/cardStore';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useUiStore, toast } from '@/store/uiStore';
import { haptics } from '@/telegram/telegram';

/**
 * Real log out (spec §3 wants this to actually clear session/local state).
 *
 * Disconnects the TON wallet, deletes the virtual card, resets holdings to
 * their seed and clears persisted preferences, then returns to the Wallet tab.
 * Destructive, so it goes through the confirm dialog in its red variant.
 */
export function useLogout(): () => void {
  const { t } = useTranslation();
  const [tonConnectUI] = useTonConnectUI();
  const resetSettings = useSettingsStore((state) => state.resetAll);
  const removeCard = useCardStore((state) => state.remove);
  const resetPortfolio = usePortfolioStore((state) => state.resetAll);
  const setTab = useUiStore((state) => state.setTab);

  return () => {
    haptics.impact('light');
    confirm({
      title: t('logOut'),
      message: t('logOutMsg'),
      danger: true,
      onConfirm: () => {
        // Disconnect first: the wallet is the only thing that outlives the app.
        void tonConnectUI.disconnect().catch(() => {
          /* already disconnected — the rest of the reset still applies */
        });
        removeCard();
        resetPortfolio();
        resetSettings();
        setTab('wallet');
        toast.success(t('loggedOut'));
      },
    });
  };
}
