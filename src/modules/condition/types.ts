export type HourData = {
  time: string;
  temp_c: number;
  chance_of_rain: number;
  chance_of_snow: number;
  precip_mm: number;
  humidity: number;
  wind_kph: number;
  wind_dir: string;
  uv: number;
  condition: {
    icon: string;
    text: string;
  };
};

export type ForecastDay = {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    totalsnow_cm: number;
    avghumidity: number;
    daily_will_it_rain: number;
    daily_chance_of_rain: number;
    daily_will_it_snow: number;
    daily_chance_of_snow: number;
    uv: number;
    condition: {
      text: string;
      icon: string;
    };
  };
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: number;
  };
  hour: HourData[];
};
