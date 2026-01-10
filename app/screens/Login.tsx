import { useAuth } from "@/Contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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
  const [isLocked, setIsLocked] = useState(false); // prevents spam

  const isDisabled = isLoading || isSuccess || isLocked;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  /* -------------------- Submit -------------------- */
  const onSubmit = async (data: FormData) => {
    if (isDisabled) return;

    setIsLoading(true);
    setIsLocked(true);

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
        setIsLocked(false); // unlock login after error timeout
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
    <SafeAreaView className="flex-1 bg-primary" style={{ paddingTop: 20 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 28,
          justifyContent: "center",
          paddingBottom: 40,
          gap: 22,
        }}
      >
        <Text style={styles.pageHeaderText}>Welcome Back</Text>

        <View className="bg-white rounded-2xl p-6 shadow-lg">
          {error && (
            <Text className="text-red-500 text-center mb-4">{error}</Text>
          )}

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, onBlur } }) => (
              <View className="mb-4">
                <Text className="text-gray-700 mb-1">Email</Text>
                <View className="border border-gray-300 rounded-lg px-4 py-3">
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!isDisabled}
                    selectTextOnFocus={!isDisabled}
                    placeholder="Enter email"
                    keyboardType="email-address"
                    className="text-gray-900"
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
                    editable={!isDisabled}
                    secureTextEntry={!showPassword || isDisabled}
                    className="flex-1 text-gray-900"
                    placeholder="Enter password"
                    placeholderTextColor="#999"
                  />
                  {!isDisabled && (
                    <TouchableOpacity
                      onPress={() => setShowPassword((p) => !p)}
                    >
                      <Text className="text-blue-500 ml-2">
                        {showPassword ? "Hide" : "Show"}
                      </Text>
                    </TouchableOpacity>
                  )}
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
            disabled={isDisabled}
            onPress={handleSubmit(onSubmit)}
            style={{
              opacity: isDisabled ? 0.6 : 1,
              backgroundColor: isSuccess ? "#28a745" : "#6a5db0",
            }}
            className="py-3 rounded-lg items-center mt-10"
          >
            <Text className="text-white font-bold text-lg">
              {isLoading
                ? "Loading..."
                : isSuccess
                  ? "Success! Continue"
                  : "Login"}
            </Text>
          </Pressable>

          {/* Links */}
          {!isDisabled && (
            <>
              <View className="my-4 border-b border-gray-300 flex-row items-center justify-between">
                <Pressable onPress={() => router.push("/screens/Register")}>
                  <Text className="text-center text-primary underline mt-4">
                    Don’t have an account? Register
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => router.push("/screens/ForgotPassword")}
                > 
                  <Text className="text-center text-primary underline mt-4">
                    Forgot Password?
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={() => router.push("/screens/Welcome")}
                className="flex-row items-center mt-4 justify-center"
              >
                <Ionicons name="arrow-back" size={20} color="black" />
                <Text className="text-primary ml-2">Back to Home</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
