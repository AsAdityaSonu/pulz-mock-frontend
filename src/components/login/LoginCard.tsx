import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { User, Lock, Eye, EyeOff } from 'lucide-react-native';
import { CustomInput } from '../CustomInput';
import { CustomButton } from '../CustomButton';
import { useTheme } from '../../context/ThemeContext';

interface LoginCardProps {
  credential: string;
  setCredential: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  isLoading: boolean;
  handleLogin: () => void;
  navigation: any;
}

export const LoginCard: React.FC<LoginCardProps> = ({
  credential,
  setCredential,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading,
  handleLogin,
  navigation,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSignupNavigation = () => {
    navigation.replace('Signup');
  };

  return (
    <View className="px-5">
      <View 
        className={`
          ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
          border rounded-3xl px-5 py-6
        `}
        style={{
          shadowColor: isDark ? '#000' : '#8b5cf6',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {/* Sign In Header */}
        <View className="mb-6 text-center">
          <Text className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Sign In
          </Text>
          <Text className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Enter your credentials to access your account
          </Text>
        </View>

        {/* Form Inputs */}
        <View className="space-y-2 mb-1">
          <CustomInput
            icon={User}
            placeholder="Username, Email or Phone"
            value={credential}
            onChangeText={setCredential}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            icon={Lock}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? EyeOff : Eye}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />
        </View>

        {/* Forgot Password */}
        <TouchableOpacity className="mb-4 self-end">
          <Text className="text-purple-600 font-semibold text-base">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Login Button - only this triggers handleLogin */}
        <CustomButton
          title={isLoading ? 'Signing In...' : 'Sign In'}
          onPress={() => {
            if (typeof handleLogin === 'function') {
              handleLogin();
            }
          }}
          loading={isLoading}
          variant='outline'
          size="medium"
          style={{ 
            marginBottom: 24,
            shadowColor: '#8b5cf6',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        />

        {/* Divider */}
        <View className="flex-row items-center mb-6">
          <View className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
          <Text className={`mx-4 ${isDark ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
            or
          </Text>
          <View className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
        </View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center">
          <Text className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text className="text-purple-600 font-bold text-base">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
