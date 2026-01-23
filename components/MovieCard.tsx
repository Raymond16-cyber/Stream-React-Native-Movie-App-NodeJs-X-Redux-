import { icons } from "@/constants/icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  item: Movie;
  onPress?: () => void;
};

const MovieCard = ({ item, onPress }: Props) => {
  if (!item) {
    return null;
  }

  const { id, title, poster_path, vote_average, release_date } = item;

  return (
    <Link
      href={`/movies/${id}`}
      onPress={onPress}
      asChild
    >
      <TouchableOpacity 
        className="w-[30%]"
        activeOpacity={0.8}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 6,
        }}
      >
        <View className="relative">
          <Image
            source={{
              uri: poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : `https://placeholder.co/600x400/1a1a1a/ffffff.png`,
            }}
            className="w-full h-52 rounded-2xl"
            resizeMode="cover"
          />
          
          {/* Gradient overlay */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
            }}
          />
          
          {/* Rating badge */}
          {vote_average > 0 && (
            <View 
              className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1 flex-row items-center"
              style={{
                shadowColor: "#FFD700",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 3,
                elevation: 4,
              }}
            >
              <MaterialCommunityIcons name="star" size={12} color="#fbbf24" />
              <Text className="text-white text-xs font-bold ml-1">
                {vote_average?.toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
          {title}
        </Text>

        <View className="flex-row items-center mt-1">
          {Array.from({ length: Math.min(Math.round(vote_average / 2), 5) }).map((_, i) => (
            <MaterialCommunityIcons key={i} name="star" size={14} color="#fbbf24" />
          ))}
        </View>

        <View className="flex-row items-center mt-1">
          <MaterialCommunityIcons name="calendar" size={12} color="#9ca3af" />
          <Text className="text-xs text-gray-400 ml-1">
            {release_date?.split("-")[0] || "N/A"}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
