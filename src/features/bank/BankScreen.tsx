import { PhaseNote } from '@/components/PhaseNote';
import { useTranslation } from '@/i18n/useTranslation';

/** Bank tab: virtual card on top, fiat balances below (spec §3). Built in Phase 4. */
export function BankScreen() {
  const { t } = useTranslation();

  return (
    <>
      <div className="section-title">{t('yourCard')}</div>
      <PhaseNote>Phase 4 — virtual card, 4 metallic palettes, freeze / reveal / delete</PhaseNote>

      <div className="section-title">{t('fiatBalances')}</div>
      <PhaseNote>Phase 4 — live FX balances, swipe-to-delete, add currency</PhaseNote>
    </>
  );
}
