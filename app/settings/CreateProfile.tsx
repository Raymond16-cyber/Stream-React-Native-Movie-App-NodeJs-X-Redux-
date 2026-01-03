import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ProgressBarAndroidBase,
  ToastAndroid,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import {
  createProfileAction,
  deleteProfileAction,
} from "@/store/actions/userAction";
import { useAppDispatch, useAppSelector } from "@/store/hooks/useAppDispatch";
import { CreateProfileModal } from "@/components/User/Settings/CreateProfileModal";
import { AntDesign } from "@expo/vector-icons";
import useCreateProfileImage from "@/hooks/useCreateProfileImage";
import { CLEAR_ERRORS, CLEAR_SUCCESS_MESSAGE } from "@/store/types/type";

const SIZE = 128;

const Profiles = ({
  profile,
  user,
  setIsModalVisible,
  isModalVisible,
  showUpdateIcons,
  setShowUpdateIcons,
  deleteProfile,
  showSwitch,
  setShowSwitch,
  switchProfile
}: any) => {
  const isEditMode = showUpdateIcons === profile?._id;
  const isSwitchMode = showSwitch === profile?._id;

  return (
    <View style={{ width: "48%", alignItems: "center", padding: 20 }}>
      <View
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          borderWidth: 2,
          borderColor: "white",
          borderStyle: "dashed",
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {profile ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setShowUpdateIcons(isEditMode ? "none" : profile._id);
              setShowSwitch(isSwitchMode ? "none" : profile._id);
            }}
            style={{
              width: SIZE - 20,
              height: SIZE - 20,
              borderRadius: (SIZE - 20) / 2,
              position: "relative",
            }}
          >
            {/* IMAGE / INITIALS */}
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: (SIZE - 20) / 2,
                overflow: "hidden",
              }}
            >
              {(profile.user?.toString() === user?.id && profile.isMain) ||
              (profile.user === user?._id && profile.isMain) ? (
                <Image
                  source={{ uri: user.image }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              ) : profile.image ? (
                <Image
                  source={{ uri: profile.image }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#4b5563",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "white", fontSize: 28 }}>
                    {profile.name?.charAt(0)?.toUpperCase()}
                  </Text>
                </View>
              )}

              {/* DARK OVERLAY */}
              {isEditMode && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.6)",
                  }}
                />
              )}

              {/* CENTERED ICONS */}
              {isEditMode && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 30,
                  }}
                >
                  <TouchableOpacity>
                    <AntDesign name="edit" size={28} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <AntDesign
                      name="delete"
                      size={28}
                      color="red"
                      onPress={() => deleteProfile(profile._id)}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ) : (
          /* EMPTY SLOT */
          <TouchableOpacity
            onPress={() => setIsModalVisible(!isModalVisible)}
            style={{
              width: SIZE - 20,
              height: SIZE - 20,
              borderRadius: (SIZE - 20) / 2,
              backgroundColor: "#4b5563",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 40 }}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      {profile?.name && (
        <Text
          style={{ color: "white", marginTop: 8, fontSize: 16 }}
          numberOfLines={1}
        >
          {profile.name}
        </Text>
      )}
    </View>
  );
};

const CreateProfile = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showUpdateIcons, setShowUpdateIcons] = useState("none");
  const [showSwitch, setShowSwitch] = useState("none");
  const [name, setName] = useState("");
  const [creatingProfile, setCreatingProfile] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { image, pickImage, setImage } = useCreateProfileImage();
  const { message, error } = useAppSelector((state) => state.auth);

  const MAX_PROFILES = 4;
  const profiles = user?.profiles ?? [];

  const filledProfiles = [
    ...profiles,
    ...Array(MAX_PROFILES - profiles.length).fill(null),
  ];

  const createProfile = async () => {
    setCreatingProfile(true);
    if (profiles.length >= MAX_PROFILES) return;

    const formData = new FormData();
    formData.append("name", name);

    if (image) {
      formData.append("file", {
        uri: image,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);
    }

    await dispatch(createProfileAction(formData));

    setIsModalVisible(false);
    setName("");
    setImage(null);
    setCreatingProfile(false);
  };

  const deleteProfile = async (profileId: string) => {
    ToastAndroid.show("Deleting profile...", ToastAndroid.SHORT);
    await dispatch(deleteProfileAction(profileId));
  };

  const switchProfile = async () => {
    // implement switch profile logic here
    console.log("Switching to profile:", showUpdateIcons);
  }
  useEffect(() => {
    if (message) {
      ToastAndroid.show(message, ToastAndroid.SHORT);
      setTimeout(() => {
        dispatch({ type: CLEAR_SUCCESS_MESSAGE });
      }, 2000);
    }
    if (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT);
      setTimeout(() => {
        dispatch({ type: CLEAR_SUCCESS_MESSAGE });
      }, 3000);
    }
    if (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT);
      setTimeout(() => {
        dispatch({ type: CLEAR_ERRORS });
      }, 3000);
    }
  }, [message, error]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0f0d23",
        justifyContent: "center",
        paddingHorizontal: 30,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          rowGap: 40,
        }}
      >
        {filledProfiles.map((profile: any, index: number) => (
          <Profiles
            key={index}
            profile={profile}
            user={user}
            setIsModalVisible={setIsModalVisible}
            isModalVisible={isModalVisible}
            showUpdateIcons={showUpdateIcons}
            setShowUpdateIcons={setShowUpdateIcons}
            deleteProfile={deleteProfile}
            showSwitch={showSwitch}
            setShowSwitch={setShowSwitch}
            switchProfile={switchProfile}
          />
        ))}
      </View>
      {showSwitch !== "none" && (
        <View
          style={{
            position: "absolute",
            bottom: 30, // 👈 distance from bottom (adjust as needed)
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#1f2937",
              paddingVertical: 14,
              paddingHorizontal: 40,
              borderRadius: 30,
              elevation: 6, // Android shadow
            }}
          onPress={switchProfile}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              Switch
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {isModalVisible && (
        <CreateProfileModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSubmit={createProfile}
          name={name}
          setName={setName}
          image={image}
          pickImage={pickImage}
          profiles={filledProfiles}
          creatingProfile={creatingProfile}
        />
      )}
    </View>
  );
};

export default CreateProfile;
