import { icons } from "@/constants/icons";
import { useAuth } from "@/Contexts/AuthContext";
import { useSavedMovies } from "@/hooks/useSavedMovies";
import { fetchmovieDetails } from "@/services/api";
import { saveMovieInfo } from "@/services/appwrite";
import { useFetch } from "@/services/useFetch";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MovieInfo = ({ label, value }: { label: string; value: string }) => (
  <View className=" flex-col items-start justify-center mt-5">
    <Text className=" text-white text-sm font-normal">{label}</Text>
    <Text className=" text-light-200 text-sm font-bold mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const {
    data: movie,
    loading,
    error,
  } = useFetch(() => fetchmovieDetails(id as string));
  const { savedMovies, refetch: fetchSaved } = useSavedMovies(user.$id);
  console.log("savedMovies", savedMovies);

  const [expandText, setExpandText] = useState(false);
  const [movieSaved, setMovieSaved] = useState(false);

  const saveMovie = async (movie: MovieDetails | null) => {
    if (!movie) return;
    console.log("saving movie: ", movie.title, movie.genres[0].name);
    const result = await saveMovieInfo(movie, user.$id);
    setMovieSaved(result ?? false);
  };

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="mt-20">
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.backdrop_path}`,
            }}
            style={{ width: "100%", height: 260 }}
            resizeMode="stretch"
          />
        </View>
        <View className=" flex-col items-start justify-center mt-5 px-5">
          <Text className=" text-white font-bold text-xl">
            {loading
              ? "Loading..."
              : error
                ? "Error loading movie."
                : movie?.title}
          </Text>
          <View className=" flex-row items-center gap-x-1 mt-2">
            <Text className=" text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]}
            </Text>
            <Text className=" text-light-200 text-sm"> • </Text>
            <Text className=" text-light-200 text-sm">
              {movie?.adult ? "PG-18" : "PG-13"}
            </Text>
            <Text className=" text-light-200 text-sm"> • </Text>
            <Text className=" text-light-200 text-sm">
              {movie?.runtime} mins
            </Text>
          </View>

          {/* rating X save film */}
          <View className="flex flex-row items-center justify-between w-full">
            <View className=" bg-dark-100 px-2 py-1 rounded-md mt-2 flex-row items-center justify-center">
              <Image source={icons.star} className=" size-4 w-10 h-10" />
              <Text className=" text-light-200 text-sm">
                {Math.round(movie?.vote_average || 0)}/10
              </Text>
              <Text className=" text-light-200 text-sm">
                {" "}
                ({movie?.vote_count} votes)
              </Text>
            </View>

            <Pressable
              className="flex flex-col items-center"
              onPress={() => saveMovie(movie)}
              disabled={movieSaved}
            >
              <AntDesign
                name={
                  savedMovies.some((m) => m.movie_id === movie?.id) ||
                  movieSaved
                    ? "check"
                    : "plus"
                }
                size={24}
                color={
                  savedMovies.some((m) => m.movie_id === movie?.id) ||
                  movieSaved
                    ? "green"
                    : "white"
                }
              />
              {savedMovies.some((m) => m.movie_id === movie?.id) ||
              movieSaved ? (
                <Text className=" text-green-700" style={{ fontSize: 8 }}>
                  Saved
                </Text>
              ) : (
                <Text className=" text-white" style={{ fontSize: 8 }}>
                  Saved
                </Text>
              )}
            </Pressable>
          </View>

          {/* movie overview */}
          <View className=" py-1 rounded-md gap-x-1 mt-4">
            <Text className="text-light-200 font-bold text-sm">Overview</Text>
            <Text
              className=" text-white mt-1 text-base"
              numberOfLines={expandText ? undefined : 2}
            >
              {movie?.overview}
            </Text>
            <Text
              className=" text-sm font-bold text-light-200 mt-1"
              onPress={() => setExpandText(!expandText)}
            >
              {expandText ? "Show Less" : "Read More"}
            </Text>
          </View>
          <MovieInfo
            label="Genres"
            value={
              Array.isArray(movie?.genres)
                ? movie.genres.map((g) => g.name).join(" - ")
                : "N/A"
            }
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={
                movie?.budget
                  ? `$${Math.round(movie.budget / 1_000_000)}M`
                  : "N/A"
              }
            />
            <MovieInfo
              label="Revenue"
              value={
                movie?.revenue
                  ? `$${Math.round(movie.revenue / 1_000_000)}M`
                  : "N/A"
              }
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies
                ? movie.production_companies.map((pc) => pc.name).join(" - ")
                : "N/A"
            }
          />
        </View>
      </ScrollView>

      {/* Go back button */}
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={() => {
          router.back();
        }}
      >
        <AntDesign name="arrow-left" size={22} color="white" />
        <Text className=" text-white font-semibold text-base ml-2">
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}
