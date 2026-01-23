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
  View,
  Animated,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { authForgetPasswordAction } from "@/store/actions/authAction";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";

/* -------------------- Validation Schema -------------------- */
type FormData = {
  email: string;
};

const schema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const dispatch = useAppDispatch();
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
      await dispatch(authForgetPasswordAction(data.email));
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/screens/Login");
      }, 2000);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
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
          <Text className="text-white text-4xl font-bold mb-2">Reset Password</Text>
          <Text className="text-gray-300 text-base">Enter your email to receive reset instructions</Text>
        </View>

        {/* Password Reset Card */}
        <View className="bg-white rounded-3xl p-6 shadow-2xl">
          {/* Info Message */}
          <View className="bg-blue-100 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
            <View className="flex-row items-start">
              <MaterialCommunityIcons name="information" size={20} color="#2563eb" />
              <Text className="text-blue-700 ml-3 flex-1 text-sm font-medium">
                We'll send you an email with instructions to reset your password.
              </Text>
            </View>
          </View>

          {/* Error Alert */}
          {error && (
            <View className="bg-red-100 border-l-4 border-red-500 rounded-lg p-4 mb-6">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="alert-circle" size={20} color="#dc2626" />
                <Text className="text-red-700 ml-3 flex-1 text-sm font-medium">{error}</Text>
              </View>
            </View>
          )}

          {/* Success Message */}
          {isSuccess && (
            <View className="bg-green-100 border-l-4 border-green-500 rounded-lg p-4 mb-6">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="check-circle" size={20} color="#16a34a" />
                <Text className="text-green-700 ml-3 flex-1 text-sm font-medium">
                  Check your email for reset instructions!
                </Text>
              </View>
            </View>
          )}

          {/* Email Input */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, onBlur } }) => (
              <View className="mb-6">
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
                    editable={!isLoading && !isSuccess}
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

          {/* Submit Button */}
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
                    <Text className="text-white font-bold text-lg ml-2">Sending...</Text>
                  </>
                ) : isSuccess ? (
                  <>
                    <MaterialCommunityIcons name="check-circle" size={24} color="white" />
                    <Text className="text-white font-bold text-lg ml-2">Email Sent!</Text>
                  </>
                ) : (
                  <Text className="text-white font-bold text-lg">Send Reset Link</Text>
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

              {/* Navigation Buttons */}
              <View className="gap-3">
                <Pressable
                  onPress={() => router.push("/screens/Login")}
                  className="flex-row items-center justify-center py-3 rounded-2xl border-2 border-indigo-200 bg-indigo-50"
                >
                  <MaterialCommunityIcons name="login" size={20} color="#6366f1" />
                  <Text className="text-gray-800 font-semibold ml-2">Back to Login</Text>
                </Pressable>

                <Pressable
                  onPress={() => router.push("/screens/Register")}
                  className="flex-row items-center justify-center py-3 rounded-2xl border-2 border-gray-200 bg-gray-50"
                >
                  <MaterialCommunityIcons name="account-plus" size={20} color="#6366f1" />
                  <Text className="text-gray-800 font-semibold ml-2">Create New Account</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
