import { generateName } from "@/services/generatePlaceholderName";
import { RegisterUser } from "@/services/useAuth";
import { useDispatch } from "react-redux";
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
import { registerAction } from "@/store/actions/authAction";
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

const Register = () => {
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
    Alert.alert("Registration Submitted, heading to login page");
    // send data to backend here
    const { email, password } = data;
    const name = await generateName();
    const toSend = {
      email: email,
      password: password,
      name: name,
    };
    dispatch(registerAction(toSend));
    router.push("/screens/Login");
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
        <Text style={styles.pageHeaderText}>Create Account</Text>

        <View className="bg-white rounded-2xl p-6 shadow-lg">
          {/* Email Input */}
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
                    className="flex-1 text-gray-900"
                    placeholderTextColor="#999"
                  />

                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text className="text-blue-500 font-medium "></Text>
                  </TouchableOpacity>
                </View>
                {errors.email && (
                  <Text className="text-red-500 mt-1">
                    {errors.email.message}
                  </Text>
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
                    <Text className="text-blue-500 font-medium">
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

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            className="bg-primary py-3 rounded-lg items-center mb-4 mt-10"
          >
            <Text className="text-white font-bold text-lg">Register</Text>
          </Pressable>

          {/* Login Link */}
          <Pressable
            onPress={() => {
              router.push("/screens/Login");
            }}
          >
            <Text className="text-center text-primary underline">
              Already have an account? Login
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
