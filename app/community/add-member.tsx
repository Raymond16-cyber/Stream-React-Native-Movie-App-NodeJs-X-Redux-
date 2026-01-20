import React, { useMemo, useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, router } from "expo-router";
import { useAppSelector } from "@/store/hooks/useAppDispatch";
import { useAuth } from "@/Contexts/AuthContext";

export default function AddMember() {
  const { communityid } = useLocalSearchParams<{ communityid: string }>();
  const { myCommunities } = useAppSelector((state) => state.communities);
  const { user } = useAuth();
  const currentCommunity = myCommunities.find((c) => c._id === communityid);

  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<Record<string, boolean>>({});

  const sampleUsers = useMemo(
    () => [
      { _id: "u1", name: "Alex", image: "https://i.pravatar.cc/100?img=1" },
      { _id: "u2", name: "Jamie", image: "https://i.pravatar.cc/100?img=2" },
      { _id: "u3", name: "Taylor", image: "https://i.pravatar.cc/100?img=3" },
      { _id: "u4", name: "Jordan", image: "https://i.pravatar.cc/100?img=4" },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return sampleUsers.filter((u) => u.name.toLowerCase().includes(q));
  }, [query, sampleUsers]);

  const handleAddMember = (userId: string) => {
    setPending((prev) => ({ ...prev, [userId]: true }));
    setTimeout(() => {
      setPending((prev) => ({ ...prev, [userId]: false }));
    }, 800);
  };

  if (!currentCommunity) {
    return (
      <SafeAreaView className="flex-1 bg-primary items-center justify-center">
        <Text className="text-light-300">Community not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="px-4 py-3 border-b border-light-300/10 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Image source={{ uri: currentCommunity.image }} className="w-10 h-10 rounded-full mr-3" />
        <View className="flex-1">
          <Text className="text-white text-lg font-semibold" numberOfLines={1}>{currentCommunity.name}</Text>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="account-group" size={14} color="#9CA4AB" />
            <Text className="text-light-300 text-xs ml-1">{currentCommunity.memberCount} members</Text>
          </View>
        </View>
      </View>

      <View className="px-4 mt-3">
        <Text className="text-white text-base font-bold mb-2">Add Members</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search users by name"
          placeholderTextColor="#9CA4AB"
          className="bg-light-300/10 rounded-xl px-4 py-3 text-white"
        />
      </View>

      <View className="px-4 mt-3 flex-1">
        {query && filtered.length === 0 ? (
          <View className="items-center mt-10">
            <MaterialCommunityIcons name="account-search" size={48} color="#9CA4AB" />
            <Text className="text-light-300 mt-2">No users found</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View className="flex-row items-center py-3 border-b border-light-300/10">
                <Image source={{ uri: item.image }} className="w-10 h-10 rounded-full mr-3" />
                <Text className="text-white flex-1">{item.name}</Text>
                <TouchableOpacity
                  onPress={() => handleAddMember(item._id)}
                  className="bg-accent rounded-full px-4 py-2"
                >
                  <Text className="text-primary font-bold">{pending[item._id] ? "Adding..." : "Add"}</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<View />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
