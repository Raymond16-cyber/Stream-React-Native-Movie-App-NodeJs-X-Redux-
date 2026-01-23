import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const Welcome = () => {
  const scaleAnimGetStarted = new Animated.Value(1);
  const scaleAnimSignIn = new Animated.Value(1);

  const handlePressIn = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className="flex-1 bg-primary relative">
      {/* Video background */}
      <Video
        source={require("@/assets/videos/welcomevideobg.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
        isMuted
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={["rgba(15, 13, 35, 0.6)", "rgba(15, 13, 35, 0.8)", "rgba(15, 13, 35, 0.95)"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView className="flex-1 justify-between z-10">
        {/* Top Brand Section */}
        <View className="px-6 pt-8">
          <View className="flex-row items-center mb-3">
            <MaterialCommunityIcons name="play-circle" size={40} color="#fff" />
            <Text className="text-white text-5xl font-bold ml-2">Stream</Text>
          </View>
          <Text className="text-gray-300 text-lg font-medium">
            Unlimited movies, TV shows, and more
          </Text>
        </View>

        {/* Center Feature Highlights */}
        <View className="px-6 mb-12">
          <View className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <View className="flex-row items-center mb-4">
              <View className="bg-indigo-500 rounded-full p-3 mr-4">
                <MaterialCommunityIcons name="movie-open" size={24} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">Watch Anywhere</Text>
                <Text className="text-gray-300 text-sm">Stream on your phone, tablet, or TV</Text>
              </View>
            </View>

            <View className="flex-row items-center mb-4">
              <View className="bg-purple-500 rounded-full p-3 mr-4">
                <MaterialCommunityIcons name="account-group" size={24} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">Create Communities</Text>
                <Text className="text-gray-300 text-sm">Watch and chat with friends</Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="bg-pink-500 rounded-full p-3 mr-4">
                <MaterialCommunityIcons name="download" size={24} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">Save & Watch Later</Text>
                <Text className="text-gray-300 text-sm">Download your favorites offline</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Action Buttons */}
        <View className="px-6 pb-8 gap-4">
          {/* Get Started Button */}
          <Animated.View style={{ transform: [{ scale: scaleAnimGetStarted }] }}>
            <TouchableOpacity
              className="bg-indigo-600 rounded-2xl py-5 items-center shadow-2xl"
              onPress={() => router.push("/screens/Register")}
              onPressIn={() => handlePressIn(scaleAnimGetStarted)}
              onPressOut={() => handlePressOut(scaleAnimGetStarted)}
              activeOpacity={0.9}
            >
              <View className="flex-row items-center">
                <Text className="text-white font-bold text-xl mr-2">Get Started Free</Text>
                <MaterialCommunityIcons name="arrow-right-circle" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Sign In Button */}
          <Animated.View style={{ transform: [{ scale: scaleAnimSignIn }] }}>
            <TouchableOpacity
              className="border-2 border-white rounded-2xl py-5 items-center bg-white/5"
              onPress={() => router.push("/screens/Login")}
              onPressIn={() => handlePressIn(scaleAnimSignIn)}
              onPressOut={() => handlePressOut(scaleAnimSignIn)}
              activeOpacity={0.9}
            >
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="login" size={24} color="#fff" />
                <Text className="text-white font-bold text-xl ml-2">Sign In</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Terms */}
          <Text className="text-gray-400 text-center text-xs mt-2">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Welcome;
