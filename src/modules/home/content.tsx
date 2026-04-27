"use client";

import DailyForecast from "@/modules/home/daily-forecast";
import HourlyForecast from "@/modules/home/hourly-forecast";
import Overview from "@/modules/home/overview";
import SearchComponent from "@/modules/home/search-component";
import LandingView from "@/modules/home/landing-view";
import useQueryWeather from "@/app/hooks/use-query-weather";
import { useSearchParams } from "next/navigation";

const Content = () => {
  const { data: weather, isLoading, error } = useQueryWeather();
  const searchParams = useSearchParams();
  const currentCity = searchParams.get("city");

  return (
    <div className="pb-20">
      <SearchComponent />
      
      {!currentCity && !isLoading && <LandingView />}

      {isLoading && (
        <div className="flex flex-col items-center justify-center mt-20 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-text-tertiary">正在獲取氣象數據...</p>
        </div>
      )}

      {error && currentCity && (
        <div className="text-center mt-20 p-8 bg-red-500/5 rounded-2xl border border-red-500/20 max-w-md mx-auto">
          <p className="text-red-500 font-bold text-lg mb-2">搜尋出錯</p>
          <p className="text-text-tertiary mb-6">找不到城市「{currentCity}」，請檢查拼字是否正確。</p>
        </div>
      )}

      {weather && (
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
          <Overview weather={weather} />
          <HourlyForecast weather={weather} />
          <DailyForecast weather={weather} />
        </div>
      )}
    </div>
  );
};

export default Content;
