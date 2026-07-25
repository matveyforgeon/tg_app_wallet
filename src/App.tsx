import { ConfirmDialog } from '@/components/ConfirmDialog';
import { LangLoadingOverlay } from '@/components/LangLoadingOverlay';
import { PasscodePrompt } from '@/components/PasscodePrompt';
import { SheetHost } from '@/components/SheetHost';
import { Splash } from '@/components/Splash';
import { TabBar } from '@/components/TabBar';
import { ToastView } from '@/components/ToastView';
import { TopBar } from '@/components/TopBar';
import { Waves } from '@/components/Waves';
import { BankScreen } from '@/features/bank/BankScreen';
import { OnboardingOverlay, hasOnboarded } from '@/features/onboarding/OnboardingOverlay';
import { SettingsScreen } from '@/features/settings/SettingsScreen';
import { SwapAssetPicker } from '@/features/swap/SwapAssetPicker';
import { SwapScreen } from '@/features/swap/SwapScreen';
import { WalletScreen } from '@/features/wallet/WalletScreen';
import { useIncomingTonAlert } from '@/hooks/useIncomingTonAlert';
import { useRatesPolling } from '@/hooks/useRatesPolling';
import { useThemeEffect } from '@/hooks/useThemeEffect';
import { useTonWalletSync } from '@/hooks/useTonWalletSync';
import { useTranslation } from '@/i18n/useTranslation';
import { TAB_TITLE_KEY } from '@/lib/tabs';
import { TAB_ORDER, useUiStore, type TabId } from '@/store/uiStore';
import { useState } from 'react';

const SCREENS: Record<TabId, () => React.JSX.Element> = {
  wallet: WalletScreen,
  bank: BankScreen,
  swap: SwapScreen,
  settings: SettingsScreen,
};

export function App() {
  useThemeEffect();
  useRatesPolling();
  useTonWalletSync();
  useIncomingTonAlert();

  // Shown once per device, after the splash (spec §6 keeps the splash first).
  const [onboarding, setOnboarding] = useState(() => !hasOnboarded());

  const { t } = useTranslation();
  const activeTab = useUiStore((state) => state.activeTab);

  return (
    <div className="app-shell">
      <Waves />

      <TopBar title={t(TAB_TITLE_KEY[activeTab])} />

      <ToastView />
      <LangLoadingOverlay />

      {/* All four screens stay mounted and are toggled by `.screen.active`,
          matching the mockup — switching tabs keeps each screen's local state. */}
      <div className="content">
        {TAB_ORDER.map((tab) => {
          const Screen = SCREENS[tab];
          return (
            <div key={tab} className={`screen${tab === activeTab ? ' active' : ''}`}>
              <Screen />
            </div>
          );
        })}
      </div>

      <TabBar />

      {/* Overlays are siblings of `.content` so they stack above the tab bar. */}
      <SheetHost />
      <SwapAssetPicker />
      <ConfirmDialog />
      <PasscodePrompt />
      {onboarding ? <OnboardingOverlay onFinish={() => setOnboarding(false)} /> : null}
      <Splash />
    </div>
  );
}
