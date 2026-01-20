import { View, Text, ScrollView, TouchableOpacity, Linking, Modal, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const CustomerCare = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [chatModal, setChatModal] = useState(false)
  const [feedbackModal, setFeedbackModal] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")
  const [loading, setLoading] = useState(false)

  const faqs = [
    {
      id: '1',
      question: 'How do I create a community?',
      answer: 'Go to the Communities tab, tap the + button, fill in the details, and tap Create Community.',
    },
    {
      id: '2',
      question: 'How can I invite friends to a community?',
      answer: 'Open the community chat, tap the + icon in the header, search for users, and tap Add.',
    },
    {
      id: '3',
      question: 'How do I report inappropriate content?',
      answer: 'Long-press the message, tap Report, and describe the issue. Our team will review it.',
    },
    {
      id: '4',
      question: 'Can I delete a message I sent?',
      answer: 'Messages are permanent to maintain chat history. Contact support if you need assistance.',
    },
    {
      id: '5',
      question: 'How do I change my profile picture?',
      answer: 'Go to Settings, tap Edit Profile, and select a new image from your gallery.',
    },
  ]

  const contactOptions = [
    {
      id: '1',
      icon: 'email',
      label: 'Email Support',
      value: 'uchennaraymond74@gmail.com',
      action: () => Linking.openURL('mailto:uchennaraymond74@gmail.com'),
    },
    {
      id: '2',
      icon: 'phone',
      label: 'Call Us',
      value: '+234 813 086 2316',
      action: () => Linking.openURL('tel:+2348130862316'),
    },
    {
      id: '3',
      icon: 'chat',
      label: 'Live Chat',
      value: 'Chat with us now',
      action: () => setChatModal(true),
    },
  ]

  const handleFeedback = async () => {
    if (!feedbackText.trim()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setFeedbackText("")
      setFeedbackModal(false)
      alert('Thank you! Your feedback has been sent.')
    }, 1500)
  }

  const handleSendMessage = () => {
    // Placeholder for sending message logic
    alert('Message sent!')
  }
  return (
    <SafeAreaView className='bg-primary flex-1'>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className='px-4 py-4'>
          <Text className='text-white text-3xl font-bold'>Help & Support</Text>
          <Text className='text-light-300 text-sm mt-1'>We're here to help you</Text>
        </View>

        {/* Contact Options */}
        <View className='px-4 mt-4'>
          <Text className='text-white text-lg font-bold mb-3'>Contact Us</Text>
          {contactOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={option.action}
              className='bg-dark-100 rounded-2xl p-4 mb-3 flex-row items-center'
            >
              <View className='bg-accent/20 rounded-full p-3 mr-4'>
                <MaterialCommunityIcons name={option.icon as any} size={20} color='#FF8C42' />
              </View>
              <View className='flex-1'>
                <Text className='text-white font-semibold'>{option.label}</Text>
                <Text className='text-light-300 text-xs mt-1'>{option.value}</Text>
              </View>
              <Ionicons name='chevron-forward' size={20} color='#9CA4AB' />
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQs */}
        <View className='px-4 mt-6'>
          <Text className='text-white text-lg font-bold mb-3'>Frequently Asked Questions</Text>
          {faqs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              className='bg-dark-100 rounded-2xl p-4 mb-3'
            >
              <View className='flex-row items-center justify-between'>
                <Text className='text-white font-semibold flex-1 pr-3'>{faq.question}</Text>
                <Ionicons
                  name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color='#FF8C42'
                />
              </View>
              {expandedFaq === faq.id && (
                <Text className='text-light-300 mt-3 text-sm leading-5'>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback */}
        <View className='px-4 mt-6 mb-6'>
          <Text className='text-white text-lg font-bold mb-3'>Send Feedback</Text>
          <TouchableOpacity
            onPress={() => setFeedbackModal(true)}
            className='bg-accent rounded-2xl p-4 flex-row items-center justify-center'
          >
            <MaterialCommunityIcons name='message-text-outline' size={20} color='#000' />
            <Text className='text-primary font-bold ml-2'>Share Your Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Live Chat Modal */}
      <Modal
        visible={chatModal}
        animationType='slide'
        transparent
        onRequestClose={() => setChatModal(false)}
      >
        <SafeAreaView className='bg-primary flex-1'>
          <KeyboardAvoidingView
            className='flex-1'
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
            <View className='px-4 py-3 border-b border-light-300/10 flex-row items-center'>
              <TouchableOpacity onPress={() => setChatModal(false)} className='mr-3'>
                <Ionicons name='chevron-back' size={24} color='#ffffff' />
              </TouchableOpacity>
              <Text className='text-white text-lg font-bold'>Live Chat Support</Text>
            </View>
            <ScrollView className='flex-1 p-4'>
            <View className='bg-dark-100 rounded-2xl p-4 mb-4'>
              <Text className='text-light-200 text-sm'>
                👋 Welcome! Our support team typically responds within 5 minutes during business hours (9 AM - 6 PM UTC).
              </Text>
            </View>
            <View className='bg-dark-100 rounded-2xl p-4'>
              <Text className='text-light-200 text-sm'>
                📧 For urgent issues, please email us at uchennaraymond74@gmail.com
              </Text>
            </View>
          </ScrollView>
            <View className='bg-primary border-t border-light-300/10 p-4 flex-row items-center gap-2'>
              <TextInput
                placeholder='Type your message...'
                placeholderTextColor='#9CA4AB'
                className='flex-1 bg-dark-100 text-white rounded-full px-4 py-3'
              />
              <TouchableOpacity className='bg-accent rounded-full p-3' onPress={handleSendMessage}>
                <Ionicons name='send' size={20} color='#000' />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        visible={feedbackModal}
        animationType='slide'
        transparent
        onRequestClose={() => setFeedbackModal(false)}
      >
        <SafeAreaView className='bg-primary flex-1'>
          <KeyboardAvoidingView
            className='flex-1'
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
            <View className='px-4 py-3 border-b border-light-300/10 flex-row items-center justify-between'>
              <Text className='text-white text-lg font-bold'>Send Feedback</Text>
              <TouchableOpacity onPress={() => setFeedbackModal(false)}>
                <Ionicons name='close' size={24} color='#ffffff' />
              </TouchableOpacity>
            </View>
            <ScrollView className='flex-1 p-4'>
            <Text className='text-light-200 text-sm mb-4'>
              Help us improve Stream by sharing your thoughts and suggestions.
            </Text>
            <TextInput
              placeholder='Tell us what you think...'
              placeholderTextColor='#9CA4AB'
              value={feedbackText}
              onChangeText={setFeedbackText}
              multiline
              numberOfLines={8}
              className='bg-dark-100 text-white rounded-2xl px-4 py-3 mb-4'
              textAlignVertical='top'
            />
          </ScrollView>
            <View className='bg-primary border-t border-light-300/10 p-4'>
              <TouchableOpacity
                onPress={handleFeedback}
                disabled={loading || !feedbackText.trim()}
                className={`rounded-full py-3 items-center justify-center ${
                  loading || !feedbackText.trim() ? 'bg-light-300/30' : 'bg-accent'
                }`}
              >
                {loading ? (
                  <ActivityIndicator color='#000' />
                ) : (
                  <Text className='text-primary font-bold'>Send Feedback</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

export default CustomerCare