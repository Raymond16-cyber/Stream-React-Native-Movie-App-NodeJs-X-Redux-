import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { router } from 'expo-router'

const Notifications = () => {
  const [settings, setSettings] = useState({
    messageNotifications: true,
    communityUpdates: true,
    friendRequests: true,
    systemAlerts: true,
    emailNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
    doNotDisturb: false,
  })

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const notificationCategories = [
    {
      id: 'messages',
      label: 'Message Notifications',
      description: 'Get notified when you receive new messages',
      icon: 'message-text',
      key: 'messageNotifications' as const,
    },
    {
      id: 'communities',
      label: 'Community Updates',
      description: 'Get notified about community activities',
      icon: 'account-group',
      key: 'communityUpdates' as const,
    },
    {
      id: 'friends',
      label: 'Friend Requests',
      description: 'Get notified about new friend requests',
      icon: 'account-plus',
      key: 'friendRequests' as const,
    },
    {
      id: 'system',
      label: 'System Alerts',
      description: 'Important app updates and alerts',
      icon: 'bell-alert',
      key: 'systemAlerts' as const,
    },
  ]

  const soundSettings = [
    {
      id: 'sound',
      label: 'Sound',
      description: 'Play sound on new notifications',
      icon: 'volume-high',
      key: 'soundEnabled' as const,
    },
    {
      id: 'vibration',
      label: 'Vibration',
      description: 'Vibrate on new notifications',
      icon: 'vibrate',
      key: 'vibrationEnabled' as const,
    },
    {
      id: 'dnd',
      label: 'Do Not Disturb',
      description: 'Silence all notifications until disabled',
      icon: 'moon',
      key: 'doNotDisturb' as const,
    },
  ]

  const recentNotifications = [
    {
      id: '1',
      type: 'message',
      title: 'New message from Alex',
      description: 'Hey, how are you doing?',
      time: '5 min ago',
      icon: 'message-text',
    },
    {
      id: '2',
      type: 'community',
      title: 'New post in Movie Lovers',
      description: 'Check out the latest discussion',
      time: '1 hour ago',
      icon: 'account-group',
    },
    {
      id: '3',
      type: 'system',
      title: 'App update available',
      description: 'Version 2.1.0 is now available',
      time: '3 hours ago',
      icon: 'bell-alert',
    },
  ]

  return (
    <SafeAreaView className='bg-primary flex-1'>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className='px-4 py-4 flex-row items-center'>
          <TouchableOpacity onPress={() => router.back()} className='mr-3'>
            <Ionicons name='chevron-back' size={24} color='#ffffff' />
          </TouchableOpacity>
          <Text className='text-white text-2xl font-bold'>Notifications</Text>
        </View>

        {/* Notification Categories */}
        <View className='px-4 mt-4'>
          <Text className='text-white text-lg font-bold mb-3'>Notification Types</Text>
          {notificationCategories.map((category) => (
            <View
              key={category.id}
              className='bg-dark-100 rounded-2xl p-4 mb-3 flex-row items-center justify-between'
            >
              <View className='flex-row items-center flex-1 mr-3'>
                <View className='bg-accent/20 rounded-full p-3 mr-4'>
                  <MaterialCommunityIcons name={category.icon as any} size={20} color='#FF8C42' />
                </View>
                <View className='flex-1'>
                  <Text className='text-white font-semibold'>{category.label}</Text>
                  <Text className='text-light-300 text-xs mt-1'>{category.description}</Text>
                </View>
              </View>
              <Switch
                value={settings[category.key]}
                onValueChange={() => toggleSetting(category.key)}
                trackColor={{ false: '#444', true: '#FF8C42' }}
                thumbColor={settings[category.key] ? '#fff' : '#ccc'}
              />
            </View>
          ))}
        </View>

        {/* Sound & Vibration */}
        <View className='px-4 mt-6'>
          <Text className='text-white text-lg font-bold mb-3'>Sound & Haptics</Text>
          {soundSettings.map((setting) => (
            <View
              key={setting.id}
              className='bg-dark-100 rounded-2xl p-4 mb-3 flex-row items-center justify-between'
            >
              <View className='flex-row items-center flex-1 mr-3'>
                <View className='bg-accent/20 rounded-full p-3 mr-4'>
                  <MaterialCommunityIcons name={setting.icon as any} size={20} color='#FF8C42' />
                </View>
                <View className='flex-1'>
                  <Text className='text-white font-semibold'>{setting.label}</Text>
                  <Text className='text-light-300 text-xs mt-1'>{setting.description}</Text>
                </View>
              </View>
              <Switch
                value={settings[setting.key]}
                onValueChange={() => toggleSetting(setting.key)}
                trackColor={{ false: '#444', true: '#FF8C42' }}
                thumbColor={settings[setting.key] ? '#fff' : '#ccc'}
              />
            </View>
          ))}
        </View>

        {/* Recent Notifications */}
        <View className='px-4 mt-6 mb-6'>
          <View className='flex-row items-center justify-between mb-3'>
            <Text className='text-white text-lg font-bold'>Recent Notifications</Text>
            <TouchableOpacity>
              <Text className='text-accent text-xs font-semibold'>Clear All</Text>
            </TouchableOpacity>
          </View>
          {recentNotifications.length > 0 ? (
            recentNotifications.map((notif) => (
              <View
                key={notif.id}
                className='bg-dark-100 rounded-2xl p-4 mb-3 flex-row items-start'
              >
                <View className='bg-accent/20 rounded-full p-3 mr-4'>
                  <MaterialCommunityIcons name={notif.icon as any} size={20} color='#FF8C42' />
                </View>
                <View className='flex-1'>
                  <Text className='text-white font-semibold'>{notif.title}</Text>
                  <Text className='text-light-300 text-xs mt-1'>{notif.description}</Text>
                  <Text className='text-light-400 text-xs mt-2'>{notif.time}</Text>
                </View>
                <TouchableOpacity className='ml-2'>
                  <Ionicons name='close-circle' size={20} color='#9CA4AB' />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View className='bg-dark-100 rounded-2xl p-6 items-center'>
              <MaterialCommunityIcons name='bell-outline' size={40} color='#9CA4AB' />
              <Text className='text-light-300 mt-2'>No notifications</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Notifications