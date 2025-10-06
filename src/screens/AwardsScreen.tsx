import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, Trophy, Star, Medal } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { Header } from '../components/Header';
import { ScrollableContainer } from '../components/ScrollableContainer';

export const AwardsScreen: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const achievements = [
    { icon: Trophy, title: 'First Post', description: 'Share your first post with the community', earned: true, color: '#fbbf24' },
    { icon: Star, title: 'Popular Creator', description: 'Get 100 likes on a single post', earned: false, color: '#8b5cf6' },
    { icon: Medal, title: 'Streak Master', description: 'Maintain a 30-day streak', earned: false, color: '#f59e0b' },
    { icon: Award, title: 'Community Helper', description: 'Help 10 community members', earned: false, color: '#10b981' },
  ];

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#ffffff'}
        translucent={false}
      />
      <Header title="Awards" />
      <ScrollableContainer>
        <View className="py-4">
          <Text className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Your Achievements
          </Text>
          
          <View className="space-y-4">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <View
                  key={index}
                  className={`p-4 rounded-xl border ${
                    achievement.earned
                      ? isDark ? 'bg-gray-800 border-purple-600' : 'bg-purple-50 border-purple-200'
                      : isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <View className="flex-row items-start">
                    <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                      achievement.earned 
                        ? 'bg-purple-600' 
                        : isDark ? 'bg-gray-700' : 'bg-gray-300'
                    }`}>
                      <IconComponent 
                        size={20} 
                        color={achievement.earned ? '#ffffff' : (isDark ? '#9ca3af' : '#6b7280')} 
                      />
                    </View>
                    <View className="flex-1">
                      <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} ${
                        !achievement.earned ? 'opacity-60' : ''
                      }`}>
                        {achievement.title}
                      </Text>
                      <Text className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} ${
                        !achievement.earned ? 'opacity-60' : ''
                      }`}>
                        {achievement.description}
                      </Text>
                      {achievement.earned && (
                        <Text className="text-purple-600 text-sm font-medium mt-2">Earned! 🎉</Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
          
          <View className="mt-8 items-center py-6">
            <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Keep engaging with the community to unlock more achievements!
            </Text>
          </View>
        </View>
      </ScrollableContainer>
    </SafeAreaView>
  );
};