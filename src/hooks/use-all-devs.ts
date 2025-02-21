import {
  getFromSessionStorage,
  saveToSessionStorage,
} from "@/lib/session_storage_functions";
import { useEffect, useState } from "react";
import { getAllDevelopers } from "../../actions/user_apis";

export type Developer = {
  // type for the developer
  id: string;
  name: string;
  skills: { id: string; name: string }[];
  headline: string | null;
  cover_image: string | null;
  location: { city: string; country: string; state?: string } | any;
  followers?: any;
  avatar: string | null;
  score?: number;
  slug: string | null;
};

type UseAllDevs = {
  // type for the custom hook
  all_developers: Developer[];
  all_devs_loading: boolean;
  all_devs_error: string;
};

export const useAllDevs = (): UseAllDevs => {
  const [allDevelopers, seAlltDevelopers] = useState<Developer[]>([]); // all developers
  const [allDevsLoading, setAllDevsLoading] = useState<boolean>(false); // loading state
  const [allDevsError, setAllDevsError] = useState<string | null | any>(null); // error state

  const fetch_devs = async () => {
    setAllDevsLoading(true);
    // check session storage for all developers
    const all_devs = getFromSessionStorage("allDevelopers");
    if (all_devs !== null) {
      seAlltDevelopers(all_devs);
      setAllDevsLoading(false);
    }

    // fetch all developers
    try {
      const { allDevelopers, success, message } = await getAllDevelopers();
      if (!success) {
        setAllDevsError(message);
      }
      seAlltDevelopers(allDevelopers);
      // save to session storage
      saveToSessionStorage("allDevelopers", allDevelopers);
    } catch (error: any) {
      setAllDevsError(error?.message ?? "Error fetching developers");
    } finally {
      setAllDevsLoading(false);
    }
  };

  useEffect(() => {
    fetch_devs(); // fetch all developers
  }, []);

  return {
    all_developers: allDevelopers,
    all_devs_loading: allDevsLoading,
    all_devs_error: allDevsError,
  };
};
