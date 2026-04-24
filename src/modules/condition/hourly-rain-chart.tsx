import type { HourData } from "./types";

type HourlyRainChartProps = {
  hours: HourData[];
};

const CHART_HEIGHT = 140;
const CHART_PADDING_TOP = 20;
const CHART_PADDING_BOTTOM = 24;
const DRAWABLE_HEIGHT = CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;

const HourlyRainChart = ({ hours }: HourlyRainChartProps) => {
  // 每個時段的寬度
  const pointGap = 36;
  const totalWidth = Math.max(hours.length * pointGap, 300);

  // 計算 Y 座標（機率 0~100）
  const getY = (chance: number) => {
    const ratio = chance / 100;
    return CHART_HEIGHT - CHART_PADDING_BOTTOM - ratio * DRAWABLE_HEIGHT;
  };

  // 建構 SVG 折線的 path
  const points = hours.map((h, i) => ({
    x: i * pointGap + pointGap / 2,
    y: getY(h.chance_of_rain),
    value: h.chance_of_rain,
    hour: h.time.slice(-5, -3),
  }));

  // 折線路徑
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // 填充漸層的路徑（折線下方區域）
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${CHART_HEIGHT - CHART_PADDING_BOTTOM} L ${points[0].x} ${CHART_HEIGHT - CHART_PADDING_BOTTOM} Z`;

  // Y 軸刻度線
  const yTicks = [0, 25, 50, 75, 100];

  return (
    <div className="bg-surface backdrop-blur-md rounded-2xl p-5 shadow-lg border border-surface-border">
      <h3 className="text-text-secondary text-sm font-medium mb-4 flex items-center gap-2">
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          />
        </svg>
        逐時降雨機率
      </h3>

      <div className="overflow-x-auto scrollbar scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent">
        <svg
          width={totalWidth}
          height={CHART_HEIGHT}
          viewBox={`0 0 ${totalWidth} ${CHART_HEIGHT}`}
          className="select-none"
        >
          <defs>
            {/* 折線下方漸層填充 */}
            <linearGradient id="rainAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.35)" />
              <stop offset="100%" stopColor="rgba(56, 189, 248, 0.02)" />
            </linearGradient>
            {/* 折線漸層 */}
            <linearGradient id="rainLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>

          {/* Y 軸參考線 */}
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={0}
                y1={getY(tick)}
                x2={totalWidth}
                y2={getY(tick)}
                stroke="var(--chart-grid)"
                strokeDasharray="4 4"
              />
              <text
                x={4}
                y={getY(tick) - 4}
                fill="var(--chart-label)"
                fontSize={9}
              >
                {tick}%
              </text>
            </g>
          ))}

          {/* 面積填充 */}
          <path d={areaPath} fill="url(#rainAreaGrad)" />

          {/* 折線 */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#rainLineGrad)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 資料點 + 標籤 */}
          {points.map((p, i) => (
            <g key={i}>
              {/* 圓點 */}
              <circle
                cx={p.x}
                cy={p.y}
                r={3.5}
                fill="var(--chart-dot-fill)"
                stroke="#38bdf8"
                strokeWidth={2}
              />

              {/* 數值標籤 (每隔幾個顯示，或值 > 0 顯示) */}
              {(i % 3 === 0 || p.value > 0) && (
                <text
                  x={p.x}
                  y={p.y - 8}
                  textAnchor="middle"
                  fill="var(--chart-value)"
                  fontSize={10}
                  fontWeight={500}
                >
                  {p.value}%
                </text>
              )}

              {/* 時間標籤 */}
              <text
                x={p.x}
                y={CHART_HEIGHT - 6}
                textAnchor="middle"
                fill="var(--chart-label)"
                fontSize={10}
              >
                {p.hour}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default HourlyRainChart;
