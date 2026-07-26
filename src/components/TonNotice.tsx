import { useTranslation } from '@/i18n/useTranslation';
import type { StringKey } from '@/i18n/types';

interface TonNoticeProps {
  bodyKey: StringKey;
}

/**
 * TON-network warning shown in the Receive and Send sheets.
 *
 * Restrained on purpose — a tinted border and a coloured title, never a filled
 * red block or a glow (spec §2 rejects loud treatments).
 */
export function TonNotice({ bodyKey }: TonNoticeProps) {
  const { t } = useTranslation();
  return (
    <div className="notice">
      <div className="notice-title">{t('tonOnlyTitle')}</div>
      <div className="notice-body">{t(bodyKey)}</div>
    </div>
  );
}
