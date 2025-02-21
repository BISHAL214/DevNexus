"use client";
import { useCallback, useState } from "react";
import { getUserDetails } from "../../actions/user_apis";

type detailsType = {
  user_details: any | null;
  loading: boolean;
  error: string | null;
};

export const useUserDetails = () => {
  const [state, setState] = useState<detailsType>({
    user_details: {},
    loading: false,
    error: null,
  });

  const fetchUserDetails = useCallback(async (slug: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await getUserDetails(slug);
      setState({ user_details: data, loading: false, error: null });
    } catch (error) {
      setState({
        user_details: null,
        loading: false,
        error: (error as Error).message,
      });
    }
  }, []);

  return {
    user_details: state.user_details,
    user_details_loading: state.loading,
    user_details_error: state.error,
    fetchUserDetails,
  };
};
