import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { images } from "@/constants/images";
import MaskedView from "@react-native-masked-view/masked-view";
import { icons } from "@/constants/icons";
import { LinearGradient } from "expo-linear-gradient";

type TrendingCardProps = {
  movie: {
    title: string;
    poster_url: string;
    movie_id: number;
  };
  index: number;
};

const TrendingMovieCard = ({
  movie: { title, poster_url, movie_id },
  index,
}: TrendingCardProps) => {
  return (
    <Link href={`/movies/${movie_id}`} asChild>
      <TouchableOpacity 
        className="w-32 relative pl-5"
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
              uri: poster_url,
            }}
            className="w-32 h-48 rounded-2xl"
            resizeMode="cover"
          />
          
          {/* Gradient overlay for better title readability */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)"]}
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
        </View>

        <View 
          className="absolute bottom-9 -left-3.5 px-2 py-1 rounded-full"
          style={{
            shadowColor: "#FFD700",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.6,
            shadowRadius: 4,
            elevation: 8,
          }}
        >
          <MaskedView
            maskElement={
              <Text className="text-6xl font-bold text-white">{index + 1}</Text>
            }
          >
            <Image
              source={images.rankingGradient}
              className="size-14 h-20"
              resizeMode="cover"
            />
          </MaskedView>
        </View>
        <Text
          className="text-sm mt-2 font-semibold text-white"
          numberOfLines={2}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default TrendingMovieCard;
