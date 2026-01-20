import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { router } from 'expo-router'

const AccountUpgrade = () => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')

  const premiumFeatures = [
    {
      icon: 'crown',
      title: 'Ad-Free Experience',
      description: 'Enjoy streaming without interruptions',
    },
    {
      icon: 'quality-high',
      title: '4K Ultra HD Quality',
      description: 'Watch movies in stunning quality',
    },
    {
      icon: 'download',
      title: 'Offline Downloads',
      description: 'Download and watch anywhere',
    },
    {
      icon: 'account-group',
      title: 'Unlimited Communities',
      description: 'Create and join unlimited communities',
    },
    {
      icon: 'play-speed',
      title: 'Early Access',
      description: 'Get new features before everyone else',
    },
    {
      icon: 'shield-check',
      title: 'Priority Support',
      description: '24/7 dedicated customer support',
    },
  ]

  const plans = {
    monthly: {
      price: '$9.99',
      period: 'month',
      savings: null,
    },
    yearly: {
      price: '$99.99',
      period: 'year',
      savings: 'Save $20',
    },
  }

  const handleUpgrade = () => {
    // Placeholder for payment integration
    alert(`Upgrading to ${selectedPlan} plan...`)
  }

  return (
    <SafeAreaView className='bg-primary flex-1'>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className='px-4 py-4 flex-row items-center'>
          <TouchableOpacity onPress={() => router.back()} className='mr-3'>
            <Ionicons name='chevron-back' size={24} color='#ffffff' />
          </TouchableOpacity>
          <Text className='text-white text-2xl font-bold'>Upgrade Account</Text>
        </View>

        {/* Hero Section */}
        <View className='px-4 mt-2'>
          <View className='bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl p-6 items-center bg-accent/10'>
            <View className='bg-accent rounded-full p-4 mb-4'>
              <MaterialCommunityIcons name='crown' size={40} color='#000' />
            </View>
            <Text className='text-white text-2xl font-bold text-center'>Go Premium</Text>
            <Text className='text-light-300 text-center mt-2 text-sm'>
              Unlock unlimited features and elevate your streaming experience
            </Text>
          </View>
        </View>

        {/* Plan Selection */}
        <View className='px-4 mt-6'>
          <Text className='text-white text-lg font-bold mb-3'>Choose Your Plan</Text>
          <View className='flex-row gap-3'>
            <TouchableOpacity
              onPress={() => setSelectedPlan('monthly')}
              className={`flex-1 rounded-2xl p-4 border-2 ${
                selectedPlan === 'monthly' ? 'border-accent bg-accent/10' : 'border-light-300/20 bg-dark-100'
              }`}
            >
              <Text className={`font-bold text-lg ${selectedPlan === 'monthly' ? 'text-accent' : 'text-white'}`}>
                Monthly
              </Text>
              <Text className='text-white text-2xl font-bold mt-2'>{plans.monthly.price}</Text>
              <Text className='text-light-300 text-xs mt-1'>per {plans.monthly.period}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedPlan('yearly')}
              className={`flex-1 rounded-2xl p-4 border-2 relative ${
                selectedPlan === 'yearly' ? 'border-accent bg-accent/10' : 'border-light-300/20 bg-dark-100'
              }`}
            >
              {plans.yearly.savings && (
                <View className='absolute -top-2 right-2 bg-accent rounded-full px-3 py-1'>
                  <Text className='text-primary text-xs font-bold'>{plans.yearly.savings}</Text>
                </View>
              )}
              <Text className={`font-bold text-lg ${selectedPlan === 'yearly' ? 'text-accent' : 'text-white'}`}>
                Yearly
              </Text>
              <Text className='text-white text-2xl font-bold mt-2'>{plans.yearly.price}</Text>
              <Text className='text-light-300 text-xs mt-1'>per {plans.yearly.period}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features List */}
        <View className='px-4 mt-6'>
          <Text className='text-white text-lg font-bold mb-3'>Premium Features</Text>
          {premiumFeatures.map((feature, index) => (
            <View key={index} className='flex-row items-start bg-dark-100 rounded-2xl p-4 mb-3'>
              <View className='bg-accent/20 rounded-full p-3 mr-4'>
                <MaterialCommunityIcons name={feature.icon as any} size={24} color='#FF8C42' />
              </View>
              <View className='flex-1'>
                <Text className='text-white font-semibold text-base'>{feature.title}</Text>
                <Text className='text-light-300 text-sm mt-1'>{feature.description}</Text>
              </View>
              <MaterialCommunityIcons name='check-circle' size={20} color='#4ADE80' />
            </View>
          ))}
        </View>

        {/* Upgrade Button */}
        <View className='px-4 mt-6 mb-8'>
          <TouchableOpacity onPress={handleUpgrade} className='bg-accent rounded-full py-4 items-center'>
            <Text className='text-primary font-bold text-lg'>
              Upgrade to Premium - {plans[selectedPlan].price}/{plans[selectedPlan].period}
            </Text>
          </TouchableOpacity>
          <Text className='text-light-300 text-xs text-center mt-3'>
            Cancel anytime. Terms and conditions apply.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AccountUpgrade