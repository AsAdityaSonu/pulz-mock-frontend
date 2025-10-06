import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Lock, Calendar, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { CustomInput } from '../CustomInput';
import { CustomButton } from '../CustomButton';
import { CircularButton } from '../CustomCircularButton';

interface Step3SecurityProps {
  formData: {
    password: string;
    confirmPassword: string;
    date_of_birth: string;
  };
  onInputChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

export const Step3Security: React.FC<Step3SecurityProps> = ({
  formData,
  onInputChange,
  onNext,
  onBack,
  isValid
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View className="py-4">
      {/* Header */}
      <View className="items-center mb-12">
        <View className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${
          isDark ? 'bg-green-900/30' : 'bg-green-50'
        }`} style={{
          shadowColor: '#10b981',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
        }}>
          <Lock size={32} color={isDark ? '#34d399' : '#10b981'} />
        </View>
        <Text className={`text-3xl font-bold mb-3 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Secure Your Account
        </Text>
        <Text className={`text-center px-6 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
          Create a strong password and confirm your age
        </Text>
      </View>

      {/* Form Fields */}
      <View className="mb-8">
        <CustomInput
          icon={Lock}
          placeholder="Password (min. 6 characters)"
          value={formData.password}
          onChangeText={(value) => onInputChange('password', value)}
          secureTextEntry={!showPassword}
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconPress={() => setShowPassword(!showPassword)}
        />

        <CustomInput
          icon={Lock}
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(value) => onInputChange('confirmPassword', value)}
          secureTextEntry={!showConfirmPassword}
          rightIcon={showConfirmPassword ? EyeOff : Eye}
          onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <CustomInput
          icon={Calendar}
          placeholder="Date of Birth (YYYY-MM-DD)"
          value={formData.date_of_birth}
          onChangeText={(value) => onInputChange('date_of_birth', value)}
        />
      </View>

      {/* Helper Text */}
      <Text
        className={`text-sm mb-10 text-center ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
      >
        Password must be at least 6 characters. You must be at least 13 years old to join. Your birthday won't be shown publicly.
      </Text>

      {/* Navigation Buttons */}
      <View className="flex-row justify-between">
        <CircularButton
          icon={ArrowLeft}
          onPress={onBack}
          disabled={false}
          style={{ marginRight: 12 }}
        />
        <CircularButton
          icon={ArrowRight}
          onPress={onNext}
          disabled={!isValid}
        />
      </View>
    </View>
  );
};