import { useState } from 'react';
import { findFiat } from '@/data/fiatCatalog';
import { useTranslation } from '@/i18n/useTranslation';
import { confirm } from '@/store/confirmStore';
import { useCardStore } from '@/store/cardStore';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useFiatRate } from '@/store/ratesStore';
import { useSheetStore } from '@/store/sheetStore';
import { toast } from '@/store/uiStore';
import { haptics } from '@/telegram/telegram';
import { FiatRow } from './FiatRow';
import { VirtualCard } from './VirtualCard';

/** Bank tab: virtual card on top, fiat balances below (spec §3). */
export function BankScreen() {
  const { t } = useTranslation();
  const card = useCardStore((state) => state.card);
  const balances = usePortfolioStore((state) => state.fiat);
  const removeFiat = usePortfolioStore((state) => state.removeFiat);
  const openSheet = useSheetStore((state) => state.open);
  const fiatRate = useFiatRate();

  /** Only one swipe row is open at a time, like the mockup. */
  const [openRow, setOpenRow] = useState<string | null>(null);

  // Sorted descending by USD-equivalent value (spec §3).
  const sorted = [...balances].sort(
    (a, b) => b.amount * fiatRate(b.code) - a.amount * fiatRate(a.code),
  );

  const tryDelete = (code: string, amount: number) => {
    setOpenRow(null);
    // Two gates: the balance must be exactly zero, then the confirm dialog.
    if (amount !== 0) {
      haptics.notify('error');
      toast.error(t('mustBeZero'));
      return;
    }
    confirm({
      title: t('deleteCurrencyTitle'),
      message: t('deleteCurrencyMsg'),
      danger: true,
      onConfirm: () => {
        removeFiat(code);
        toast.success(t('removed'));
      },
    });
  };

  return (
    <>
      <div className="section-title">{t('yourCard')}</div>
      {card ? (
        <VirtualCard />
      ) : (
        <button
          type="button"
          className="create-card-cta"
          onClick={() => {
            haptics.impact('light');
            openSheet('createCard');
          }}
        >
          <span className="plus-icon">+</span>
          <span>{t('createCard')}</span>
        </button>
      )}

      <div className="section-title">{t('fiatBalances')}</div>
      {sorted.map((balance) => {
        const currency = findFiat(balance.code);
        if (!currency) return null;
        return (
          <FiatRow
            key={balance.code}
            currency={currency}
            amount={balance.amount}
            isOpen={openRow === balance.code}
            onOpenChange={(open) => setOpenRow(open ? balance.code : null)}
            onDelete={() => tryDelete(balance.code, balance.amount)}
          />
        );
      })}

      <button
        type="button"
        className="add-currency-card"
        onClick={() => {
          haptics.impact('light');
          openSheet('addCurrency');
        }}
      >
        <span className="plus-icon">+</span>
        <span>{t('addCurrency')}</span>
      </button>
    </>
  );
}
