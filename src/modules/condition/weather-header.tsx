import Image from "next/image";
import type { ForecastDay } from "./types";

type WeatherHeaderProps = {
  day: ForecastDay["day"];
  date: string;
  currentTemp?: number;
};

function formatDateDisplay(dateString: string) {
  const d = new Date(dateString);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekday = d.toLocaleDateString("zh-TW", { weekday: "long" });
  return `${month}月${day}日 ${weekday}`;
}

const WeatherHeader = ({ day, date, currentTemp }: WeatherHeaderProps) => {
  const iconSrc = day.condition.icon.startsWith("//")
    ? `https:${day.condition.icon}`
    : day.condition.icon;

  // Use current temperature if available (for today), otherwise use avg
  const mainTemp = currentTemp ?? day.avgtemp_c;
  
  // Ensure range includes the temperature we are displaying
  const displayMax = Math.max(mainTemp, day.maxtemp_c);
  const displayMin = Math.min(mainTemp, day.mintemp_c);

  return (
    <div className="bg-surface backdrop-blur-md rounded-2xl p-6 shadow-lg border border-surface-border text-center space-y-3">
      <p className="text-text-tertiary text-sm">{formatDateDisplay(date)}</p>
      <div className="flex items-center justify-center gap-3">
        <Image
          src={iconSrc}
          alt={day.condition.text}
          width={64}
          height={64}
        />
        <div>
          <p className="text-4xl font-bold text-text-primary">{mainTemp}°C</p>
          <p className="text-lg text-text-secondary italic">{day.condition.text}</p>
        </div>
      </div>
      <div className="flex justify-center gap-6 text-sm text-text-tertiary">
        <span>最高 {displayMax}°C</span>
        <span>最低 {displayMin}°C</span>
      </div>
    </div>
  );
};

export default WeatherHeader;
