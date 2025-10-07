import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, Calendar, Target } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { Header } from '../components/Header';
import { ScrollableContainer } from '../components/ScrollableContainer';

export const StreaksScreen: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#ffffff'}
        translucent={false}
      />
      <Header title="Streaks" />
      <ScrollableContainer>
        <View className="items-center py-12">
          <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-yellow-800' : 'bg-yellow-100'}`}>
            <Zap size={24} color={isDark ? '#fbbf24' : '#f59e0b'} />
          </View>
          <Text className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Build Your Streaks!
          </Text>
          <Text className={`text-center px-6 mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Track your daily activities and maintain your streaks! Keep building those healthy habits.
          </Text>
          <View className="w-full space-y-4">
            <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
              <View className="flex-row items-center">
                <Calendar size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text className={`ml-3 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Daily Check-ins</Text>
              </View>
              <Text className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Coming soon...</Text>
            </View>
            <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
              <View className="flex-row items-center">
                <Target size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text className={`ml-3 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Goal Tracking</Text>
              </View>
              <Text className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Coming soon...</Text>
            </View>
          </View>
        </View>
      </ScrollableContainer>
    </SafeAreaView>
  );
};