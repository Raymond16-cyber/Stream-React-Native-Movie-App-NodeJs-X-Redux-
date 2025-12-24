import { icons } from "@/constants/icons";
import { useAuth } from "@/Contexts/AuthContext";
import { editUser } from "@/services/user";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomizeProfilePage = () => {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [bio, setBio] = useState("");

  // user state
  const { user, refreshUser } = useAuth();

  const pickImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission is required to access photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  //   send data to server
  const submitDetails = async () => {
    const data = {
      name: username,
      image: "",
    };
    await editUser(data);
    // Refresh user context to update UI immediately
    await refreshUser();
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Header */}
      <View
        className="w-full py-3 justify-center"
        style={{ paddingBottom: 10 }}
      >
        <Text className="text-light-200 text-center" style={{ fontSize: 22 }}>
          Customize Profile
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View className="px-4">
          {/* Avatar card */}
          <View
            style={{
              backgroundColor: "#6a5db0",
              borderRadius: 16,
              padding: 20,
            }}
            className="flex flex-row items-center relative"
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: 90, height: 90 }}
              />
            ) : (
              <Image source={icons.person} style={{ width: 90, height: 90 }} />
            )}

            <View className="ml-4">
              <Text className="text-white text-xl">Profile Photo</Text>
              <Text className="text-light-200">Update your avatar</Text>
            </View>

            {/* edit overlay (no action yet) */}
            <TouchableOpacity
              className="absolute right-3 top-3 border-white p-1 border-2"
              style={{ borderRadius: 9999 }}
              onPress={pickImage}
            >
              <Feather name="edit-3" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View className="mt-6 flex flex-col" style={{ gap: 14 }}>
            {/* Username */}
            <View>
              <Text className="text-light-200 mb-2">Username</Text>
              <View className="bg-dark-100 rounded-xl px-4 py-3">
                <TextInput
                  placeholder={user?.name || "e.g. johndoe"}
                  placeholderTextColor="#9CA4AB"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  className="text-white"
                />
              </View>
            </View>
          </View>

          {/* Actions */}
          <View className="mt-8 flex flex-row" style={{ gap: 12 }}>
            <TouchableOpacity
              className="flex-1 bg-secondary rounded-xl py-3 items-center justify-center"
              // purely visual for now
              activeOpacity={0.8}
            >
              <Text className="text-light-200 font-semibold">Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 rounded-xl py-3 items-center justify-center"
              style={{ backgroundColor: "#6a5db0" }}
              // purely visual for now
              activeOpacity={0.8}
              onPress={submitDetails}
            >
              <Text className="text-white font-semibold">Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomizeProfilePage;
