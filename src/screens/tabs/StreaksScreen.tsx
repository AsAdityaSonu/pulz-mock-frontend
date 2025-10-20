import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import apiService from '../../services/api';

const { width } = Dimensions.get('window');

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  weekProgress: boolean[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  completed: boolean;
  icon: string;
}

export const StreaksScreen: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: '',
    weekProgress: [false, false, false, false, false, false, false]
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreakData();
    loadAchievements();
  }, []);

  const loadStreakData = async () => {
    try {
      const response = await apiService.getMyStreak();
      setStreakData(response);
    } catch (error) {
      console.error('Error loading streak data:', error);
      Alert.alert('Error', 'Failed to load streak data');
    }
  };

  const loadAchievements = async () => {
    try {
      const response = await apiService.getAchievements();
      setAchievements(response);
    } catch (error) {
      console.error('Error loading achievements:', error);
      Alert.alert('Error', 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return '🌱';
    if (streak < 7) return '🔥';
    if (streak < 30) return '⚡';
    if (streak < 100) return '💎';
    return '👑';
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return 'Start your journey today!';
    if (streak < 7) return 'Building momentum!';
    if (streak < 30) return 'On fire! Keep it up!';
    if (streak < 100) return 'Incredible dedication!';
    return 'Legendary streak master!';
  };

  const renderWeekProgress = () => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    
    return (
      <View className="flex-row justify-between items-center px-4">
        {days.map((day, index) => {
          const isActive = streakData.weekProgress[index];
          const isToday = index === new Date().getDay() - 1;
          
          return (
            <View key={index} className="items-center">
              <Text className={`text-xs mb-2 font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {day}
              </Text>
              <View 
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  isActive 
                    ? 'bg-purple-500' 
                    : isDark 
                      ? 'bg-gray-700' 
                      : 'bg-gray-200'
                } ${isToday ? 'border-2 border-purple-400' : ''}`}
                style={isToday ? {
                  shadowColor: '#8b5cf6',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3,
                } : {}}
              >
                {isActive && (
                  <Ionicons name="checkmark" size={16} color="#ffffff" />
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderAchievement = (achievement: Achievement, index: number) => {
    const progressPercentage = (achievement.progress / achievement.total) * 100;
    
    return (
      <TouchableOpacity
        key={achievement.id}
        className={`mx-4 mb-4 rounded-2xl overflow-hidden ${
          achievement.completed 
            ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
            : isDark 
              ? 'bg-gray-800' 
              : 'bg-white'
        }`}
        style={{
          shadowColor: achievement.completed ? '#f59e0b' : '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: achievement.completed ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 5,
          backgroundColor: achievement.completed 
            ? '#f59e0b' 
            : isDark 
              ? '#1f2937' 
              : '#ffffff'
        }}
      >
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center flex-1">
              <View className={`w-12 h-12 rounded-full items-center justify-center ${
                achievement.completed 
                  ? 'bg-white bg-opacity-20' 
                  : isDark 
                    ? 'bg-purple-900' 
                    : 'bg-purple-100'
              }`}>
                <Text className="text-2xl">{achievement.icon || '🏆'}</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className={`font-bold text-lg ${
                  achievement.completed 
                    ? 'text-white' 
                    : isDark 
                      ? 'text-white' 
                      : 'text-gray-900'
                }`}>
                  {achievement.title}
                </Text>
                <Text className={`text-sm ${
                  achievement.completed 
                    ? 'text-white opacity-90' 
                    : isDark 
                      ? 'text-gray-400' 
                      : 'text-gray-600'
                }`}>
                  {achievement.description}
                </Text>
              </View>
            </View>
            {achievement.completed && (
              <View className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <Text className="text-white font-bold text-sm">+{achievement.reward}</Text>
              </View>
            )}
          </View>
          
          {!achievement.completed && (
            <View className="mt-2">
              <View className="flex-row justify-between items-center mb-2">
                <Text className={`text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Progress: {achievement.progress}/{achievement.total}
                </Text>
                <Text className={`text-sm font-bold ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {Math.round(progressPercentage)}%
                </Text>
              </View>
              <View className={`h-2 rounded-full ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <View 
                  className="h-2 rounded-full bg-purple-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      >
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={isDark ? '#111827' : '#f9fafb'}
          translucent={false}
        />
        <Header title="Streaks" />
        <View className="flex-1 justify-center items-center">
          <Text className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Loading streaks...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#f9fafb'}
        translucent={false}
      />
      <Header title="Streaks" />
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Main Streak Card */}
        <View className="mx-4 mt-6 mb-6">
          <View
            className="bg-purple-600 rounded-3xl p-6"
            style={{
              shadowColor: '#8b5cf6',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 10,
            }}
          >
            <View className="items-center">
              <Text className="text-6xl mb-2">{getStreakEmoji(streakData.currentStreak)}</Text>
              <Text className="text-white text-5xl font-bold mb-2">
                {streakData.currentStreak}
              </Text>
              <Text className="text-white text-xl font-semibold mb-2">
                Day Streak
              </Text>
              <Text className="text-white opacity-90 text-center text-base">
                {getStreakMessage(streakData.currentStreak)}
              </Text>
              
              {streakData.longestStreak > 0 && (
                <View className="mt-4 bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <Text className="text-white font-medium">
                    Best: {streakData.longestStreak} days 🏆
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Weekly Progress */}
        <View className={`mx-4 mb-6 p-6 rounded-2xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              This Week
            </Text>
            <View className="flex-row items-center">
              <Ionicons 
                name="calendar-outline" 
                size={20} 
                color={isDark ? '#a855f7' : '#8b5cf6'} 
              />
              <Text className={`ml-2 font-semibold ${
                isDark ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {streakData.weekProgress.filter(Boolean).length}/7
              </Text>
            </View>
          </View>
          {renderWeekProgress()}
        </View>

        {/* Stats Cards */}
        <View className="flex-row mx-4 mb-6 space-x-3">
          <View className={`flex-1 p-4 rounded-xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}>
            <View className="items-center">
              <Ionicons name="trophy" size={24} color="#f59e0b" />
              <Text className={`text-2xl font-bold mt-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {streakData.longestStreak}
              </Text>
              <Text className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Best Streak
              </Text>
            </View>
          </View>
          
          <View className={`flex-1 p-4 rounded-xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}>
            <View className="items-center">
              <Ionicons name="flash" size={24} color="#10b981" />
              <Text className={`text-2xl font-bold mt-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {achievements.filter(a => a.completed).length}
              </Text>
              <Text className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Achievements
              </Text>
            </View>
          </View>
        </View>

        {/* Achievements Section */}
        <View className="mb-4">
          <Text className={`text-2xl font-bold mx-4 mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Achievements
          </Text>
          
          {achievements.length > 0 ? (
            achievements.map((achievement, index) => renderAchievement(achievement, index))
          ) : (
            <View className="mx-4 p-8 items-center">
              <Ionicons 
                name="trophy-outline" 
                size={48} 
                color={isDark ? '#4b5563' : '#d1d5db'} 
              />
              <Text className={`mt-4 text-center ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No achievements yet.{'\n'}Start your streak to unlock rewards!
              </Text>
            </View>
          )}
        </View>

        {/* Motivational Quote */}
        <View className={`mx-4 mb-6 p-6 rounded-2xl ${
          isDark ? 'bg-gray-800' : 'bg-blue-50'
        }`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}>
          <Text className={`text-center text-lg font-medium italic ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            "Success is the sum of small efforts repeated day in and day out."
          </Text>
          <Text className={`text-center mt-2 font-semibold ${
            isDark ? 'text-purple-400' : 'text-purple-600'
          }`}>
            - Robert Collier
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
