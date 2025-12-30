import { fetchMovieTrailer } from "@/services/api";
import { useFetch } from "@/services/useFetch";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const { width } = Dimensions.get("window");

const MovieTrailer = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, error, loading } = useFetch(() => fetchMovieTrailer(id as string));

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {error ? "Failed to load trailer" : "No trailer available"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <YoutubePlayer
        height={width * 0.6} // responsive height
        width={width - 20} // responsive width with some padding
        play={false}
        videoId={data}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  centered: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default MovieTrailer;
