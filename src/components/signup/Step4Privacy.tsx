import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Shield } from 'lucide-react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { CircularButton } from '../CustomCircularButton';
import { useTheme } from '../../context/ThemeContext';
import { CustomButton } from '../CustomButton';

interface Step4PrivacyProps {
  formData: {
    is_private: boolean;
  };
  onInputChange: (field: string, value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4Privacy: React.FC<Step4PrivacyProps> = ({
  formData,
  onInputChange,
  onNext,
  onBack
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleTogglePrivacy = (value: boolean) => {
    onInputChange('is_private', value);
  };

  return (
    <View className="py-4">
      {/* Header */}
      <View className="items-center mb-12">
        <View className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${
          isDark ? 'bg-purple-900' : 'bg-purple-100'
        }`} style={{
          shadowColor: '#8b5cf6',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <Shield size={32} color={isDark ? '#a855f7' : '#8b5cf6'} />
        </View>
        <Text className={`text-3xl font-bold mb-3 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Privacy Settings
        </Text>
        <Text className={`text-center px-6 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
          Choose who can see your content and profile
        </Text>
      </View>

      {/* Privacy Toggle */}
         <View className="mb-8">
           <View className="flex-row items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: isDark ? '#2e1065' : '#f3e8ff' }}>
             <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Private Account</Text>
             <Switch
               value={formData.is_private}
               onValueChange={handleTogglePrivacy}
               trackColor={{ false: isDark ? '#374151' : '#d1d5db', true: '#8b5cf6' }}
               thumbColor={formData.is_private ? '#ffffff' : isDark ? '#9ca3af' : '#f3f4f6'}
               ios_backgroundColor={isDark ? '#374151' : '#d1d5db'}
             />
           </View>
         </View>





      {/* Helper Text */}
      <Text
        className={`text-sm mb-10 text-center ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
      >
        You can change this setting anytime in your profile preferences.
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
          disabled={false}
        />
      </View>
    </View>
  );
};