import "dotenv/config";

export default {
  expo: {
    name: "Stream",
    slug: "stream",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    scheme: "streamapp",
    deepLinks: true,
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
       "package": "com.anonymous.stream",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/logo.png",
        backgroundImage: "./assets/images/logo.png",
        monochromeImage: "./assets/images/logo.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/images/logo.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      movieToken: process.env.MOVIE_TOKEN,
      appwriteProjectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
      appwriteProjectName: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME,
      appwriteEndpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
      appwriteDatabaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
      tmdbApiKey: process.env.TMDB_API_KEY,
    },
  },
};
