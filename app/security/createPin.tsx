import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { createSecurityPinAction } from "@/store/actions/authAction";
import { useAppDispatch, useAppSelector } from "@/store/hooks/useAppDispatch";
import { RootState } from "@/store/store";
import { router } from "expo-router";

const createPin = () => {
  const dispatch = useAppDispatch();
  const { error, message } = useAppSelector((state: RootState) => state.auth);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [toConfirm, setToConfirm] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const validatePin = async () => {
    if (pin === confirmPin) {
      // save pin securely
      console.log("PIN set successfully");
      await dispatch(createSecurityPinAction(pin));
    }
    setConfirmError(pin !== confirmPin);
  };
  useEffect(() => {
    if (message) {
      // reset states on success
      setPin("");
      setConfirmPin("");
      setToConfirm(false);
    }
    if(error){
        Alert.alert("Error",error);
    }
  }, [message, error]);
  return toConfirm ? (
    <View className="flex-1 items-center justify-center bg-primary">
      <Text className="text-white text-xl mb-4">Confirm Security PIN</Text>

      <TextInput
        value={confirmPin}
        onChangeText={(text) => {
          // hard filter: only digits
          const numeric = text.replace(/[^0-9]/g, "");
          setConfirmPin(numeric);
        }}
        keyboardType="number-pad"
        inputMode="numeric"
        secureTextEntry
        maxLength={4}
        textAlign="center"
        className="bg-dark-100 text-white p-4 rounded-lg w-40 text-center"
        style={{
          letterSpacing: 10,
          paddingVertical: 12,
          paddingHorizontal: 7,
          width: 120,
        }}
      />
      {confirmError && (
        <Text className="text-red-500 mt-2">
          PINs do not match. Please try again.
        </Text>
      )}

      <TouchableOpacity
        onPress={validatePin}
        className="mt-4 bg-white px-10 rounded-lg"
        style={{ paddingVertical: 12, paddingHorizontal: 20 }}
      >
        <Text className="text-black font-semibold">Confirm</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View className="flex-1 items-center justify-center bg-primary">
      <Text className="text-white text-xl mb-4">Create A Security PIN</Text>

      <TextInput
        value={pin}
        onChangeText={(text) => {
          // hard filter: only digits
          const numeric = text.replace(/[^0-9]/g, "");
          setPin(numeric);
        }}
        keyboardType="number-pad"
        inputMode="numeric"
        secureTextEntry
        maxLength={4}
        textAlign="center"
        className="bg-dark-100 text-white p-4 rounded-lg w-40 text-center"
        style={{
          letterSpacing: 10,
          paddingVertical: 12,
          paddingHorizontal: 7,
          width: 120,
        }}
      />

      <TouchableOpacity
        onPress={setToConfirm.bind(this, true)}
        className="mt-4 bg-white px-10 rounded-lg"
        style={{ paddingVertical: 12, paddingHorizontal: 20 }}
      >
        <Text className="text-black font-semibold">Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default createPin;
