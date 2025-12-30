import { AuthProvider, useAuth } from "@/Contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import "../global.css";
import { PinSecurityProvider } from "@/Contexts/PinSecurityContext";

function RootLayoutNav() {
  const { user, restoreUserFromToken, loading, isAuthenticated } = useAuth();
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
  if (!isReady || loading) return;

  if (isAuthenticated) {
    router.replace("/(tabs)");
  } else {
    router.replace("/screens/Login");
  }
}, [isAuthenticated, loading, isReady]);


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
        <Stack.Screen
          name="movies/[id]/trailer"
          options={{ headerShown: false }}
        />
        {/* settings */}
        <Stack.Screen
          name="settings/CustomizeProfile"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="settings/CreateProfile"
          options={{ headerShown: false }}
        />
        {/* security */}
        <Stack.Screen name="security/usePin" options={{ headerShown: false }} />
        <Stack.Screen
          name="security/createPin"
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
        <PinSecurityProvider>
          <RootLayoutNav />
        </PinSecurityProvider>
      </AuthProvider>
    </Provider>
  );
}
