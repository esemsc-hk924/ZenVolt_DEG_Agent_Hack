// Carbon Intensity API integration
// https://api.carbonintensity.org.uk/

export interface CarbonIntensityData {
  from: string;
  to: string;
  intensity: {
    forecast: number;
    actual?: number;
    index: string;
  };
  generationmix: Array<{
    fuel: string;
    perc: number;
  }>;
}

export interface RegionalCarbonData {
  regionid: number;
  dnoregion: string;
  shortname: string;
  data: CarbonIntensityData[];
}

/**
 * Get current carbon intensity for a region
 */
export async function getCarbonIntensity(region: string = "UK"): Promise<number> {
  try {
    const url =
      region === "UK"
        ? "https://api.carbonintensity.org.uk/intensity"
        : `https://api.carbonintensity.org.uk/regional/regionid/${region}`;

    const response = await fetch(url, {
      cache: "no-store", // Client-side fetch, no caching
    });

    if (!response.ok) {
      throw new Error("Failed to fetch carbon intensity");
    }

    const data = await response.json();
    return data.data[0]?.intensity?.actual || data.data[0]?.intensity?.forecast || 0;
  } catch (error) {
    console.error("Error fetching carbon intensity:", error);
    // Return mock data for demo
    return Math.floor(Math.random() * 300) + 50;
  }
}

/**
 * Get carbon intensity forecast for next 24 hours
 */
export async function getCarbonForecast(region: string = "UK"): Promise<CarbonIntensityData[]> {
  try {
    const url =
      region === "UK"
        ? "https://api.carbonintensity.org.uk/intensity/fw24h"
        : `https://api.carbonintensity.org.uk/regional/intensity/${region}/fw24h`;

    const response = await fetch(url, {
      cache: "no-store", // Client-side fetch, no caching
    });

    if (!response.ok) {
      throw new Error("Failed to fetch carbon forecast");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching carbon forecast:", error);
    // Return mock forecast data
    return generateMockForecast();
  }
}

/**
 * Get regional data for all UK regions
 */
export async function getRegionalData(): Promise<RegionalCarbonData[]> {
  try {
    const response = await fetch("https://api.carbonintensity.org.uk/regional", {
      cache: "no-store", // Client-side fetch, no caching
    });

    if (!response.ok) {
      throw new Error("Failed to fetch regional data");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching regional data:", error);
    return [];
  }
}

function generateMockForecast(): CarbonIntensityData[] {
  const now = new Date();
  const forecast: CarbonIntensityData[] = [];

  for (let i = 0; i < 24; i++) {
    const from = new Date(now.getTime() + i * 60 * 60 * 1000);
    const to = new Date(now.getTime() + (i + 1) * 60 * 60 * 1000);

    // Simulate lower carbon at night (3am-6am), higher during day
    const hour = from.getHours();
    const baseIntensity = hour >= 3 && hour < 6 ? 50 : hour >= 14 && hour < 18 ? 400 : 200;

    forecast.push({
      from: from.toISOString(),
      to: to.toISOString(),
      intensity: {
        forecast: baseIntensity + Math.random() * 100 - 50,
        index: baseIntensity < 150 ? "low" : baseIntensity > 300 ? "very high" : "moderate",
      },
      generationmix: [],
    });
  }

  return forecast;
}

