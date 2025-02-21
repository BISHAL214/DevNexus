"use client";

import { useState, useEffect, useCallback } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<void>; // Make execute accept any arguments
}

function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>, // Accept a function that returns a Promise<T>
  initialData: T | null = null,
  dependencies: any[] = [] // Optional dependencies array for useEffect
): AsyncState<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      // useCallback for memoization
      setLoading(true);
      setError(null); // Clear any previous errors

      try {
        const result = await asyncFunction(...args);
        setData(result);
      } catch (err: any) {
        // Catch any type of error
        setError(err?.message || "An error occurred."); // Handle potential undefined messages
        console.error("Async error:", err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  ); // Add asyncFunction to the dependency array

  useEffect(() => {
    // Only call execute if dependencies change or if no initial call is desired
    if (dependencies.length > 0) {
      execute(...dependencies); // Spread the dependencies as arguments
    }
    // else, you can leave it empty if you don't want to run on mount
    // or call execute() with the appropriate arguments if you want
    // to run it only once on mount
  }, dependencies); // Run when dependencies change

  return { data, loading, error, execute };
}

export default useAsync;
