import { icons } from "@/constants/icons";
import { useAuth } from "@/Contexts/AuthContext";
import useCreateProfileImage from "@/hooks/useCreateProfileImage";
import { editUserDetailsAction } from "@/store/actions/userAction";
import { useAppDispatch, useAppSelector } from "@/store/hooks/useAppDispatch";
import { CLEAR_ERRORS, CLEAR_SUCCESS_MESSAGE } from "@/store/types/type";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  Animated,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomizeProfilePage = () => {
  const dispatch = useAppDispatch();
  const { message, error } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [isSaving, setIsSaving] = useState("null");
  const scaleAnim = new Animated.Value(1);

  // user state
  const { user } = useAuth();

  // image size
  const AVATAR_SIZE = 90;
  const { image, pickImage, setImage } = useCreateProfileImage();

  //   send data to server
  const submitDetails = async () => {
    if (isSaving === "saving") return;

    setIsSaving("saving");
    const formData = new FormData();
    formData.append("name", username || user?.currentProfile?.name || "");

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
      setImage(null);
      setIsSaving("saved");
      if (Platform.OS === "android") {
            
        ToastAndroid.show(message, ToastAndroid.SHORT);
          } else {
            Alert.alert("", message);
          }
      setTimeout(() => {
        dispatch({ type: CLEAR_SUCCESS_MESSAGE });
        setIsSaving("null");
      }, 2000);
    }
    if (error) {
      setIsSaving("error");
      if (Platform.OS === "android") {
        ToastAndroid.show(error, ToastAndroid.SHORT);
      } else {
        Alert.alert("", error);
      }
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS });
        setIsSaving("null");
      }, 3000);
    }
  }, [message, error]);

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Header */}
      <View className="px-4 pt-5 pb-4 border-b border-white/10 items-center">
        <Text className="text-light-200 text-xl font-semibold">Customize Profile</Text>
        <Text className="text-light-300 text-xs mt-1">Update your avatar and display name</Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140, paddingTop: 20, paddingHorizontal: 16, gap: 18 }}
      >
        {/* Avatar card */}
        <View className="bg-white/8 rounded-2xl p-5 relative overflow-hidden">
          <View className="absolute -right-8 -top-8 w-36 h-36 bg-white/5 rounded-full" />
          <View className="absolute right-2 top-6 w-20 h-20 bg-white/5 rounded-full" />

          <View className="flex-row items-center gap-4">
            {image ? (
              <Image source={{ uri: image }} style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 }} />
            ) : user?.currentProfile?.image ? (
              <View
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: AVATAR_SIZE / 2,
                  overflow: "hidden",
                  borderWidth: 2,
                  borderColor: "#8b5cf6",
                }}
              >
                <Image
                  source={user?.currentProfile?.image ? { uri: user.currentProfile.image } : icons.person}
                  style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <Image source={icons.person} style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }} />
            )}

            <View className="flex-1">
              <Text className="text-white text-lg font-semibold">Profile Photo</Text>
              <Text className="text-light-200 text-sm">Update your avatar</Text>

              <TouchableOpacity
                className="mt-3 flex-row items-center gap-2 px-3 py-2 rounded-full bg-white/10"
                onPress={pickImage}
              >
                <Feather name="image" size={16} color="#e5e7eb" />
                <Text className="text-light-200 text-sm">Choose image</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="p-2 bg-white/10 rounded-full"
              onPress={pickImage}
            >
              <Feather name="edit-3" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View className="gap-4">
          {/* Username */}
          <View>
            <Text className="text-light-200 mb-2 font-semibold">Display name</Text>
            <View className="bg-dark-100 rounded-xl px-4 py-3 border border-white/5">
              <TextInput
                placeholder={user?.currentProfile?.name || "e.g. johndoe"}
                placeholderTextColor="#9CA4AB"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="words"
                className="text-white"
              />
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row gap-12 pt-4">
          <View className="flex-1 bg-white/5 rounded-2xl p-3 border border-white/10">
            <Text className="text-light-200 text-sm mb-2">Preview</Text>
            <View className="flex-row items-center gap-3">
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  overflow: "hidden",
                  backgroundColor: "#111",
                }}
              >
                <Image
                  source={
                    image
                      ? { uri: image }
                      : user?.currentProfile?.image
                        ? { uri: user.currentProfile.image }
                        : icons.person
                  }
                  style={{ width: 46, height: 46 }}
                  resizeMode="cover"
                />
              </View>
              <View>
                <Text className="text-white font-semibold text-sm">
                  {username || user?.currentProfile?.name || "Your name"}
                </Text>
                <Text className="text-light-300 text-xs">How others see you</Text>
              </View>
            </View>
          </View>

          <View className="flex-1 gap-3">
            <TouchableOpacity
              className="bg-white/10 rounded-2xl py-3 items-center justify-center"
              activeOpacity={0.85}
              onPress={() => {
                setUsername("");
                setImage(null);
              }}
            >
              <Text className="text-light-200 font-semibold">Reset</Text>
            </TouchableOpacity>

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                className="rounded-2xl py-3 items-center justify-center"
                style={{ backgroundColor: "#6a5db0" }}
                activeOpacity={0.9}
                onPress={() => {
                  Animated.sequence([
                    Animated.timing(scaleAnim, {
                      toValue: 0.95,
                      duration: 100,
                      useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                      toValue: 1,
                      duration: 100,
                      useNativeDriver: true,
                    }),
                  ]).start();
                  submitDetails();
                }}
                disabled={isSaving === "saving" || isSaving === "saved"}
              >
                {isSaving === "saving" ? (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator color="white" size="small" />
                    <Text className="text-white font-semibold">Saving...</Text>
                  </View>
                ) : isSaving === "saved" ? (
                  <View className="flex-row items-center gap-2">
                    <MaterialCommunityIcons name="check-circle" size={18} color="#10b981" />
                    <Text className="text-white font-semibold">Saved</Text>
                  </View>
                ) : isSaving === "error" ? (
                  <View className="flex-row items-center gap-2">
                    <MaterialCommunityIcons name="alert-circle" size={18} color="#f87171" />
                    <Text className="text-white font-semibold">Try Again</Text>
                  </View>
                ) : (
                  <Text className="text-white font-semibold">Save Changes</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomizeProfilePage;
