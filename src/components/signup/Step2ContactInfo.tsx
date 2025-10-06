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
    <View className="py-4">
      {/* Header */}
      <View className="items-center mb-12">
        <View className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${
          isDark ? 'bg-blue-900/30' : 'bg-blue-50'
        }`} style={{
          shadowColor: '#3b82f6',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
        }}>
          <Mail size={32} color={isDark ? '#60a5fa' : '#3b82f6'} />
        </View>
        <Text className={`text-3xl font-bold mb-3 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Contact Information
        </Text>
        <Text className={`text-center px-6 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
          How can we reach you?
        </Text>
      </View>

      {/* Form Fields */}
      <View className="space-y-5 mb-8">
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
      <Text className={`text-sm mb-10 text-center ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
        Your contact info is private and secure
      </Text>

      {/* Navigation Buttons */}
      <View className="space-y-4">
        <CustomButton
          title="Continue"
          onPress={onNext}
          size="large"
          disabled={!isValid}
          style={{
            shadowColor: '#8b5cf6',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
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