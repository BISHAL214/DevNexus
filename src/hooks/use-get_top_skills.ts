import { useEffect, useState } from "react";
import { getTopskills } from "../../actions/user_apis";

type TopSkills = {
  id: string;
  name: string;
};

export const useGetTopSkills = () => {
  const [topSkillsArray, setTopSkillsArray] = useState<TopSkills[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopSkills = async () => {
      const { topSkills, success, message } = await getTopskills();
      if (success) {
        if (topSkills) {
          setTopSkillsArray(
            topSkills.map((skill: any) => ({ id: skill.id, name: skill.name }))
          );
        }
        setLoading(false);
      } else {
        setError(message);
        setLoading(false);
      }
    };

    fetchTopSkills();
  }, []);

  return { topSkillsArray, loading, error };
};
