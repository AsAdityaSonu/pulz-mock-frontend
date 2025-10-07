import React from 'react';
import { View, Text } from 'react-native';
import { User, UserCircle, AtSign } from 'lucide-react-native';
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
  isValid,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View className="py-4">
      {/* Header */}
      <View className="items-center mb-4">
        <View
          className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${
            isDark ? 'bg-purple-900' : 'bg-purple-100'
          }`}
          style={{
            shadowColor: '#8b5cf6',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <User size={32} color={isDark ? '#a855f7' : '#8b5cf6'} />
        </View>
        <Text
          className={`text-3xl font-bold mb-3 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          Basic Information
        </Text>
      </View>

      {/* Form Fields */}
      <View className="mb-0">
        <View style={{ marginBottom: 5 }}>
          <CustomInput
            icon={UserCircle}
            placeholder="First Name"
            value={formData.first_name}
            onChangeText={(value) => onInputChange('first_name', value)}
            autoCapitalize="words"
          />
        </View>

        <View style={{ marginBottom: 5 }}>
          <CustomInput
            icon={UserCircle}
            placeholder="Last Name"
            value={formData.last_name}
            onChangeText={(value) => onInputChange('last_name', value)}
            autoCapitalize="words"
          />
        </View>

        <CustomInput
          icon={AtSign}
          placeholder="Username"
          value={formData.user_name}
          onChangeText={(value) => onInputChange('user_name', value)}
          autoCapitalize="none"
        />
      </View>

      {/* Helper Text */}
      {/* <Text
        className={`text-sm mb-6 -mt-3 text-center ${isDark ? "text-gray-500" : "text-gray-500"}`}
      >
        You can always change this later in your profile
      </Text> */}

      {/* Next Button */}
      <CustomButton
        title="Continue"
        onPress={onNext}
        size="medium"
        variant="outline"
        disabled={!isValid}
        style={{
          marginTop: 16,
          shadowColor: '#8b5cf6',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      />
    </View>
  );
};
