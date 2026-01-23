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
import { router } from "expo-router";

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
  isLocked?: boolean;
  enabled?: boolean;
  onPress?: () => void;
  onToggle?: () => void;
};

const ButtonNav = ({
  Icon,
  name,
  text,
  isTheme,
  isMultiProfile,
  isLocked,
  enabled,
  onToggle,
  onPress
}: ButtonNavProps) => (
  <TouchableOpacity
    className="flex flex-row items-center justify-between rounded-2xl bg-white/6 border border-white/10"
    style={{ paddingVertical: 12, paddingHorizontal: 12, marginVertical: 4 }}
    activeOpacity={0.85}
    onPress={isLocked ? undefined : onPress}
  >
    <View className="flex flex-row items-center gap-x-3">
      <View className="p-2 rounded-xl bg-white/10">
        <Icon name={name} size={20} color="white" />
      </View>
      {isTheme ? (
        <Text className="text-white font-semibold text-base">
          {enabled ? "Dark Mode" : "Light Mode"}
        </Text>
      ) : (
        <Text className="text-white font-semibold text-base">{text}</Text>
      )}
    </View>

    <View className="flex flex-row items-center">
      {isTheme || isMultiProfile ? (
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: "#4b5563", true: "#8b5cf6" }}
          thumbColor={enabled ? "#f9fafb" : "#d1d5db"}
        />
      ) : isLocked ? (
        <Ionicons name="lock-closed" size={18} color="white" />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="white" />
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
    <View className="flex flex-col gap-4">
      {/* Personal Info */}
      <View className="bg-white/6 rounded-3xl p-4 border border-white/10">
        <Text className="text-white mb-2 text-xl font-semibold">Personal</Text>

        <ButtonNav
          Icon={MaterialCommunityIcons}
          name="account"
          text="Personal Info"
          onPress={() => router.push("/settings/PersonalInfo")}
        />
        <ButtonNav Icon={Feather} name="bell" text="Notifications" onPress={() => router.push("/settings/Notifications")} />
        <ButtonNav
          Icon={FontAwesome6}
          name="ticket"
          text="Vouchers / Discounts"
          onPress={() => router.push("/settings/DiscountCodes")}
        />
        <ButtonNav
          Icon={FontAwesome}
          name="credit-card"
          text="Payment Method"
          onPress={() => router.push("/settings/PaymentMethod")}
        />
      </View>

      {/* Profile */}
      <View className="bg-white/6 rounded-3xl p-4 border border-white/10">
        <Text className="text-white mb-2 text-xl font-semibold">Profile</Text>

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
          name="star"
          text="Upgrade my account"
          onPress={() => router.push("/settings/AccountUpgrade")}
        />
      </View>

      {/* Security */}
      <View className="bg-white/6 rounded-3xl p-4 border border-white/10">
        <Text className="text-white mb-2 text-xl font-semibold">Security</Text>

        <ButtonNav Icon={Feather} name="shield" text="Security" onPress={() => router.push("/settings/Security")} />
        <ButtonNav Icon={Entypo} name="language" text="Language" onPress={() => router.push("/settings/Languages")} />

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
          onPress={() => router.push("/customer-services/customer-care")}
          isLocked
        />
      </View>
    </View>
  );
};

export default ActionContainer;
