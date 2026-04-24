import Link from "next/link";
import Image from "next/image";
import type { ForecastDay } from "./types";

type DateSelectorProps = {
  forecastDays: ForecastDay[];
  currentDate: string;
  city: string;
};

function formatShortDate(dateString: string, index: number) {
  if (index === 0) return "今天";
  const d = new Date(dateString);
  return d.toLocaleDateString("zh-TW", { weekday: "short" });
}

function formatDayMonth(dateString: string) {
  const d = new Date(dateString);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

const DateSelector = ({
  forecastDays,
  currentDate,
  city,
}: DateSelectorProps) => {
  return (
    <div className="bg-surface backdrop-blur-md rounded-2xl p-3 shadow-lg border border-surface-border">
      <div className="flex gap-2">
        {forecastDays.map((fd, index) => {
          const isActive = fd.date === currentDate;
          const iconSrc = fd.day.condition.icon.startsWith("//")
            ? `https:${fd.day.condition.icon}`
            : fd.day.condition.icon;

          return (
            <Link
              key={fd.date}
              href={`/forecast/${fd.date}?city=${encodeURIComponent(city)}`}
              id={`date-tab-${fd.date}`}
              className={`
                flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl
                transition-all duration-300 relative
                ${
                  isActive
                    ? "bg-surface-active shadow-md border border-surface-border-hover"
                    : "hover:bg-surface-hover border border-transparent"
                }
              `}
            >
              {/* 星期 */}
              <span
                className={`text-xs font-semibold ${isActive ? "text-text-primary" : "text-text-tertiary"}`}
              >
                {formatShortDate(fd.date, index)}
              </span>

              {/* 日期 */}
              <span
                className={`text-[10px] ${isActive ? "text-text-secondary" : "text-text-muted"}`}
              >
                {formatDayMonth(fd.date)}
              </span>

              {/* 天氣圖示 */}
              <Image
                src={iconSrc}
                alt={fd.day.condition.text}
                width={32}
                height={32}
              />

              {/* 溫度範圍 */}
              <div className="flex gap-1 text-[11px]">
                <span className={isActive ? "text-text-primary" : "text-text-tertiary"}>
                  {fd.day.maxtemp_c}°
                </span>
                <span className={isActive ? "text-text-tertiary" : "text-text-muted"}>
                  {fd.day.mintemp_c}°
                </span>
              </div>

              {/* 選中指示器 */}
              {isActive && (
                <div className="absolute bottom-1 w-5 h-0.5 rounded-full bg-indicator" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DateSelector;
