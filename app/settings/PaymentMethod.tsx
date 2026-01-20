import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { router } from 'expo-router'

const PaymentMethod = () => {
  const [selectedCard, setSelectedCard] = useState<string>('card1')
  const [addCardModal, setAddCardModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  })

  const savedCards = [
    {
      id: 'card1',
      type: 'Visa',
      lastFour: '4242',
      cardHolder: 'John Doe',
      expiryDate: '12/25',
      isDefault: true,
      icon: 'credit-card',
    },
    {
      id: 'card2',
      type: 'Mastercard',
      lastFour: '5555',
      cardHolder: 'John Doe',
      expiryDate: '08/26',
      isDefault: false,
      icon: 'credit-card',
    },
  ]

  const paymentHistory = [
    {
      id: '1',
      type: 'Premium Upgrade',
      amount: '+$99.99',
      date: 'Jan 15, 2026',
      status: 'Success',
      icon: 'crown',
    },
    {
      id: '2',
      type: 'Monthly Subscription',
      amount: '+$9.99',
      date: 'Dec 15, 2025',
      status: 'Success',
      icon: 'repeat',
    },
    {
      id: '3',
      type: 'In-App Purchase',
      amount: '+$4.99',
      date: 'Dec 10, 2025',
      status: 'Success',
      icon: 'shopping',
    },
    {
      id: '4',
      type: 'Premium Upgrade',
      amount: '+$99.99',
      date: 'Nov 15, 2025',
      status: 'Failed',
      icon: 'crown',
    },
  ]

  const handleAddCard = async () => {
    if (!cardData.cardNumber || !cardData.cardHolder || !cardData.expiryDate || !cardData.cvv) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setAddCardModal(false)
      setCardData({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' })
      alert('Card added successfully!')
    }, 1500)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  return (
    <SafeAreaView className='bg-primary flex-1'>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className='px-4 py-4 flex-row items-center'>
          <TouchableOpacity onPress={() => router.back()} className='mr-3'>
            <Ionicons name='chevron-back' size={24} color='#ffffff' />
          </TouchableOpacity>
          <Text className='text-white text-2xl font-bold'>Payment Methods</Text>
        </View>

        {/* Saved Cards */}
        <View className='px-4 mt-4'>
          <View className='flex-row items-center justify-between mb-3'>
            <Text className='text-white text-lg font-bold'>Saved Cards</Text>
            <TouchableOpacity onPress={() => setAddCardModal(true)}>
              <View className='bg-accent rounded-full p-2'>
                <Ionicons name='add' size={20} color='#000' />
              </View>
            </TouchableOpacity>
          </View>

          {savedCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              onPress={() => setSelectedCard(card.id)}
              className={`rounded-2xl p-5 mb-3 border-2 ${
                selectedCard === card.id ? 'border-accent bg-accent/10' : 'border-light-300/20 bg-dark-100'
              }`}
            >
              <View className='flex-row items-center justify-between mb-3'>
                <View className='flex-row items-center flex-1'>
                  <MaterialCommunityIcons name={card.icon as any} size={24} color='#FF8C42' />
                  <Text className='text-accent font-bold ml-2'>{card.type}</Text>
                </View>
                {card.isDefault && (
                  <View className='bg-accent rounded-full px-2 py-1'>
                    <Text className='text-primary text-xs font-bold'>Default</Text>
                  </View>
                )}
              </View>

              <View className='mb-3'>
                <Text className='text-light-300 text-xs mb-1'>Card Number</Text>
                <Text className='text-white text-lg font-semibold'>•••• •••• •••• {card.lastFour}</Text>
              </View>

              <View className='flex-row justify-between'>
                <View>
                  <Text className='text-light-300 text-xs mb-1'>Card Holder</Text>
                  <Text className='text-white font-semibold'>{card.cardHolder}</Text>
                </View>
                <View>
                  <Text className='text-light-300 text-xs mb-1'>Expires</Text>
                  <Text className='text-white font-semibold'>{card.expiryDate}</Text>
                </View>
              </View>

              {selectedCard === card.id && (
                <View className='flex-row gap-2 mt-4 pt-4 border-t border-light-300/10'>
                  <TouchableOpacity className='flex-1 bg-accent/20 rounded-full py-2 items-center'>
                    <Text className='text-accent text-xs font-bold'>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className='flex-1 bg-red-500/20 rounded-full py-2 items-center'>
                    <Text className='text-red-400 text-xs font-bold'>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment History */}
        <View className='px-4 mt-6 mb-8'>
          <View className='flex-row items-center justify-between mb-3'>
            <Text className='text-white text-lg font-bold'>Payment History</Text>
            <TouchableOpacity>
              <Text className='text-accent text-xs font-semibold'>View All</Text>
            </TouchableOpacity>
          </View>

          {paymentHistory.slice(0, 4).map((payment) => (
            <View key={payment.id} className='bg-dark-100 rounded-2xl p-4 mb-3 flex-row items-center justify-between'>
              <View className='flex-row items-center flex-1'>
                <View className='bg-accent/20 rounded-full p-3 mr-4'>
                  <MaterialCommunityIcons name={payment.icon as any} size={18} color='#FF8C42' />
                </View>
                <View className='flex-1'>
                  <Text className='text-white font-semibold'>{payment.type}</Text>
                  <Text className='text-light-300 text-xs mt-1'>{payment.date}</Text>
                </View>
              </View>

              <View className='items-end'>
                <Text className={`font-bold ${payment.status === 'Success' ? 'text-green-400' : 'text-red-400'}`}>
                  {payment.amount}
                </Text>
                <Text
                  className={`text-xs mt-1 ${
                    payment.status === 'Success' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {payment.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Card Modal */}
      <Modal
        visible={addCardModal}
        animationType='slide'
        transparent
        onRequestClose={() => setAddCardModal(false)}
      >
        <SafeAreaView className='bg-primary flex-1'>
          <KeyboardAvoidingView
            className='flex-1'
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
            <View className='px-4 py-3 border-b border-light-300/10 flex-row items-center justify-between'>
              <Text className='text-white text-lg font-bold'>Add New Card</Text>
              <TouchableOpacity onPress={() => setAddCardModal(false)}>
                <Ionicons name='close' size={24} color='#ffffff' />
              </TouchableOpacity>
            </View>

            <ScrollView className='flex-1 p-4'>
              <View className='mb-4'>
                <Text className='text-light-200 text-sm font-semibold mb-2'>Card Number</Text>
                <TextInput
                  placeholder='1234 5678 9012 3456'
                  placeholderTextColor='#9CA4AB'
                  value={cardData.cardNumber}
                  onChangeText={(value) =>
                    setCardData({ ...cardData, cardNumber: formatCardNumber(value) })
                  }
                  maxLength={19}
                  keyboardType='numeric'
                  className='bg-dark-100 text-white rounded-xl px-4 py-3'
                />
              </View>

              <View className='mb-4'>
                <Text className='text-light-200 text-sm font-semibold mb-2'>Card Holder Name</Text>
                <TextInput
                  placeholder='John Doe'
                  placeholderTextColor='#9CA4AB'
                  value={cardData.cardHolder}
                  onChangeText={(value) => setCardData({ ...cardData, cardHolder: value })}
                  className='bg-dark-100 text-white rounded-xl px-4 py-3'
                />
              </View>

              <View className='flex-row gap-3 mb-4'>
                <View className='flex-1'>
                  <Text className='text-light-200 text-sm font-semibold mb-2'>Expiry Date</Text>
                  <TextInput
                    placeholder='MM/YY'
                    placeholderTextColor='#9CA4AB'
                    value={cardData.expiryDate}
                    onChangeText={(value) => setCardData({ ...cardData, expiryDate: value })}
                    maxLength={5}
                    keyboardType='numeric'
                    className='bg-dark-100 text-white rounded-xl px-4 py-3'
                  />
                </View>
                <View className='flex-1'>
                  <Text className='text-light-200 text-sm font-semibold mb-2'>CVV</Text>
                  <TextInput
                    placeholder='123'
                    placeholderTextColor='#9CA4AB'
                    value={cardData.cvv}
                    onChangeText={(value) => setCardData({ ...cardData, cvv: value })}
                    maxLength={3}
                    keyboardType='numeric'
                    secureTextEntry
                    className='bg-dark-100 text-white rounded-xl px-4 py-3'
                  />
                </View>
              </View>

              <View className='bg-dark-100/50 rounded-xl p-3 mb-6'>
                <Text className='text-light-300 text-xs leading-4'>
                  Your payment information is encrypted and secure. We never store your full card details.
                </Text>
              </View>
            </ScrollView>

            <View className='bg-primary border-t border-light-300/10 p-4 gap-3'>
              <TouchableOpacity
                onPress={handleAddCard}
                disabled={loading}
                className='bg-accent rounded-full py-4 items-center'
              >
                {loading ? (
                  <ActivityIndicator color='#000' />
                ) : (
                  <Text className='text-primary font-bold text-lg'>Add Card</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAddCardModal(false)} className='bg-dark-100 rounded-full py-4 items-center'>
                <Text className='text-white font-semibold'>Cancel</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

export default PaymentMethod