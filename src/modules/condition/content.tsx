"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import useQueryWeather from "@/app/hooks/use-query-weather";

type HourData = {
  time: string;
  temp_c: number;
  chance_of_rain: number;
  chance_of_snow: number;
  precip_mm: number;
  humidity: number;
  wind_kph: number;
  wind_dir: string;
  uv: number;
  condition: {
    icon: string;
    text: string;
  };
};

type ForecastDay = {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    totalsnow_cm: number;
    avghumidity: number;
    daily_will_it_rain: number;
    daily_chance_of_rain: number;
    daily_will_it_snow: number;
    daily_chance_of_snow: number;
    uv: number;
    condition: {
      text: string;
      icon: string;
    };
  };
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: number;
  };
  hour: HourData[];
};

// ── 輔助：根據 UV 指數回傳等級標籤 ──
function uvLabel(uv: number) {
  if (uv <= 2) return "低";
  if (uv <= 5) return "中等";
  if (uv <= 7) return "高";
  if (uv <= 10) return "極高";
  return "危險";
}

// ── 輔助：格式化日期 ──
function formatDateDisplay(dateString: string) {
  const d = new Date(dateString);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekday = d.toLocaleDateString("zh-TW", { weekday: "long" });
  return `${month}月${day}日 ${weekday}`;
}

// ── 資訊卡片元件 ──
function InfoCard({
  title,
  value,
  sub,
  icon,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-2 shadow-lg border border-white/5 hover:border-white/15 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-sm text-white/50">{sub}</p>}
    </div>
  );
}

// ── 逐時降雨機率圖表 ──
function HourlyRainChart({ hours }: { hours: HourData[] }) {
  const maxChance = Math.max(...hours.map((h) => h.chance_of_rain), 1);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5">
      <h3 className="text-white/60 text-sm font-medium mb-4 flex items-center gap-2">
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
      <div className="flex items-end gap-[2px] h-28 overflow-x-auto scrollbar scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent pb-1">
        {hours.map((h, i) => {
          const pct = (h.chance_of_rain / maxChance) * 100;
          const hour = h.time.slice(-5, -3);
          return (
            <div
              key={i}
              className="flex flex-col items-center min-w-[28px] group"
            >
              <div className="relative w-full flex justify-center">
                <span className="absolute -top-5 text-[10px] text-white/0 group-hover:text-white/80 transition-colors duration-200">
                  {h.chance_of_rain}%
                </span>
                <div
                  className="w-3 rounded-t-sm bg-gradient-to-t from-blue-500 to-cyan-300 transition-all duration-300 group-hover:from-blue-400 group-hover:to-cyan-200"
                  style={{ height: `${Math.max(pct, 4)}%` }}
                />
              </div>
              <span className="text-[10px] text-white/40 mt-1">{hour}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 天文資訊元件 ──
function AstroCard({ astro }: { astro: ForecastDay["astro"] }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5 col-span-1 sm:col-span-2">
      <h3 className="text-white/60 text-sm font-medium mb-4 flex items-center gap-2">
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
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-amber-400"
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
          </div>
          <div>
            <p className="text-xs text-white/50">日出</p>
            <p className="text-white font-semibold">{astro.sunrise}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-orange-400"
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
          </div>
          <div>
            <p className="text-xs text-white/50">日落</p>
            <p className="text-white font-semibold">{astro.sunset}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-indigo-300"
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
          </div>
          <div>
            <p className="text-xs text-white/50">月出</p>
            <p className="text-white font-semibold">{astro.moonrise}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-500/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-slate-400"
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
          </div>
          <div>
            <p className="text-xs text-white/50">月落</p>
            <p className="text-white font-semibold">{astro.moonset}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-sm text-white/50">月相</span>
        <span className="text-sm text-white font-medium">
          {astro.moon_phase}
        </span>
      </div>
    </div>
  );
}

// ── 主元件 ──
const ConditionContent = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const dateParam = params.date as string;
  const city = searchParams.get("city") || "";

  const { data: weather, isLoading, error } = useQueryWeather();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/60 text-lg">載入天氣資料中...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-500/10 backdrop-blur-md rounded-2xl p-8 text-center border border-red-500/20">
          <p className="text-red-400 text-lg font-semibold">無法載入天氣資料</p>
          <p className="text-white/50 mt-2">請稍後再試</p>
          <Link
            href={`/?city=${city}`}
            className="inline-block mt-4 px-6 py-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
          >
            返回首頁
          </Link>
        </div>
      </div>
    );
  }

  const forecastDays: ForecastDay[] = weather.forecast?.forecastday || [];
  const targetDay = forecastDays.find((d: ForecastDay) => d.date === dateParam);

  if (!targetDay) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10">
          <p className="text-white text-lg font-semibold">找不到該日期的預報</p>
          <Link
            href={`/?city=${city}`}
            className="inline-block mt-4 px-6 py-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
          >
            返回首頁
          </Link>
        </div>
      </div>
    );
  }

  const { day, astro, hour } = targetDay;

  return (
    <div className="text-white space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* 返回按鈕 + 日期標題 */}
      <div className="flex items-center gap-4">
        <Link
          href={`/?city=${city}`}
          className="flex items-center gap-1 text-white/60 hover:text-white transition-colors group"
          id="back-to-home"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-sm">返回</span>
        </Link>
      </div>

      {/* 天氣概覽 header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/5 text-center space-y-3">
        <p className="text-white/50 text-sm">{formatDateDisplay(dateParam)}</p>
        <div className="flex items-center justify-center gap-3">
          <Image
            src={
              day.condition.icon.startsWith("//")
                ? `https:${day.condition.icon}`
                : day.condition.icon
            }
            alt={day.condition.text}
            width={64}
            height={64}
          />
          <div>
            <p className="text-4xl font-bold">{day.avgtemp_c}°C</p>
            <p className="text-lg text-white/70 italic">{day.condition.text}</p>
          </div>
        </div>
        <div className="flex justify-center gap-6 text-sm text-white/50">
          <span>最高 {day.maxtemp_c}°C</span>
          <span>最低 {day.mintemp_c}°C</span>
        </div>
      </div>

      {/* 降雨機率長條圖 */}
      <HourlyRainChart hours={hour} />

      {/* 資訊卡片 Grid */}
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
    </div>
  );
};

export default ConditionContent;
