import { useState } from 'react';
import { BottomSheet } from '@/components/BottomSheet';
import { CARD_PALETTES, DEFAULT_CARD_COLOR, type CardColorId } from '@/data/cardPalettes';
import { useTranslation } from '@/i18n/useTranslation';
import { useCardStore } from '@/store/cardStore';
import { toast } from '@/store/uiStore';
import { haptics } from '@/telegram/telegram';

interface CreateCardSheetProps {
  onClose: () => void;
}

/**
 * Card issuance sheet: cardholder name and one of exactly four metallic
 * finishes, in the fixed violet → red → white → black order (spec §10).
 */
export function CreateCardSheet({ onClose }: CreateCardSheetProps) {
  const { t } = useTranslation();
  const [holder, setHolder] = useState('');
  const [colorId, setColorId] = useState<CardColorId>(DEFAULT_CARD_COLOR);
  const create = useCardStore((state) => state.create);

  const submit = () => {
    const name = holder.trim();
    if (!name) {
      haptics.notify('error');
      toast.error(t('enterName'));
      return;
    }
    create(name, colorId);
    haptics.notify('success');
    toast.success(t('cardCreated'));
    onClose();
  };

  return (
    <BottomSheet title={t('createCard')} onClose={onClose}>
      <div className="sheet-body">
        <div className="field-label">{t('cardHolder')}</div>
        <input
          className="field-input"
          value={holder}
          onChange={(event) => setHolder(event.target.value)}
          placeholder={t('fullName')}
          autoComplete="name"
        />

        <div className="field-label">{t('cardColor')}</div>
        <div className="color-swatch-row">
          {CARD_PALETTES.map((palette) => (
            <button
              key={palette.id}
              type="button"
              className={`color-swatch${palette.id === colorId ? ' active' : ''}`}
              style={{ background: palette.grad }}
              onClick={() => {
                haptics.select();
                setColorId(palette.id);
              }}
              aria-label={palette.id}
              aria-pressed={palette.id === colorId}
            />
          ))}
        </div>

        <button type="button" className="primary-btn" onClick={submit}>
          {t('confirm')}
        </button>
      </div>
    </BottomSheet>
  );
}
