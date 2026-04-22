"use client";

import DailyForecast from "@/modules/home/daily-forecast";
import HourlyForecast from "@/modules/home/hourly-forecast";
import Overview from "@/modules/home/overview";
import SearchComponent from "@/modules/home/search-component";
import useQueryWeather from "@/app/hooks/use-query-weather";

const Content = () => {
  const { data: weather, isLoading, error } = useQueryWeather();

  return (
    <div>
      <SearchComponent />
      {isLoading && <p className="text-center mt-10">加載中...</p>}
      {error && (
        <p className="text-center mt-10 text-red-500">出錯了，請稍後重試</p>
      )}
      {weather && (
        <>
          <Overview weather={weather} />
          <HourlyForecast weather={weather} />
          <DailyForecast weather={weather} />
        </>
      )}
    </div>
  );
};

export default Content;
