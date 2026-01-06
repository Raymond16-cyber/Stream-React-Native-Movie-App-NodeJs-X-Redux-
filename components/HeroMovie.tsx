import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";

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
      <View style={{ width: width - 32, height: imageHeight }} className="mx-auto relative">
        {poster ? (
          <Image
            source={{ uri: poster }}
            style={{ width: "100%", height: "100%", borderRadius: 16 }}
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-gray-800 rounded-lg justify-center items-center">
            <Text className="text-white text-xl font-semibold">No Image</Text>
          </View>
        )}

        {/* Blur overlay for title */}
        <BlurView
          intensity={70}
          tint="dark"
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
        >
          <Text className="text-white text-2xl font-bold">{title || "Unknown Movie"}</Text>
        </BlurView>

        {/* Watch Now button */}
        <View
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            backgroundColor: "#E53935",
            paddingVertical: 6,
            paddingHorizontal: 14,
            borderRadius: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text className="text-white font-bold">Watch Now</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HeroMovie;
