import { useWeatherStore } from "@/stores/use-weather-store";

interface WeatherData {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
    };
  };
  forecast: {
    forecastday: Array<{
      day: {
        maxtemp_c: number;
        mintemp_c: number;
      };
    }>;
  };
}

interface OverviewProps {
  weather: WeatherData;
}

const Overview = ({ weather }: OverviewProps) => {
  const currentTemp = weather.current.temp_c;
  const forecastDay = weather.forecast.forecastday[0].day;
  
  const { addFavorite, removeFavorite } = useWeatherStore();
  const favorited = useWeatherStore((state) => 
    state.favorites.some((f) => f.en === weather.location.name || f.name === weather.location.name)
  );

  const toggleFavorite = () => {
    if (favorited) {
      removeFavorite(weather.location.name);
    } else {
      addFavorite({ name: weather.location.name, en: weather.location.name });
    }
  };

  // Ensure high/low range includes the current temperature
  const displayMax = Math.max(currentTemp, forecastDay.maxtemp_c);
  const displayMin = Math.min(currentTemp, forecastDay.mintemp_c);

  return (
    <div className="backdrop-blur-md rounded-2xl p-6 text-text-primary text-center space-y-2 relative">
      <button
        onClick={toggleFavorite}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors group"
        aria-label={favorited ? "從最愛移除" : "加入最愛"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-6 h-6 transition-all ${
            favorited 
              ? "fill-yellow-400 stroke-yellow-400 scale-110" 
              : "fill-none stroke-text-tertiary group-hover:stroke-yellow-400"
          }`}
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
      
      <h2 className="text-3xl font-bold">我的位置</h2>
      <p className="text-2xl font-semibold">{weather.location.name}</p>
      <p className="text-6xl font-bold">{currentTemp}°C</p>

      <div className="flex justify-center gap-6 text-sm text-text-tertiary">
        <p>最高 {displayMax}°C</p>
        <p>最低 {displayMin}°C</p>
      </div>

      <p className="text-lg italic">{weather.current.condition.text}</p>
    </div>
  );
};

export default Overview;
