import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchKidsCartoons, fetchMovies } from "@/services/api";
import { useFetch } from "@/services/useFetch";
import { incrementCountOrSaveSearchAction } from "@/store/actions/movieActions";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/Contexts/AuthContext";

const search = () => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const isKid = user?.currentProfile?.isKid || false;

  const {
      data: movies,
      loading,
      error,
      refetch,
      reset
    } = useFetch(() =>
      isKid
        ? fetchKidsCartoons({query:searchQuery.trim()})
        : fetchMovies({
            query: searchQuery.trim(),
           
          }),false
    );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        refetch();
      } else {
        reset();
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, isKid]);

  const handleMoviePress = (movie: Movie) => {
    if (!searchQuery.trim()) return;

    dispatch(incrementCountOrSaveSearchAction(searchQuery, movie,isKid));
  };

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={movies || []} // FIX: never pass null
        renderItem={({ item }) => (
          <MovieCard item={item} onPress={() => handleMoviePress(item)} />
        )}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 mb-6 items-center">
              <View className="bg-white/10 px-6 py-3 rounded-3xl backdrop-blur-lg">
                <Image source={icons.logo} className="w-14 h-12" />
              </View>
            </View>

            <View className="mb-5">
              <SearchBar
                placeholder="Search movies..."
                value={searchQuery}
                onChangeText={(text)=>{
                  setSearchQuery(text);
                }}
              />
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#8b5cf6"
                className="my-3"
              />
            )}

            {error && (
              <View className="bg-red-500/20 border border-red-400/40 rounded-2xl px-4 py-3 mx-5 my-3">
                <Text className="text-red-100 text-sm font-medium">
                  Error: {error.message}
                </Text>
              </View>
            )}

            {!loading && !error && searchQuery.trim() !== "" && (
              <View className="bg-white/10 rounded-2xl px-4 py-3 mb-2 flex-row items-center">
                <MaterialCommunityIcons name="magnify" size={20} color="#8b5cf6" />
                <Text className="text-base text-white font-semibold ml-2">
                  Results for{" "}
                  <Text className="text-purple-400">"{searchQuery}"</Text>
                </Text>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              {searchQuery.trim() && movies && movies.length === 0 ? (
                <View className="bg-white/5 rounded-3xl p-6 items-center">
                  <View className="bg-red-500/20 rounded-full p-4 mb-4">
                    <MaterialCommunityIcons name="file-search-outline" size={48} color="#ef4444" />
                  </View>
                  <Text className="text-white text-center text-lg font-semibold mb-2">
                    No Results Found
                  </Text>
                  <Text className="text-gray-300 text-center text-sm">
                    Sorry, we couldn't find any results for "{searchQuery}". Please try a different search term.
                  </Text>

                  <Image
                    source={images.notfoundAvatar}
                    className="w-60 h-60 mt-6 rounded-xl opacity-90"
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <View className="bg-white/5 rounded-3xl p-6 items-center">
                  <View className="bg-purple-500/20 rounded-full p-4 mb-4">
                    <MaterialCommunityIcons name="movie-search" size={48} color="#8b5cf6" />
                  </View>
                  <Text className="text-white text-center text-lg font-semibold mb-2">
                    Search for Movies
                  </Text>
                  <Text className="text-gray-300 text-center text-sm">
                    Start typing to discover amazing content
                  </Text>
                </View>
              )}
            </View>
          ) : null
        }
      />
    </View>
  );
};
export default search;
