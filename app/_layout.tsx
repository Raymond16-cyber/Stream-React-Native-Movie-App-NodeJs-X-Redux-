import { AuthProvider, useAuth } from "@/Contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import "../global.css";

function RootLayoutNav() {
   const { user, restoreUserFromToken, loading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      if (!hasLaunched) {
        await AsyncStorage.setItem("hasLaunched", "true");
        router.replace("/screens/Welcome");
      }

      // Restore user session if token exists
      await restoreUserFromToken();
      setIsReady(true);
    };

    initApp();
  }, []);

  useEffect(() => {
    if (isReady && !loading) {
      
      if (user.id) {
        console.log(" User is authenticated, navigating to home page");
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
    <Provider store={store}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </Provider>
  );
}
