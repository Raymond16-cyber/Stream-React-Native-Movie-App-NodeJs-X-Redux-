import Ionicons from "@expo/vector-icons/Ionicons";
import {Video,ResizeMode} from "expo-av";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Welcome = () => {
  return (
    <View className="flex-1 bg-primary relative">
      {/* Background Image */}
      {/* <Image
        source={images.welcomeBg}
        className="absolute w-full h-full"
        resizeMode="stretch"
      /> */}
      {/* Video background */}
      <Video
        source={require("@/assets/videos/welcomevideobg.mp4")} // or a remote URL
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.STRETCH}
        isLooping
        shouldPlay
        isMuted
      />

      <SafeAreaView className="flex-1 justify-between p-6 z-10 pb-20">
        {/* Top content */}
        <View>
          <Text className="text-white text-4xl font-bold">Stream</Text>
        </View>

        {/* Bottom buttons */}
        <View className="gap-7">
          <TouchableOpacity className="bg-white rounded-full py-4 items-center flex flex-row  justify-center gap-2"
          onPress={() => router.push("/screens/Register")}>
            <Text className="text-primary font-bold text-lg">Get Started</Text>
            <Ionicons name="chevron-forward" size={22} color="black" />
          </TouchableOpacity>

          <TouchableOpacity className="border border-white rounded-full py-4 items-center"
           onPress={() => router.push("/screens/Login")}>
            <Text className="text-white font-bold text-lg">Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Welcome;
