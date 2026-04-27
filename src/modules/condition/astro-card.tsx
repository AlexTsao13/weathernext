import type { ForecastDay } from "./types";

type AstroCardProps = {
  astro: ForecastDay["astro"];
};

const AstroCard = ({ astro }: AstroCardProps) => {
  return (
    <div className="bg-surface backdrop-blur-md rounded-2xl p-5 shadow-lg border border-surface-border col-span-2 hover:border-surface-border-hover transition-all duration-300 hover:scale-[1.01]">
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
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
        天文資訊
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AstroItem
          color="amber"
          label="日出"
          value={astro.sunrise}
          iconPath="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
        <AstroItem
          color="orange"
          label="日落"
          value={astro.sunset}
          iconPath="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
        <AstroItem
          color="indigo"
          label="月出"
          value={astro.moonrise}
          iconPath="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
        <AstroItem
          color="slate"
          label="月落"
          value={astro.moonset}
          iconPath="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </div>
      <div className="mt-4 pt-4 border-t border-divider flex items-center justify-between">
        <span className="text-sm text-text-tertiary">月相</span>
        <span className="text-sm text-text-primary font-medium">
          {astro.moon_phase}
        </span>
      </div>
    </div>
  );
};

// ── 天文子項目 ──
const colorMap: Record<string, { bg: string; text: string }> = {
  amber: { bg: "bg-amber-500/20", text: "text-amber-400" },
  orange: { bg: "bg-orange-500/20", text: "text-orange-400" },
  indigo: { bg: "bg-indigo-500/20", text: "text-indigo-300" },
  slate: { bg: "bg-slate-500/20", text: "text-slate-400" },
};

function AstroItem({
  color,
  label,
  value,
  iconPath,
}: {
  color: string;
  label: string;
  value: string;
  iconPath: string;
}) {
  const c = colorMap[color] || colorMap.slate;
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-full ${c.bg} flex items-center justify-center`}
      >
        <svg
          className={`w-5 h-5 ${c.text}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={iconPath}
          />
        </svg>
      </div>
      <div>
        <p className="text-xs text-text-tertiary">{label}</p>
        <p className="text-text-primary font-semibold">{value}</p>
      </div>
    </div>
  );
}

export default AstroCard;
