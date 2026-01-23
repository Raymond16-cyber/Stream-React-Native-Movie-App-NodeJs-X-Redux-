import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { router } from 'expo-router'

const Notifications = () => {
  type NotificationItem = {
    id: string
    type: 'message' | 'community' | 'system'
    title: string
    description: string
    time: string
    icon: string
  }

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

  const [recentNotifications, setRecentNotifications] = useState<NotificationItem[]>([{
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
  }])

  const toggleSetting = useCallback((key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }, [])

  const notificationCategories = useMemo(
    () => [
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
    ],
    []
  )

  const soundSettings = useMemo(
    () => [
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
    ],
    []
  )

  const handleClearAll = useCallback(() => {
    setRecentNotifications([])
  }, [])

  const handleDismiss = useCallback((id: string) => {
    setRecentNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }, [])

  const NotificationRow = ({
    icon,
    label,
    description,
    value,
    onToggle,
  }: {
    icon: string
    label: string
    description: string
    value: boolean
    onToggle: () => void
  }) => (
    <View className='bg-dark-100 rounded-2xl p-4 mb-3 flex-row items-center justify-between'>
      <View className='flex-row items-center flex-1 mr-3'>
        <View className='bg-accent/20 rounded-full p-3 mr-4'>
          <MaterialCommunityIcons name={icon as any} size={20} color='#FF8C42' />
        </View>
        <View className='flex-1'>
          <Text className='text-white font-semibold'>{label}</Text>
          <Text className='text-light-300 text-xs mt-1'>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#444', true: '#FF8C42' }}
        thumbColor={value ? '#fff' : '#ccc'}
      />
    </View>
  )

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
            <NotificationRow
              key={category.id}
              icon={category.icon}
              label={category.label}
              description={category.description}
              value={settings[category.key]}
              onToggle={() => toggleSetting(category.key)}
            />
          ))}
        </View>

        {/* Sound & Vibration */}
        <View className='px-4 mt-6'>
          <Text className='text-white text-lg font-bold mb-3'>Sound & Haptics</Text>
          {soundSettings.map((setting) => (
            <NotificationRow
              key={setting.id}
              icon={setting.icon}
              label={setting.label}
              description={setting.description}
              value={settings[setting.key]}
              onToggle={() => toggleSetting(setting.key)}
            />
          ))}
        </View>

        {/* Recent Notifications */}
        <View className='px-4 mt-6 mb-6'>
          <View className='flex-row items-center justify-between mb-3'>
            <Text className='text-white text-lg font-bold'>Recent Notifications</Text>
            <TouchableOpacity onPress={handleClearAll} disabled={!recentNotifications.length}>
              <Text
                className={`text-xs font-semibold ${recentNotifications.length ? 'text-accent' : 'text-light-400'}`}
              >
                Clear All
              </Text>
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
                <TouchableOpacity className='ml-2' onPress={() => handleDismiss(notif.id)}>
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