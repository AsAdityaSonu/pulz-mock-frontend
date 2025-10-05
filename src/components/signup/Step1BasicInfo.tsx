import React from 'react';
import { View, Text } from 'react-native';
import { User } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { CustomInput } from '../CustomInput';
import { CustomButton } from '../CustomButton';

interface Step1BasicInfoProps {
  formData: {
    first_name: string;
    last_name: string;
    user_name: string;
  };
  onInputChange: (field: string, value: string) => void;
  onNext: () => void;
  isValid: boolean;
}

export const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
  formData,
  onInputChange,
  onNext,
  isValid
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View>
      {/* Header */}
      <View className="items-center mb-6">
        <View className={`w-16 h-16 rounded-full items-center justify-center mb-3 ${
          isDark ? 'bg-purple-800' : 'bg-purple-100'
        }`}>
          <User size={28} color={isDark ? '#a855f7' : '#8b5cf6'} />
        </View>
        <Text className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Basic Information
        </Text>
        <Text className={`text-center px-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Let's start with your name and username
        </Text>
      </View>

      {/* Form Fields */}
      <View className="space-y-4">
        <CustomInput
          icon={User}
          placeholder="First Name"
          value={formData.first_name}
          onChangeText={(value) => onInputChange('first_name', value)}
          autoCapitalize="words"
        />

        <CustomInput
          icon={User}
          placeholder="Last Name"
          value={formData.last_name}
          onChangeText={(value) => onInputChange('last_name', value)}
          autoCapitalize="words"
        />

        <CustomInput
          icon={User}
          placeholder="Username"
          value={formData.user_name}
          onChangeText={(value) => onInputChange('user_name', value)}
          autoCapitalize="none"
        />
      </View>

      {/* Helper Text */}
      <Text className={`text-sm mt-4 text-center ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
        You can always change this later
      </Text>

      {/* Next Button */}
      <View className="mt-12">
        <CustomButton
          title="Next"
          onPress={onNext}
          size="large"
          disabled={!isValid}
        />
      </View>
    </View>
  );
};