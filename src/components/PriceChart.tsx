import { CHART_HEIGHT, CHART_WIDTH, chartGeometry } from '@/lib/chart';

interface PriceChartProps {
  points: readonly number[];
}

/** The Buy/Sell sparkline: gradient-filled area under a holo-gradient stroke. */
export function PriceChart({ points }: PriceChartProps) {
  const { line, area } = chartGeometry(points);

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      width="100%"
      height={CHART_HEIGHT}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c6bf0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7c6bf0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5a4bd6" />
          <stop offset="100%" stopColor="#3f6ff2" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#chartFill)" />
      <polyline
        points={line}
        fill="none"
        stroke="url(#chartStroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
