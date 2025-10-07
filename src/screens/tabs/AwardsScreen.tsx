import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, Trophy, Star, Medal } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import { ScrollableContainer } from '../../components/ScrollableContainer';

const AwardsScreenComponent: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const achievements = [
    {
      icon: Trophy,
      title: 'First Post',
      description: 'Share your first post with the community',
      earned: true,
      color: '#fbbf24',
    },
    {
      icon: Star,
      title: 'Popular Creator',
      description: 'Get 100 likes on a single post',
      earned: false,
      color: '#8b5cf6',
    },
    {
      icon: Medal,
      title: 'Streak Master',
      description: 'Maintain a 30-day streak',
      earned: false,
      color: '#f59e0b',
    },
    {
      icon: Award,
      title: 'Community Helper',
      description: 'Help 10 community members',
      earned: false,
      color: '#10b981',
    },
  ];

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
      <Header title="Awards" />
      <ScrollableContainer>
        {/* Achievement Progress */}
        <View className="py-4">
          <View className="items-center mb-8">
            <View
              className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-yellow-800' : 'bg-yellow-100'}`}
            >
              <Trophy size={32} color={isDark ? '#fbbf24' : '#f59e0b'} />
            </View>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              1 / 16
            </Text>
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Achievements Unlocked
            </Text>
          </View>

          {/* Progress Categories */}
          <View className="flex-row justify-around mb-8">
            <View className="items-center">
              <View
                className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${isDark ? 'bg-blue-800' : 'bg-blue-100'}`}
              >
                <Star size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
              </View>
              <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Social
              </Text>
              <Text className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>0/5</Text>
            </View>
            <View className="items-center">
              <View
                className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${isDark ? 'bg-green-800' : 'bg-green-100'}`}
              >
                <Award size={20} color={isDark ? '#4ade80' : '#10b981'} />
              </View>
              <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Activity
              </Text>
              <Text className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>1/6</Text>
            </View>
            <View className="items-center">
              <View
                className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${isDark ? 'bg-purple-800' : 'bg-purple-100'}`}
              >
                <Medal size={20} color={isDark ? '#a855f7' : '#7c3aed'} />
              </View>
              <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Special
              </Text>
              <Text className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>0/5</Text>
            </View>
          </View>

          {/* Achievements Section */}
          <Text className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Your Achievements
          </Text>

          <View className="space-y-4 mb-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <View
                  key={index}
                  className={`p-4 rounded-xl border ${
                    achievement.earned
                      ? isDark
                        ? 'bg-gray-800 border-purple-600'
                        : 'bg-purple-50 border-purple-200'
                      : isDark
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <View className="flex-row items-start">
                    <View
                      className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                        achievement.earned
                          ? 'bg-purple-600'
                          : isDark
                            ? 'bg-gray-700'
                            : 'bg-gray-300'
                      }`}
                    >
                      <IconComponent
                        size={20}
                        color={achievement.earned ? '#ffffff' : isDark ? '#9ca3af' : '#6b7280'}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} ${
                          !achievement.earned ? 'opacity-60' : ''
                        }`}
                      >
                        {achievement.title}
                      </Text>
                      <Text
                        className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} ${
                          !achievement.earned ? 'opacity-60' : ''
                        }`}
                      >
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

          {/* Coming Soon Achievements */}
          <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Coming Soon
          </Text>
          <View className="space-y-3 mb-8">
            {[
              { emoji: '🎮', title: 'Gaming Pro', description: 'Complete 100 gaming sessions' },
              { emoji: '👥', title: 'Social Butterfly', description: 'Connect with 50 friends' },
              { emoji: '🔥', title: 'On Fire', description: 'Get featured 5 times' },
              { emoji: '💎', title: 'Diamond Member', description: 'Reach premium status' },
              { emoji: '🌟', title: 'Rising Star', description: 'Get 1000 total likes' },
              { emoji: '🎯', title: 'Goal Crusher', description: 'Complete 20 challenges' },
            ].map((achievement, index) => (
              <View
                key={index}
                className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'} opacity-75`}
              >
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-3">{achievement.emoji}</Text>
                  <View className="flex-1">
                    <Text className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {achievement.title}
                    </Text>
                    <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {achievement.description}
                    </Text>
                  </View>
                  <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Locked
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View className="items-center py-6">
            <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Keep engaging with the community to unlock more achievements!
            </Text>
          </View>

          {/* Removed bottom padding to fix space above tab bar */}
        </View>
      </ScrollableContainer>
    </SafeAreaView>
  );
};

export const AwardsScreen = React.memo(AwardsScreenComponent);
