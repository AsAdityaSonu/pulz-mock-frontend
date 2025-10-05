import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const handleLogin = async () => {
    if (!credential || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const success = await login(credential, password);
    setIsLoading(false);

    if (!success) {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 py-8 min-h-full">
          {/* Header with theme switch */}
          <View className="flex-row justify-between items-center mb-12">
            <View>
              <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Welcome to
              </Text>
              <Text className="text-4xl font-bold text-purple-600 mt-1">Pulz</Text>
            </View>
            <ThemeSwitch />
          </View>

          {/* Login Form */}
          <View className="flex-1 justify-center">
            <Text className={`text-2xl font-semibold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Sign In
            </Text>

            {/* Credential Input */}
            <CustomInput
              icon={Mail}
              placeholder="Username, Email or Phone"
              value={credential}
              onChangeText={setCredential}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Password Input */}
            <CustomInput
              icon={Lock}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            {/* Login Button */}
            <CustomButton
              title={isLoading ? 'Signing In...' : 'Sign In'}
              onPress={handleLogin}
              loading={isLoading}
              size="large"
              style={{ marginBottom: 16 }}
            />

            {/* Sign Up Link */}
            <View className="flex-row justify-center">
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text className="text-purple-600 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};