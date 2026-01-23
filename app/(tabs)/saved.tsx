import UserListCard from "@/components/UserListCard";
import { useAuth } from "@/Contexts/AuthContext";
import { useFetch } from "@/services/useFetch";
import { getSavedMoviesAction } from "@/store/actions/movieActions";
import { useAppDispatch, useAppSelector } from "@/store/hooks/useAppDispatch";
import { RootState } from "@/store/store";
import { CLEAR_ERRORS } from "@/store/types/type";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const saved = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { loading, error, savedMovies } = useAppSelector(
    (state: RootState) => state.movies
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(getSavedMoviesAction());
      return;
    }, [])
  );

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch({
          type: CLEAR_ERRORS,
        });
      }, 3000);
    }
  }, [error]);
  return (
    <SafeAreaView className="flex flex-col flex-1 bg-primary w-full">
      <View className="flex-1">
        <View className="px-3 mb-5 mt-4">
          <View className="bg-white/10 rounded-2xl px-4 py-3 flex-row items-center">
            <View className="bg-purple-500/30 rounded-full p-2 mr-3">
              <MaterialCommunityIcons name="bookmark-multiple" size={24} color="#8b5cf6" />
            </View>
            <Text className="text-white text-2xl font-bold">Saved Movies</Text>
          </View>
        </View>
        {/* loading state */}
        {loading && (
          <ActivityIndicator
            size="large"
            color="#8b5cf6"
            className="mt-10 self-center"
          />
        )}

        {/* error state */}
        {error && (
          <View className="bg-red-500/20 border border-red-400/40 rounded-2xl px-4 py-3 mx-3 mb-3">
            <Text className="text-red-100 text-sm font-medium text-center">
              Error: {error}
            </Text>
          </View>
        )}

        <FlatList
          data={savedMovies}
          renderItem={({ item }) => <UserListCard item={item} />}
          keyExtractor={(item) => item.movie_id.toString()}
        />

        {!loading && !error && savedMovies?.length === 0 && (
          <View className="flex-1 items-center justify-center mt-20 mb-10 px-6">
            <View className="bg-white/5 rounded-3xl p-8 items-center max-w-md">
              <View className="bg-purple-500/20 rounded-full p-5 mb-4">
                <MaterialCommunityIcons name="bookmark-outline" size={56} color="#8b5cf6" />
              </View>
              <Text className="text-white text-xl font-bold mb-2">
                No Saved Movies Yet
              </Text>
              <Text className="text-gray-300 text-center text-sm">
                Movies you save will appear here so you can watch them later.
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default saved;
