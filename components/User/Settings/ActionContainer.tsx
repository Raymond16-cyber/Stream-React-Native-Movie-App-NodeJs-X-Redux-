import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import { toggleMultiProfileAction } from "@/store/actions/userAction";

type ActionProps = {
  modeenabled: boolean;
  setModeEnabled: (value: boolean) => void;
  multiProfileEnabled: boolean;
  setMultiProfileEnabled: (value: boolean) => void;
  handleToggleMultiProfile: () => void;
};

type ButtonNavProps = {
  Icon: any;
  name: string;
  text?: string;
  isTheme?: boolean;
  isMultiProfile?: boolean;
  enabled?: boolean;
  onToggle?: () => void;
};

const ButtonNav = ({
  Icon,
  name,
  text,
  isTheme,
  isMultiProfile,
  enabled,
  onToggle,
}: ButtonNavProps) => (
  <TouchableOpacity
    className="flex flex-row items-center justify-between"
    style={{ padding: 10 }}
    activeOpacity={0.8}
  >
    <View className="flex flex-row items-center gap-x-4">
      <Icon name={name} size={24} color="white" />
      {isTheme ? (
        <Text className="text-white">
          {enabled ? "Dark Mode" : "Light Mode"}
        </Text>
      ) : (
        <Text className="text-white">{text}</Text>
      )}
    </View>

    <View className="flex flex-row items-center">
      {isTheme || isMultiProfile ? (
        <Switch value={enabled} onValueChange={onToggle} />
      ) : (
        <Ionicons name="chevron-forward" size={24} color="white" />
      )}
    </View>
  </TouchableOpacity>
);

const ActionContainer = ({
  modeenabled,
  setModeEnabled,
  multiProfileEnabled,
  handleToggleMultiProfile
}: ActionProps) => {
  return (
    <View className="flex flex-col">
      {/* Personal Info */}
      <View className="px-2 mt-4 flex flex-col bg-dark-100" style={{ padding: 20 }}>
        <Text className="text-white mb-2 text-2xl">Personal Info</Text>

        <ButtonNav
          Icon={MaterialCommunityIcons}
          name="account"
          text="Personal Info"
        />
        <ButtonNav Icon={Feather} name="bell" text="Notifications" />
        <ButtonNav
          Icon={FontAwesome6}
          name="ticket"
          text="Vouchers / Discounts"
        />
        <ButtonNav
          Icon={FontAwesome}
          name="credit-card"
          text="Payment Method"
        />
      </View>

      {/* Profile */}
      <View className="px-2 mt-4 flex flex-col bg-dark-100" style={{ padding: 20 }}>
        <Text className="text-white mb-2 text-2xl">Profile</Text>

        <ButtonNav
          Icon={AntDesign}
          name="deployment-unit"
          isMultiProfile
          text="Enable Multi Profiles"
          enabled={multiProfileEnabled}
          onToggle={handleToggleMultiProfile}
        />

        <ButtonNav
          Icon={AntDesign}
          name="question-circle"
          text="Help Center"
        />
      </View>

      {/* Security */}
      <View className="px-2 mt-4 flex flex-col bg-dark-100" style={{ padding: 20 }}>
        <Text className="text-white mb-2 text-2xl">Security</Text>

        <ButtonNav Icon={Feather} name="shield" text="Security" />
        <ButtonNav Icon={Entypo} name="language" text="Language" />

        <ButtonNav
          Icon={AntDesign}
          name={modeenabled ? "moon" : "sun"}
          isTheme
          enabled={modeenabled}
          onToggle={() => setModeEnabled(!modeenabled)}
        />

        <ButtonNav
          Icon={AntDesign}
          name="question-circle"
          text="Help Center"
        />
      </View>
    </View>
  );
};

export default ActionContainer;
