import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useAuth } from "@/Contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks/useAppDispatch";
import {
  fetchCommunityMessagesAction,
  sendCommunityMessageAction,
} from "@/store/actions/community.action";
import useAppSockets from "@/hooks/useSockets";

interface Message {
  communityId: string;
  id: string;
  sender: string;
  senderId: string;
  text: string;
  timestamp: string;
}

const CommunityPage = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const { communityid } = useLocalSearchParams<{ communityid: string }>();
  const { myCommunities } = useAppSelector((state) => state.communities);

  const socketRef = useAppSockets(user?._id);

  const currentCommunity = myCommunities.find(
    (c) => c._id === communityid
  );

  const messages = currentCommunity?.messages || [];
  const [newMessage, setNewMessage] = useState("");
  const [ socketMessage,setSocketMessage ] = useState(null);

  /* Fetch message history */
  useEffect(() => {
    if (communityid) {
      dispatch(fetchCommunityMessagesAction(communityid));
    }
  }, [communityid]);

  /* Join community room */
  useEffect(() => {
    if (!socketRef.current || !communityid) return;
    socketRef.current.emit("joinCommunity", communityid);
  }, [communityid]);

  /* Listen for incoming socket messages */
  useEffect(() => {
    if (!socketRef.current) return;

    const handleReceiveMessage = (message: Message) => {
      if (message.communityId !== communityid) return;
      dispatch(sendCommunityMessageAction(message));
    };

    socketRef.current.on("receiveMessage", handleReceiveMessage);
    socketRef.current?.on("sentMessage", (message) => {
  dispatch({
    type: "RECEIVED_SOCKET_MESSAGE",
    payload: {
      communityId: message.communityId,
      message: {
        _id: message.id,
        senderName: message.sender,
        senderId: message.senderId,
        content: message.text,
        createdAt: message.timestamp,
      },
    },
  });
});


    return () => {
      socketRef.current?.off("receiveMessage", handleReceiveMessage);
    };
  }, [communityid]);

  if (!currentCommunity) {
    return (
      <View className="flex-1 items-center justify-center bg-primary">
        <Text className="text-light-300">Community not found</Text>
      </View>
    );
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      communityId: currentCommunity._id,
      id: Date.now().toString(),
      sender: user?.name || "You",
      senderId: user?.id || user?._id || "",
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    socketRef.current?.emit("sendMessage", message);
    setNewMessage("");
  };

  const renderHeader = () => (
    <View>
      <Image
        source={{ uri: currentCommunity.image }}
        className="w-full h-52"
      />

      <View className="p-4">
        <Text className="text-white text-3xl font-bold">
          {currentCommunity.name}
        </Text>
        <Text className="text-light-300 mt-2">
          {currentCommunity.description}
        </Text>

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

        <View className="h-px bg-light-300/10 my-6" />
        <Text className="text-light-200 text-lg font-bold">
          Community Activity
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id }
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 90 }}
          renderItem={({ item }) => (
            <View
              className={`mb-3 p-3 rounded-lg ${
                item.senderId === user?.id || item.senderId === user?._id
                  ? "bg-accent/30 self-end"
                  : "bg-light-300/10 self-start"
              }`}
            >
              <Text className="text-white font-semibold">
                {item.senderName}
              </Text>
              <Text className="text-light-300">{item.content}</Text>
              <Text className="text-xs text-light-300 mt-1">
                {new Date(item.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          )}
        />

        <View className="absolute bottom-0 left-0 right-0 bg-primary p-3 flex-row items-center border-t border-light-300/10">
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#9CA4AB"
            className="flex-1 bg-light-300/10 rounded-full px-4 py-2 text-white"
          />
          <TouchableOpacity
            onPress={sendMessage}
            className="ml-3 bg-accent px-4 py-2 rounded-full"
          >
            <Text className="text-primary font-bold">Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CommunityPage;
