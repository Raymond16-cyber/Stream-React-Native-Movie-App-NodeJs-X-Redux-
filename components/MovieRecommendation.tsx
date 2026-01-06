import { Image, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

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
    >
      {/* Poster */}
      <Image
        source={{
          uri: item?.poster_path
            ? `https://image.tmdb.org/t/p/w500${item?.poster_path}`
            : `https://placeholder.co/600x400/1a1a1a/ffffff.png`,
        }}
        className="w-full h-52 rounded-lg"
        resizeMode="cover"
      />

      {/* Title */}
      <Text numberOfLines={1} className="text-white mt-2 text-sm font-semibold">
        {item.title}
      </Text>

      {/* Rating + Year */}
      <View className="flex-row items-center justify-between mt-1">
        <Text className="text-yellow-400 text-xs">
          ⭐ {item.vote_average?.toFixed(1)}
        </Text>

        <Text className="text-gray-400 text-xs">
          {item.release_date?.slice(0, 4)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
