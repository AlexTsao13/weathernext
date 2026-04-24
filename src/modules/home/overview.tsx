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
  return (
    <div className=" backdrop-blur-md rounded-2xl p-6 text-text-primary  text-center space-y-2">
      <h2 className="text-3xl font-bold">我的位置</h2>
      <p className="text-2xl font-semibold">{weather.location.name}</p>
      <p className="text-6xl font-bold">{weather.current.temp_c}°C</p>

      <div className="flex justify-center gap-6 text-sm text-text-tertiary">
        <p>最高 {weather.forecast.forecastday[0].day.maxtemp_c}°C</p>
        <p>最低 {weather.forecast.forecastday[0].day.mintemp_c}°C</p>
      </div>

      <p className="text-lg italic">{weather.current.condition.text}</p>
    </div>
  );
};

export default Overview;
