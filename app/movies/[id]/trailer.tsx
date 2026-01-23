import { fetchMovieTrailer } from "@/services/api";
import { useFetch } from "@/services/useFetch";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, ActivityIndicator, Dimensions } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const MovieTrailer = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, error, loading } = useFetch(() => fetchMovieTrailer(id as string));

  if (loading) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <View className="bg-white/10 rounded-3xl p-8 items-center">
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text className="text-white text-base font-semibold mt-4">Loading trailer...</Text>
        </View>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View className="flex-1 bg-primary items-center justify-center px-6">
        <View className="bg-white/5 rounded-3xl p-8 items-center max-w-md">
          <View className="bg-red-500/20 rounded-full p-5 mb-4">
            <MaterialCommunityIcons name="alert-circle-outline" size={56} color="#ef4444" />
          </View>
          <Text className="text-white text-xl font-bold mb-2">
            {error ? "Failed to Load Trailer" : "No Trailer Available"}
          </Text>
          <Text className="text-gray-300 text-center text-sm">
            {error ? "Please check your connection and try again" : "This movie doesn't have a trailer yet"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary items-center justify-center px-4">
      <View 
        className="w-full rounded-3xl overflow-hidden"
        style={{
          shadowColor: "#8b5cf6",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        <YoutubePlayer
          height={width * 0.6}
          width={width - 32}
          play={false}
          videoId={data}
        />
      </View>
      
      <View className="bg-white/10 rounded-2xl px-6 py-4 mt-6 flex-row items-center">
        <MaterialCommunityIcons name="information" size={20} color="#8b5cf6" />
        <Text className="text-gray-300 text-sm ml-2 flex-1">
          Tap play to watch the official trailer
        </Text>
      </View>
    </View>
  );
};

export default MovieTrailer;
