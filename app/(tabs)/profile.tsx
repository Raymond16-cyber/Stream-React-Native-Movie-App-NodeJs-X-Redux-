import ActionContainer from "@/components/User/Settings/ActionContainer";
import UserInfoCardContainer from "@/components/User/Settings/UserInfoCardContainer";
import { icons } from "@/constants/icons";
import { useAuth } from "@/Contexts/AuthContext";
import { usePinSecurity } from "@/Contexts/PinSecurityContext";
import { destroyAccountAction, LogoutAction } from "@/store/actions/authAction";
import { toggleMultiProfileAction } from "@/store/actions/userAction";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import { Ionicons } from "@expo/vector-icons";

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Link, router, useFocusEffect } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const dispatch = useAppDispatch();

  // theme change
  const [modeenabled, setModeEnabled] = useState(true);
  const [multiProfileEnabled, setMultiProfileEnabled] = useState(false);

  const { user, loading } = useAuth();
  const { request } = usePinSecurity();

  const AVATAR_SIZE = 78;

  // animation for switch profile
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: multiProfileEnabled ? 0 : -100,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.spring(slideAnim, {
      toValue: multiProfileEnabled ? 0 : -100,
      useNativeDriver: true,
    }).start();
  }, [multiProfileEnabled]);

  // switching profiles

  const handleSwitchProfile = async () => {
    if (!multiProfileEnabled) {
      if (user.securityPin != "") {
        const allowed = await request();
        console.log("PIN allowed:", allowed);
        if (allowed) {
          router.back();
          // setMultiProfileEnabled(true);
          dispatch(toggleMultiProfileAction());
        }
        return;
      } else {
        router.push("/security/createPin");
      }
    }
    // setMultiProfileEnabled(false);
    dispatch(toggleMultiProfileAction());
  };

  const destroyAccount = async () => {
    if (user.securityPin != "") {
      const allowed = await request();
      console.log("PIN allowed:", allowed);
      if (allowed) {
        router.back();
        await dispatch(destroyAccountAction());
      }
      return;
    } else {
      router.push("/security/createPin");
    }
  };
  useEffect(() => {
    setMultiProfileEnabled(user.isMultiProfileEnabled);
  }, [user.isMultiProfileEnabled]);
  useFocusEffect(() => {
    console.log(user.isMultiProfileEnabled);
  });
  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Header */}
      <View className="px-4 pb-3 pt-4 flex-row items-center justify-between border-b border-light-300/10">
        <View className="flex-1 items-center">
          <Text className="text-light-200 text-lg font-semibold">Account</Text>
          <Text className="text-light-300 text-xs">Manage your profile & security</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/customer-services/customer-care")}
          className="p-2 rounded-full bg-white/10">
          <AntDesign name="customer-service" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 140,
          paddingTop: 26,
          paddingHorizontal: 14,
          gap: 18,
        }}
      >
        {/* User Card */}
        <UserInfoCardContainer loading={loading}>
          <View className="bg-dark-100 rounded-2xl p-5 relative overflow-hidden">
            <View className="absolute -right-8 -top-8 w-36 h-36 bg-white/5 rounded-full" />
            <View className="absolute right-2 top-4 w-20 h-20 bg-white/5 rounded-full" />

            <View className="flex-row items-center gap-4">
              {user?.currentProfile?.image ? (
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
                    source={
                      user?.currentProfile?.image
                        ? { uri: user?.currentProfile?.image }
                        : icons.person
                    }
                    style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <Image source={icons.person} style={{ width: 90, height: 90 }} />
              )}

              <View className="flex-1">
                <Text className="text-white text-xl font-semibold">
                  {user?.currentProfile?.name || "Your Name"}
                </Text>
                <Text className="text-light-200 text-sm">
                  {user?.email || "you@example.com"}
                </Text>

                <View className="flex-row gap-2 mt-2 flex-wrap">
                  <View className="bg-white/10 px-3 py-1.5 rounded-full flex-row items-center gap-1">
                    <MaterialCommunityIcons name="shield-check" size={16} color="#10b981" />
                    <Text className="text-light-200 text-xs">Secure</Text>
                  </View>
                  {multiProfileEnabled ? (
                    <View className="bg-indigo-500/20 px-3 py-1.5 rounded-full flex-row items-center gap-1">
                      <MaterialCommunityIcons name="account-multiple" size={16} color="#a78bfa" />
                      <Text className="text-indigo-100 text-xs">Multi profile</Text>
                    </View>
                  ) : null}
                </View>
              </View>

              <Pressable
                className="p-2 bg-white/10 rounded-full"
                onPress={() => router.push("/settings/CustomizeProfile")}
              >
                <Feather name="edit-3" size={20} color="white" />
              </Pressable>
            </View>

            {/* Switch Profile */}
            {multiProfileEnabled ? (
              <Link href="/settings/CreateProfile" asChild>
                <Pressable className="mt-4">
                  <Animated.View
                    className="flex-row items-center justify-center bg-white/10 py-3 rounded-xl"
                    style={{ transform: [{ translateX: slideAnim }] }}
                  >
                    <AntDesign name="swap" size={18} color="white" />
                    <Text className="text-white ml-2 font-semibold">Switch Profile</Text>
                  </Animated.View>
                </Pressable>
              </Link>
            ) : (
              <View className="mt-4" />
            )}
          </View>
        </UserInfoCardContainer>

        {/* Actions */}
        <ActionContainer
          modeenabled={modeenabled}
          setModeEnabled={setModeEnabled}
          multiProfileEnabled={multiProfileEnabled}
          setMultiProfileEnabled={setMultiProfileEnabled}
          handleToggleMultiProfile={handleSwitchProfile}
        />

        {/* Danger Zone */}
        <View className="gap-3">
          <TouchableOpacity
            className="bg-red-500/15 rounded-2xl py-3.5 flex-row items-center justify-center"
            onPress={destroyAccount}
          >
            <MaterialCommunityIcons name="cancel" size={22} color="#f87171" />
            <Text className="text-red-100 font-semibold text-base ml-2">
              Close account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white/10 rounded-2xl py-3.5 flex-row items-center justify-center"
            onPress={async () => {
              await dispatch(LogoutAction());
            }}
          >
            <MaterialCommunityIcons name="logout" size={22} color="white" />
            <Text className="text-white font-semibold text-base ml-2">
              Sign out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
