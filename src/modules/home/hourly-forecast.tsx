import Image from "next/image";
import { SunriseIcon, SunsetIcon } from "./icons";

type HourData = {
  time: string;
  condition: {
    icon: string;
    text: string;
  };
  temp_c: number;
};

type ForecastWeather = {
  forecast: {
    forecastday: Array<{
      date: string;
      astro: {
        sunrise: string;
        sunset: string;
      };
      hour: HourData[];
    }>;
  };
};

type EventItem = {
  time: string;
  isEvent: true;
  label: string;
};

const HourlyForecast = ({ weather }: { weather: ForecastWeather }) => {
  const forecast = weather.forecast; // 暫時轉型為 any
  const today = forecast.forecastday[0];
  const tomorrow = forecast.forecastday[1];

  const todayHours = today.hour;
  const tomorrowHours = tomorrow?.hour || [];

  const currentHour = new Date().getHours();
  const futureHours = [...todayHours.slice(currentHour), ...tomorrowHours];
  const next24Hours = futureHours.slice(0, 24);

  // 建立一個插入的時間事件陣列（日出日落）
  type EventItem = {
    time: string;
    isEvent: true;
    label: string;
  };
  const events: EventItem[] = [];

  const addEvent = (timeString: string, label: string) => {
    events.push({
      time: timeString,
      isEvent: true,
      label,
    });
  };

  // 加入今天的日出日落
  if (today.astro.sunrise) {
    const sunrise = convertTo24Hour(today.date, today.astro.sunrise);
    addEvent(sunrise, "日出");
  }
  if (today.astro.sunset) {
    const sunset = convertTo24Hour(today.date, today.astro.sunset);
    addEvent(sunset, "日落");
  }

  // 加入明天的日出日落
  if (tomorrow?.astro?.sunrise) {
    const sunrise = convertTo24Hour(tomorrow.date, tomorrow.astro.sunrise);
    addEvent(sunrise, "日出");
  }
  if (tomorrow?.astro?.sunset) {
    const sunset = convertTo24Hour(tomorrow.date, tomorrow.astro.sunset);
    addEvent(sunset, "日落");
  }

  console.log(events);
  // 將日出日落插入正確位置
  type ForecastDisplayItem = HourData | EventItem;
  const combined: ForecastDisplayItem[] = [...next24Hours];
  console.log(combined);
  events.forEach((event) => {
    const index = combined.findIndex((h) => h.time > event.time);
    const eventObj: EventItem = {
      time: event.time,
      isEvent: true,
      label: event.label,
    };

    if (index !== -1 && index !== 0) {
      combined.splice(index, 0, eventObj);
    }
  });

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white shadow-lg text-center overflow-x-auto flex gap-4 scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent">
      {combined.map((item, index) => (
        <div
          key={index}
          className="min-w-[80px] flex flex-col items-center space-y-1"
        >
          <p className="text-sm">{item.time.slice(-5)}</p>
          {"isEvent" in item ? (
            <>
              {item.label === "日出" ? <SunriseIcon /> : <SunsetIcon />}
              <p className="text-base italic">{item.label}</p>
            </>
          ) : (
            <>
              <Image
                src={
                  item.condition.icon.startsWith("//")
                    ? `https:${item.condition.icon}`
                    : item.condition.icon
                }
                alt={item.condition.text}
                width={32}
                height={32}
              />
              <p className="text-base italic">{item.temp_c}°C</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

function convertTo24Hour(date: string, time12h: string): string {
  const [time, period] = time12h.split(" ");
  const [hoursStr, minutesStr] = time.split(":");
  let hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `${date} ${hh}:${mm}`;
}

export default HourlyForecast;
