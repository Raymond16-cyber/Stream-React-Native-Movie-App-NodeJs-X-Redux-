import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useFocusEffect } from "expo-router";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import { refetchLastMessageAction } from "@/store/actions/community.action";
import { useAuth } from "@/Contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

const CommunityCard = ({ community }: { community: Community }) => {
  const dispatch = useAppDispatch();
  const { user} = useAuth() 
  const handleOpenChat = (communityId: string) => {
    router.push({
      pathname: "/mycommunity/[communityid]",
      params: { communityid: communityId },
    });
  };
  const handleJoinCommunity = (communityId: string) => {
    // TODO: Implement join community API call
  };
  const unreadMessagesCount = community.messages?.filter((msg) => !msg.readBy?.includes(user._id))

  useFocusEffect(()=>{
  dispatch(refetchLastMessageAction(community._id));
})

  return (
    <TouchableOpacity
      className="bg-white/5 rounded-3xl mb-4 overflow-hidden border border-white/10"
      onPress={() => community.isJoined && handleOpenChat(community._id)}
      activeOpacity={0.8}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
      }}
    >
      <View className="flex-row p-4 items-center" style={{ gap: 12 }}>
        {/* Community Image */}
        <View className="relative">
          <Image
            source={{
              uri: community.image,
            }}
            className="w-16 h-16 rounded-2xl"
            style={{ backgroundColor: "#2C2F33", width: 64, height: 64, borderRadius: 16 }}
            resizeMode="cover"
          />
          
        </View>

        {/* Community Info */}
        <View className="flex-1 ml-3 justify-center">
          <View className="flex-row items-center justify-between">
            <Text className="text-white font-bold text-base" numberOfLines={1}>
              {community.name}
            </Text>
            {typeof unreadMessagesCount?.length === "number" &&
              unreadMessagesCount.length > 0 && (
                <View 
                  className="bg-purple-500 rounded-full px-2.5 py-1 min-w-[24px] items-center"
                  style={{
                    shadowColor: "#8b5cf6",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.4,
                    shadowRadius: 3,
                    elevation: 4,
                  }}
                >
                  <Text className="text-white text-xs font-bold">
                    {unreadMessagesCount?.length}
                  </Text>
                </View>
              )}
          </View>

          <Text className="text-gray-300 text-xs mt-1" numberOfLines={1}>
            {community.description}
          </Text>

          <View className="flex-row items-center mt-2">
            <MaterialCommunityIcons
              name="account-group"
              size={14}
              color="#8b5cf6"
            />
            <Text className="text-gray-400 text-xs ml-1 font-medium">
              {community.memberCount} members
            </Text>

            {community.lastMessageTime && (
              <>
                <View className="w-1 h-1 bg-gray-500 rounded-full mx-2" />
                <MaterialCommunityIcons name="clock-outline" size={12} color="#9ca3af" />
                <Text className="text-gray-400 text-xs ml-1">
                  {community.lastMessageTime}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Action Button */}
        {!community.isJoined && (
          <TouchableOpacity
            className="bg-purple-500 rounded-full px-4 py-2 self-center ml-2 flex-row items-center"
            onPress={() => handleJoinCommunity(community._id)}
            style={{
              shadowColor: "#8b5cf6",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <MaterialCommunityIcons name="plus" size={16} color="white" />
            <Text className="text-white font-bold text-sm ml-1">Join</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Last Message Preview (for joined communities) */}
      {community.isJoined && community.lastMessage?.content && (
        <View className="px-4 pb-3 border-t border-white/10 pt-3 mt-1 bg-white/5">
          <View className="flex-row items-start">
            <MaterialCommunityIcons name="message-text-outline" size={14} color="#8b5cf6" />
            <Text className="text-gray-200 text-sm ml-2 flex-1" numberOfLines={1}>
              {community.lastMessage.content}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CommunityCard;
