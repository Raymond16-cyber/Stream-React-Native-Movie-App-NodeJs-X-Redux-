import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useFocusEffect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useAuth } from "@/Contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks/useAppDispatch";
import {
  fetchCommunityMessagesAction,
  readCommunityMessagesAction,
  sendCommunityMessageAction,
} from "@/store/actions/community.action";
import useAppSockets from "@/hooks/useSockets";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";



interface SocketMessage {
  communityId: string;
  id: string;
  sender: string;
  senderId: string;
  text: string;
  timestamp: string;
  senderImage?: string;
}

const Avatar = ({ uri, size = 32, style }: { uri?: string; size?: number; style?: any }) => {
  const [errored, setErrored] = React.useState(false);
  const source = !uri || errored ? images.notfoundAvatar : { uri } as any;
  return (
    <Image
      source={source}
      onError={() => setErrored(true)}
      style={{ width: size, height: size, borderRadius: size / 2, ...(style || {}) }}
    />
  );
};

const CommunityPage = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { communityid } = useLocalSearchParams<{ communityid: string }>();
  const { myCommunities, loadingCommunityMessages } = useAppSelector(
    (state) => state.communities
  );
  const socketRef = useAppSockets();

  const currentCommunity = myCommunities.find((c) => c._id === communityid);
  const messages = currentCommunity?.messages || [];
  const bounce = useSharedValue(0);

