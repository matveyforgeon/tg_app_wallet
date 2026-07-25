import { useTranslation } from '@/i18n/useTranslation';
import { useConfirmStore } from '@/store/confirmStore';
import { haptics } from '@/telegram/telegram';

/**
 * The one centred confirm dialog reused across the app (spec §4): title, a
 * one-line consequence, Cancel + Confirm. Tapping the backdrop cancels.
 *
 * Distinct from the bottom sheets on purpose — sheets are for pickers and
 * forms, this is for committing to something.
 */
export function ConfirmDialog() {
  const { t } = useTranslation();
  const request = useConfirmStore((state) => state.request);
  const close = useConfirmStore((state) => state.close);

  if (!request) return null;

  const accept = () => {
    haptics.impact('medium');
    close();
    request.onConfirm();
  };

  return (
    <div
      className="confirm-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={request.title}
    >
      <div className="confirm-box">
        <div className="confirm-title">{request.title}</div>
        <div className="confirm-message">{request.message}</div>
        <div className="confirm-actions">
          <button type="button" className="confirm-btn confirm-cancel" onClick={close}>
            {t('cancel')}
          </button>
          <button
            type="button"
            className={`confirm-btn ${request.danger ? 'confirm-danger' : 'confirm-ok'}`}
            onClick={accept}
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
