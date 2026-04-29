"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWeatherStore } from "@/stores/use-weather-store";

const SearchComponent = () => {
  const [city, setCity] = useState<string>(""); // 存輸入的城市
  const router = useRouter(); // React Router 導航

  const addRecentSearch = useWeatherStore((state) => state.addRecentSearch);

  // 監聽輸入框變化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value); // 更新城市狀態
  };
  // 觸發搜尋
  const handleSearch = () => {
    if (city.trim()) {
      addRecentSearch(city.trim());
      router.push(`/?city=${encodeURIComponent(city.trim())}`); // 導航到城市頁面
    }
  };
  // 監聽Enter鍵觸發搜尋
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(); // 觸發搜尋
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-10 rounded-lg">
      {/* Search Input */}
      <div className="flex items-center border border-surface-border-hover rounded-lg overflow-hidden bg-input-bg">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 text-text-tertiary hover:text-blue-500 transition-colors border-r border-surface-border-hover"
          title="回首頁"
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>
        <input
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          type="text"
          name="search"
          className="flex-1 px-4 py-2 outline-none text-input-text bg-transparent"
          placeholder="enter city name..."
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition"
        >
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};

export default SearchComponent;
