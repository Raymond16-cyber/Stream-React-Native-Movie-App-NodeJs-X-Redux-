import { APPWRITE_DATABASE_ID, APPWRITE_TABLE_ID_2, tablesDB } from "@/services/appwrite";
import { Query } from "appwrite";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export const useSavedMovies = (userId:string) => {
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const result = await tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_TABLE_ID_2,
        queries:[Query.equal("userId",userId)]
      });
      setSavedMovies(result.rows as unknown as SavedMovie[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSaved();
      return;
    }, [])
  );

  return { savedMovies, loading, error, refetch: fetchSaved };
};
