import {
  CardChip,
  EyeIcon,
  EyeOffIcon,
  FreezeIcon,
  TrashIcon,
  UnfreezeIcon,
} from '@/components/icons/CardIcons';
import { findPalette } from '@/data/cardPalettes';
import { useTranslation } from '@/i18n/useTranslation';
import { confirm } from '@/store/confirmStore';
import { groupCardNumber, maskCardNumber, useCardStore } from '@/store/cardStore';
import { toast } from '@/store/uiStore';
import { haptics } from '@/telegram/telegram';

/**
 * The virtual card face and its actions (spec §3, Bank).
 *
 * Number and CVV stay masked. Revealing them is gated behind the confirm
 * dialog; hiding them again is not. Deleting is gated too — it is destructive.
 * Freezing desaturates the face and shows the FROZEN badge.
 *
 * The rim glow is deliberately restrained: a 1px tinted border plus a ~9px
 * soft glow, no wide halo (spec §3 and §10 — it was dialled back twice).
 */
export function VirtualCard() {
  const { t } = useTranslation();
  const card = useCardStore((state) => state.card);
  const revealed = useCardStore((state) => state.revealed);
  const reveal = useCardStore((state) => state.reveal);
  const hide = useCardStore((state) => state.hide);
  const toggleFreeze = useCardStore((state) => state.toggleFreeze);
  const remove = useCardStore((state) => state.remove);

  if (!card) return null;

  const palette = findPalette(card.colorId);

  const onToggleDetails = () => {
    haptics.impact('light');
    if (revealed) {
      hide();
      return;
    }
    confirm({
      title: t('viewDetailsTitle'),
      message: t('viewDetailsMsg'),
      onConfirm: reveal,
    });
  };

  const onFreeze = () => {
    haptics.impact('medium');
    toggleFreeze();
    toast.info(card.frozen ? t('cardUnfrozen') : t('cardFrozen'));
  };

  const onDelete = () => {
    haptics.impact('light');
    confirm({
      title: t('deleteCardTitle'),
      message: t('deleteCardMsg'),
      danger: true,
      onConfirm: () => {
        remove();
        toast.success(t('cardDeleted'));
      },
    });
  };

  return (
    <>
      <div
        className={`bank-card${card.frozen ? ' frozen' : ''}`}
        style={
          {
            '--card-grad': palette.grad,
            '--card-glow': palette.glow,
            '--card-text': palette.text,
          } as React.CSSProperties
        }
      >
        {card.frozen ? <div className="bank-card-frozen-badge">{t('frozenBadge')}</div> : null}

        <div className="bank-card-top">
          <div className="bank-card-chip">
            <CardChip />
          </div>
          {/* Placeholder wordmark — replace with the real issuer's branding. */}
          <div className="bank-card-network">VISA</div>
        </div>

        <div className="bank-card-number">
          {revealed ? groupCardNumber(card.number) : maskCardNumber(card.number)}
        </div>

        <div className="bank-card-bottom">
          <div>
            <div className="bank-card-holder">{t('cardHolder')}</div>
            <div className="bank-card-holder-name">{card.holder}</div>
          </div>
          <div className="bank-card-meta-row">
            <div className="bank-card-exp">
              <div className="bank-card-exp-label">{t('expires')}</div>
              <div className="bank-card-exp-val">{card.exp}</div>
            </div>
            <div className="bank-card-exp">
              <div className="bank-card-exp-label">CVV</div>
              <div className="bank-card-exp-val">{revealed ? card.cvv : '•••'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-actions">
        <button type="button" className="card-action-btn" onClick={onToggleDetails}>
          {revealed ? <EyeOffIcon /> : <EyeIcon />}
          <span>{revealed ? t('hide') : t('viewDetails')}</span>
        </button>
        <button type="button" className="card-action-btn" onClick={onFreeze}>
          {card.frozen ? <UnfreezeIcon /> : <FreezeIcon />}
          <span>{card.frozen ? t('unfreeze') : t('freeze')}</span>
        </button>
        <button type="button" className="card-action-btn" onClick={onDelete}>
          <TrashIcon />
          <span>{t('deleteCard')}</span>
        </button>
      </div>
    </>
  );
}
