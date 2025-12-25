import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { useFetch } from "@/services/useFetch";
import { incrementCountOrSaveSearchAction } from "@/store/actions/movieActions";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const search = () => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: movies,
    loading,
    error,
    refetch,
    reset,
  } = useFetch(
    () => fetchMovies({ query: searchQuery }),
    false // ← don't fetch on mount
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
  }, [searchQuery]);

  const handleMoviePress = (movie: Movie) => {
    if (!searchQuery.trim()) return;

    console.log("Tracking search for:", movie.title);
    dispatch(incrementCountOrSaveSearchAction(searchQuery, movie));
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
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-14 h-12" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search movies..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {!loading && !error && searchQuery.trim() !== "" && (
              <Text className="text-xl text-white font-bold">
                Search results for{" "}
                <Text className="text-accent">{searchQuery}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              {searchQuery.trim() && movies && movies.length === 0 ? (
                <View className="flex-col items-center">
                  <Text className="text-white text-center text-lg">
                    {"Sorry, we couldn't find any results for " +
                      `"${searchQuery}". Please try a different search term.`}
                  </Text>

                  <Image
                    source={images.notfoundAvatar}
                    className=" w-60 h-60 mt-6 rounded-xl opacity-90"
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <Text className="text-white text-center text-lg">
                  Start typing to search for movies.
                </Text>
              )}
            </View>
          ) : null
        }
      />
    </View>
  );
};
export default search;
