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
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useAppSelector } from "@/store/hooks/useAppDispatch";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAuth } from "@/Contexts/AuthContext";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

const CommunityPage = () => {
    const { user } = useAuth()
  const { communityid } = useLocalSearchParams<{ communityid: string }>();
  const { myCommunities} = useAppSelector((state) => state.communities);

  const currentCommunity = myCommunities.find((c) => c._id === communityid);

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "Alice", text: "Welcome to the community!", timestamp: "10:00 AM" },
    { id: "2", sender: "Bob", text: "Hi everyone!", timestamp: "10:05 AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  if (!currentCommunity) {
    return (
      <View className="flex-1 items-center justify-center bg-primary">
        <Text className="text-light-300">Community not found</Text>
      </View>
    );
  }

  const isAdmin = currentCommunity.createdBy === user.id;

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const message: Message = {
      id: Date.now().toString(),
      sender: user.name || "You",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  // Render header for FlatList (community info + admin panel)
  const renderHeader = () => (
    <View>
      {/* Header Image */}
      <Image
        source={{ uri: currentCommunity.image }}
        className="w-full h-52"
        resizeMode="cover"
      />

      {/* Community Info */}
      <View className="p-4">
        <Text className="text-white text-3xl font-bold">{currentCommunity.name}</Text>
        <Text className="text-light-300 mt-2">{currentCommunity.description}</Text>

        {/* Meta */}
        <View className="flex-row items-center mt-4">
          <MaterialCommunityIcons name="account-group" size={18} color="#9CA4AB" />
          <Text className="text-light-300 ml-2">{currentCommunity.memberCount} members</Text>
        </View>

        <View className="mt-3">
          <Text className="text-accent font-semibold">
            Category: {currentCommunity.category}
          </Text>
        </View>

        {/* Admin Panel */}
        {isAdmin && (
          <View className="bg-accent/10 rounded-lg p-3 mt-4">
            <Text className="text-accent font-bold mb-2">Admin Panel</Text>
            <View className="flex-row space-x-4">
            {
              [
                "Add Post",
                "Manage Members",
                "Pin Message",
              ].map((action) => (
                <TouchableOpacity
                  key={action}
                  className="bg-accent px-3 py-1 rounded-full"
                >
                  <Text className="text-primary font-semibold">{action}</Text>
                </TouchableOpacity>
              ))
            }
             
            </View>
          </View>
        )}

        {/* Divider */}
        <View className="h-px bg-light-300/10 my-6" />

        <Text className="text-light-200 text-lg font-bold mb-2">Community Activity</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 p-2"
      >
        {/* FlatList handles both header and messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <View
              className={`mb-3 p-3 rounded-lg ${
                item.sender === user.name ? "bg-accent/30 self-end" : "bg-light-300/10 self-start"
              }`}
            >
              <Text className="text-white font-semibold">{item.sender}</Text>
              <Text className="text-light-300">{item.text}</Text>
              <Text className="text-light-400 text-xs mt-1">{item.timestamp}</Text>
            </View>
          )}
        />

        {/* Message Input */}
        <View className="absolute bottom-0 left-0 right-0 bg-primary p-3 flex-row items-center border-t border-light-300/10">
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#9CA4AB"
            className="flex-1 bg-light-300/10 rounded-full px-4 py-2 text-white"
          />
          <TouchableOpacity onPress={sendMessage} className="ml-3 bg-accent px-4 py-2 rounded-full">
            <Text className="text-primary font-bold">Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CommunityPage;
