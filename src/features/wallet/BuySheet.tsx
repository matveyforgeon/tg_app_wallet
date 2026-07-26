import { useState } from 'react';
import { AssetSearchList } from '@/components/AssetSearchList';
import { BottomSheet } from '@/components/BottomSheet';
import { PriceChart } from '@/components/PriceChart';
import { cryptoCatalog } from '@/data/cryptoCatalog';
import { useTranslation } from '@/i18n/useTranslation';
import { fmtChange, fmtMoney, fmtUsdPrice } from '@/lib/format';
import { confirm } from '@/store/confirmStore';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useCryptoChange, useCryptoRate } from '@/store/ratesStore';
import { toast } from '@/store/uiStore';
import { notifyTransaction } from '@/services/notify';
import { haptics } from '@/telegram/telegram';
import { useAssetChart } from './useAssetChart';

interface BuySheetProps {
  onClose: () => void;
}

type Side = 'buy' | 'sell';

/**
 * Buy / Sell sheet (spec §3). Live price and 24h change come from the rates
 * store; the chart is real 7-day history or nothing at all. Committing goes
 * through the shared confirm dialog, with the sell path marked destructive.
 */
export function BuySheet({ onClose }: BuySheetProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState('GRAM');
  const [side, setSide] = useState<Side>('buy');
  const [amountText, setAmountText] = useState('');

  const adjust = usePortfolioStore((state) => state.adjust);
  const getCryptoAmount = usePortfolioStore((state) => state.getCryptoAmount);
  const cryptoRate = useCryptoRate();
  const cryptoChange = useCryptoChange();
  const { points, status } = useAssetChart(code);

  const rate = cryptoRate(code);
  const change = cryptoChange(code);
  const amount = Number.parseFloat(amountText);
  const estimate = Number.isFinite(amount) ? amount * rate : 0;

  const submit = () => {
    if (!Number.isFinite(amount) || amount <= 0) {
      haptics.notify('error');
      toast.error(t('enterValidAmount'));
      return;
    }
    if (side === 'sell' && amount > getCryptoAmount(code)) {
      haptics.notify('error');
      toast.error(t('insufficientBalance'));
      return;
    }

    const summary = `${amount} ${code} ≈ $${fmtMoney(estimate)}`;
    confirm({
      title: side === 'buy' ? t('confirmBuyTitle') : t('confirmSellTitle'),
      message: summary,
      danger: side === 'sell',
      onConfirm: () => {
        adjust({ type: 'crypto', code }, side === 'buy' ? amount : -amount);
        haptics.notify('success');
        toast.success(side === 'buy' ? t('boughtSuccess') : t('soldSuccess'));
        // Only successful purchases are relayed; sells were not requested.
        if (side === 'buy') {
          void notifyTransaction({ kind: 'buy', summary, asset: code, amount });
        }
        onClose();
      },
    });
  };

  return (
    <BottomSheet title={`${side === 'buy' ? t('buy') : t('sell')} ${code}`} onClose={onClose}>
      <AssetSearchList assets={cryptoCatalog} selected={code} onSelect={setCode} maxHeight={150} />

      <div className="sheet-body">
        <div className="chart-wrap">
          {/* Real history or an explicit state — never a generated curve. */}
          {status === 'ready' ? (
            <PriceChart points={points} />
          ) : (
            <div className="chart-state">
              {status === 'loading' ? t('chartLoading') : t('chartUnavailable')}
            </div>
          )}
          <div className="price-row">
            <span className="price-now">{fmtUsdPrice(rate)}</span>
            <span className={change >= 0 ? 'token-change-up' : 'token-change-down'}>
              {fmtChange(change)}
            </span>
          </div>
        </div>

        <div className="buysell-toggle">
          <button
            type="button"
            className={side === 'buy' ? 'buy-active' : ''}
            onClick={() => setSide('buy')}
            aria-pressed={side === 'buy'}
          >
            {t('buy')}
          </button>
          <button
            type="button"
            className={side === 'sell' ? 'sell-active' : ''}
            onClick={() => setSide('sell')}
            aria-pressed={side === 'sell'}
          >
            {t('sell')}
          </button>
        </div>

        <div className="field-label">{t('amount')}</div>
        <input
          className="field-input"
          type="number"
          inputMode="decimal"
          value={amountText}
          onChange={(event) => setAmountText(event.target.value)}
          placeholder="0.0"
        />
        <div className="hint">≈ ${fmtMoney(estimate)}</div>

        <button type="button" className="primary-btn" onClick={submit}>
          {side === 'buy' ? t('buy') : t('sell')}
        </button>
      </div>
    </BottomSheet>
  );
}
