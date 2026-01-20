import CommunityCard from "@/components/community/CommunityCard";
import { useAuth } from "@/Contexts/AuthContext";
import useCreateProfileImage from "@/hooks/useCreateProfileImage";
import {
  createCommunityAction,
  fetchMyCommunitiesAction,
  refetchLastMessageAction,
} from "@/store/actions/community.action";
import { useAppDispatch, useAppSelector } from "@/store/hooks/useAppDispatch";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppSockets from "@/hooks/useSockets";

const community = () => {
  const { user } = useAuth();
  const { image, pickImage, setImage } = useCreateProfileImage();
  const dispatch = useAppDispatch();
  const { myCommunities } = useAppSelector((state) => state.communities);
  const socketRef = useAppSockets();
  const [activeTab, setActiveTab] = useState<"my" | "discover">("my");
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
    category: "General",
    image: "",
  });
  const [ isCreatingCommunity, setIsCreatingCommunity ] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchMyCommunitiesAction());
    }, [dispatch])
  );

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // join all user communities to receive live updates on the list screen
    myCommunities?.forEach((community) => {
      if (community?._id) {
        socket.emit("joinCommunity", community._id);
      }
    });

    const handleReceiveMessage = (message: any) => {
      if (message?.senderId === user?._id) return; // ignore own messages to avoid duplicates
      dispatch({
        type: "RECEIVED_SOCKET_MESSAGE",
        payload: {
          communityId: message.communityId,
          message,
        },
      });
      dispatch(refetchLastMessageAction(message.communityId));
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socketRef, myCommunities, dispatch, user?._id]);

  const recommendedCommunities: Community[] = [
    {
      _id: "4",
      name: "Classic Cinema",
      createdBy: "classicAdmin",
      description: "Celebrating timeless movies from the golden age",
      image: "https://i.imgur.com/yDwFXRZ.png",
      members: ["user10", "user11", "user12"],
      memberCount: 1567,
      isJoined: false,
      category: "Movies",
    },
    {
      _id: "5",
      createdBy: "docuFan",
      name: "Documentary Lovers",
      description: "Share and discuss the best documentaries",
      image: "https://i.imgur.com/LhxYqG5.png",
      members: ["user13", "user14", "user15"],
      memberCount: 934,
      isJoined: false,
      category: "Documentary",
    },
    {
      _id: "6",
      createdBy: "sciFiGeek",
      name: "Sci-Fi Universe",
      description: "Science fiction movies and theories",
      image: "https://i.imgur.com/zqeJZef.png",
      members: ["user16", "user17", "user18"],
      memberCount: 2103,
      isJoined: false,
      category: "Sci-Fi",
    },
    {
      _id: "7",
      createdBy: "romComQueen",
      name: "Rom-Com Central",
      description: "Romantic comedies and feel-good movies",
      image: "https://i.imgur.com/5HM9Evm.png",
      members: ["user19", "user20", "user21"],
      memberCount: 1876,
      isJoined: false,
      category: "Romance",
    },
  ];

  const handleCreateCommunity = async () => {
    setIsCreatingCommunity(true);
    const communityData = {
      name: newCommunity.name,
      description: newCommunity.description,
      category: newCommunity.category,
      image: newCommunity.image, // ✅ added
    };
    const formData = new FormData();

    formData.append("name", newCommunity.name);
    formData.append("description", newCommunity.description);
    formData.append("category", newCommunity.category);
    const normalizeUri = (uri: string) => {
  if (uri.startsWith("file://")) return uri;
  return `file://${uri}`;
};


    if (image) {
      formData.append("file", {
        uri: normalizeUri(image),
        name: "community.jpg",
        type: "image/jpeg",
      } as any);
    }

    await dispatch(createCommunityAction(formData));
    setIsCreatingCommunity(false);

    setCreateModalVisible(false);
    setNewCommunity({
      name: "",
      description: "",
      category: "General",
      image: "",
    });
    setImage(null); // reset picker
  };

  useEffect(() => {
    if (image) {
      setNewCommunity((prev) => ({
        ...prev,
        image,
      }));
    }
  }, [image]);

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center justify-between mt-2">
            <View>
              <Text className="text-white text-3xl font-bold">Communities</Text>
              <Text className="text-light-200 text-sm mt-1">
                Connect with movie lovers
              </Text>
            </View>
            <TouchableOpacity
              className="bg-accent rounded-full p-3"
              onPress={() => setCreateModalVisible(true)}
            >
              <Ionicons name="add" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View className="flex-row bg-dark-100 rounded-full p-1 mt-4">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-full ${
                activeTab === "my" ? "bg-accent" : ""
              }`}
              onPress={() => setActiveTab("my")}
            >
              <Text
                className={`text-center font-bold ${
                  activeTab === "my" ? "text-white" : "text-light-300"
                }`}
              >
                My Communities
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-full ${
                activeTab === "discover" ? "bg-accent" : ""
              }`}
              onPress={() => setActiveTab("discover")}
            >
              <Text
                className={`text-center font-bold ${
                  activeTab === "discover" ? "text-white" : "text-light-300"
                }`}
              >
                Discover
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
       
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "my" ? (
            <>
              {myCommunities.length > 0 ? (
                myCommunities.map((community) => (
                  <CommunityCard key={community._id} community={community} />
                ))
              ) : (
                <View className="flex-1 justify-center items-center py-20">
                  <MaterialCommunityIcons
                    name="account-group-outline"
                    size={80}
                    color="#9CA4AB"
                  />
                  <Text className="text-light-200 text-lg mt-4 text-center">
                    No Communities Yet
                  </Text>
                  <Text className="text-light-300 text-sm mt-2 text-center px-8">
                    Join or create a community to start chatting with other
                    movie lovers
                  </Text>
                </View>
              )}
            </>
          ) : (
            <>
              <View className="mb-4">
                <Text className="text-white text-xl font-bold mb-3">
                  Recommended for You
                </Text>
              </View>
              {recommendedCommunities.map((community) => (
                <CommunityCard key={community._id} community={community} />
              ))}
            </>
          )}
        </ScrollView>

        {/* Create Community Modal */}
       <Modal
  visible={createModalVisible}
  animationType="slide"
  transparent
  onRequestClose={() => setCreateModalVisible(false)}
