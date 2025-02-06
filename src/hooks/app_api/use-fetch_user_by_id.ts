"use client";

import { User } from "@/interfaces/app_database_models";
import { useEffect, useState } from "react";
import axios from "axios";

export const useFetchUserById = (userId: string | null) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError("User ID is required.");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/auth/user${userId}`);
        setUser(res.data as User);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
};
