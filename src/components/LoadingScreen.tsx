import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const LoadingScreen: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View className={`flex-1 justify-center items-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <View className="items-center">
        <Text className={`text-4xl font-bold text-purple-600 mb-4`}>Pulz</Text>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</Text>
      </View>
    </View>
  );
};
