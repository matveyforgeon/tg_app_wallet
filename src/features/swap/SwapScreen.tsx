import { useAssetRate } from '@/hooks/useAssetRate';
import { useTranslation } from '@/i18n/useTranslation';
import { describeAsset } from '@/lib/assetLookup';
import { fmtSwapResult } from '@/lib/format';
import { confirm } from '@/store/confirmStore';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useSwapStore } from '@/store/swapStore';
import { toast } from '@/store/uiStore';
import { haptics } from '@/telegram/telegram';
import { AssetPill } from './AssetPill';

/**
 * Swap tab (spec §3): unified crypto/fiat pills, a live rate hint, and a
 * flip button. "Review Swap" validates the amount and balance inline — no
 * dialog for that — then routes the actual swap through the shared confirm
 * dialog before adjusting holdings.
 *
 * The asset picker itself is `SwapAssetPicker`, mounted at app-shell level;
 * see the note in `swapStore` for why.
 */
export function SwapScreen() {
  const { t } = useTranslation();
  const from = useSwapStore((state) => state.from);
  const to = useSwapStore((state) => state.to);
  const amountText = useSwapStore((state) => state.amountText);
  const setAmountText = useSwapStore((state) => state.setAmountText);
  const flip = useSwapStore((state) => state.flip);
  const openPicker = useSwapStore((state) => state.openPicker);

  const getAmount = usePortfolioStore((state) => state.getAmount);
  const adjust = usePortfolioStore((state) => state.adjust);
  const assetRate = useAssetRate();

  const fromRate = assetRate(from);
  const toRate = assetRate(to);
  const amount = Number.parseFloat(amountText) || 0;
  const result = toRate > 0 ? (amount * fromRate) / toRate : 0;

  const rateDecimals = toRate < 0.001 ? 8 : toRate < 1 ? 4 : 2;
  const rateHint =
    toRate > 0 ? `1 ${from.code} ≈ ${(fromRate / toRate).toFixed(rateDecimals)} ${to.code}` : '—';

  const onFlip = () => {
    haptics.impact('light');
    flip();
  };

  const onReview = () => {
    if (amount <= 0) {
      haptics.notify('error');
      toast.error(t('enterValidAmount'));
      return;
    }
    const owned = getAmount(from);
    if (amount > owned) {
      haptics.notify('error');
      toast.error(t('insufficientBalance'));
      return;
    }

    const resultText = fmtSwapResult(result);
    confirm({
      title: t('confirmSwapTitle'),
      message: `${amountText} ${from.code} → ${resultText} ${to.code}`,
      onConfirm: () => {
        adjust(from, -amount);
        adjust(to, result);
        haptics.notify('success');
        toast.success(t('swapSuccess'));
      },
    });
  };

  return (
    <>
      <div className="section-title">{t('swapTokens')}</div>

      <div className="swap-box">
        <div className="swap-row">
          <input
            className="swap-input"
            value={amountText}
            onChange={(event) => setAmountText(event.target.value)}
            inputMode="decimal"
            aria-label={describeAsset(from).name}
          />
          <AssetPill asset={from} onTap={() => openPicker('from')} />
        </div>

        <div className="swap-arrow">
          <button type="button" className="swap-arrow-btn" onClick={onFlip} aria-label="Flip">
            ⇅
          </button>
        </div>

        <div className="swap-row">
          <input className="swap-input" value={fmtSwapResult(result)} disabled />
          <AssetPill asset={to} onTap={() => openPicker('to')} />
        </div>
      </div>

      <div className="hint">{rateHint}</div>

      <button type="button" className="primary-btn" onClick={onReview}>
        {t('reviewSwap')}
      </button>
    </>
  );
}
