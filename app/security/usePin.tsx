import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { usePinSecurity } from "@/Contexts/PinSecurityContext";
import { useAuth } from "@/Contexts/AuthContext";
import { useFocusEffect } from "expo-router";

const UsePin = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const { resolve } = usePinSecurity();
  const { user } = useAuth();

  const validatePin = () => {
    const truce = pin === user.securityPin;
    if (truce) {
      resolve(pin === user.securityPin);
    } else {
      setError(new Error("Invalid PIN"));
    }
  };
  useFocusEffect(
    () => {
      return () => {
        // user left without confirming → deny
        resolve(false);
      };
    }
  );

  return (
    <View className="flex-1 items-center justify-center bg-primary">
      <Text className="text-white text-xl mb-4">Enter PIN</Text>

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
      {error && <Text className="text-red-500 mt-2">{error.message}</Text>}

      <TouchableOpacity
        onPress={validatePin}
        className="mt-4 bg-white px-10 rounded-lg"
        style={{ paddingVertical: 12, paddingHorizontal: 20 }}
      >
        <Text className="text-black font-semibold">Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UsePin;
