import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, Calendar, Target } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import { ScrollableContainer } from '../../components/ScrollableContainer';

export const StreaksScreen: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#ffffff'}
        translucent={false}
      />
      <Header title="Streaks" />
      <ScrollableContainer>
        {/* Current Streak Display */}
        <View className="items-center py-8">
          <View
            className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-yellow-800' : 'bg-yellow-100'}`}
          >
            <Zap size={32} color={isDark ? '#fbbf24' : '#f59e0b'} />
          </View>
          <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            0 Days
          </Text>
          <Text
            className={`text-lg font-medium mb-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}
          >
            Current Streak
          </Text>
          <Text className={`text-center px-6 mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Start building your daily habits today!
          </Text>
        </View>

        {/* Streak Categories */}
        <View className="space-y-4 mb-8">
          <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Track Your Activities
          </Text>

          {[
            { icon: Calendar, title: 'Daily Login', streak: 0, color: 'blue' },
            { icon: Target, title: 'Workout', streak: 0, color: 'green' },
            { icon: Zap, title: 'Gaming Session', streak: 0, color: 'purple' },
          ].map((item, index) => (
            <View key={index} className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View
                    className={`w-12 h-12 rounded-full items-center justify-center ${
                      item.color === 'blue'
                        ? isDark
                          ? 'bg-blue-800'
                          : 'bg-blue-100'
                        : item.color === 'green'
                          ? isDark
                            ? 'bg-green-800'
                            : 'bg-green-100'
                          : isDark
                            ? 'bg-purple-800'
                            : 'bg-purple-100'
                    }`}
                  >
                    <item.icon
                      size={20}
                      color={
                        item.color === 'blue'
                          ? isDark
                            ? '#60a5fa'
                            : '#3b82f6'
                          : item.color === 'green'
                            ? isDark
                              ? '#4ade80'
                              : '#10b981'
                            : isDark
                              ? '#a855f7'
                              : '#7c3aed'
                      }
                    />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.title}
                    </Text>
                    <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Current streak: {item.streak} days
                    </Text>
                  </View>
                </View>
                <View className="items-center">
                  <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {item.streak}
                  </Text>
                  <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    days
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Weekly Progress */}
        <View className="mb-8">
          <Text className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            This Week's Progress
          </Text>
          <View className="flex-row justify-between">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <View key={index} className="items-center">
                <Text className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {day}
                </Text>
                <View
                  className={`w-8 h-8 rounded-full ${
                    index < 3
                      ? isDark
                        ? 'bg-green-700'
                        : 'bg-green-200'
                      : isDark
                        ? 'bg-gray-700'
                        : 'bg-gray-200'
                  }`}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View className="mb-8">
          <Text className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Achievements
          </Text>
          <View className="space-y-3">
            {[
              { title: 'First Step', description: 'Complete your first activity', earned: false },
              { title: '7 Day Warrior', description: 'Maintain a 7-day streak', earned: false },
              { title: 'Consistency King', description: 'Maintain a 30-day streak', earned: false },
              { title: 'Century Club', description: 'Maintain a 100-day streak', earned: false },
            ].map((achievement, index) => (
              <View
                key={index}
                className={`p-4 rounded-xl flex-row items-center ${
                  achievement.earned
                    ? isDark
                      ? 'bg-yellow-900 border border-yellow-700'
                      : 'bg-yellow-50 border border-yellow-200'
                    : isDark
                      ? 'bg-gray-800'
                      : 'bg-gray-50'
                }`}
              >
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center ${
                    achievement.earned
                      ? isDark
                        ? 'bg-yellow-700'
                        : 'bg-yellow-200'
                      : isDark
                        ? 'bg-gray-700'
                        : 'bg-gray-200'
                  }`}
                >
                  <Text className="text-lg">🏆</Text>
                </View>
                <View className="ml-3 flex-1">
                  <Text
                    className={`font-semibold ${
                      achievement.earned
                        ? isDark
                          ? 'text-yellow-300'
                          : 'text-yellow-700'
                        : isDark
                          ? 'text-gray-400'
                          : 'text-gray-600'
                    }`}
                  >
                    {achievement.title}
                  </Text>
                  <Text
                    className={`text-sm ${
                      achievement.earned
                        ? isDark
                          ? 'text-yellow-400'
                          : 'text-yellow-600'
                        : isDark
                          ? 'text-gray-500'
                          : 'text-gray-500'
                    }`}
                  >
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom padding */}
        <View className="h-4" />
      </ScrollableContainer>
    </SafeAreaView>
  );
};
