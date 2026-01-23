import { Image, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function MovieRecommendationCard({
  item,
  index,
}: {
  item: any;
  index: number;
}) {
  const router = useRouter();

  if (!item?.poster_path) return null;
  

  return (
    <TouchableOpacity
      onPress={() => router.push(`/movies/${item.id}`)}
      className="w-[120px] mr-4"
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
        {/* Poster */}
        <Image
          source={{
            uri: item?.poster_path
              ? `https://image.tmdb.org/t/p/w500${item?.poster_path}`
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
            height: 80,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
        />
        
        {/* Rating badge */}
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
            {item.vote_average?.toFixed(1)}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text numberOfLines={1} className="text-white mt-2 text-sm font-bold">
        {item.title}
      </Text>

      {/* Year */}
      <View className="flex-row items-center mt-1">
        <MaterialCommunityIcons name="calendar" size={12} color="#9ca3af" />
        <Text className="text-gray-400 text-xs ml-1">
          {item.release_date?.slice(0, 4) || "N/A"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
