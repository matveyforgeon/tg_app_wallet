import { useTranslation } from '@/i18n/useTranslation';
import { confirm } from '@/store/confirmStore';
import { useSettingsStore } from '@/store/settingsStore';
import { toast } from '@/store/uiStore';
import { biometrics, haptics } from '@/telegram/telegram';

export interface SensitiveActionRequest {
  title: string;
  message: string;
  danger?: boolean;
  onConfirm: () => void;
}

/**
 * Gates a consequential action behind the confirm dialog, plus a biometric
 * scan when the user has enabled Biometric lock.
 *
 * This is the spec's own alternative to an app-wide passcode (§3, §10): secure
 * the individual sensitive actions, never the app entry. Biometrics is
 * strictly an *additional* factor — the confirm dialog still runs first, so
 * behaviour is unchanged for anyone who leaves the setting off, and a device
 * without biometrics is never locked out of its own wallet.
 */
export function useSensitiveAction(): (request: SensitiveActionRequest) => void {
  const { t } = useTranslation();
  const biometricEnabled = useSettingsStore((state) => state.biometric);

  return (request) => {
    confirm({
      title: request.title,
      message: request.message,
      ...(request.danger === undefined ? {} : { danger: request.danger }),
      onConfirm: () => {
        if (!biometricEnabled) {
          request.onConfirm();
          return;
        }
        void (async () => {
          const ok = await biometrics.authenticate(request.title);
          if (ok) {
            request.onConfirm();
            return;
          }
          haptics.notify('error');
          toast.error(t('biometricFailed'));
        })();
      },
    });
  };
}
