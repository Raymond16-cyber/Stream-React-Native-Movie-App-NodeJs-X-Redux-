import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ProgressBarAndroidBase,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import {
  createProfileAction,
  deleteProfileAction,
  editProfileImageAction,
} from "@/store/actions/userAction";
import { useAppDispatch, useAppSelector } from "@/store/hooks/useAppDispatch";
import { CreateProfileModal } from "@/components/User/Settings/CreateProfileModal";
import { AntDesign } from "@expo/vector-icons";
import useCreateProfileImage from "@/hooks/useCreateProfileImage";

const SIZE = 128;

const Profiles = ({
  profile,
  user,
  setIsModalVisible,
  isModalVisible,
  showUpdateIcons,
  setShowUpdateIcons,
  deleteProfile,
}: any) => {
  const isEditMode = showUpdateIcons === profile?._id;

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
            onPress={() =>
              setShowUpdateIcons(isEditMode ? "none" : profile._id)
            }
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
  const [name, setName] = useState("");
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { image, pickImage } = useCreateProfileImage();
  const { message, error } = useAppSelector((state) => state.auth);

  const MAX_PROFILES = 4;
  const profiles = user?.profiles ?? [];

  const filledProfiles = [
    ...profiles,
    ...Array(MAX_PROFILES - profiles.length).fill(null),
  ];

  const createProfile = async () => {
    if (profiles.length >= MAX_PROFILES) return;

    const createdProfile = await dispatch(
      createProfileAction({ name, image: "" })
    );

    
    if (image && createdProfile?._id) {
      const formData = new FormData();

      formData.append("file", {
        uri: image,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);

      await dispatch(editProfileImageAction(formData, createdProfile._id));
    }

    setIsModalVisible(false);
    setName("");
  };

  const deleteProfile = async (profileId: string) => {
    ToastAndroid.show("Deleting profile...", ToastAndroid.SHORT);
    await dispatch(deleteProfileAction(profileId));
  };

  useEffect(() => {
    if (message) {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
    if (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT);
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
          />
        ))}
      </View>

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
        />
      )}
    </View>
  );
};

export default CreateProfile;
