import { generateName } from "@/services/generatePlaceholderName";
import { registerAction } from "@/store/actions/authAction";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

/* -------------------- Validation Schema -------------------- */
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

const Register = () => {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scaleAnim = new Animated.Value(1);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    // Button animation
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
      const name = await generateName();
      const toSend = {
        email: data.email,
        password: data.password,
        name: name,
      };

      await dispatch(registerAction(toSend));
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/screens/Login");
      }, 1500);
    } catch (err) {
      setError("Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
          paddingTop: 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8 mt-2">
          <Text className="text-white text-4xl font-bold mb-2">Create Account</Text>
          <Text className="text-gray-300 text-base">Join us today</Text>
        </View>

        {/* Registration Card */}
        <View className="bg-white rounded-3xl p-6 shadow-2xl">
          {/* Error Alert */}
          {error && (
            <View className="bg-red-100 border-l-4 border-red-500 rounded-lg p-4 mb-6">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="alert-circle" size={20} color="#dc2626" />
                <Text className="text-red-700 ml-3 flex-1 text-sm font-medium">{error}</Text>
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
                    placeholder="your@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="text-gray-900 ml-3 flex-1 text-base font-medium"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                {errors.email && (
                  <View className="flex-row items-center mt-2 ml-1">
                    <MaterialCommunityIcons name="close-circle" size={16} color="#ef4444" />
                    <Text className="text-red-500 ml-1 text-xs font-medium">{errors.email.message}</Text>
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
                <Text className="text-gray-800 font-semibold mb-2 ml-1">Password</Text>
                <View className="border-2 border-gray-200 rounded-2xl px-4 py-3 flex-row items-center bg-gray-50">
                  <MaterialCommunityIcons name="lock-outline" size={22} color="#6b7280" />
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="••••••••"
                    secureTextEntry={!showPassword}
                    className="flex-1 ml-3 text-gray-900 text-base font-medium"
                    placeholderTextColor="#9ca3af"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? "eye-off" : "eye"}
                      size={22}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <View className="flex-row items-center mt-2 ml-1">
                    <MaterialCommunityIcons name="close-circle" size={16} color="#ef4444" />
                    <Text className="text-red-500 ml-1 text-xs font-medium">{errors.password.message}</Text>
                  </View>
                )}
              </View>
            )}
          />

          {/* Register Button */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
              disabled={isLoading || isSuccess}
              onPress={handleSubmit(onSubmit)}
              className="py-4 rounded-2xl items-center justify-center mt-6"
              style={{
                backgroundColor: isSuccess ? "#10b981" : isLoading ? "#8b5cf6" : "#6366f1",
                opacity: isLoading || isSuccess ? 0.8 : 1,
              }}
            >
              <View className="flex-row items-center justify-center">
                {isLoading ? (
                  <>
                    <ActivityIndicator color="white" size={20} />
                    <Text className="text-white font-bold text-lg ml-2">Creating Account...</Text>
                  </>
                ) : isSuccess ? (
                  <>
                    <MaterialCommunityIcons name="check-circle" size={24} color="white" />
                    <Text className="text-white font-bold text-lg ml-2">Account Created!</Text>
                  </>
                ) : (
                  <Text className="text-white font-bold text-lg">Create Account</Text>
                )}
              </View>
            </Pressable>
          </Animated.View>

          {/* Divider */}
          {!isLoading && !isSuccess && (
            <>
              <View className="flex-row items-center my-5">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="px-3 text-gray-500 text-xs">OR</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              {/* Login Link */}
              <Pressable
                onPress={() => router.push("/screens/Login")}
                className="flex-row items-center justify-center py-3 rounded-2xl border-2 border-indigo-200 bg-indigo-50"
              >
                <MaterialCommunityIcons name="login" size={20} color="#6366f1" />
                <Text className="text-gray-800 font-semibold ml-2">Already have an account? Login</Text>
              </Pressable>

              {/* Back Button */}
              <Pressable
                onPress={() => router.push("/screens/Welcome")}
                className="flex-row items-center justify-center py-3 mt-2"
              >
                <MaterialCommunityIcons name="arrow-left" size={20} color="#9ca3af" />
                <Text className="text-gray-600 ml-2 font-medium">Back to Welcome</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
