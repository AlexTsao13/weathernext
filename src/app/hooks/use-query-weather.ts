import { getWeather } from "@/services/weather";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const useQueryWeather = () => {
  const searchParams = useSearchParams();
  const currentCity = searchParams.get("city") || "";

  return useQuery({
    queryKey: ["weather", currentCity],
    queryFn: () => getWeather(currentCity),
    enabled: !!currentCity, // 只有有城市參數時才執行查詢
  });
};

export default useQueryWeather;
