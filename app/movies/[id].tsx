import { icons } from "@/constants/icons";
import { useAuth } from "@/Contexts/AuthContext";
import useAppSockets from "@/hooks/useSockets";
import { fetchmovieDetails } from "@/services/api";
import { useFetch } from "@/services/useFetch";
import { saveMovieAction } from "@/store/actions/movieActions";
import { useAppDispatch, useAppSelector } from "@/store/hooks/useAppDispatch";
import { RootState } from "@/store/store";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const MovieInfo = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View className="bg-white/5 rounded-2xl p-4 mt-4 w-full">
    <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{label}</Text>
    <Text className="text-white text-base font-bold mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

export default function MovieDetails() {
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const socketRef = useAppSockets()

  const { data: movie, loading, error } = useFetch(() =>
    fetchmovieDetails(id as string)
  );

  const { savedMovies } = useAppSelector(
    (state: RootState) => state.movies
  );

  const [expandText, setExpandText] = useState(false);

  // 🔑 SINGLE SOURCE OF TRUTH
  const isSaved = savedMovies.some(
    (m) => m?.movie_id === movie?.id
  );

  const saveMovie = () => {
    if (!movie || !user || isSaved) return;
    dispatch(
      saveMovieAction({
        movie,
        userId: user.id || user._id,
      })
    );
  };

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="mt-20 relative">
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.backdrop_path}`,
            }}
            style={{ width: "100%", height: 260 }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(22,22,29,0.8)", "#16161d"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 120,
            }}
          />
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          {/* TITLE + SAVE */}
          <View className="flex-row items-center justify-between w-full">
            <Text className="text-white font-bold text-2xl flex-1 mr-3">
              {loading
                ? "Loading..."
                : error
                ? "Error loading movie."
                : movie?.title}
            </Text>

            <Pressable
              className="bg-white/10 rounded-2xl px-4 py-3 flex-col items-center min-w-[70px]"
              onPress={saveMovie}
              disabled={isSaved}
              style={{
                shadowColor: isSaved ? "#22c55e" : "#8b5cf6",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <MaterialCommunityIcons
                name={isSaved ? "bookmark-check" : "bookmark-plus-outline"}
                size={24}
                color={isSaved ? "#22c55e" : "#8b5cf6"}
              />
              <Text
                className={isSaved ? "text-green-500" : "text-purple-400"}
                style={{ fontSize: 10, fontWeight: "600", marginTop: 2 }}
              >
                {isSaved ? "Saved" : "Save"}
              </Text>
            </Pressable>
          </View>

          {/* META */}
          <View className="flex-row items-center gap-x-2 mt-4">
            <View className="bg-white/10 rounded-full px-3 py-1.5 flex-row items-center">
              <MaterialCommunityIcons name="calendar" size={14} color="#a78bfa" />
              <Text className="text-gray-200 text-xs font-semibold ml-1">
                {movie?.release_date?.split("-")[0]}
              </Text>
            </View>
            <View className="bg-white/10 rounded-full px-3 py-1.5 flex-row items-center">
              <MaterialCommunityIcons name="shield-check" size={14} color="#a78bfa" />
              <Text className="text-gray-200 text-xs font-semibold ml-1">
                {movie?.adult ? "PG-18" : "PG-13"}
              </Text>
            </View>
            <View className="bg-white/10 rounded-full px-3 py-1.5 flex-row items-center">
              <MaterialCommunityIcons name="clock-outline" size={14} color="#a78bfa" />
              <Text className="text-gray-200 text-xs font-semibold ml-1">
                {movie?.runtime} mins
              </Text>
            </View>
          </View>

          {/* RATING + TRAILER */}
          <View className="flex-row items-center justify-between w-full mt-4">
            <View className="bg-white/10 px-4 py-2.5 rounded-2xl flex-row items-center">
              <MaterialCommunityIcons name="star" size={18} color="#fbbf24" />
              <Text className="text-white text-sm font-bold ml-1.5">
                {movie?.vote_average?.toFixed(1) || "0"}/10
              </Text>
              <Text className="text-gray-400 text-xs ml-1.5">
                ({movie?.vote_count})
              </Text>
            </View>

            {movie?.id && (
              <Link href={`/movies/${movie.id}/trailer`} asChild>
                <TouchableOpacity className="bg-purple-500 px-5 py-2.5 rounded-2xl flex-row items-center shadow-lg">
                  <MaterialCommunityIcons name="play-circle" size={20} color="white" />
                  <Text className="text-white text-sm font-bold ml-2">
                    Play Trailer
                  </Text>
                </TouchableOpacity>
              </Link>
            )}
          </View>

          {/* OVERVIEW */}
          <View className="bg-white/5 rounded-2xl p-4 mt-5">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="text-box-outline" size={18} color="#8b5cf6" />
              <Text className="text-white font-bold text-base ml-2">
                Overview
              </Text>
            </View>
            <Text
              className="text-gray-200 text-sm leading-5"
              numberOfLines={expandText ? undefined : 3}
            >
              {movie?.overview}
            </Text>
            <TouchableOpacity onPress={() => setExpandText(!expandText)} className="mt-2">
              <Text className="text-purple-400 text-sm font-bold">
                {expandText ? "Show Less" : "Read More"}
              </Text>
            </TouchableOpacity>
          </View>

          <MovieInfo
            label="Genres"
            value={
              Array.isArray(movie?.genres)
                ? movie.genres.map((g) => g.name).join(" • ")
                : "N/A"
            }
          />

          <View className="flex-row justify-between gap-x-2 w-full">
            <View className="bg-white/5 rounded-2xl p-4 mt-4 flex-1">
              <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Budget</Text>
              <Text className="text-white text-base font-bold mt-2">
                {movie?.budget
                  ? `$${Math.round(movie.budget / 1_000_000)}M`
                  : "N/A"}
              </Text>
            </View>
            <View className="bg-white/5 rounded-2xl p-4 mt-4 flex-1">
              <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Revenue</Text>
              <Text className="text-white text-base font-bold mt-2">
                {movie?.revenue
                  ? `$${Math.round(movie.revenue / 1_000_000)}M`
                  : "N/A"}
              </Text>
            </View>
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies
                ? movie.production_companies
                    .map((pc) => pc.name)
                    .join(" - ")
                : "N/A"
            }
          />
        </View>
      </ScrollView>

      {/* GO BACK */}
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-purple-500 rounded-2xl py-4 flex-row items-center justify-center shadow-lg"
        onPress={() => router.back()}
        style={{
          shadowColor: "#8b5cf6",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <MaterialCommunityIcons name="arrow-left" size={22} color="white" />
        <Text className="text-white font-bold text-base ml-2">
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}
