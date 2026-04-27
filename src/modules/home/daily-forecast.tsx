"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type ForecastDay = {
  date: string;
  day: {
    mintemp_c: number;
    maxtemp_c: number;
    condition: {
      icon: string;
      text: string;
    };
    daily_chance_of_rain?: number;
  };
};

type DailyForecastProps = {
  weather: {
    current?: {
      temp_c: number;
    };
    forecast: {
      forecastday: ForecastDay[];
    };
  };
};

const DailyForecast = ({ weather }: DailyForecastProps) => {
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || "";
  const forecast = weather?.forecast;
  const forecastDays = forecast?.forecastday || [];

  if (!forecastDays.length) {
    return null;
  }

  const temps = forecastDays.flatMap((d) => [d.day.mintemp_c, d.day.maxtemp_c]);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = maxTemp - minTemp || 1;

  const formatWeekday = (dateString: string, index: number) => {
    const date = new Date(dateString);
    if (index === 0) return "今天";
    return date.toLocaleDateString("zh-TW", { weekday: "short" });
  };

  const forecastItems = forecastDays.map((day, index) => {
    const label = formatWeekday(day.date, index);
    const min = day.day.mintemp_c;
    const max = day.day.maxtemp_c;
    const left = ((min - minTemp) / range) * 100;
    const width = ((max - min) / range) * 100 || 100;

    return (
      <Link
        key={day.date}
        href={`/forecast/${day.date}?city=${encodeURIComponent(city)}`}
        className="block hover:bg-surface-hover rounded-xl transition-colors duration-200 cursor-pointer"
        id={`forecast-link-${day.date}`}
      >
        {/* 間隔線 */}
        <hr className="border-divider" />
        {/* 單日預報區塊 */}
        <div className="flex items-center justify-evenly my-6 w-full gap-4 h-10">
          {/* 日期文字區塊 */}
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-center flex-3">
            {label}
          </h3>

          {/* 天氣圖示區塊 */}
          <div className="items-center justify-center flex-1">
            <Image
              src={
                day.day.condition.icon.startsWith("//")
                  ? `https:${day.day.condition.icon}`
                  : day.day.condition.icon
              }
              alt={day.day.condition.text}
              width={40}
              height={40}
            />

            {day.day.daily_chance_of_rain !== 0 && (
              <p>{day.day.daily_chance_of_rain}%</p>
            )}
          </div>

          {/* 溫度顯示與視覺化區塊 */}
          <div className="flex items-center justify-center gap-4 flex-10 h-12 sm:h-14 md:h-16 lg:h-20">
            {/* 最低溫文字 */}
            <p className="w-auto text-sm sm:text-base md:text-lg lg:text-xl font-bold flex-1">
              {min}°C
            </p>

            {/* 溫度條容器 */}
            <div className="w-full relative flex-2 h-1.5 group">
              {/* 背景軌道與範圍條 */}
              <div className="w-full h-full bg-temp-track rounded-full relative overflow-hidden">
                {/* 當日溫度範圍條 (遮罩作用) */}
                <div
                  className="h-full absolute rounded-full overflow-hidden"
                  style={{
                    left: `${left}%`,
                    width: `${Math.max(width, 2)}%`,
                  }}
                >
                  {/* 漸層顏色條 */}
                  <div
                    className="h-full absolute bg-gradient-to-r from-yellow-400 to-red-500"
                    style={{
                      left: `-${(left / Math.max(width, 2)) * 100}%`,
                      width: `${(100 / Math.max(width, 2)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* 現在溫度指示點 (僅在「今天」顯示) */}
              {index === 0 && weather.current && (
                <div
                  className="absolute top-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-white border-[1.5px] sm:border-[2px] md:border-[2.5px] border-black/80 rounded-full shadow-[0_0_4px_rgba(0,0,0,0.3)] z-10"
                  style={{
                    left: `${
                      ((weather.current.temp_c - minTemp) / range) * 100
                    }%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
            </div>

            {/* 最高溫文字 */}
            <p className="w-auto text-sm sm:text-base md:text-lg lg:text-xl font-bold flex-1">
              {max}°C
            </p>
          </div>

          {/* 箭頭指示器 */}
          <svg
            className="w-4 h-4 text-text-muted flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>
    );
  });

  // 最終畫面結構
  return (
    <div className="bg-surface backdrop-blur-md rounded-xl p-4 text-text-primary shadow-lg text-center overflow-x-auto flex flex-col mt-8 border border-surface-border scrollbar scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent w-full mx-auto">
      <p className="text-xl font-semibold mb-2">3天天氣預報</p>
      <div className="flex flex-col">{forecastItems}</div>
    </div>
  );
};

export default DailyForecast;
