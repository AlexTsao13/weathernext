import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");
  const res = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${process.env.API_KEY}&q=${city}&days=7&aqi=no&alerts=no`,
  );
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
