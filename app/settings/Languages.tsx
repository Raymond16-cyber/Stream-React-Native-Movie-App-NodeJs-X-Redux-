import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native'
import React, { useState, useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { router } from 'expo-router'

const Languages = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [searchQuery, setSearchQuery] = useState('')
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true)
  const [autoTranslate, setAutoTranslate] = useState(false)
  const [saving, setSaving] = useState(false)

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      speakers: '1.5B+',
      flag: '🇺🇸',
      coverage: 100,
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      speakers: '500M+',
      flag: '🇪🇸',
      coverage: 98,
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      speakers: '280M+',
      flag: '🇫🇷',
      coverage: 95,
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      speakers: '130M+',
      flag: '🇩🇪',
      coverage: 92,
    },
    {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      speakers: '250M+',
      flag: '🇵🇹',
      coverage: 88,
    },
    {
      code: 'it',
      name: 'Italian',
      nativeName: 'Italiano',
      speakers: '85M+',
      flag: '🇮🇹',
      coverage: 85,
    },
    {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      speakers: '125M+',
      flag: '🇯🇵',
      coverage: 90,
    },
    {
      code: 'zh',
      name: 'Chinese (Simplified)',
      nativeName: '简体中文',
      speakers: '1B+',
      flag: '🇨🇳',
      coverage: 93,
    },
    {
      code: 'ko',
      name: 'Korean',
      nativeName: '한국어',
      speakers: '80M+',
      flag: '🇰🇷',
      coverage: 87,
    },
    {
      code: 'ru',
      name: 'Russian',
      nativeName: 'Русский',
      speakers: '150M+',
      flag: '🇷🇺',
      coverage: 84,
    },
  ]

  const filteredLanguages = useMemo(() => {
    return languages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleLanguageChange = async (code: string) => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSelectedLanguage(code)
      alert(`Language changed to ${languages.find((l) => l.code === code)?.name}`)
    }, 1000)
  }

  const currentLanguage = languages.find((l) => l.code === selectedLanguage)

  return (
    <SafeAreaView className='bg-primary flex-1'>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className='px-4 py-4 flex-row items-center'>
          <TouchableOpacity onPress={() => router.back()} className='mr-3'>
            <Ionicons name='chevron-back' size={24} color='#ffffff' />
          </TouchableOpacity>
          <Text className='text-white text-2xl font-bold'>Languages & Region</Text>
        </View>

        {/* Current Language Card */}
        <View className='px-4 mt-4'>
          <View className='bg-dark-100 rounded-2xl p-6 items-center'>
            <Text className='text-5xl mb-3'>{currentLanguage?.flag}</Text>
            <Text className='text-white text-2xl font-bold text-center'>{currentLanguage?.name}</Text>
            <Text className='text-light-300 text-sm mt-1'>{currentLanguage?.nativeName}</Text>
            <View className='flex-row gap-4 mt-4'>
              <View className='items-center'>
                <Text className='text-accent font-bold text-lg'>{currentLanguage?.coverage}%</Text>
                <Text className='text-light-300 text-xs mt-1'>Content Coverage</Text>
              </View>
              <View className='w-px bg-light-300/20' />
              <View className='items-center'>
                <Text className='text-accent font-bold text-lg'>{currentLanguage?.speakers}</Text>
                <Text className='text-light-300 text-xs mt-1'>Native Speakers</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Language Settings */}
        <View className='px-4 mt-6'>
          <Text className='text-white text-lg font-bold mb-3'>Settings</Text>

          <View className='bg-dark-100 rounded-2xl p-4 mb-3 flex-row items-center justify-between'>
            <View className='flex-row items-center flex-1'>
              <MaterialCommunityIcons name='subtitles' size={20} color='#FF8C42' />
              <View className='ml-4 flex-1'>
                <Text className='text-white font-semibold'>Subtitles</Text>
                <Text className='text-light-300 text-xs mt-1'>Display subtitles in selected language</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setSubtitlesEnabled(!subtitlesEnabled)}>
              <View className={`rounded-full px-3 py-1 ${subtitlesEnabled ? 'bg-green-500/20' : 'bg-dark-200'}`}>
                <Text className={`text-xs font-bold ${subtitlesEnabled ? 'text-green-400' : 'text-light-300'}`}>
                  {subtitlesEnabled ? 'On' : 'Off'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className='bg-dark-100 rounded-2xl p-4 flex-row items-center justify-between'>
            <View className='flex-row items-center flex-1'>
              <MaterialCommunityIcons name='translate' size={20} color='#FF8C42' />
              <View className='ml-4 flex-1'>
                <Text className='text-white font-semibold'>Auto-Translate</Text>
                <Text className='text-light-300 text-xs mt-1'>Translate community posts automatically</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setAutoTranslate(!autoTranslate)}>
              <View className={`rounded-full px-3 py-1 ${autoTranslate ? 'bg-green-500/20' : 'bg-dark-200'}`}>
                <Text className={`text-xs font-bold ${autoTranslate ? 'text-green-400' : 'text-light-300'}`}>
                  {autoTranslate ? 'On' : 'Off'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Languages */}
        <View className='px-4 mt-6'>
          <Text className='text-white text-lg font-bold mb-3'>Select Language</Text>
          <TextInput
            placeholder='Search languages...'
            placeholderTextColor='#9CA4AB'
            value={searchQuery}
            onChangeText={setSearchQuery}
            className='bg-dark-100 text-white rounded-xl px-4 py-3 mb-3'
          />
        </View>

        {/* Languages List */}
        <View className='px-4 pb-6'>
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => handleLanguageChange(lang.code)}
                className={`rounded-2xl p-4 mb-3 flex-row items-center justify-between border-2 ${
                  selectedLanguage === lang.code
                    ? 'border-accent bg-accent/10'
                    : 'border-light-300/20 bg-dark-100'
                }`}
              >
                <View className='flex-row items-center flex-1'>
                  <Text className='text-3xl mr-4'>{lang.flag}</Text>
                  <View className='flex-1'>
                    <Text className='text-white font-semibold'>{lang.name}</Text>
                    <Text className='text-light-300 text-xs mt-1'>{lang.nativeName}</Text>
                  </View>
                </View>

                <View className='items-center'>
                  <View className='bg-dark-200 rounded-full px-2 py-1 mb-2'>
                    <Text className='text-light-300 text-xs font-semibold'>{lang.coverage}%</Text>
                  </View>
                  {selectedLanguage === lang.code && (
                    <MaterialCommunityIcons name='check-circle' size={24} color='#FF8C42' />
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className='bg-dark-100 rounded-2xl p-6 items-center'>
              <MaterialCommunityIcons name='magnify' size={40} color='#9CA4AB' />
              <Text className='text-light-300 mt-3'>No languages found</Text>
            </View>
          )}
        </View>

        {/* Contribute Section */}
        <View className='px-4 mb-6'>
          <TouchableOpacity className='bg-accent/10 border-2 border-accent rounded-2xl p-4'>
            <View className='flex-row items-center'>
              <MaterialCommunityIcons name='heart-outline' size={20} color='#FF8C42' />
              <View className='ml-3 flex-1'>
                <Text className='text-accent font-bold'>Help Translate Stream</Text>
                <Text className='text-light-300 text-xs mt-1'>
                  Contribute to make Stream available in more languages
                </Text>
              </View>
              <Ionicons name='chevron-forward' size={20} color='#FF8C42' />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Loading Modal */}
      {saving && (
        <View className='absolute inset-0 bg-black/50 items-center justify-center'>
          <ActivityIndicator size='large' color='#FF8C42' />
        </View>
      )}
    </SafeAreaView>
  )
}

export default Languages