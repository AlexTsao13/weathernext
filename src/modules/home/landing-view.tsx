"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useWeatherStore } from "@/stores/use-weather-store";
import { useEffect, useState } from "react";

const popularCities = [
  { name: "台北", en: "Taipei", country: "tw" },
  { name: "東京", en: "Tokyo", country: "jp" },
  { name: "首爾", en: "Seoul", country: "kr" },
  { name: "紐約", en: "New York", country: "us" },
  { name: "倫敦", en: "London", country: "gb" },
  { name: "巴黎", en: "Paris", country: "fr" },
];

const LandingView = () => {
  const router = useRouter();
  const { favorites, recentSearches, removeFavorite } = useWeatherStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  // Handle hydration to prevent SSR mismatch when reading from localStorage
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const handleCityClick = (cityName: string) => {
    router.push(`/?city=${encodeURIComponent(cityName)}`);
  };

  const handleUseLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          router.push(`/?city=${latitude},${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("無法取得位置資訊，請手動搜尋城市。");
        },
      );
    } else {
      alert("您的瀏覽器不支援地理位置查詢。");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-[fadeIn_0.6s_ease-out] px-4 space-y-12 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">
          探索全球 <span className="text-blue-500">天氣資訊</span>
        </h1>
        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
          精準的氣象預報，涵蓋全球數千個城市。
          隨時隨地掌握即時天氣、降雨機率與天文資訊。
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center">
        <button
          onClick={handleUseLocation}
          className="flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          使用我目前的位置
        </button>
      </div>

      {/* Favorites Section */}
      {hasHydrated && favorites.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-text-secondary px-2">
            <svg
              className="w-5 h-5 text-yellow-500 fill-yellow-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <h2 className="font-semibold text-text-primary text-xl">
              我的最愛
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {favorites.map((city) => (
              <div key={city.en} className="relative group">
                <button
                  onClick={() => handleCityClick(city.en)}
                  className="w-full bg-surface-hover backdrop-blur-md border border-blue-500/20 p-4 rounded-2xl hover:border-blue-400/50 transition-all hover:shadow-xl hover:shadow-blue-500/10 text-center"
                >
                  <div className="font-medium text-text-primary">
                    {city.name}
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(city.en);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {hasHydrated && recentSearches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-text-secondary px-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="font-semibold">最近搜尋</h2>
          </div>
          <div className="flex flex-wrap gap-2 px-2">
            {recentSearches.map((city) => (
              <button
                key={city}
                onClick={() => handleCityClick(city)}
                className="px-4 py-2 bg-surface border border-surface-border rounded-full text-sm text-text-secondary hover:text-blue-400 hover:border-blue-400/50 transition-all"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Cities */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-text-secondary px-2">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
          </svg>
          <h2 className="font-semibold">熱門城市</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {popularCities.map((city) => (
            <button
              key={city.en}
              onClick={() => handleCityClick(city.en)}
              className="group bg-surface backdrop-blur-md border border-surface-border p-4 rounded-2xl hover:border-blue-400/50 transition-all hover:shadow-xl hover:shadow-blue-500/10 text-center space-y-3"
            >
              <div className="flex justify-center h-8">
                <Image
                  src={`https://flagcdn.com/w80/${city.country}.png`}
                  alt={city.name}
                  width={48}
                  height={32}
                  className="rounded-sm shadow-sm group-hover:scale-110 transition-transform object-contain"
                />
              </div>
              <div className="font-medium text-text-primary text-sm">
                {city.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingView;
