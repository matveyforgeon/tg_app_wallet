import { PhaseNote } from '@/components/PhaseNote';
import { useTranslation } from '@/i18n/useTranslation';

/** Swap tab: unified crypto/fiat picker and rate hint (spec §3). Built in Phase 5. */
export function SwapScreen() {
  const { t } = useTranslation();

  return (
    <>
      <div className="section-title">{t('swapTokens')}</div>
      <PhaseNote>Phase 5 — unified asset picker, live rate, confirm dialog</PhaseNote>
    </>
  );
}
