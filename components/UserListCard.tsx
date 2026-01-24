import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View, LayoutAnimation, Platform, UIManager } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type listProps = {
  item: SavedMovie;
  onPress?: () => void;
  onRemove?: (movieId: number) => void;
};

const UserListCard = ({ item, onPress, onRemove }: listProps) => {
  const { movie_id, movie_title, genres, poster_path } = item;

  useEffect(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const handleRemove = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onRemove?.(movie_id);
  };

  return (
    <Link href={`/movies/${movie_id}`} asChild>
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center justify-between p-3 mb-3 rounded-2xl bg-white/5 border border-white/10"
        activeOpacity={0.8}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        {/* Image with gradient overlay */}
        <View className="relative">
          <View
            style={{
              width: 120,
              height: 90,
              borderRadius: 16,
              overflow: "hidden",
              marginRight: 12,
              borderWidth: 1.5,
              borderColor: "rgba(255, 255, 255, 0.2)",
              shadowColor: "#8b5cf6",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Image
              source={{
                uri: poster_path
                  ? `https://image.tmdb.org/t/p/w500${poster_path}`
                  : "https://placeholder.co/600x400/1a1a1a/ffffff.png",
              }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.4)"]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 40,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
              }}
            />
          </View>
        </View>

        {/* Text block */}
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text className="text-white font-bold text-sm mb-1" numberOfLines={2}>
            {movie_title}
          </Text>
          <View className="flex-row items-center flex-wrap">
            <MaterialCommunityIcons name="tag-multiple" size={12} color="#9ca3af" />
            <Text className="text-gray-300 text-xs ml-1" numberOfLines={1}>
              {genres.slice(0, 2).join(" • ")}
            </Text>
          </View>
        </View>

        {/* Remove button */}
        <TouchableOpacity
          onPress={handleRemove}
          className="ml-2 bg-red-500/20 rounded-full p-2"
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={20} color="#ef4444" />
        </TouchableOpacity>

        {/* Chevron */}
        <View className="ml-2 bg-purple-500/20 rounded-full p-2">
          <MaterialCommunityIcons name="chevron-right" size={20} color="#8b5cf6" />
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default UserListCard;
