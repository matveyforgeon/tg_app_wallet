interface PhaseNoteProps {
  children: string;
}

/**
 * Placeholder body for screens whose content lands in a later phase. Uses the
 * real glass card so the navigation shell reviews correctly; every instance is
 * replaced as its phase is built.
 */
export function PhaseNote({ children }: PhaseNoteProps) {
  return (
    <div className="card">
      <div className="hint" style={{ marginTop: 0 }}>
        {children}
      </div>
    </div>
  );
}
