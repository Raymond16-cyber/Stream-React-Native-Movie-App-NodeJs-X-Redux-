import UserListCard from "@/components/UserListCard";
import { useAuth } from "@/Contexts/AuthContext";
import { useSavedMovies } from "@/hooks/useSavedMovies";
import { fetchSavedMovies } from "@/services/appwrite";
import { useFetch } from "@/services/useFetch";
import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const saved = () => {
 const { user } = useAuth();

  const { savedMovies, loading, error, refetch: fetchSaved } = useSavedMovies(user.$id);

  return (
    <SafeAreaView className="flex flex-col flex-1 bg-primary w-full">
      <View className=" flex-1">
        <View className=" px-3 mb-3">
          <Text className=" text-white text-2xl">Saved Movies</Text>
        </View>
        {/* loading state */}
        {loading && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        )}

        {/* error state */}
        {error && (
          <Text className="text-white mt-5 text-center">
            Error: {error?.message}
          </Text>
        )}

        <FlatList
          data={savedMovies}
          renderItem={({ item }) => <UserListCard item={item} />}
          keyExtractor={(item) => item.movie_id.toString()}
        />
      </View>
      {/* <ScrollView showsVerticalScrollIndicator={false}></ScrollView> */}
    </SafeAreaView>
  );
};

export default saved;
