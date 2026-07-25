/**
 * Ambient background waves (spec §2, signature element 3).
 *
 * Two thin glowing line-strokes — never filled blobs — sharing one blue-purple
 * gradient family, blurred with layered drop-shadows and drifting on a 26s/30s
 * loop. Glow intensity is deliberately restrained; spec §10 forbids brightening
 * it further.
 */
export function Waves() {
  return (
    <svg
      className="waves"
      viewBox="0 0 390 800"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="waveGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5a4bd6" />
          <stop offset="100%" stopColor="#3f6ff2" />
        </linearGradient>
        <linearGradient id="waveGrad2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f6ff2" />
          <stop offset="100%" stopColor="#6a4bd6" />
        </linearGradient>
      </defs>
      {/* tighter zigzag */}
      <path
        className="wave-path wave1"
        d="M-40,50 C30,10 55,130 110,105 C165,80 180,190 235,155 C295,115 310,240 430,300"
      />
      {/* broad smooth sweep */}
      <path className="wave-path wave2" d="M-40,760 Q195,470 430,640" />
    </svg>
  );
}
