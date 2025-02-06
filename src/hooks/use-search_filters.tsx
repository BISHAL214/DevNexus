import { useCallback, useState } from "react";
import { useLocationSuggestion } from "./location_suggestion/use-suggestion";
import { __debounce } from "@/lib/debounce";
import { Location } from "@/interfaces/app_database_models";

export const useSearchFilters = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState([0, 50]);
  const [location, setLocation] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState<Location | null>(
    null
  );

  const { fetchSuggestions, suggestions, setSuggestions, loading } =
    useLocationSuggestion();

    const location_loading = loading
  const debouncedGetSuggestions = useCallback(
    __debounce(async (value: string) => {
      if (value.length > 2) {
        await fetchSuggestions(value);
      }
    }, 300),
    []
  );

  const handleLocationChange = (value: string) => {
    if (value.length === 0) {
      setSuggestions([]);
      setSelectedSuggestion(null);
    }
    setLocation(value);
    debouncedGetSuggestions(value);
  };

  const handleSkillSelect = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return {
    selectedSkills,
    handleSkillSelect,
    experienceLevel,
    setExperienceLevel,
    location,
    handleLocationChange,
    suggestions,
    setSelectedSuggestion,
    selectedSuggestion,
    location_loading,
    setLocation
  };
};
