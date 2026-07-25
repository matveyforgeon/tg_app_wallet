/**
 * The app mark from `app_icon.svg` — a coin ring with a wave line passing
 * through it, echoing the background wave motif. Drawn in `currentColor` so it
 * inherits the splash badge's foreground.
 */
export function AppMark() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="6" />
      <path
        d="M20 60 C34 44 44 66 58 50 C68 39 74 45 82 37"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
