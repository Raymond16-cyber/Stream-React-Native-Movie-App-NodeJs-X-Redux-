// this file removes the defualt header that hs the file's name on them

import { icons } from "@/constants/icons";
import { useAuth } from "@/Contexts/AuthContext";
import { Tabs } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

type Props = {
  icon: any;
  name: string;
  focused: boolean;
};

const TabIcon = ({ icon, name, focused }: Props) => {
  return focused ? (
    <View
      className="flex flex-row w-full flex-1 min-w-[112px] min-h-16
 mt-4 justify-center items-center bg-accent rounded-full overflow-hidden"
    >
      <Image source={icon} className="size-7" />
      <Text className="text-secondary text-base font-semibold">{name}</Text>
    </View>
  ) : (
    <View className="flex size-full justify-center items-center mt-4 rounded-full ">
      <Image source={icon}  tintColor="#A8B5DB" style={{ width: 28, height: 30 }} />
    </View>
  );
}; 

const _layout = () => {
  const { user } = useAuth();
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#0f0d23",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 53,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#0f0d23",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.home} name="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.search} name="Search" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          headerShown: false,
          title: "Saved",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.save} name="Saved" focused={focused} />
          ),
        }}
      />
      {
        // Only show Community tab for logged-in users whose current profile is NOT a kid
        user && user.currentProfile && !user.currentProfile.isKid && (
          <Tabs.Screen
            name="community"
            options={{
              headerShown: false,
              title: "Community",
              tabBarIcon: ({ focused }) => (
                <TabIcon icon={icons.community} name="Community" focused={focused} />
              ),
            }}
          />
        )
      }
      
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.person} name="Account" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
