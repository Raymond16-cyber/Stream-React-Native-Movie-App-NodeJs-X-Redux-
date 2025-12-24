import { AuthProvider, useAuth } from "@/Contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import "../global.css";

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      if (!hasLaunched) {
        await AsyncStorage.setItem("hasLaunched", "true");
        router.replace("/screens/Welcome");
      }
      setIsReady(true);
    };
    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (isReady && !loading) {
      if (user) {
        // User is authenticated, navigate to home page
        router.replace("/(tabs)");
      } else {
        // No user, navigate to welcome/login
        const navigateToAuth = async () => {
          const hasLaunched = await AsyncStorage.getItem("hasLaunched");
          if (hasLaunched) {
            router.replace("/screens/Login");
          }
        };
        navigateToAuth();
      }
    }
  }, [user, loading, isReady]);

  if (!isReady || loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0f0d23",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <>
      <StatusBar hidden />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Welcome" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Login" options={{ headerShown: false }} />
        <Stack.Screen
          name="screens/Register"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
        {/* settings */}
        <Stack.Screen
          name="settings/CustomizeProfile"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
