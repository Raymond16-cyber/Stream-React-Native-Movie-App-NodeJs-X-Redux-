import ActionContainer from "@/components/User/Settings/ActionContainer";
import UserInfoCardContainer from "@/components/User/Settings/UserInfoCardContainer";
import { icons } from "@/constants/icons";
import { useAuth } from "@/Contexts/AuthContext";
import { logoutUser } from "@/services/useAuth";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
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
  // theme change
  const [modeenabled, setModeEnabled] = useState(true);
  const [multiProfileEnabled, setMultiProfileEnabled] = useState(false);
  const { user, loading, refreshUser } = useAuth();

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


  return (
    <SafeAreaView className="flex flex-col flex-1 bg-primary px-2">
      <View className="py-3 justify-center" style={{ paddingBottom: 10 }}>
        {/* Center title */}
        <Text className="text-light-200 text-center" style={{ fontSize: 22 }}>
          Account
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
          paddingTop: 30,
        }}
      >
        {/* user card X actions*/}
        <View
          className="flex flex-col"
          style={{ paddingHorizontal: 13, gap: 16 }}
        >
          {/* user card */}
          <UserInfoCardContainer loading={loading}>
            <View
              style={{
                padding: 20,
                position: "relative",
              }}
              className=" flex flex-row items-center bg-dark-100"
            >
              <Image source={icons.person} style={{ width: 90, height: 90 }} />

              <View className=" flex flex-col">
                <Text className="text-white text-xl">
                  {user?.name || "Test Name"}
                </Text>
                <Text className=" text-light-200">
                  {user?.email || "Test Email"}
                </Text>
              </View>
            </View>

            {/* switch profile */}
            {multiProfileEnabled ? (
              <Animated.View
                className="flex flex-row items-center justify-center bg-dark-100 mt-4 py-2"
                style={{ transform: [{ translateX: slideAnim }] }}
              >
                <AntDesign name="swap" size={20} color="white" />
                <Text className=" text-white">Switch Profile</Text>
              </Animated.View>
            ) : (
              <View className=" mt-4 py-4">

              </View>
            )}

            {/* edit icon */}
            <Pressable
              className="absolute right-0 -top-3 bg-primary border-white p-1 border-2"
              style={{
                borderRadius: "50%",
              }}
              onPress={() => router.push("/settings/CustomizeProfile")}
            >
              <Feather name="edit-3" size={24} color="white" />
            </Pressable>
          </UserInfoCardContainer>

          {/* user action*/}
          <ActionContainer
            modeenabled={modeenabled}
            setModeEnabled={setModeEnabled}
            multiProfileEnabled={multiProfileEnabled}
            setMultiProfileEnabled={setMultiProfileEnabled}
          />

          {/* Logout */}
          <TouchableOpacity
            className="bg-dark-100 rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
            style={{
              borderRadius: 16,
            }}
          >
            <MaterialCommunityIcons name="cancel" size={22} color="white" />
            <Text className=" text-white font-semibold text-base ml-2">
              Close account
            </Text>
          </TouchableOpacity>
          {/* close account */}
          <TouchableOpacity
            className="bg-dark-100 rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
            style={{
              borderRadius: 16,
            }}
            onPress={async () => {
              await logoutUser();
              await refreshUser();
            }}
          >
            <MaterialCommunityIcons name="logout" size={22} color="white" />
            <Text className=" text-white font-semibold text-base ml-2">
              Sign out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
