import HeroMovie from "@/components/HeroMovie";
import MovieCard from "@/components/MovieCard";
import MovieRecommendationCard from "@/components/MovieRecommendation";
import TrendingMovieCard from "@/components/TrendingMovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useAuth } from "@/Contexts/AuthContext";
import {
  fetchKidsCartoons,
  fetchMovieRecommendations,
  fetchMovies,
} from "@/services/api";
import { useFetch } from "@/services/useFetch";
import { getTrendingMoviesAction } from "@/store/actions/movieActions";
import { useAppDispatch, useAppSelector } from "@/store/hooks/useAppDispatch";
import { RootState } from "@/store/store";
import { CLEAR_ERRORS } from "@/store/types/type";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import { Redirect, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  FlatListComponent,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const movieGenres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];
  const dispatch = useAppDispatch();
  const [selectedMovieGenre, setSelectedMovieGenre] = useState<string | null>(
    null
  );
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const {
    loading: trendingLoading,
    error: trendingError,
    trendingMovies,
  } = useAppSelector((state: RootState) => state.movies);

  const { user, loading } = useAuth();
  const router = useRouter();
  const isKid = user?.currentProfile?.isKid;

  useFocusEffect(
    useCallback(() => {
      if (!isKid) {
        dispatch(getTrendingMoviesAction());
      }
      return;
    }, [isKid])
  );
  useEffect(() => {
    if (trendingError) {
      setTimeout(() => {
        dispatch({
          type: CLEAR_ERRORS,
        });
      }, 3000);
    }
  }, [trendingError]);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch,
  } = useFetch(() =>
    isKid
      ? fetchKidsCartoons()
      : fetchMovies({
          query: "",
          id: selectedMovieId ? selectedMovieId : undefined,
        })
  );
  // fetchimg movie recommendations
  const {
    data: movieRecommendations,
    loading: recommendationsLoading,
    error: recommendationsError,
    refetch: refetchRecommendations,
  } = useFetch(() => fetchMovieRecommendations());

  const randomRecommendedMovie =
    movieRecommendations &&
    movieRecommendations.length > 0 &&
    movieRecommendations[
      Math.floor(Math.random() * movieRecommendations.length)
    ];
  console.log("Random Recommended Movie:", randomRecommendedMovie);

  // refetch on swithching profiles between kid and adult
  useEffect(() => {
    refetch();
  }, [user.currentProfile?.isKid]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!user) return <Redirect href="/screens/Login" />;

  const selectMovieGenre = (name: string, id: number) => {
    setSelectedMovieGenre(name);
    setSelectedMovieId(id);
  };
  useEffect(() => {
    if (selectedMovieId !== null) {
      refetch();
    }
  }, [selectedMovieId]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full h-full z-0" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        {/* Header */}
        <BlurView
          intensity={70}
          tint="dark"
          className="flex flex-row items-center justify-between bg-transparent pt-20 pb-4 px-4 z-10"
        >
          <View className="flex flex-row items-center gap-x-2">
            <Image source={icons.logo} className="w-14 h-12" />
            <Text className="text-white text-2xl font-bold">Stream</Text>
          </View>
          <View className="flex-row items-center gap-x-4">
            <TouchableOpacity onPress={() => router.push("/search")}>
              <Image source={icons.search} className="w-14 h-10" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/profile")}
  className="rounded-full border-2 border-white overflow-hidden"
               style={{ width: 37, height: 37 }}
            >
              {user?.currentProfile?.image ? (
                <Image
                  source={{ uri: user.currentProfile.image }}
                  style={{ width: "100%", height: "100%" }}
                  className="rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <MaterialCommunityIcons
                  name="account-circle"
                  size={34}
                  color="white"
                />
              )}
            </TouchableOpacity>
          </View>
        </BlurView>

        {/* filter movies by genres */}
        <View className="flex-row items-center justify-end px-5 mt-4 gap-x-3">
          <FlatList
            data={movieGenres}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => selectMovieGenre(item.name, item.id)}
              >
                <Text className="text-white bg-gray-800 px-3 py-1 rounded-full">
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            horizontal
          />
        </View>

        <View className="flex-1 px-5">
          {(moviesLoading || trendingLoading) && (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              className="mt-10 self-center"
            />
          )}

          {(moviesError || trendingError) && (
            <Text className="text-white mt-5 text-center">
              Error: {moviesError?.message || trendingError}
            </Text>
          )}

          {/* hero movie */}

          {movieRecommendations && movieRecommendations.length > 0 && (
            <View className="mt-5 w-full overflow-hidden">
              <HeroMovie
                title={randomRecommendedMovie.title}
                poster={`https://image.tmdb.org/t/p/w500${randomRecommendedMovie.poster_path}`}
                onPress={() =>
                  router.push(`/movies/${randomRecommendedMovie.id}`)
                }
              />
            </View>
          )}

          {/* Trending Movies */}
          {trendingMovies && trendingMovies.length > 0 && (
            <View className="mt-10">
              <Text className="text-lg font-bold text-white mb-3">
                Trending Searches
              </Text>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="w-4" />}
                className="mb-4 mt-3"
                data={trendingMovies}
                renderItem={({ item, index }) => (
                  <TrendingMovieCard movie={item} index={index} />
                )}
                keyExtractor={(item) => item?.movie_id.toString()}
              />
            </View>
          )}

          {/* Recommendations */}
          {movieRecommendations && movieRecommendations.length > 0 && (
            <View className="mt-5">
              <Text className="text-lg font-bold text-white mb-3">
                Recommended For You
              </Text>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="w-4" />}
                className="mb-4 mt-3"
                data={movieRecommendations}
                renderItem={({ item, index }) => (
                  <MovieRecommendationCard item={item} index={index} />
                )}
                keyExtractor={(item) =>
                  item?.id?.toString() ?? Math.random().toString()
                }
              />
            </View>
          )}

          {/* Latest Movies / filtered movies*/}
          {selectedMovieId ? (
            <Text className="text-lg font-bold text-white mt-5 mb-3">
              Showing results for {selectedMovieGenre} movies
            </Text>
          ) : (
            <Text className="text-lg font-bold text-white mt-5 mb-3">
              Latest Movies
            </Text>
          )}
          {movies && (
            <FlatList
              data={movies}
              renderItem={({ item }) => <MovieCard item={item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10,
              }}
              className="mt-2 pb-32"
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
