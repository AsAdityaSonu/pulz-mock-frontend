import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Shield, Lock, Eye, Users } from 'lucide-react-native';
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
          isDark ? 'bg-purple-900/30' : 'bg-purple-50'
        }`} style={{
          shadowColor: '#8b5cf6',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
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
      <View className={`p-4 rounded-xl border-2 mb-4 ${
        formData.is_private
          ? isDark ? 'bg-purple-900/30 border-purple-600' : 'bg-purple-50 border-purple-300'
          : isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'
      }`}>
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <Text className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Private Account
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Only approved followers can see your posts
            </Text>
          </View>
          <Switch
            value={formData.is_private}
            onValueChange={handleTogglePrivacy}
            trackColor={{ false: isDark ? '#374151' : '#d1d5db', true: '#8b5cf6' }}
            thumbColor={formData.is_private ? '#ffffff' : isDark ? '#9ca3af' : '#f3f4f6'}
            ios_backgroundColor={isDark ? '#374151' : '#d1d5db'}
          />
        </View>
      </View>

      {/* Explanation Cards */}
      <View className="space-y-3 mb-4">
        {/* Public Account */}
        <View className={`p-4 rounded-xl border ${
          !formData.is_private
            ? isDark ? 'bg-blue-900/20 border-blue-600' : 'bg-blue-50 border-blue-200'
            : isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
        }`}>
          <View className="flex-row items-center mb-2">
            <Eye size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
            <Text className={`ml-2 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Public Account
            </Text>
          </View>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            • Anyone can see your posts and gaming activity{'\n'}
            • Your profile appears in search results{'\n'}
            • Better for building a gaming community
          </Text>
        </View>

        {/* Private Account */}
        <View className={`p-4 rounded-xl border ${
          formData.is_private
            ? isDark ? 'bg-purple-900/20 border-purple-600' : 'bg-purple-50 border-purple-200'
            : isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
        }`}>
          <View className="flex-row items-center mb-2">
            <Lock size={20} color={isDark ? '#a855f7' : '#8b5cf6'} />
            <Text className={`ml-2 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Private Account
            </Text>
          </View>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            • Only approved followers see your content{'\n'}
            • You control who can follow you{'\n'}
            • More privacy and security
          </Text>
        </View>
      </View>

      {/* Note */}
      <View className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
        <View className="flex-row items-center mb-2">
          <Users size={16} color={isDark ? '#fbbf24' : '#f59e0b'} />
          <Text className={`ml-2 text-sm font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
            Note
          </Text>
        </View>
        <Text className={`text-xs ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
          You can change this setting anytime in your profile preferences.
        </Text>
      </View>

      {/* Additional Privacy Information */}
      <View className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Privacy Tips
        </Text>
        <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          • Choose public to grow your gaming network faster{'\n'}
          • Private accounts give you more control over followers{'\n'}
          • You can switch between public and private anytime{'\n'}
          • Private accounts still allow direct messages from friends{'\n'}
          • Your gaming achievements are always visible to followers
        </Text>
      </View>

      {/* Platform Features */}
      <View className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
        <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
          How Privacy Works on Pulz
        </Text>
        <Text className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
          Public accounts appear in search results, gaming leaderboards, and can be discovered by other gamers with similar interests. Private accounts require approval for new followers but still participate in game communities and challenges.
        </Text>
      </View>

      {/* Navigation Buttons */}
      <View className="space-y-4 mt-8">
        <CustomButton
          title="Continue"
          onPress={onNext}
          size="large"
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