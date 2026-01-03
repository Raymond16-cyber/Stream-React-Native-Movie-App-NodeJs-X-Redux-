import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { icons } from "@/constants/icons";

export const CreateProfileModal = ({
  visible,
  onClose,
  onSubmit,
  name,
  setName,
  image,
  pickImage,
  profiles,
  creatingProfile,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  name: string;
  setName: (name: string) => void;
  image?: string | null;
  pickImage?: () => void;
  profiles: any[];
  creatingProfile: boolean;
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center ">
        {creatingProfile ? (
          <View
            className="bg-dark-100 w-80 rounded-xl p-5"
            style={{ padding: 20, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }}
          >
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white text-lg mt-4">Please wait a while...</Text>
          </View>
        ) : (
          <View
            className="bg-dark-100 w-80 rounded-xl p-5"
            style={{ padding: 20 }}
          >
            <Text className="text-white text-lg mb-4">Create Profile</Text>

            <View className="bg-gray-800 h-24 w-24 mb-4 rounded-lg justify-center items-center">
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: 100, height: 100 }}
                />
              ) : (
                <TouchableOpacity
                  onPress={pickImage}
                  activeOpacity={0.7}
                  style={{
                    position: "relative",
                    borderWidth: 2,
                    borderColor: "white",
                    borderRadius: 70,
                    width: 100,
                    height: 100,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={icons.person}
                    style={{
                      tintColor: "white",
                      width: 100,
                      height: 100,
                      borderRadius: 70,
                    }}
                  />

                  {/* Dark overlay */}
                  <View
                    pointerEvents="none" // 🔥 THIS IS THE KEY
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      borderRadius: 70,
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Profile name"
              placeholderTextColor="#aaa"
              className="bg-black text-white p-3 rounded-lg mb-4"
            />

            <View className="flex-row justify-between">
              <TouchableOpacity onPress={onClose}>
                <Text className="text-gray-400">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  onSubmit();
                  setName("");
                }}
              >
                <Text className="text-white font-semibold">Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};
