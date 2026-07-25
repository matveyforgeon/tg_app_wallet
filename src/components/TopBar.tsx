interface TopBarProps {
  title: string;
}

/**
 * Screen title.
 *
 * The EN/RU toggle that used to live here was removed on request — language is
 * auto-detected from Telegram and changed in Settings › Account, so a permanent
 * control in the header was redundant.
 */
export function TopBar({ title }: TopBarProps) {
  return (
    <div className="topbar">
      <h1>{title}</h1>
    </div>
  );
}
