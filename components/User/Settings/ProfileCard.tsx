import { View, Text, Image, Pressable } from "react-native";

const SIZE = 128;

type Props = {
  profile?: any;
  onAdd?: () => void;
};

export const ProfileCard = ({ profile, onAdd }: Props) => {
  return (
    <View style={{ width: SIZE, alignItems: "center" }}>
      <Pressable
        onPress={!profile ? onAdd : undefined}
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          borderWidth: 2,
          borderStyle: "dashed",
          borderColor: "white",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {profile?.image ? (
          <Image
            source={{ uri: profile.image }}
            style={{
              width: SIZE - 10,
              height: SIZE - 10,
              borderRadius: (SIZE - 10) / 2,
            }}
          />
        ) : (
          <Text style={{ fontSize: 42, color: "white" }}>+</Text>
        )}
      </Pressable>

      {profile?.name && (
        <Text
          style={{ color: "white", marginTop: 8 }}
          numberOfLines={1}
        >
          {profile.name}
        </Text>
      )}
    </View>
  );
};
