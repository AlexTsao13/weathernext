import Image from "next/image";

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
    forecast: {
      forecastday: ForecastDay[];
    };
  };
};

const DailyForecast = ({ weather }: DailyForecastProps) => {
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
      <div key={day.date}>
        {/* 間隔線 */}
        <hr className="border-white/20" />
        {/* 單日預報區塊 */}
        <div className="flex items-center justify-evenly my-6 w-full gap-4 h-10">
          {/* 日期文字區塊 */}
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-center flex-3">
            {label}
          </h3>

          {/* 天氣圖示區塊 */}
          <div className="items-center justify-center flex-1">
            <Image 
              src={day.day.condition.icon.startsWith('//') ? `https:${day.day.condition.icon}` : day.day.condition.icon} 
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
            <div className="w-full h-[10%] bg-gray-300 rounded-full relative flex-2">
              {/* 白色背景條，代表當日溫度範圍在整體中的位置 */}
              <div
                className="h-full rounded-full bg-white overflow-hidden"
                style={{
                  marginLeft: `${left}%`,
                  width: `${width}%`,
                }}
              >
                {/* 漸層顏色條，實際溫度條圖案，套用 scaleX 來保持一致比例 */}
                <div
                  className="h-full w-full rounded-full bg-gradient-to-r from-yellow-300 to-orange-500"
                  style={{
                    transform: `translateX(-${
                      (left / width) * 100
                    }%) scaleX(${1 / (width / 100 || 1)})`,
                    transformOrigin: "left",
                  }}
                />
              </div>
            </div>

            {/* 最高溫文字 */}
            <p className="w-auto text-sm sm:text-base md:text-lg lg:text-xl font-bold flex-1">
              {max}°C
            </p>
          </div>
        </div>
      </div>
    );
  });

  // 最終畫面結構
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-white shadow-lg text-center overflow-x-auto flex flex-col mt-8 scrollbar scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent w-full mx-auto">
      <p className="text-xl font-semibold mb-2">3天天氣預報</p>
      <div className="flex flex-col">{forecastItems}</div>
    </div>
  );
};

export default DailyForecast;
