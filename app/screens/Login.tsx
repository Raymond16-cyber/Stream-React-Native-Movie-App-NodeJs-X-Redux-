import { useAuth } from "@/Contexts/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { styles } from "../styles/Stylesheets/OutApp";
import { loginAction } from "@/store/actions/authAction";
import { useAppDispatch, useAppSelector } from "@/store/hooks/useAppDispatch";
import { CLEAR_ERRORS } from "@/store/types/type";

/* -------------------- Validation -------------------- */
const schema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
}).required();

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const { error, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const scaleAnim = new Animated.Value(1);

  const isDisabled = isLoading || isSuccess || isLocked;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* -------------------- Submit -------------------- */
  const onSubmit = async (data: FormData) => {
    if (isDisabled) return;

    setIsLoading(true);
    setIsLocked(true);

    // Button press animation
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

    try {
      await dispatch(
        loginAction({
          email: data.email,
          password: data.password,
        })
      );
    } catch {
      // redux handles error
    }
  };

  /* -------------------- Error handling -------------------- */
  useEffect(() => {
    if (error) {
      setIsLoading(false);

      const timer = setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS });
        setIsLocked(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  /* -------------------- Success handling -------------------- */
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(false);
      setIsSuccess(true);

      const timer = setTimeout(() => {
        router.replace("/(tabs)");
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
          paddingTop: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="text-white text-4xl font-bold mb-2">Welcome Back</Text>
          <Text className="text-gray-300 text-base">Sign in to continue</Text>
        </View>

        {/* Login Form Card */}
        <View className="bg-white rounded-3xl p-6 shadow-2xl mb-6">
          {/* Error Alert */}
          {error && (
            <View className="bg-red-100 border-l-4 border-red-500 rounded-lg p-4 mb-6">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="alert-circle" size={20} color="#dc2626" />
                <Text className="text-red-700 ml-3 flex-1">{error}</Text>
              </View>
            </View>
          )}

          {/* Email Input */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, onBlur } }) => (
              <View className="mb-5">
                <Text className="text-gray-800 font-semibold mb-2 ml-1">Email Address</Text>
                <View className="border-2 border-gray-200 rounded-2xl px-4 py-3 flex-row items-center bg-gray-50">
                  <MaterialCommunityIcons name="email-outline" size={22} color="#6b7280" />
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!isDisabled}
                    selectTextOnFocus={!isDisabled}
                    placeholder="your@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="text-gray-900 ml-3 flex-1 text-base"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                {errors.email && (
                  <View className="flex-row items-center mt-2 ml-1">
                    <MaterialCommunityIcons name="close-circle" size={16} color="#ef4444" />
                    <Text className="text-red-500 ml-1 text-sm">{errors.email.message}</Text>
                  </View>
                )}
              </View>
            )}
          />

          {/* Password Input */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, onBlur } }) => (
              <View className="mb-6">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-800 font-semibold ml-1">Password</Text>
                </View>
                <View className="border-2 border-gray-200 rounded-2xl px-4 py-3 flex-row items-center bg-gray-50">
                  <MaterialCommunityIcons name="lock-outline" size={22} color="#6b7280" />
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!isDisabled}
                    secureTextEntry={!showPassword || isDisabled}
                    className="flex-1 ml-3 text-gray-900 text-base"
                    placeholder="••••••••"
                    placeholderTextColor="#9ca3af"
                  />
                  {!isDisabled && (
                    <TouchableOpacity
                      onPress={() => setShowPassword((p) => !p)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <MaterialCommunityIcons
                        name={showPassword ? "eye-off" : "eye"}
                        size={22}
                        color="#6b7280"
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {errors.password && (
                  <View className="flex-row items-center mt-2 ml-1">
                    <MaterialCommunityIcons name="close-circle" size={16} color="#ef4444" />
                    <Text className="text-red-500 ml-1 text-sm">{errors.password.message}</Text>
                  </View>
                )}
              </View>
            )}
          />

          {/* Login Button */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
              disabled={isDisabled}
              onPress={handleSubmit(onSubmit)}
              className="py-4 rounded-2xl items-center justify-center mt-4"
              style={{
                backgroundColor: isSuccess ? "#10b981" : isLoading ? "#8b5cf6" : "#6366f1",
                opacity: isDisabled ? 0.8 : 1,
              }}
            >
              <View className="flex-row items-center justify-center">
                {isLoading ? (
                  <>
                    <ActivityIndicator color="white" size={20} />
                    <Text className="text-white font-bold text-lg ml-2">Signing in...</Text>
                  </>
                ) : isSuccess ? (
                  <>
                    <MaterialCommunityIcons name="check-circle" size={24} color="white" />
                    <Text className="text-white font-bold text-lg ml-2">Welcome!</Text>
                  </>
                ) : (
                  <Text className="text-white font-bold text-lg">Sign In</Text>
                )}
              </View>
            </Pressable>
          </Animated.View>

          {/* Divider */}
          <View className="flex-row items-center my-5">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="px-3 text-gray-500 text-sm">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Links */}
          {!isDisabled && (
            <View className="gap-3">
              <Pressable
                onPress={() => router.push("/screens/Register")}
                className="flex-row items-center justify-center py-3 rounded-2xl border-2 border-gray-300 bg-gray-50"
              >
                <MaterialCommunityIcons name="account-plus" size={20} color="#6366f1" />
                <Text className="text-gray-800 font-semibold ml-2">Create New Account</Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/screens/ForgotPassword")}
                className="py-3 items-center"
              >
                <Text className="text-indigo-600 font-semibold text-base underline">Forgot Password?</Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/screens/Welcome")}
                className="flex-row items-center justify-center py-3"
              >
                <MaterialCommunityIcons name="arrow-left" size={20} color="#9ca3af" />
                <Text className="text-gray-600 ml-2 font-medium">Back to Welcome</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
