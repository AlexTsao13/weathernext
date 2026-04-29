"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import useQueryWeather from "@/app/hooks/use-query-weather";
import type { ForecastDay } from "./types";
import DateSelector from "./date-selector";
import WeatherHeader from "./weather-header";
import HourlyRainChart from "./hourly-rain-chart";
import InfoCardsGrid from "./info-cards-grid";

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
          <div className="w-12 h-12 border-4 border-spinner-border border-t-spinner-active rounded-full animate-spin" />
          <p className="text-text-tertiary text-lg">載入天氣資料中...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-500/10 backdrop-blur-md rounded-2xl p-8 text-center border border-red-500/20">
          <p className="text-red-400 text-lg font-semibold">無法載入天氣資料</p>
          <p className="text-text-tertiary mt-2">請稍後再試</p>
          <Link
            href={`/?city=${city}`}
            className="inline-block mt-4 px-6 py-2 bg-surface rounded-full text-text-primary hover:bg-surface-active transition-colors"
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
        <div className="bg-surface backdrop-blur-md rounded-2xl p-8 text-center border border-surface-border">
          <p className="text-text-primary text-lg font-semibold">找不到該日期的預報</p>
          <Link
            href={`/?city=${city}`}
            className="inline-block mt-4 px-6 py-2 bg-surface rounded-full text-text-primary hover:bg-surface-active transition-colors"
          >
            返回首頁
          </Link>
        </div>
      </div>
    );
  }

  const { day, astro, hour } = targetDay;

  return (
    <div className="text-text-primary space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* 返回按鈕 */}
      <div className="flex items-center gap-4">
        <Link
          href={`/?city=${city}`}
          className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors group"
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

      {/* 日期選擇列 */}
      <DateSelector
        forecastDays={forecastDays}
        currentDate={dateParam}
        city={city}
      />

      {/* 天氣概覽 */}
      <WeatherHeader 
        day={day} 
        date={dateParam} 
        currentTemp={new Date().toISOString().split('T')[0] === dateParam ? weather.current.temp_c : undefined}
      />

      {/* 逐時降雨折線圖 */}
      <HourlyRainChart hours={hour} />

      {/* 資訊卡片 */}
      <InfoCardsGrid day={day} astro={astro} />
    </div>
  );
};

export default ConditionContent;
