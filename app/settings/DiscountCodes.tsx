import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import React, { useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { router } from 'expo-router'

const DiscountCodes = () => {
  const [promoCode, setPromoCode] = useState('')
  const [redeemModal, setRedeemModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const activeDiscounts = useMemo(
    () => [
      {
        id: '1',
        code: 'WELCOME20',
        description: '20% off first purchase',
        discount: '20%',
        expiresIn: '5 days',
        icon: 'gift',
        used: true,
      },
      {
        id: '2',
        code: 'NEWYEAR30',
        description: 'New Year Special - 30% off',
        discount: '30%',
        expiresIn: '10 days',
        icon: 'star',
        used: false,
      },
      {
        id: '3',
        code: 'FRIEND25',
        description: 'Refer a friend - 25% off',
        discount: '25%',
        expiresIn: 'No expiry',
        icon: 'account-multiple',
        used: false,
      },
    ],
    []
  )

  const availablePromotions = useMemo(
    () => [
      {
        id: '1',
        title: 'Summer Bundle Deal',
        description: 'Get 3 months for the price of 2',
        code: 'SUMMER22',
        discount: '33%',
        badge: 'Limited Time',
        color: '#FF6B6B',
      },
      {
        id: '2',
        title: 'Student Discount',
        description: 'Verify your student ID for 50% off',
        code: 'STUDENT50',
        discount: '50%',
        badge: 'Exclusive',
        color: '#4ECDC4',
      },
      {
        id: '3',
        title: 'Family Plan',
        description: 'Add 4 profiles to one account',
        code: 'FAMILY4',
        discount: '15%',
        badge: 'New',
        color: '#95E1D3',
      },
    ],
    []
  )

  const discountHistory = useMemo(
    () => [
      {
        id: '1',
        code: 'WELCOME20',
        discount: '-$20.00',
        appliedOn: 'Jan 5, 2026',
        status: 'Applied',
      },
      {
        id: '2',
        code: 'NEWYEAR30',
        discount: '-$45.00',
        appliedOn: 'Dec 28, 2025',
        status: 'Applied',
      },
      {
        id: '3',
        code: 'INVALID99',
        discount: 'Rejected',
        appliedOn: 'Dec 20, 2025',
        status: 'Expired',
      },
    ],
    []
  )

  const handleRedeemCode = async () => {
    if (!promoCode.trim()) {
      alert('Please enter a discount code')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setRedeemModal(false)
      setPromoCode('')
      alert('Discount code applied successfully!')
    }, 1500)
  }

  const handleCopyCode = (code: string) => {
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <SafeAreaView className='bg-primary flex-1'>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className='px-4 py-4 flex-row items-center'>
          <TouchableOpacity onPress={() => router.back()} className='mr-3'>
            <Ionicons name='chevron-back' size={24} color='#ffffff' />
          </TouchableOpacity>
          <Text className='text-white text-2xl font-bold'>Discount Codes</Text>
        </View>

        {/* Redeem Code Section */}
        <View className='px-4 mt-4'>
          <TouchableOpacity
            onPress={() => setRedeemModal(true)}
            className='bg-gradient-to-r from-accent to-accent/80 rounded-2xl p-6 items-center'
          >
            <MaterialCommunityIcons name='ticket-percent' size={32} color='#000' />
            <Text className='text-primary font-bold text-lg mt-2'>Have a Discount Code?</Text>
            <Text className='text-primary/80 text-xs mt-1'>Tap to redeem your code</Text>
          </TouchableOpacity>
        </View>

        {/* Active Discounts */}
        <View className='px-4 mt-6'>
          <Text className='text-white text-lg font-bold mb-3'>Your Active Discounts</Text>
          {activeDiscounts.length > 0 ? (
            activeDiscounts.map((discount) => (
              <View key={discount.id} className='bg-dark-100 rounded-2xl p-4 mb-3'>
                <View className='flex-row items-start justify-between mb-3'>
                  <View className='flex-row items-center flex-1'>
                    <View className='bg-accent/20 rounded-full p-3 mr-3'>
                      <MaterialCommunityIcons name={discount.icon as any} size={18} color='#FF8C42' />
                    </View>
                    <View className='flex-1'>
                      <Text className='text-white font-semibold'>{discount.description}</Text>
                      <Text className='text-light-300 text-xs mt-1'>
                        Expires in {discount.expiresIn}
                      </Text>
                    </View>
                  </View>
                  <View className='bg-accent/20 rounded-full px-3 py-1'>
                    <Text className='text-accent font-bold text-sm'>{discount.discount}</Text>
                  </View>
                </View>

                <View className='bg-dark-200 rounded-xl p-3 flex-row items-center justify-between'>
                  <Text className='text-white font-bold text-lg'>{discount.code}</Text>
                  <TouchableOpacity onPress={() => handleCopyCode(discount.code)}>
                    <MaterialCommunityIcons
                      name={copied === discount.code ? 'check' : 'content-copy'}
                      size={18}
                      color={copied === discount.code ? '#4ADE80' : '#FF8C42'}
                    />
                  </TouchableOpacity>
                </View>

                {discount.used && (
                  <View className='mt-3 bg-green-500/20 rounded-full px-3 py-1 self-start'>
                    <Text className='text-green-400 text-xs font-bold'>Used</Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View className='bg-dark-100 rounded-2xl p-6 items-center'>
              <MaterialCommunityIcons name='gift-outline' size={40} color='#9CA4AB' />
              <Text className='text-light-300 mt-3'>No active discounts</Text>
            </View>
          )}
        </View>

        {/* Available Promotions */}
        <View className='px-4 mt-6'>
          <Text className='text-white text-lg font-bold mb-3'>Available Promotions</Text>
          {availablePromotions.map((promo) => (
            <View key={promo.id} className='bg-dark-100 rounded-2xl overflow-hidden mb-3'>
              <View className='p-4'>
                <View className='flex-row items-start justify-between mb-2'>
                  <View className='flex-1'>
                    <Text className='text-white font-bold text-base'>{promo.title}</Text>
                    <Text className='text-light-300 text-xs mt-1'>{promo.description}</Text>
                  </View>
                  <View style={{ backgroundColor: promo.color }} className='rounded-full px-2 py-1'>
                    <Text className='text-white text-xs font-bold'>{promo.badge}</Text>
                  </View>
                </View>

                <View className='flex-row items-center justify-between mt-4'>
                  <View>
                    <Text className='text-light-300 text-xs mb-1'>Code</Text>
                    <Text className='text-accent font-bold'>{promo.code}</Text>
                  </View>
                  <View>
                    <Text className='text-light-300 text-xs mb-1'>Discount</Text>
                    <Text className='text-white font-bold text-lg'>{promo.discount}</Text>
                  </View>
                  <TouchableOpacity className='bg-accent/20 rounded-full p-2'>
                    <MaterialCommunityIcons name='arrow-right' size={18} color='#FF8C42' />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Discount History */}
        <View className='px-4 mt-6 mb-8'>
          <Text className='text-white text-lg font-bold mb-3'>Discount History</Text>
          {discountHistory.map((history) => (
            <View key={history.id} className='bg-dark-100 rounded-2xl p-4 mb-3 flex-row items-center justify-between'>
              <View className='flex-1'>
                <Text className='text-white font-semibold'>{history.code}</Text>
                <Text className='text-light-300 text-xs mt-1'>{history.appliedOn}</Text>
              </View>

              <View className='items-end'>
                <Text className={`font-bold ${history.status === 'Applied' ? 'text-green-400' : 'text-red-400'}`}>
                  {history.discount}
                </Text>
                <Text
                  className={`text-xs mt-1 ${
                    history.status === 'Applied' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {history.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Redeem Code Modal */}
      <Modal
        visible={redeemModal}
        animationType='slide'
        transparent
        onRequestClose={() => setRedeemModal(false)}
      >
        <SafeAreaView className='bg-primary flex-1'>
          <KeyboardAvoidingView
            className='flex-1'
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
            <View className='px-4 py-3 border-b border-light-300/10 flex-row items-center justify-between'>
              <Text className='text-white text-lg font-bold'>Redeem Code</Text>
              <TouchableOpacity onPress={() => setRedeemModal(false)}>
                <Ionicons name='close' size={24} color='#ffffff' />
              </TouchableOpacity>
            </View>

            <ScrollView className='flex-1 p-4'>
              <View className='bg-accent/10 rounded-2xl p-6 items-center mt-4'>
                <MaterialCommunityIcons name='ticket-percent' size={40} color='#FF8C42' />
                <Text className='text-white text-xl font-bold mt-3'>Enter Discount Code</Text>
                <Text className='text-light-300 text-sm mt-2 text-center'>
                  Paste your discount code below to redeem
                </Text>
              </View>

              <View className='mt-6'>
                <Text className='text-light-200 text-sm font-semibold mb-2'>Discount Code</Text>
                <TextInput
                  placeholder='e.g. WELCOME20'
                  placeholderTextColor='#9CA4AB'
                  value={promoCode}
                  onChangeText={setPromoCode}
                  autoCapitalize='characters'
                  className='bg-dark-100 text-white rounded-xl px-4 py-3 text-lg font-semibold'
                />
              </View>

              <View className='bg-dark-100 rounded-xl p-4 mt-6'>
                <Text className='text-light-300 text-xs leading-4'>
                  • Make sure you enter the code exactly as provided{'\n'}
                  • Some codes may have expiration dates{'\n'}
                  • Each code can typically be used once per account
                </Text>
              </View>
            </ScrollView>

            <View className='bg-primary border-t border-light-300/10 p-4 gap-3'>
              <TouchableOpacity
                onPress={handleRedeemCode}
                disabled={loading || !promoCode.trim()}
                className={`rounded-full py-4 items-center ${
                  loading || !promoCode.trim() ? 'bg-light-300/30' : 'bg-accent'
                }`}
              >
                {loading ? (
                  <ActivityIndicator color='#000' />
                ) : (
                  <Text className='text-primary font-bold text-lg'>Redeem Code</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setRedeemModal(false)} className='bg-dark-100 rounded-full py-4 items-center'>
                <Text className='text-white font-semibold'>Cancel</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

export default DiscountCodes