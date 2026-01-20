import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useFocusEffect } from "expo-router";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import { refetchLastMessageAction } from "@/store/actions/community.action";
import { useAuth } from "@/Contexts/AuthContext";

const CommunityCard = ({ community }: { community: Community }) => {
  const dispatch = useAppDispatch();
  const { user} = useAuth() 
  const handleOpenChat = (communityId: string) => {
    // TODO: Navigate to chat screen
    console.log("Opening chat for community:", communityId);
    router.push({
      pathname: "/mycommunity/[communityid]",
      params: { communityid: communityId },
    });
  };
  const handleJoinCommunity = (communityId: string) => {
    // TODO: Implement join community API call
    console.log("Joining community:", communityId);
  };
  const unreadMessagesCount = community.messages?.filter((msg) => !msg.readBy?.includes(user._id))
  console.log("Unread messages count:",unreadMessagesCount)

  useFocusEffect(()=>{
  dispatch(refetchLastMessageAction(community._id));
})

  return (
    <TouchableOpacity
      className="bg-dark-100 rounded-2xl mb-4 overflow-hidden"
      onPress={() => community.isJoined && handleOpenChat(community._id)}
    >
      <View className="flex-row p-4 items-center" style={{ gap: 12 }}>
        {/* Community Image */}
        <Image
          source={{
            uri: community.image,
          }}
          className="w-16 h-16 rounded-xl"
          style={{ backgroundColor: "#2C2F33",width:64,height:64,borderRadius:70 }}
          resizeMode="cover"
        />

        {/* Community Info */}
        <View className="flex-1 ml-3 justify-center">
          <View className="flex-row items-center justify-between">
            <Text className="text-white font-bold text-base" numberOfLines={1}>
              {community.name}
            </Text>
            {typeof unreadMessagesCount?.length === "number" &&
              unreadMessagesCount.length > 0 && (
                <View className="bg-accent rounded-full px-2 py-1 min-w-[24px] items-center">
                  <Text className="text-white text-xs font-bold">
                    {unreadMessagesCount?.length}
                  </Text>
                </View>
              )}
          </View>

          <Text className="text-light-300 text-xs mt-1" numberOfLines={1}>
            {community.description}
          </Text>

          <View className="flex-row items-center mt-2">
            <MaterialCommunityIcons
              name="account-group"
              size={14}
              color="#9CA4AB"
            />
            <Text className="text-light-300 text-xs ml-1">
              {community.memberCount} members
            </Text>

            {community.lastMessageTime && (
              <>
                <View className="w-1 h-1 bg-light-300 rounded-full mx-2" />
                <Text className="text-light-300 text-xs">
                  {community.lastMessageTime}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Action Button */}
        {!community.isJoined && (
          <TouchableOpacity
            className="bg-accent rounded-full px-4 py-2 self-center ml-2"
            onPress={() => handleJoinCommunity(community._id)}
          >
            <Text className="text-white font-bold text-sm">Join</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Last Message Preview (for joined communities) */}
      {community.isJoined && community.lastMessage?.content && (
        <View className="px-4 pb-3 border-t border-light-300/10 pt-2 mt-1">
          <Text className="text-light-200 text-sm" numberOfLines={1}>
           {community.lastMessage.content}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CommunityCard;
