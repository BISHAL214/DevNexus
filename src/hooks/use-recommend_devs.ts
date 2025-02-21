import { useEffect, useState } from "react";
import { useFirebaseStore } from "./../store/firebase_firestore";
import { getRecommendedDevelopers } from "../../actions/user_apis";
import {
  getFromSessionStorage,
  saveToSessionStorage,
} from "@/lib/session_storage_functions";

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
  slug: string | null;
};

export const useRecommendDevs = () => {
  const { user } = useFirebaseStore();
  const [devs, setDevs] = useState<RecommendDevsType[]>([]);
  const [devsLoading, setDevsLoading] = useState<boolean>(false);
  const [devsError, setDevsError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      setDevsLoading(true);
      const developers = getFromSessionStorage("recommendedDevs");
      if (developers !== null) {
        setDevs(developers);
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
            slug: dev.slug,
          }));
          setDevs(devs);
          saveToSessionStorage("recommendedDevs", devs);
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
