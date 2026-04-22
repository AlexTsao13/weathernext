import { getWeather } from "@/services/weather";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const useQueryWeather = () => {
  const searchParams = useSearchParams();
  const currentCity = searchParams.get("city") || "";

  return useQuery({
    queryKey: ["weather", currentCity],
    queryFn: () => getWeather(currentCity),
    enabled: !!currentCity, // 只有有城市参数时才执行查询
  });
};

export default useQueryWeather;
