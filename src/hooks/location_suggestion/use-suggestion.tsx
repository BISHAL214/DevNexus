import { Location } from "@/interfaces/app_database_models";
import { getLocationSuggestions } from "@/lib/location_suggestion";
import { useState } from "react";

export const useLocationSuggestion = () => {
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async (query: string) => {
    setLoading(true);
    try {
      const data = await getLocationSuggestions(query);
      setSuggestions(data);
    } catch (error: any) {
      console.log(
        "location suggestion error from hook - ",
        error,
        error.message
      );
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { suggestions, setSuggestions, loading, error, fetchSuggestions };
};
