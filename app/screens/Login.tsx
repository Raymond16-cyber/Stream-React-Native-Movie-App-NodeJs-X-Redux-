import { useAuth } from "@/Contexts/AuthContext";
import { loginUser } from "@/services/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { styles } from "../styles/Stylesheets/OutApp";
import { loginAction } from "@/store/actions/authAction";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";

// Validation schema
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
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const loginData = {
        email: data.email,
        password: data.password,
      };
      await dispatch(loginAction(loginData));
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error instanceof Error ? error.message : "An error occurred"
      );
      console.error("Login error:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary" style={{ paddingTop: 20 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 28,
          justifyContent: "center",
          paddingBottom: 40,
          display: "flex",
          gap: 22,
        }}
      >
        {/* Title */}
        <Text style={styles.pageHeaderText}>Welcome Back</Text>

        {/* Card */}
        <View className="bg-white rounded-2xl p-6 shadow-lg">
          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, onBlur } }) => (
              <View className="mb-4">
                <Text className="text-gray-700 mb-1">Email</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter Email"
                    keyboardType="email-address"
                    className="flex-1 text-gray-900"
                    placeholderTextColor="#999"
                  />
                </View>
                {errors.email && (
                  <Text className="text-red-500 mt-1">
                    {errors.email.message}
                  </Text>
                )}
              </View>
            )}
          />

          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, onBlur } }) => (
              <View className="mb-6">
                <Text className="text-gray-700 mb-1">Password</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter password"
                    secureTextEntry={!showPassword}
                    className="flex-1 text-gray-900"
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text className="text-blue-500 font-medium ml-2">
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text className="text-red-500 mt-1">
                    {errors.password.message}
                  </Text>
                )}
              </View>
            )}
          />

          {/* Button */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            className="bg-primary py-3 rounded-lg items-center mb-4 mt-10"
          >
            <Text className="text-white font-bold text-lg">Login</Text>
          </Pressable>

          {/* Register link */}
          <Pressable onPress={() => router.push("/screens/Register")}>
            <Text className="text-center text-primary underline">
              Don’t have an account? Register
            </Text>
          </Pressable>

          {/* back to welcome page */}
          <Pressable
            onPress={() => router.push("/screens/Welcome")}
            className="flex-row items-center mt-4 justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="black" />
            <Text className="text-primary ml-2 text-base">Back to Home</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
