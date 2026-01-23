import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { router } from 'expo-router'
import * as LocalAuthentication from 'expo-local-authentication';


const Security = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true)
  const [suspiciousActivityAlerts, setSuspiciousActivityAlerts] = useState(true)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [biometricSupport, setBiometricSupport] = useState({ available: false, enrolled: false, type: 'Unknown' })
  const [biometricMessage, setBiometricMessage] = useState('')
  const [biometricError, setBiometricError] = useState('')
  const [biometricChecking, setBiometricChecking] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [twoFactorError, setTwoFactorError] = useState('')
  const [showPasswordHint, setShowPasswordHint] = useState('')

  useEffect(() => {
    checkBiometrics()
  }, [])

  const activeSessions: Array<{
    id: number
    device: string
    os: string
    location: string
    lastActive: string
    current: boolean
    icon: keyof typeof MaterialCommunityIcons.glyphMap
  }> = [
    {
      id: 1,
      device: 'iPhone 15 Pro',
      os: 'iOS 18.1',
      location: 'New York, USA',
      lastActive: '2 minutes ago',
      current: true,
      icon: 'apple',
    },
    {
      id: 2,
      device: 'MacBook Pro',
      os: 'macOS Sonoma',
      location: 'New York, USA',
      lastActive: '45 minutes ago',
      current: false,
      icon: 'laptop',
    },
    {
      id: 3,
      device: 'Chrome Browser',
      os: 'Windows 11',
      location: 'Los Angeles, USA',
      lastActive: '2 days ago',
      current: false,
      icon: 'google-chrome',
    },
  ]

  const loginHistory = [
    {
      id: 1,
      device: 'iPhone 15 Pro',
      location: 'New York, USA',
      timestamp: 'Today at 2:35 PM',
      type: 'successful',
    },
    {
      id: 2,
      device: 'MacBook Pro',
      location: 'New York, USA',
      timestamp: 'Today at 1:20 PM',
      type: 'successful',
    },
    {
      id: 3,
      device: 'Unknown',
      location: 'London, UK',
      timestamp: 'Yesterday at 11:45 PM',
      type: 'failed',
    },
  ]

  const handleChangePassword = () => {
    setPasswordError('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required')
      return
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    if (newPassword === currentPassword) {
      setPasswordError('New password must be different from current password')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShowPasswordModal(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      alert('Password changed successfully')
    }, 1500)
  }

  async function checkBiometrics() {
    setBiometricChecking(true)
    setBiometricError('')
    setBiometricMessage('')
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync()
      const typeLabel = supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        ? 'Fingerprint'
        : supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
        ? 'Face ID'
        : supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)
        ? 'Iris'
        : 'Biometric'

      setBiometricSupport({ available: hasHardware, enrolled: isEnrolled, type: typeLabel })

      if (!hasHardware) {
        setBiometricMessage('No biometric hardware found on this device')
        return
      }
      if (!isEnrolled) {
        setBiometricMessage('Set up biometrics in system settings to enable')
        return
      }
      setBiometricMessage(`${typeLabel} available on this device`)
    } catch (error) {
      setBiometricError('Unable to check device biometrics right now')
    } finally {
      setBiometricChecking(false)
    }
  }

  async function handleBiometricToggle() {
    setBiometricError('')

    if (biometricEnabled) {
      setBiometricEnabled(false)
      setBiometricMessage('Biometric login disabled on this device')
      return
    }

    if (!biometricSupport.available) {
      setBiometricError('This device does not support biometrics')
      return
    }

    if (!biometricSupport.enrolled) {
      setBiometricError('Enroll Face ID or fingerprint in device settings first')
      return
    }

    setBiometricChecking(true)
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometric login',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      })

      if (result.success) {
        setBiometricEnabled(true)
        setBiometricMessage(`${biometricSupport.type} enabled for sign in on this device`)
      } else {
        setBiometricError(result.error || 'Authentication canceled')
      }
    } catch (error) {
      setBiometricError('Biometric authentication failed. Please try again.')
    } finally {
      setBiometricChecking(false)
    }
  }

  const handleSetupTwoFactor = () => {
    setTwoFactorError('')

    if (!twoFactorCode) {
      setTwoFactorError('Verification code is required')
      return
    }

    if (twoFactorCode.length !== 6) {
      setTwoFactorError('Code must be 6 digits')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShowTwoFactorModal(false)
      setTwoFactorCode('')
      setTwoFactorEnabled(true)
      alert('Two-Factor Authentication enabled successfully')
    }, 1500)
  }

  const securityScore = twoFactorEnabled && biometricEnabled ? 'Strong' : 'Medium'
  const securityColor =
    securityScore === 'Strong' ? 'text-green-400' : securityScore === 'Medium' ? 'text-yellow-400' : 'text-red-400'

  return (
    <SafeAreaView className='bg-primary flex-1'>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className='px-4 py-4 flex-row items-center'>
          <TouchableOpacity onPress={() => router.back()} className='mr-3'>
            <Ionicons name='chevron-back' size={24} color='#ffffff' />
          </TouchableOpacity>
          <Text className='text-white text-2xl font-bold'>Security Settings</Text>
        </View>

        {/* Security Score Card */}
        <View className='px-4 mt-4'>
          <View className='bg-dark-100 rounded-2xl p-6'>
            <View className='flex-row items-center justify-between mb-4'>
              <Text className='text-white text-lg font-bold'>Security Status</Text>
              <MaterialCommunityIcons name='shield-check' size={28} color='#FF8C42' />
            </View>

            <View className='bg-dark-200 rounded-xl p-4 flex-row items-center justify-between'>
              <View>
                <Text className='text-light-300 text-sm mb-1'>Current Level</Text>
                <Text className={`text-2xl font-bold ${securityColor}`}>{securityScore}</Text>
              </View>
              <View className='items-center'>
                <View className='w-16 h-16 rounded-full bg-accent/20 items-center justify-center'>
                  <Text className='text-accent text-xl font-bold'>
                    {twoFactorEnabled && biometricEnabled ? '95' : '65'}%
                  </Text>
                </View>
              </View>
            </View>

            <Text className='text-light-300 text-xs mt-4 leading-5'>
              Enable two-factor authentication and biometric login to increase your security
            </Text>
          </View>
        </View>

        {/* Password Section */}
        <View className='px-4 mt-6'>
          <Text className='text-white text-lg font-bold mb-3'>Password</Text>

          <TouchableOpacity
            onPress={() => setShowPasswordModal(true)}
            className='bg-dark-100 rounded-2xl p-4 flex-row items-center justify-between'
          >
            <View className='flex-row items-center flex-1'>
              <MaterialCommunityIcons name='lock-reset' size={20} color='#FF8C42' />
              <View className='ml-4 flex-1'>
                <Text className='text-white font-semibold'>Change Password</Text>
                <Text className='text-light-300 text-xs mt-1'>Update your password regularly</Text>
              </View>
            </View>
            <Ionicons name='chevron-forward' size={20} color='#9CA4AB' />
          </TouchableOpacity>
        </View>

        {/* Two-Factor Authentication */}
        <View className='px-4 mt-6'>
          <Text className='text-white text-lg font-bold mb-3'>Two-Factor Authentication</Text>

          <View className='bg-dark-100 rounded-2xl p-4 mb-3 flex-row items-center justify-between'>
            <View className='flex-row items-center flex-1'>
              <MaterialCommunityIcons name='shield-alert' size={20} color='#FF8C42' />
              <View className='ml-4 flex-1'>
                <Text className='text-white font-semibold'>2FA Status</Text>
                <Text className='text-light-300 text-xs mt-1'>
                  {twoFactorEnabled ? 'Enabled' : 'Add extra security layer'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setShowTwoFactorModal(true)}
              className={`rounded-full px-4 py-2 ${twoFactorEnabled ? 'bg-green-500/20' : 'bg-dark-200'}`}
            >
              <Text className={`text-xs font-bold ${twoFactorEnabled ? 'text-green-400' : 'text-accent'}`}>
                {twoFactorEnabled ? 'Enabled' : 'Enable'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className='bg-dark-100 rounded-2xl p-4 flex-row items-center justify-between'
            onPress={handleBiometricToggle}
            activeOpacity={0.85}
          >
            <View className='flex-row items-center flex-1'>
              <MaterialCommunityIcons name='fingerprint' size={20} color='#FF8C42' />
              <View className='ml-4 flex-1'>
                <Text className='text-white font-semibold'>Biometric Login</Text>
                <Text className='text-light-300 text-xs mt-1'>
                  {biometricMessage || 'Use Face ID or fingerprint to sign in'}
                </Text>
                <View className='flex-row flex-wrap gap-2 mt-2'>
                  <View className={`px-2 py-1 rounded-full ${biometricSupport.available ? 'bg-green-500/20' : 'bg-dark-200'}`}>
                    <Text className={`text-xs font-semibold ${biometricSupport.available ? 'text-green-400' : 'text-light-300'}`}>
                      {biometricSupport.available ? 'Hardware ready' : 'No hardware'}
                    </Text>
                  </View>
                  <View className={`px-2 py-1 rounded-full ${biometricSupport.enrolled ? 'bg-green-500/20' : 'bg-dark-200'}`}>
                    <Text className={`text-xs font-semibold ${biometricSupport.enrolled ? 'text-green-400' : 'text-light-300'}`}>
                      {biometricSupport.enrolled ? 'Enrolled' : 'Not enrolled'}
                    </Text>
                  </View>
                  <View className='px-2 py-1 rounded-full bg-dark-200'>
                    <Text className='text-xs font-semibold text-light-300'>{biometricSupport.type}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View className={`rounded-full px-3 py-1 ${biometricEnabled ? 'bg-green-500/20' : 'bg-dark-200'}`}>
              {biometricChecking ? (
                <ActivityIndicator size='small' color={biometricEnabled ? '#22c55e' : '#9CA4AB'} />
              ) : (
                <Text className={`text-xs font-bold ${biometricEnabled ? 'text-green-400' : 'text-light-300'}`}>
                  {biometricEnabled ? 'On' : 'Off'}
                </Text>
              )}
            </View>
          </TouchableOpacity>

          {(biometricError || biometricMessage) && (
            <View
              className={`mt-3 rounded-xl p-3 ${biometricError ? 'bg-red-500/15 border border-red-500/40' : 'bg-dark-100'}`}
            >
              <Text className={biometricError ? 'text-red-400 text-xs' : 'text-light-300 text-xs'}>
                {biometricError || biometricMessage}
              </Text>
              <View className='flex-row gap-3 mt-3'>
                <TouchableOpacity
                  className='bg-dark-200 rounded-lg px-3 py-2'
                  onPress={checkBiometrics}
                  disabled={biometricChecking}
                >
                  {biometricChecking ? (
                    <ActivityIndicator size='small' color='#FF8C42' />
                  ) : (
                    <Text className='text-accent text-xs font-semibold'>Re-check device</Text>
                  )}
                </TouchableOpacity>
                {biometricEnabled && (
                  <TouchableOpacity
                    className='bg-accent/10 border border-accent rounded-lg px-3 py-2'
                    onPress={handleBiometricToggle}
                  >
                    <Text className='text-accent text-xs font-semibold'>Disable on this device</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Alerts & Notifications */}
        <View className='px-4 mt-6'>
          <Text className='text-white text-lg font-bold mb-3'>Alerts & Notifications</Text>

          <View className='bg-dark-100 rounded-2xl p-4 mb-3 flex-row items-center justify-between'>
            <View className='flex-row items-center flex-1'>
              <MaterialCommunityIcons name='bell-alert' size={20} color='#FF8C42' />
              <View className='ml-4 flex-1'>
                <Text className='text-white font-semibold'>Login Alerts</Text>
                <Text className='text-light-300 text-xs mt-1'>Get notified of new sign-ins</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setLoginAlertsEnabled(!loginAlertsEnabled)}>
              <View className={`rounded-full px-3 py-1 ${loginAlertsEnabled ? 'bg-green-500/20' : 'bg-dark-200'}`}>
                <Text className={`text-xs font-bold ${loginAlertsEnabled ? 'text-green-400' : 'text-light-300'}`}>
                  {loginAlertsEnabled ? 'On' : 'Off'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className='bg-dark-100 rounded-2xl p-4 flex-row items-center justify-between'>
            <View className='flex-row items-center flex-1'>
              <MaterialCommunityIcons name='alert-circle' size={20} color='#FF8C42' />
              <View className='ml-4 flex-1'>
                <Text className='text-white font-semibold'>Suspicious Activity</Text>
                <Text className='text-light-300 text-xs mt-1'>Alert on unusual account activity</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setSuspiciousActivityAlerts(!suspiciousActivityAlerts)}>
              <View
                className={`rounded-full px-3 py-1 ${suspiciousActivityAlerts ? 'bg-green-500/20' : 'bg-dark-200'}`}
              >
                <Text
                  className={`text-xs font-bold ${suspiciousActivityAlerts ? 'text-green-400' : 'text-light-300'}`}
                >
                  {suspiciousActivityAlerts ? 'On' : 'Off'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Sessions */}
        <View className='px-4 mt-6'>
          <View className='flex-row items-center justify-between mb-3'>
            <Text className='text-white text-lg font-bold'>Active Sessions</Text>
            <TouchableOpacity className='bg-dark-200 rounded-full px-3 py-1'>
              <Text className='text-accent text-xs font-bold'>View All</Text>
            </TouchableOpacity>
          </View>

          {activeSessions.map((session) => (
            <View
              key={session.id}
              className={`rounded-2xl p-4 mb-3 flex-row items-center justify-between ${
                session.current ? 'bg-accent/10 border-2 border-accent' : 'bg-dark-100'
              }`}
            >
              <View className='flex-row items-center flex-1'>
                <MaterialCommunityIcons
                  name={session.icon}
                  size={24}
                  color={session.current ? '#FF8C42' : '#9CA4AB'}
                />
                <View className='ml-4 flex-1'>
                  <View className='flex-row items-center gap-2'>
                    <Text className='text-white font-semibold'>{session.device}</Text>
                    {session.current && (
                      <View className='bg-green-500/20 rounded-full px-2 py-0.5'>
                        <Text className='text-green-400 text-xs font-bold'>Current</Text>
                      </View>
                    )}
                  </View>
                  <Text className='text-light-300 text-xs mt-1'>{session.os}</Text>
                  <Text className='text-light-300 text-xs'>{session.location}</Text>
                  <Text className='text-light-400 text-xs mt-1'>{session.lastActive}</Text>
                </View>
              </View>
              {!session.current && (
                <TouchableOpacity className='ml-2'>
                  <MaterialCommunityIcons name='close-circle-outline' size={20} color='#9CA4AB' />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Login History */}
        <View className='px-4 mt-6 mb-6'>
          <View className='flex-row items-center justify-between mb-3'>
            <Text className='text-white text-lg font-bold'>Login History</Text>
            <TouchableOpacity className='bg-dark-200 rounded-full px-3 py-1'>
              <Text className='text-accent text-xs font-bold'>View All</Text>
            </TouchableOpacity>
          </View>

          {loginHistory.map((login) => (
            <View key={login.id} className='bg-dark-100 rounded-2xl p-4 mb-3'>
              <View className='flex-row items-center justify-between mb-2'>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons
                    name={login.type === 'successful' ? 'check-circle' : 'alert-circle'}
                    size={16}
                    color={login.type === 'successful' ? '#22c55e' : '#ef4444'}
                  />
                  <Text className='text-white font-semibold text-sm'>{login.device}</Text>
                </View>
                <Text className={`text-xs font-semibold ${login.type === 'successful' ? 'text-green-400' : 'text-red-400'}`}>
                  {login.type === 'successful' ? 'Success' : 'Failed'}
                </Text>
              </View>
              <Text className='text-light-300 text-xs'>{login.location}</Text>
              <Text className='text-light-400 text-xs mt-1'>{login.timestamp}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal visible={showPasswordModal} animationType='slide' transparent>
        <SafeAreaView className='bg-primary/95 flex-1 justify-end'>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className='flex-1 justify-end'
          >
            <View className='bg-dark-100 rounded-t-3xl p-6 pb-12'>
              {/* Close Button */}
              <View className='flex-row justify-between items-center mb-6'>
                <Text className='text-white text-2xl font-bold'>Change Password</Text>
                <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                  <Ionicons name='close' size={24} color='#ffffff' />
                </TouchableOpacity>
              </View>

              {/* Error Message */}
              {passwordError ? (
                <View className='bg-red-500/20 border-l-4 border-red-500 rounded-lg p-3 mb-4'>
                  <Text className='text-red-400 text-sm'>{passwordError}</Text>
                </View>
              ) : null}

              {/* Current Password */}
              <View className='mb-4'>
                <Text className='text-white font-semibold mb-2'>Current Password</Text>
                <TextInput
                  placeholder='Enter current password'
                  placeholderTextColor='#9CA4AB'
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={(text) => {
                    setCurrentPassword(text)
                    setPasswordError('')
                  }}
                  className='bg-dark-200 text-white rounded-xl px-4 py-3 border border-light-300/20'
                />
              </View>

              {/* New Password */}
              <View className='mb-4'>
                <Text className='text-white font-semibold mb-2'>New Password</Text>
                <TextInput
                  placeholder='Enter new password (min. 8 characters)'
                  placeholderTextColor='#9CA4AB'
                  secureTextEntry
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text)
                    setPasswordError('')
                  }}
                  className='bg-dark-200 text-white rounded-xl px-4 py-3 border border-light-300/20'
                />
              </View>

              {/* Confirm Password */}
              <View className='mb-6'>
                <Text className='text-white font-semibold mb-2'>Confirm Password</Text>
                <TextInput
                  placeholder='Confirm new password'
                  placeholderTextColor='#9CA4AB'
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text)
                    setPasswordError('')
                  }}
                  className='bg-dark-200 text-white rounded-xl px-4 py-3 border border-light-300/20'
                />
              </View>

              {/* Password Strength Hint */}
              <View className='bg-dark-200 rounded-xl p-3 mb-6'>
                <Text className='text-light-300 text-xs leading-5'>
                  <Text className='font-bold'>Strong passwords:</Text> Include uppercase letters, numbers, and symbols
                </Text>
              </View>

              {/* Buttons */}
              <View className='flex-row gap-3'>
                <TouchableOpacity
                  onPress={() => setShowPasswordModal(false)}
                  className='flex-1 bg-dark-200 rounded-xl py-3 items-center'
                >
                  <Text className='text-white font-semibold'>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleChangePassword}
                  disabled={loading}
                  className='flex-1 bg-accent rounded-xl py-3 items-center'
                >
                  {loading ? (
                    <ActivityIndicator color='#1A1A2E' />
                  ) : (
                    <Text className='text-dark-300 font-bold'>Change Password</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Two-Factor Authentication Modal */}
      <Modal visible={showTwoFactorModal} animationType='slide' transparent>
        <SafeAreaView className='bg-primary/95 flex-1 justify-end'>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className='flex-1 justify-end'
          >
            <View className='bg-dark-100 rounded-t-3xl p-6 pb-12'>
              {/* Close Button */}
              <View className='flex-row justify-between items-center mb-6'>
                <Text className='text-white text-2xl font-bold'>Enable 2FA</Text>
                <TouchableOpacity onPress={() => setShowTwoFactorModal(false)}>
                  <Ionicons name='close' size={24} color='#ffffff' />
                </TouchableOpacity>
              </View>

              {/* Info Section */}
              <View className='bg-accent/10 border-l-4 border-accent rounded-lg p-4 mb-6'>
                <Text className='text-accent font-bold mb-2'>Two-Factor Authentication</Text>
                <Text className='text-light-300 text-xs leading-5'>
                  Download an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy to get started.
                </Text>
              </View>

              {/* QR Code Placeholder */}
              <View className='bg-dark-200 rounded-2xl p-6 items-center mb-6'>
                <View className='w-40 h-40 bg-light-300/20 rounded-xl items-center justify-center'>
                  <MaterialCommunityIcons name='qrcode' size={60} color='#9CA4AB' />
                </View>
                <Text className='text-light-300 text-xs mt-4'>Scan this code with your authenticator app</Text>
              </View>

              {/* Error Message */}
              {twoFactorError ? (
                <View className='bg-red-500/20 border-l-4 border-red-500 rounded-lg p-3 mb-4'>
                  <Text className='text-red-400 text-sm'>{twoFactorError}</Text>
                </View>
              ) : null}

              {/* Verification Code */}
              <View className='mb-6'>
                <Text className='text-white font-semibold mb-2'>Verification Code</Text>
                <TextInput
                  placeholder='000000'
                  placeholderTextColor='#9CA4AB'
                  maxLength={6}
                  keyboardType='numeric'
                  value={twoFactorCode}
                  onChangeText={(text) => {
                    setTwoFactorCode(text)
                    setTwoFactorError('')
                  }}
                  className='bg-dark-200 text-white text-2xl text-center rounded-xl px-4 py-3 border border-light-300/20 font-bold tracking-widest'
                />
              </View>

              {/* Backup Codes Notice */}
              <View className='bg-dark-200 rounded-xl p-3 mb-6'>
                <Text className='text-light-300 text-xs leading-5'>
                  <Text className='font-bold'>Save backup codes:</Text> You'll receive backup codes that can be used if
                  you lose access to your authenticator app
                </Text>
              </View>

              {/* Buttons */}
              <View className='flex-row gap-3'>
                <TouchableOpacity
                  onPress={() => setShowTwoFactorModal(false)}
                  className='flex-1 bg-dark-200 rounded-xl py-3 items-center'
                >
                  <Text className='text-white font-semibold'>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSetupTwoFactor}
                  disabled={loading}
                  className='flex-1 bg-accent rounded-xl py-3 items-center'
                >
                  {loading ? (
                    <ActivityIndicator color='#1A1A2E' />
                  ) : (
                    <Text className='text-dark-300 font-bold'>Verify & Enable</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

export default Security