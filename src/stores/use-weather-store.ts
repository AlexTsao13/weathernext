import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteCity {
  name: string;
  en: string;
}

interface WeatherState {
  favorites: FavoriteCity[];
  recentSearches: string[];
  unit: 'celsius' | 'fahrenheit';
  
  // Actions
  addFavorite: (city: FavoriteCity) => void;
  removeFavorite: (cityName: string) => void;
  isFavorite: (cityName: string) => boolean;
  
  addRecentSearch: (cityName: string) => void;
  clearRecentSearches: () => void;
  
  setUnit: (unit: 'celsius' | 'fahrenheit') => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      favorites: [],
      recentSearches: [],
      unit: 'celsius',

      addFavorite: (city) =>
        set((state) => ({
          favorites: state.favorites.some((f) => f.en === city.en)
            ? state.favorites
            : [city, ...state.favorites],
        })),

      removeFavorite: (cityName) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.en !== cityName && f.name !== cityName),
        })),

      isFavorite: (cityName) => {
        return get().favorites.some((f) => f.en === cityName || f.name === cityName);
      },

      addRecentSearch: (cityName) =>
        set((state) => {
          const filtered = state.recentSearches.filter((s) => s !== cityName);
          return {
            recentSearches: [cityName, ...filtered].slice(0, 5),
          };
        }),

      clearRecentSearches: () => set({ recentSearches: [] }),

      setUnit: (unit) => set({ unit }),
    }),
    {
      name: 'weather-storage',
    }
  )
);
