import { icons } from "@/constants/icons";
import { useAuth } from "@/Contexts/AuthContext";
import useCreateProfileImage from "@/hooks/useCreateProfileImage";
import { editUserDetailsAction } from "@/store/actions/userAction";
import { useAppDispatch, useAppSelector } from "@/store/hooks/useAppDispatch";
import { CLEAR_ERRORS, CLEAR_SUCCESS_MESSAGE } from "@/store/types/type";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import React, { use, useEffect, useState } from "react";
import { set } from "react-hook-form";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomizeProfilePage = () => {
  const dispatch = useAppDispatch();
  const { message, error } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [isSaving, setIsSaving] = useState("null");

  // user state
  const { user } = useAuth();

  // image size
  const AVATAR_SIZE = 90;
  const { image, pickImage } = useCreateProfileImage();

  //   send data to server
  const submitDetails = async () => {
    setIsSaving("saving");
    const formData = new FormData();
    formData.append("name", username);

    if (image) {
      formData.append("file", {
        uri: image,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);
    }

    await dispatch(editUserDetailsAction(formData));
  };
  useEffect(() => {
    if (message) {
      setIsSaving("saved");
      ToastAndroid.show(message, ToastAndroid.SHORT);
      setTimeout(() => {
        dispatch({ type: CLEAR_SUCCESS_MESSAGE });
      }, 2000);
    }
    if (error) {
      setIsSaving("error");
      ToastAndroid.show(error, ToastAndroid.SHORT);
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS });
      }, 3000);
    }
  }, [message, error, isSaving]);

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
                style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
              />
            ) : user?.image ? (
              <View
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: AVATAR_SIZE / 2,
                  overflow: "hidden", // 🔑 this is mandatory
                }}
              >
                <Image
                  source={user?.image ? { uri: user.image } : icons.person}
                  style={{
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                  }}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <Image
                source={icons.person}
                style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
              />
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
              disabled={isSaving === "saving" || isSaving === "saved"}
            >
              {isSaving === "null" ? (
                <Text className="text-white font-semibold">Save Changes</Text>
              ) : isSaving === "saving" ? (
                <Text className="text-white font-semibold">Saving...</Text>
              ) : isSaving === "saved" ? (
                <Text className="text-white font-semibold">Saved!</Text>
              ) : (
                <Text className="text-white font-semibold">Try Again</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomizeProfilePage;
