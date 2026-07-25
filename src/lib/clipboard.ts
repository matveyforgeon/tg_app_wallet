/**
 * Copies text to the clipboard, returning whether it worked.
 *
 * `navigator.clipboard` is unavailable in some Telegram in-app webviews (and on
 * any non-secure origin), so this falls back to the legacy `execCommand` path
 * rather than silently doing nothing.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (globalThis.navigator?.clipboard?.writeText) {
      await globalThis.navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or unavailable — fall through to the legacy path.
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    // Keep it off-screen and non-scrolling so the page does not jump.
    textarea.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
