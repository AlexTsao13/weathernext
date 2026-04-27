"use client";
import { useRouter } from "next/navigation";

const popularCities = [
  { name: "台北", en: "Taipei", icon: "🏙️" },
  { name: "東京", en: "Tokyo", icon: "🗼" },
  { name: "紐約", en: "New York", icon: "🗽" },
  { name: "倫敦", en: "London", icon: "🎡" },
  { name: "巴黎", en: "Paris", icon: "🗼" },
  { name: "首爾", en: "Seoul", icon: "🏯" },
];

const LandingView = () => {
  const router = useRouter();

  const handleCityClick = (cityName: string) => {
    router.push(`/?city=${encodeURIComponent(cityName)}`);
  };

  const handleUseLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Weather APIs often accept "lat,lon" as a query
          router.push(`/?city=${latitude},${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("無法取得位置資訊，請手動搜尋城市。");
        }
      );
    } else {
      alert("您的瀏覽器不支援地理位置查詢。");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-[fadeIn_0.6s_ease-out]">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">
          探索全球 <span className="text-blue-500">天氣資訊</span>
        </h1>
        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
          精準的氣象預報，涵蓋全球數千個城市。
          隨時隨地掌握即時天氣、降雨機率與天文資訊。
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center mb-16">
        <button
          onClick={handleUseLocation}
          className="flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          使用我目前的位置
        </button>
      </div>

      {/* Popular Cities */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-text-secondary px-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <h2 className="font-semibold">熱門城市搜尋</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {popularCities.map((city) => (
            <button
              key={city.en}
              onClick={() => handleCityClick(city.en)}
              className="group bg-surface backdrop-blur-md border border-surface-border p-4 rounded-2xl hover:border-blue-400/50 transition-all hover:shadow-xl hover:shadow-blue-500/10 text-center space-y-2"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">
                {city.icon}
              </div>
              <div className="font-medium text-text-primary">{city.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 opacity-80">
        <FeatureCard 
          icon="📊" 
          title="精確數據" 
          desc="即時更新的溫度、濕度與降雨數據" 
        />
        <FeatureCard 
          icon="🌙" 
          title="天文資訊" 
          desc="日出日落與月相變化一手掌握" 
        />
        <FeatureCard 
          icon="📱" 
          title="響應式設計" 
          desc="完美適配各種裝置的瀏覽體驗" 
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="p-6 space-y-2 border-l-2 border-blue-500/20">
    <div className="text-2xl">{icon}</div>
    <h3 className="font-bold text-text-primary">{title}</h3>
    <p className="text-sm text-text-tertiary leading-relaxed">{desc}</p>
  </div>
);

export default LandingView;
