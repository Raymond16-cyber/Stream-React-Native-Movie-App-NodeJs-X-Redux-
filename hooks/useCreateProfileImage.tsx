import { View, Text } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";

const useCreateProfileImage = () => {
  const [image, setImage] = useState<string | null>(null);
  const pickImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Permission is required to access photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [6, 5],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return {image, pickImage};
};

export default useCreateProfileImage;
