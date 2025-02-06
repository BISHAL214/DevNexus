"use client";
import { useCallback, useEffect, useState } from "react";
import { getAllSkills } from "../../actions/user_apis";
import { __debounce } from "@/lib/debounce";

type SuggestSkill = {
  id: string;
  name: string;
};

export const useSuggestSkills = () => {
  const [skills, setSkills] = useState<SuggestSkill[]>([]);
  const [skill, setSkill] = useState<string>("");
  const [skillSuggestions, setSkillSuggestions] = useState<SuggestSkill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<SuggestSkill | null>(null);
  const [skillSuggestionLoading, setskillSuggestionLoading] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getSkillsSuggestions = async (value: string) => {
    if (skills && skills.length > 0) {
      const lowercase_value = value.toLowerCase();
      const suggestions = skills.filter((skill) =>
        skill?.name?.includes(lowercase_value)
      );
      setSkillSuggestions(suggestions);
    } else {
      setError("No Skills Found");
    }
  };

  const handleSelectSkill = (skill: SuggestSkill) => {
    setSelectedSkill(skill);
    setSkill(skill.name);
    setSkillSuggestions([]);
  };

  const debouncedGetSkillSuggestions = useCallback(
    __debounce((value: string) => {
      if (value.length >= 2) {
        getSkillsSuggestions(value);
      }
    }, 400),
    [skill, selectedSkill]
  );

  const handleSkillChange = (value: string) => {
    if (value.length < 2) {
      setSkillSuggestions([]);
      setSelectedSkill(null);
    }
    setSkill(value);
    debouncedGetSkillSuggestions(value);
  };

  useEffect(() => {
    const fetchSuggestSkills = async () => {
      setskillSuggestionLoading(true);
      try {
        const { allSkills, success, message } = await getAllSkills();
        if (!success) {
          setError(message);
        }
        setSkills(allSkills);
      } catch (error: any) {
        console.log("Skill Suggestion Error From Hook => ", error.message);
      } finally {
        setskillSuggestionLoading(false);
      }
    };

    fetchSuggestSkills();
  }, []);

  return {
    skill,
    handleSkillChange,
    skillSuggestions,
    selectedSkill,
    handleSelectSkill,
    skillSuggestionLoading,
    error,
  };
};