useEffect(() => {
  bounce.value = withRepeat(
    withTiming(-4, { duration: 500 }),
    -1,
    true
  );
}, []);
const dotStyle = useAnimatedStyle(() => ({
  transform: [{ translateY: bounce.value }],
}));


  // Normalize messages to ensure content/createdAt/key are present and consistent
  const normalizedMessages = useMemo(() => {
    return messages
      .filter(Boolean)
      .map((m, idx) => {
        const content = m.content ?? m.text ?? "";
        const createdAt = m.createdAt ?? m.timestamp ?? null;
        const fallbackKey = `${m.senderId || "u"}-${m.timestamp || m.createdAt || m.id || idx}`;
        const key = m._id || m.id || fallbackKey;
        return {
          ...m,
          content,
          createdAt,
          _id: key, // base key
        };
      })
      .filter((m) => m.content?.trim()); // drop empty placeholder rows
  }, [messages]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const flatListRef = React.useRef<FlatList>(null);

  // Refetch messages and mark as read when page comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (communityid) {
        dispatch(fetchCommunityMessagesAction(communityid));
        dispatch(readCommunityMessagesAction(communityid, user._id));
      }
    }, [communityid, dispatch, user._id])
  );

  // Auto-scroll to latest message when messages change
  useEffect(() => {
    if (normalizedMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [normalizedMessages]);

  // Also scroll when sender completes sending
  useEffect(() => {
    if (!sending && normalizedMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [sending, normalizedMessages.length]);

  // Fetch message history on mount
  useEffect(() => {
    if (communityid) dispatch(fetchCommunityMessagesAction(communityid));
  }, [communityid, dispatch]);

  // Join community room and setup socket listeners
  useEffect(() => {
    if (!socketRef.current || !communityid) return;

    socketRef.current.emit("joinCommunity", communityid);

    const handleReceiveMessage = (message: any) => {
      if (message.communityId !== communityid) return;
      if (message.senderId === user?._id) return;

      dispatch({
        type: "RECEIVED_SOCKET_MESSAGE",
        payload: {
          communityId: message.communityId,
          message,
        },
      });

      // Mark as read immediately when user is viewing this chat
      dispatch(readCommunityMessagesAction(message.communityId, user._id));
    };

    const handleUserTyping = (userId: string) => {
      if (userId === user?._id) return;
      setTypingUsers(prev => {
        const next = new Set(prev);
        next.add(userId);
        return next;
      });
    };

    const handleUserStoppedTyping = (userId: string) => {
      if (userId === user?._id) return;
      setTypingUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    };

    socketRef.current.on("receiveMessage", handleReceiveMessage);
    socketRef.current.on("userTyping", handleUserTyping);
    socketRef.current.on("userStoppedTyping", handleUserStoppedTyping);

    return () => {
      socketRef.current?.off("receiveMessage", handleReceiveMessage);
      socketRef.current?.off("userTyping", handleUserTyping);
      socketRef.current?.off("userStoppedTyping", handleUserStoppedTyping);
    };
  }, [communityid, dispatch, user?._id]);



  if (!currentCommunity) {
    return (
      <View className="flex-1 items-center justify-center bg-primary px-6">
        <View className="bg-white/5 rounded-3xl p-8 items-center max-w-md">
          <View className="bg-red-500/20 rounded-full p-5 mb-4">
            <MaterialCommunityIcons name="alert-circle-outline" size={56} color="#ef4444" />
          </View>
          <Text className="text-white text-xl font-bold mb-2">Community Not Found</Text>
          <Text className="text-gray-300 text-center text-sm">
            This community doesn't exist or you don't have access
          </Text>
        </View>
      </View>
    );
  }

  const typingTimeoutRef = React.useRef<NodeJS.Timeout | number | null>(null);

  const onTypingMessage = (text: string) => {
    setNewMessage(text);

    // Emit typing event
    if (socketRef.current) {
      socketRef.current.emit("typing", {
        communityId: currentCommunity._id,
        userId: user._id,
        userName: user.name,
        isTyping: true,
      });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to emit "stopped typing" after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit("stoppedTyping", {
          communityId: currentCommunity._id,
          userId: user._id,
          userName: user.name,
          isTyping: false,
        });
      }
    }, 2000);
  };

  const sendMessage = async () => {
  if (!newMessage.trim() || !socketRef.current || sending) return;
  setSending(true);

  // Clear typing timeout and emit stopped typing immediately
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }
  
  if (socketRef.current) {
    socketRef.current.emit("stoppedTyping", {
      communityId: currentCommunity._id,
      userId: user._id,
      userName: user.name,
      isTyping: false,
    });
  }

  const outgoing = {
    communityId: currentCommunity._id,
    senderName: user.name?.split(" ")[0],
    senderId: user._id,
    senderImage: user.image,
    text: newMessage,
  };

  try {
    // Save to DB and get the saved message with _id/createdAt/content
    const savedMessage = await dispatch<any>(sendCommunityMessageAction(outgoing));

    // Broadcast the saved message so others get the right shape
    socketRef.current.emit("sendMessage", savedMessage);
    setNewMessage("");
  } finally {
    setSending(false);
  }
};

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    const isMe = item.senderId === user?._id;
    const prevMessage = normalizedMessages[index - 1];
    const isConsecutive = prevMessage && prevMessage.senderId === item.senderId;

    return item.content ? (
      <View
        className={`px-4 flex-row ${
          isMe ? "justify-end" : "justify-start"
        } ${isConsecutive ? "mt-1" : "mt-3"}`}
      >
        {/* Left avatar */}
        {!isMe && !isConsecutive && (
          <Avatar uri={item.senderImage} size={32} style={{ marginRight: 8, marginTop: 4 }} />
        )}
        
        {!isMe && isConsecutive && <View className="w-10" />}

        <View
          className={`max-w-[75%] p-3 rounded-2xl ${
            isMe ? "bg-purple-500/30" : "bg-white/10"
          }`}
          style={{
            shadowColor: isMe ? "#8b5cf6" : "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          {!isConsecutive && !isMe && item.senderName && (
            <Text className="text-purple-400 font-bold mb-1 text-xs">
              {item.senderName}
            </Text>
          )}

          {
            item.content && <Text className="text-white">{item.content}</Text>
          
          }
          
          {item.createdAt ? (
            <Text className="text-xs text-gray-400 mt-1 self-end">
              {new Date(item.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          ) : null}
        </View>

        {/* Right avatar */}
        {isMe && !isConsecutive && (
          <Avatar uri={item.senderImage} size={32} style={{ marginLeft: 8, marginTop: 4 }} />
        )}
        {isMe && isConsecutive && <View className="w-10" />}
      </View>
    ) : null;
  };

  const TypingIndicator = ({ count }: { count: number }) => {
  if (count === 0) return null;

  return (
    <View className="px-4 py-2">
      <View className="flex-row items-center bg-white/5 rounded-2xl px-4 py-2 self-start">
        <Animated.View style={dotStyle} className="w-2 h-2 bg-purple-500 rounded-full mr-1" />
        <Animated.View style={dotStyle} className="w-2 h-2 bg-purple-500 rounded-full mr-1" />
        <Animated.View style={dotStyle} className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
        <Text className="text-gray-300 text-xs italic">
          {count === 1 ? "Someone is typing…" : `${count} people are typing…`}
        </Text>
      </View>
    </View>
  );
};


  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Chat Header */}
      <View 
        className="bg-white/5 border-b border-white/10 px-4 py-3 flex-row items-center" 
        style={{
          minHeight: 60,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <View className="bg-white/10 rounded-full p-2">
            <Ionicons name="chevron-back" size={24} color="#ffffff" />
          </View>
        </TouchableOpacity>
        <View className="flex-row items-center flex-1">
          <View 
            style={{
              shadowColor: "#8b5cf6",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Avatar uri={currentCommunity.image} size={40} style={{ marginRight: 12 }} />
          </View>
          <View className="flex-1 mr-2">
            <Text className="text-white text-lg font-bold" numberOfLines={1}>
              {currentCommunity.name}
            </Text>
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="account-group"
                size={14}
                color="#8b5cf6"
              />
              <Text className="text-gray-400 text-xs ml-1 font-medium">
                {currentCommunity.memberCount} members
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="ml-auto bg-purple-500/20 rounded-full p-2.5"
          onPress={() =>
            router.push({
               pathname: "/community/add-member",
              params: { communityid: currentCommunity._id },
            })
          }
        >
          <MaterialCommunityIcons name="account-plus" size={22} color="#8b5cf6" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 20}
      >
        {/* Loading state */}
        {loadingCommunityMessages ? (
          <View className="flex-1 items-center justify-center">
            <View className="bg-white/10 rounded-3xl p-8 items-center">
              <ActivityIndicator size="large" color="#8b5cf6" />
              <Text className="text-white text-base font-semibold mt-4">Loading messages...</Text>
            </View>
          </View>
        ) : messages.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
            <View className="bg-white/5 rounded-3xl p-8 items-center max-w-md">
              <View className="bg-purple-500/20 rounded-full p-5 mb-4">
                <MaterialCommunityIcons
                  name="chat-outline"
                  size={56}
                  color="#8b5cf6"
                />
              </View>
              <Text className="text-white text-xl font-bold mb-2">No Messages Yet</Text>
              <Text className="text-gray-300 text-center text-sm">
                Be the first to say something
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={normalizedMessages}
            keyExtractor={(item, index) => `${item._id || "k"}-${index}`}
            renderItem={renderMessage}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
            ListFooterComponent={<TypingIndicator count={typingUsers.size} />}
          />
        )}

        {/* Message input */}
        <View className="bg-white/5 p-3 flex-row items-center border-t border-white/10">
          <TextInput
            value={newMessage}
            onChangeText={onTypingMessage}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
            className="flex-1 bg-white/10 rounded-full px-4 py-3 text-white"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
          
          <TouchableOpacity
            onPress={sendMessage}
            className="ml-3 bg-purple-500 rounded-full p-3"
            disabled={sending}
            style={{
              shadowColor: "#8b5cf6",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            {sending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <MaterialCommunityIcons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CommunityPage;
