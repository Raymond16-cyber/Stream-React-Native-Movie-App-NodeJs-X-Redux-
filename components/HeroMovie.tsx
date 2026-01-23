import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type HeroMovieProps = {
  title?: string;
  poster?: string;
  onPress?: () => void;
};

const { width } = Dimensions.get("window");

const HeroMovie: React.FC<HeroMovieProps> = ({ title, poster, onPress }) => {
  const imageHeight = (width - 40) * 1.4; // maintain aspect ratio

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} className="my-4">
      <View 
        style={{ 
          width: width - 32, 
          height: imageHeight,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 10,
        }} 
        className="mx-auto relative rounded-3xl overflow-hidden"
      >
        {poster ? (
          <Image
            source={{ uri: poster }}
            style={{ width: "100%", height: "100%", borderRadius: 24 }}
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-gray-800 rounded-3xl justify-center items-center">
            <MaterialCommunityIcons name="movie-open-outline" size={64} color="#8b5cf6" />
            <Text className="text-gray-400 text-lg font-semibold mt-3">No Image</Text>
          </View>
        )}

        {/* Gradient overlay for better readability */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.95)"]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 150,
          }}
        />

        {/* Blur overlay for title */}
        <BlurView
          intensity={40}
          tint="dark"
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <Text className="text-white text-2xl font-bold" numberOfLines={2}>{title || "Unknown Movie"}</Text>
        </BlurView>

        {/* Watch Now button */}
        <View
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: "#8b5cf6",
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 24,
            shadowColor: "#8b5cf6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <MaterialCommunityIcons name="play-circle" size={20} color="#ffffff" />
          <Text className="text-white font-bold text-base">Watch Now</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HeroMovie;
