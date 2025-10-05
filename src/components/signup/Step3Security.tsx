import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Lock, Calendar, Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { CustomInput } from '../CustomInput';
import { CustomButton } from '../CustomButton';

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
    <View>
      {/* Header */}
      <View className="items-center mb-6">
        <View className={`w-16 h-16 rounded-full items-center justify-center mb-3 ${
          isDark ? 'bg-green-800' : 'bg-green-100'
        }`}>
          <Lock size={28} color={isDark ? '#34d399' : '#10b981'} />
        </View>
        <Text className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Secure Your Account
        </Text>
        <Text className={`text-center px-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Create a strong password and confirm your age
        </Text>
      </View>

      {/* Form Fields */}
      <View className="space-y-4">
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
      <View className={`p-4 rounded-xl mt-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          • Password must be at least 6 characters{'\n'}
          • You must be at least 13 years old to join{'\n'}
          • Your birthday won't be shown publicly
        </Text>
      </View>

      {/* Navigation Buttons */}
      <View className="mt-12 space-y-3">
        <CustomButton
          title="Next"
          onPress={onNext}
          size="large"
          disabled={!isValid}
        />
        
        <CustomButton
          title="Back"
          variant="outline"
          onPress={onBack}
          size="large"
        />
      </View>
    </View>
  );
};