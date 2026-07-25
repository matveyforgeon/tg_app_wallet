import { LangLoadingOverlay } from '@/components/LangLoadingOverlay';
import { Splash } from '@/components/Splash';
import { TabBar } from '@/components/TabBar';
import { ToastView } from '@/components/ToastView';
import { TopBar } from '@/components/TopBar';
import { Waves } from '@/components/Waves';
import { BankScreen } from '@/features/bank/BankScreen';
import { SettingsScreen } from '@/features/settings/SettingsScreen';
import { SwapScreen } from '@/features/swap/SwapScreen';
import { WalletScreen } from '@/features/wallet/WalletScreen';
import { useThemeEffect } from '@/hooks/useThemeEffect';
import { useTranslation } from '@/i18n/useTranslation';
import { TAB_TITLE_KEY } from '@/lib/tabs';
import { TAB_ORDER, useUiStore, type TabId } from '@/store/uiStore';

const SCREENS: Record<TabId, () => React.JSX.Element> = {
  wallet: WalletScreen,
  bank: BankScreen,
  swap: SwapScreen,
  settings: SettingsScreen,
};

export function App() {
  useThemeEffect();

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

      <Splash />
    </div>
  );
}