>
  <View className="flex-1 bg-black/50 justify-end">
    {/* Only wrap the content area */}
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <View className="bg-secondary rounded-t-3xl max-h-[90%]">
        <View className="flex-row items-center justify-between mb-6 px-6 pt-6">
          <Text className="text-white text-2xl font-bold">
            Create Community
          </Text>
          <TouchableOpacity
            onPress={() => setCreateModalVisible(false)}
            className="bg-dark-100 rounded-full p-2"
          >
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="px-6"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
                <Text className="text-light-200 text-sm mb-2">
                  Community Image
                </Text>

                <TouchableOpacity
                  style={{
                    position: "relative",
                    borderRadius: 70,
                    width: "100%",
                    height: 160,
                    borderWidth: 2,
                    borderColor: "#9CA4AB",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={async () => {
                    await pickImage();
                  }}
                  className="bg-dark-100 rounded-xl h-40 mb-4 items-center justify-center overflow-hidden"
                >
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      resizeMode="cover"
                      style={{ borderRadius: 16, width: 100, height: 100 }}
                    />
                  ) : (
                    <View className="items-center">
                      <Ionicons
                        name="image-outline"
                        size={40}
                        color="#9CA4AB"
                      />
                      <Text className="text-light-300 mt-2">Select Image</Text>
                    </View>
                  )}
                  <View
                    pointerEvents="none" // 🔥 THIS IS THE KEY
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      borderRadius: 70,
                    }}
                  />
                </TouchableOpacity>

                <Text className="text-light-200 text-sm mb-2">
                  Community Name
                </Text>
                <TextInput
                  className="bg-dark-100 text-white rounded-xl p-4 mb-4"
                  placeholder="Enter community name"
                  placeholderTextColor="#9CA4AB"
                  value={newCommunity.name}
                  onChangeText={(text) =>
                    setNewCommunity({ ...newCommunity, name: text })
                  }
                />

                <Text className="text-light-200 text-sm mb-2">Description</Text>
                <TextInput
                  className="bg-dark-100 text-white rounded-xl p-4 mb-4 h-24"
                  placeholder="Describe your community"
                  placeholderTextColor="#9CA4AB"
                  multiline
                  textAlignVertical="top"
                  value={newCommunity.description}
                  onChangeText={(text) =>
                    setNewCommunity({ ...newCommunity, description: text })
                  }
                />

                <Text className="text-light-200 text-sm mb-2">Category</Text>
                <View className="flex-row flex-wrap gap-2 mb-6">
                  {[
                    "General",
                    "Movies",
                    "Animation",
                    "Sci-Fi",
                    "Horror",
                    "Comedy",
                  ].map((category) => (
                    <TouchableOpacity
                      key={category}
                      className={`px-4 py-2 rounded-full ${
                        newCommunity.category === category
                          ? "bg-accent"
                          : "bg-dark-100"
                      }`}
                      onPress={() =>
                        setNewCommunity({ ...newCommunity, category })
                      }
                    >
                      <Text
                        className={`${
                          newCommunity.category === category
                            ? "text-white"
                            : "text-light-300"
                        } font-bold`}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  className="bg-accent rounded-full py-4 mt-4"
                  onPress={handleCreateCommunity}
                >
                  <Text className="text-white text-center font-bold text-base">
                    {
                      isCreatingCommunity ? 'Creating...' : 'Create Community'
                    }
                  </Text>
                </TouchableOpacity>
              </ScrollView>
      </View>
    </KeyboardAvoidingView>
  </View>
</Modal>

      </View>
    </SafeAreaView>
  );
};

export default community;
