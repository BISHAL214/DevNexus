import { Location } from "@/interfaces/app_database_models";
export const getLocationSuggestions = async (
  query: string
): Promise<Location[]> => {
  try {
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=10`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch location suggestions");
    }
    const data = await response.json();
    return data.features.map((feature: any) => ({
      city: feature.properties.name || "",
      country: feature.properties.country || "",
      state: feature.properties.state || "",
      latitude: feature.geometry.coordinates[1] || 0,
      longitude: feature.geometry.coordinates[0] || 0,
    }));
  } catch (error) {
    console.error("Error fetching location suggestions:", error);
    return [];
  }
};
