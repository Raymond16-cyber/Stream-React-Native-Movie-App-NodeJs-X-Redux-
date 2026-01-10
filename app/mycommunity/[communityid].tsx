import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useAppSelector } from "@/store/hooks/useAppDispatch";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const CommunityPage = () => {
  const { communityid } = useLocalSearchParams<{ communityid: string }>();
  const { myCommunities } = useAppSelector((state) => state.communities);

  const currentCommunity = myCommunities.find(
    (c) => c._id === communityid
  );

  if (!currentCommunity) {
    return (
      <View className="flex-1 items-center justify-center bg-primary">
        <Text className="text-light-300">Community not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <Image
          source={{ uri: currentCommunity.image }}
          className="w-full h-52"
          resizeMode="cover"
        />

        {/* Content */}
        <View className="p-4">
          <Text className="text-white text-2xl font-bold">
            {currentCommunity.name}
          </Text>

          <Text className="text-light-300 mt-2">
            {currentCommunity.description}
          </Text>

          {/* Meta */}
          <View className="flex-row items-center mt-4">
            <MaterialCommunityIcons
              name="account-group"
              size={18}
              color="#9CA4AB"
            />
            <Text className="text-light-300 ml-2">
              {currentCommunity.memberCount} members
            </Text>
          </View>

          <View className="mt-3">
            <Text className="text-accent font-semibold">
              Category: {currentCommunity.category}
            </Text>
          </View>

          {/* Divider */}
          <View className="h-px bg-light-300/10 my-6" />

          {/* Placeholder for posts/chat */}
          <Text className="text-light-200 text-lg font-bold">
            Community Activity
          </Text>
          <Text className="text-light-300 mt-2">
            Chat and posts will appear here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CommunityPage;
