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
import { use, useEffect, useRef, useState } from "react";
import { set } from "react-hook-form";
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

  const AVATAR_SIZE = 70;

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
    <SafeAreaView className="flex flex-col flex-1 bg-primary px-2">
      {/* Header */}
      <View className="border-b border-light-300/10 flex flex-row items-center  px-3">
      <View className="py-3 justify-center flex-1" style={{ paddingBottom: 10 }}>
        <Text className="text-light-200 text-center" style={{ fontSize: 22 }}>
          Account
        </Text>
      </View>

<TouchableOpacity onPress={()=> router.push("/customer-services/customer-care")}>
      <AntDesign name="customer-service" size={24} color="white" />
      </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
          paddingTop: 30,
        }}
      >
        <View
          className="flex flex-col"
          style={{ paddingHorizontal: 13, gap: 16 }}
        >
          {/* User Card */}
          <UserInfoCardContainer loading={loading}>
            <View
              className="flex flex-row items-center bg-dark-100"
              style={{
                padding: 20,
                position: "relative",
                gap: 20,
              }}
            >
              {user?.currentProfile?.image ? (
                <View
                  style={{
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    borderRadius: AVATAR_SIZE / 2,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={
                      user?.currentProfile?.image
                        ? { uri: user?.currentProfile?.image }
                        : icons.person
                    }
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
                  style={{ width: 90, height: 90 }}
                />
              )}

              <View className="flex flex-col">
                <Text className="text-white text-xl">
                  {user?.currentProfile?.name || "Test Name"}
                </Text>
                <Text className="text-light-200">
                  {user?.email || "Test Email"}
                </Text>
              </View>
            </View>

            {/* Switch Profile */}
            {multiProfileEnabled ? (
              <Link href="/settings/CreateProfile" asChild>
                <Pressable>
                  <Animated.View
                    className="flex flex-row items-center justify-center bg-dark-100 mt-4 py-2"
                    style={{ transform: [{ translateX: slideAnim }] }}
                  >
                    <AntDesign name="swap" size={20} color="white" />
                    <Text className="text-white">Switch Profile</Text>
                  </Animated.View>
                </Pressable>
              </Link>
            ) : (
              <View className="mt-4 py-4" />
            )}

            {/* Edit Icon */}
            <Pressable
              className="absolute right-0 -top-3 bg-primary border-white p-1 border-2"
              style={{ borderRadius: "50%" }}
              onPress={() => router.push("/settings/CustomizeProfile")}
            >
              <Feather name="edit-3" size={24} color="white" />
            </Pressable>
          </UserInfoCardContainer>

          {/* Actions */}
          <ActionContainer
            modeenabled={modeenabled}
            setModeEnabled={setModeEnabled}
            multiProfileEnabled={multiProfileEnabled}
            setMultiProfileEnabled={setMultiProfileEnabled}
            handleToggleMultiProfile={handleSwitchProfile}
          />

          {/* Close Account */}
          <TouchableOpacity
            className="bg-dark-100 rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
            style={{ borderRadius: 16 }}
            onPress={destroyAccount}
          >
            <MaterialCommunityIcons name="cancel" size={22} color="white" />
            <Text className="text-white font-semibold text-base ml-2">
              Close account
            </Text>
          </TouchableOpacity>

          {/* Sign Out */}
          <TouchableOpacity
            className="bg-dark-100 rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
            style={{ borderRadius: 16 }}
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
