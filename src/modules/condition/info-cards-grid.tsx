import InfoCard from "./info-card";
import AstroCard from "./astro-card";
import type { ForecastDay } from "./types";

type InfoCardsGridProps = {
  day: ForecastDay["day"];
  astro: ForecastDay["astro"];
};

// ── 輔助：UV 指數等級 ──
function uvLabel(uv: number) {
  if (uv <= 2) return "低";
  if (uv <= 5) return "中等";
  if (uv <= 7) return "高";
  if (uv <= 10) return "極高";
  return "危險";
}

const InfoCardsGrid = ({ day, astro }: InfoCardsGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 降雨機率 */}
      <InfoCard
        title="降雨機率"
        value={`${day.daily_chance_of_rain}%`}
        sub={day.daily_will_it_rain ? "預計會下雨" : "預計不會下雨"}
        icon={
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
        }
      />

      {/* 總降水量 */}
      <InfoCard
        title="總降水量"
        value={`${day.totalprecip_mm} mm`}
        sub={day.totalsnow_cm > 0 ? `降雪 ${day.totalsnow_cm} cm` : undefined}
        icon={
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
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-1.318.659a6 6 0 01-3.86.517L4.594 15.62a2 2 0 00-1.022.547M19.428 15.428a2 2 0 01.572 1.407v.964a2 2 0 01-2 2H6a2 2 0 01-2-2v-.964c0-.535.214-1.049.572-1.407"
            />
          </svg>
        }
      />

      {/* 降雪機率 */}
      <InfoCard
        title="降雪機率"
        value={`${day.daily_chance_of_snow}%`}
        sub={day.daily_will_it_snow ? "預計會下雪" : "預計不會下雪"}
        icon={
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
              d="M12 3v18m-6-6l6 6 6-6M6 9l6-6 6 6"
            />
          </svg>
        }
      />

      {/* 平均濕度 */}
      <InfoCard
        title="平均濕度"
        value={`${day.avghumidity}%`}
        icon={
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
              d="M12 3c-4.97 4.97-7 8.03-7 11a7 7 0 1014 0c0-2.97-2.03-6.03-7-11z"
            />
          </svg>
        }
      />

      {/* 最大風速 */}
      <InfoCard
        title="最大風速"
        value={`${day.maxwind_kph} km/h`}
        icon={
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
              d="M14 5a2 2 0 012 2H3m14 4a2 2 0 100-4M9 17a2 2 0 01-2-2h12"
            />
          </svg>
        }
      />

      {/* UV 指數 */}
      <InfoCard
        title="UV 指數"
        value={`${day.uv}`}
        sub={uvLabel(day.uv)}
        icon={
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
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        }
      />

      {/* 天文資訊 */}
      <AstroCard astro={astro} />
    </div>
  );
};

export default InfoCardsGrid;
