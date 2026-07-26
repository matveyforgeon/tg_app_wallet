import { useTranslation } from '@/i18n/useTranslation';
import { confirm } from '@/store/confirmStore';
import { usePasscodePrompt } from '@/store/passcodePromptStore';
import { usePasscodeStore } from '@/store/passcodeStore';
import { useSettingsStore } from '@/store/settingsStore';
import { toast } from '@/store/uiStore';
import { biometrics, haptics } from '@/telegram/telegram';

export interface SensitiveActionRequest {
  title: string;
  message: string;
  danger?: boolean;
  /**
   * Requires the send passcode on top of the confirm dialog. Only sending
   * crypto sets this — it is the one action that moves funds out of the
   * wallet irreversibly.
   */
  requirePasscode?: boolean;
  onConfirm: () => void;
}

/**
 * Gates a consequential action behind the confirm dialog, plus — depending on
 * settings and the action — a biometric scan or the send passcode.
 *
 * Spec §10 forbids an app-entry passcode. Both factors here guard individual
 * actions, which is exactly the alternative the spec names.
 *
 * Ordering:
 *   confirm dialog  →  passcode prompt (send only, if one is set)
 *                   →  otherwise biometric scan (if enabled)
 *
 * The passcode prompt attempts biometrics itself, so enabling both does not
 * mean two challenges — Face ID resolves the prompt without typing.
 */
export function useSensitiveAction(): (request: SensitiveActionRequest) => void {
  const { t } = useTranslation();
  const biometricEnabled = useSettingsStore((state) => state.biometric);
  const passcodeSet = usePasscodeStore((state) => state.isSet);
  const requestPasscode = usePasscodePrompt((state) => state.request);

  return (request) => {
    confirm({
      title: request.title,
      message: request.message,
      ...(request.danger === undefined ? {} : { danger: request.danger }),
      onConfirm: () => {
        if (request.requirePasscode && passcodeSet) {
          requestPasscode(t('passcodeReason'), request.onConfirm);
          return;
        }
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
