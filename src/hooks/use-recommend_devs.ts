import { useEffect, useState } from "react";
import { useFirebaseStore } from "./../store/firebase_firestore";
import { getRecommendedDevelopers } from "../../actions/user_apis";

export type RecommendDevsType = {
  id: string | null;
  name: string | null;
  cover_image: string | undefined;
  avatar: string | undefined;
  headline: string | null;
  score: number | null;
  followers: any;
  location: any;
  skills: any;
};

export const useRecommendDevs = () => {
  const { user } = useFirebaseStore();
  const [devs, setDevs] = useState<RecommendDevsType[]>([]);
  const [devsLoading, setDevsLoading] = useState<boolean>(false);
  const [devsError, setDevsError] = useState<string | null>(null);

  const getFromSessionStorage = () => {
    const devs = sessionStorage.getItem("recommendedDevs");
    if (devs) {
      setDevs(JSON.parse(devs));
    }
  }

  const saveToSessionStorage = (devs: RecommendDevsType[]) => {
    sessionStorage.setItem("recommendedDevs", JSON.stringify(devs));
  }

  useEffect(() => {
    if (user?.id) {
      setDevsLoading(true);
      if(sessionStorage.getItem("recommendedDevs")) {
        getFromSessionStorage();
        setDevsLoading(false);
      }
      const fetchRecommendDevs = async () => {
        const { recommendedDevelopers, success, message } =
          await getRecommendedDevelopers(user.id);

        if (success) {
          const devs = recommendedDevelopers.map((dev) => ({
            id: dev.id,
            name: dev.name,
            cover_image: dev.cover_image || "",
            avatar: dev.avatar || undefined,
            headline: dev?.headline || "",
            score: dev.score,
            followers: dev.followers,
            location: dev.location,
            skills: dev.skills,
          }));
          setDevs(devs);
          saveToSessionStorage(devs);
        } else {
          setDevsError(message);
        }
        setDevsLoading(false);
      };

      fetchRecommendDevs();
    }
  }, [user?.id]);

  return { devs, devsLoading, devsError };
};
