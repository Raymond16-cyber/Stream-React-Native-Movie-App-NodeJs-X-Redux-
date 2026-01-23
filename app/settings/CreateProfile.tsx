import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import {
  createProfileAction,
  deleteProfileAction,
  switchProfileAction,
} from "@/store/actions/userAction";
import { useAppDispatch, useAppSelector } from "@/store/hooks/useAppDispatch";
import { CreateProfileModal } from "@/components/User/Settings/CreateProfileModal";
import { AntDesign } from "@expo/vector-icons";
import useCreateProfileImage from "@/hooks/useCreateProfileImage";
import { CLEAR_ERRORS, CLEAR_SUCCESS_MESSAGE } from "@/store/types/type";

const SIZE = 128;
const MAX_PROFILES = 4;

// ---------------- PROFILE CARD ----------------
const ProfileCard = ({
  profile,
  user,
  showUpdateIcons,
  showSwitch,
  setShowUpdateIcons,
  setShowSwitch,
  deleteProfile,
  onAddProfile,
}: any) => {
  const isKids = profile?.isKids ?? false;
  const isEditMode = profile && !isKids && showUpdateIcons === profile._id;
  const isSwitchMode = profile && showSwitch === profile._id;

  return (
    <View style={{ width: "48%", alignItems: "center", padding: 10 }}>
      {/* MAIN TAG */}
      {profile?.isMain && (
        <View
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "#2563eb",
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 12,
            zIndex: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 0.5,
            }}
          >
            MAIN
          </Text>
        </View>
      )}

      {/* PROFILE IMAGE */}
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
              // ✅ Only allow adults to go into edit mode
              if (!isKids) {
                setShowUpdateIcons(isEditMode ? "none" : profile._id);
              }
              // Everyone can switch
              setShowSwitch(isSwitchMode ? "none" : profile._id);
            }}
            style={{
              width: SIZE - 20,
              height: SIZE - 20,
              borderRadius: (SIZE - 20) / 2,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* IMAGE OR INITIAL */}
            {profile.image ? (
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

            {/* EDIT MODE OVERLAY (Adults only) */}
            {isEditMode && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 30,
                }}
              >
                <TouchableOpacity>
                  <AntDesign name="edit" size={28} color="white" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteProfile(profile._id)}>
                  <AntDesign name="delete" size={28} color="red" />
                </TouchableOpacity>
              </View>
            )}

            {/* SWITCH INDICATOR */}
            {user?.currentProfile?._id === profile._id && !isEditMode && (
              <View
                style={{
                  position: "absolute",
                  bottom: 6,
                  right: 6,
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: "#22c55e",
                  borderWidth: 2,
                  borderColor: "white",
                  zIndex: 20,
                }}
              />
            )}
          </TouchableOpacity>
        ) : (
          // EMPTY SLOT
          <TouchableOpacity
            style={{
              width: SIZE - 20,
              height: SIZE - 20,
              borderRadius: (SIZE - 20) / 2,
              backgroundColor: "#4b5563",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={onAddProfile}
          >
            <Text style={{ color: "white", fontSize: 40 }}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* PROFILE NAME */}
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

// ---------------- CREATE PROFILE PAGE ----------------
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

  const profiles = user?.profiles ?? [];
  const filledProfiles = [
    ...profiles,
    ...Array(MAX_PROFILES - profiles.length).fill(null),
  ];

  const showToast = (msg: string) => {
    if (Platform.OS === "android") {
      // Native Android toast
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { ToastAndroid } = require("react-native");
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert("", msg);
    }
  };

  // CREATE PROFILE
  const createProfile = async () => {
    if (!name.trim()) {
      showToast("Please enter a name");
      return;
    }

    if (profiles.length >= MAX_PROFILES) {
      showToast("Maximum profiles reached");
      return;
    }

    setCreatingProfile(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());

      if (image) {
        formData.append("file", {
          uri: image.startsWith("file://") ? image : `file://${image}`,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);
      }

      await dispatch(createProfileAction(formData));

      showToast("Profile created!");
      setIsModalVisible(false);
      setName("");
      setImage(null);
    } catch (err) {
      showToast("Failed to create profile");
    } finally {
      setCreatingProfile(false);
    }
  };

  // DELETE PROFILE
  const deleteProfile = async (profileId: string) => {
    showToast("Deleting profile...");
    await dispatch(deleteProfileAction(profileId));
  };

  // SWITCH PROFILE
  const switchProfile = async () => {
    if (showSwitch === "none" || showSwitch === user?.currentProfile?._id) {
      showToast("Profile already active");
      return;
    }

    await dispatch(switchProfileAction({ profileId: showSwitch }));
  };

  // TOAST FOR SUCCESS/ERROR
  useEffect(() => {
    if (message) {
      showToast(message);
      setTimeout(() => dispatch({ type: CLEAR_SUCCESS_MESSAGE }), 2000);
    }
    if (error) {
      showToast(error);
      setTimeout(() => dispatch({ type: CLEAR_ERRORS }), 3000);
    }
  }, [message, error]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0f0d23",
        justifyContent: "center",
        paddingHorizontal: 20,
      }}
    >
      {/* PROFILES GRID */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          rowGap: 40,
        }}
      >
        {filledProfiles.map((profile: any, index: number) => (
          <ProfileCard
            key={profile?._id || `empty-${index}`}
            profile={profile}
            user={user}
            showUpdateIcons={showUpdateIcons}
            showSwitch={showSwitch}
            setShowUpdateIcons={setShowUpdateIcons}
            setShowSwitch={setShowSwitch}
            deleteProfile={deleteProfile}
            onAddProfile={() => setIsModalVisible(true)}
          />
        ))}
      </View>

      {/* SWITCH BUTTON */}
      {showSwitch !== "none" && (
        <View
          style={{
            position: "absolute",
            bottom: 30,
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
              elevation: 6,
            }}
            onPress={switchProfile}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              Switch
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CREATE PROFILE MODAL */}
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
