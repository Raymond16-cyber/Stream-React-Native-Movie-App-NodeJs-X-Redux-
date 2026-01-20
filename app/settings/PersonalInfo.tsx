import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { router } from 'expo-router'
import { useAuth } from '@/Contexts/AuthContext'

const PersonalInfo = () => {
  const { user } = useAuth()

  const userInfo = [
    {
      label: 'Email',
      value: user?.email || 'Not provided',
      icon: 'email',
    },
    {
      label: 'Phone',
      value: '+1 (555) 123-4567',
      icon: 'phone',
    },
    {
      label: 'Location',
      value: 'United States',
      icon: 'map-marker',
    },
    {
      label: 'Member Since',
      value: 'January 2024',
      icon: 'calendar',
    },
    {
      label: 'Account Status',
      value: 'Active',
      icon: 'check-circle',
      valueColor: '#4ADE80',
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
          <Text className='text-white text-2xl font-bold'>Personal Info</Text>
        </View>

        {/* Profile Section */}
        <View className='px-4 mt-4'>
          <View className='bg-dark-100 rounded-3xl p-6 items-center'>
            <Image
              source={{ uri: user?.image || 'https://i.pravatar.cc/150?img=5' }}
              className='w-24 h-24 rounded-full mb-4 bg-light-300/20'
            />
            <Text className='text-white text-2xl font-bold text-center'>{user?.name || 'User'}</Text>
            <Text className='text-light-300 text-sm mt-1'>{user?.email || 'No email'}</Text>
            <View className='flex-row gap-2 mt-4'>
              <View className='bg-accent/20 rounded-full px-3 py-1'>
                <Text className='text-accent text-xs font-semibold'>Verified</Text>
              </View>
              <View className='bg-green-500/20 rounded-full px-3 py-1'>
                <Text className='text-green-400 text-xs font-semibold'>Active</Text>
              </View>
            </View>
          </View>
        </View>

        {/* User Details */}
        <View className='px-4 mt-6'>
          <Text className='text-white text-lg font-bold mb-3'>Account Details</Text>
          {userInfo.map((info, index) => (
            <View key={index} className='bg-dark-100 rounded-2xl p-4 mb-3 flex-row items-center'>
              <View className='bg-accent/20 rounded-full p-3 mr-4'>
                <MaterialCommunityIcons name={info.icon as any} size={20} color='#FF8C42' />
              </View>
              <View className='flex-1'>
                <Text className='text-light-300 text-xs font-semibold'>{info.label}</Text>
                <Text className={`text-base font-semibold mt-1 ${info.valueColor ? 'text-[' + info.valueColor + ']' : 'text-white'}`}>
                  {info.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Stats Section */}
        <View className='px-4 mt-6 mb-6'>
          <Text className='text-white text-lg font-bold mb-3'>Statistics</Text>
          <View className='flex-row gap-3'>
            <View className='flex-1 bg-dark-100 rounded-2xl p-4 items-center'>
              <Text className='text-accent text-2xl font-bold'>12</Text>
              <Text className='text-light-300 text-xs mt-2 text-center'>Communities Joined</Text>
            </View>
            <View className='flex-1 bg-dark-100 rounded-2xl p-4 items-center'>
              <Text className='text-accent text-2xl font-bold'>347</Text>
              <Text className='text-light-300 text-xs mt-2 text-center'>Messages Sent</Text>
            </View>
            <View className='flex-1 bg-dark-100 rounded-2xl p-4 items-center'>
              <Text className='text-accent text-2xl font-bold'>89</Text>
              <Text className='text-light-300 text-xs mt-2 text-center'>Hours Watched</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PersonalInfo