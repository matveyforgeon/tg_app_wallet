import { LangLoadingOverlay } from '@/components/LangLoadingOverlay';
import { ToastView } from '@/components/ToastView';
import { TopBar } from '@/components/TopBar';
import { Waves } from '@/components/Waves';
import { FoundationScreen } from '@/features/foundation/FoundationScreen';
import { useThemeEffect } from '@/hooks/useThemeEffect';
import { useTranslation } from '@/i18n/useTranslation';
import { TAB_TITLE_KEY } from '@/lib/tabs';
import { useUiStore } from '@/store/uiStore';

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

      <div className="content">
        {/* Phase 2 replaces this with the four real tab screens. */}
        <FoundationScreen />
      </div>
    </div>
  );
}
