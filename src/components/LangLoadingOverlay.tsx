import { useSettingsStore } from '@/store/settingsStore';

/**
 * The brief spinner shown while a *manual* language switch applies (spec §5).
 * Auto-detection at launch never shows it.
 */
export function LangLoadingOverlay() {
  const langSwitching = useSettingsStore((state) => state.langSwitching);
  if (!langSwitching) return null;

  return (
    <div className="lang-loading">
      <div className="spinner" />
    </div>
  );
}
