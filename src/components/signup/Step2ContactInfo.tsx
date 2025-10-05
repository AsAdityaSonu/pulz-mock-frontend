import React from 'react';
import { View, Text } from 'react-native';
import { Mail, Phone } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { CustomInput } from '../CustomInput';
import { CustomButton } from '../CustomButton';

interface Step2ContactInfoProps {
  formData: {
    email: string;
    phone_number: string;
  };
  onInputChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

export const Step2ContactInfo: React.FC<Step2ContactInfoProps> = ({
  formData,
  onInputChange,
  onNext,
  onBack,
  isValid
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View>
      {/* Header */}
      <View className="items-center mb-6">
        <View className={`w-16 h-16 rounded-full items-center justify-center mb-3 ${
          isDark ? 'bg-blue-800' : 'bg-blue-100'
        }`}>
          <Mail size={28} color={isDark ? '#60a5fa' : '#3b82f6'} />
        </View>
        <Text className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Contact Information
        </Text>
        <Text className={`text-center px-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          How can we reach you?
        </Text>
      </View>

      {/* Form Fields */}
      <View className="space-y-4">
        <CustomInput
          icon={Mail}
          placeholder="Email Address"
          value={formData.email}
          onChangeText={(value) => onInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <CustomInput
          icon={Phone}
          placeholder="Phone Number (e.g., +1234567890)"
          value={formData.phone_number}
          onChangeText={(value) => onInputChange('phone_number', value)}
          keyboardType="phone-pad"
        />
      </View>

      {/* Helper Text */}
      <Text className={`text-sm mt-4 text-center ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
        Your contact info is private and secure
      </Text>

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