import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, ToastAndroid } from "react-native";
import { useLocalSearchParams, useRouter, } from "expo-router";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
      return;
    }
    if (password !== confirmPassword) {
      ToastAndroid.show("Passwords do not match", ToastAndroid.SHORT);
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${process.env.BACKEND_URL}/auth/reset-password`, {
        token,
        password,
      });
      ToastAndroid.show("Password reset successfully", ToastAndroid.SHORT);
      router.replace("/screens/Login");
    } catch (err: any) {
      ToastAndroid.show(err.response?.data?.error || "Failed to reset password", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: "#0f0d23",
      }}
    >
      <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 20 }}>
        <TextInput
          placeholder="New password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 12 }}
        />
        <TextInput
          placeholder="Confirm password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={{ padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 20 }}
        />
        <TouchableOpacity
          onPress={handleReset}
          disabled={loading}
          style={{
            backgroundColor: "#007BFF",
            paddingVertical: 14,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
            {loading ? "Resetting..." : "Reset Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetPassword;
