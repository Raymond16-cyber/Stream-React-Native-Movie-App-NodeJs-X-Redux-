import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authForgetPasswordAction } from "@/store/actions/authAction";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";

type FormData = {
  email: string;
};

const schema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const dispatch = useAppDispatch();

  const onSubmit = async (data: FormData) => {
    await dispatch(authForgetPasswordAction(data.email));
  };

  return (
    <SafeAreaView
      className="flex-1 bg-primary"
      style={{
        paddingHorizontal: 20,
        justifyContent: "center",
      }}
    >
      <View className="bg-white rounded-3xl px-6  shadow-lg" style={{ paddingVertical: 40 }}>
        {/* EMAIL INPUT */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value, onBlur } }) => (
            <View>
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-white text-gray-900 px-4 py-4 rounded-xl border border-gray-300"
                placeholderTextColor="#9ca3af"
              />

              {errors.email && (
                <Text className="text-red-500 text-sm mt-2">
                  {errors.email.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* SUBMIT BUTTON */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="bg-black py-4 rounded-xl mt-6"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center font-semibold text-base">
            {isSubmitting ? "Sending..." : "Reset Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
