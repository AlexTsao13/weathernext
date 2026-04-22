export const getWeather = async (city: string) => {
  const response = await fetch(`/api/weather/detail?city=${city}`);
  const resData = await response.json();
  return resData; // 直接返回 API 数据，不要取 .data 字段
};
