import React from 'react';
import { View, Text } from 'react-native';
import { Heart, MessageCircle, Share } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { Header } from '../components/Header';
import { ScrollableContainer } from '../components/ScrollableContainer';

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <Header title="Home" showThemeSwitch />
      <ScrollableContainer>
        <View className="items-center py-12">
          <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-purple-800' : 'bg-purple-100'}`}>
            <Heart size={24} color={isDark ? '#c084fc' : '#7c3aed'} />
          </View>
          <Text className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome to your feed!
          </Text>
          <Text className={`text-center px-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            This is where you'll see posts from people you follow. Start connecting with others to see content here.
          </Text>
          <View className="flex-row mt-6 space-x-4">
            <View className={`px-4 py-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Posts</Text>
            </View>
            <View className={`px-4 py-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Stories</Text>
            </View>
            <View className={`px-4 py-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Live</Text>
            </View>
          </View>
        </View>
      </ScrollableContainer>
    </View>
  );
};