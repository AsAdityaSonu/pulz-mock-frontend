import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import apiService from '../../services/api';

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'streak' | 'engagement' | 'social' | 'consistency';
  progress: number;
  total: number;
  reward: number;
  completed: boolean;
  claimed: boolean;
  completedAt: string | null;
  icon: string;
  badge: string | null;
}

interface AchievementStats {
  totalAchievements: number;
  completedAchievements: number;
  totalPoints: number;
  categoryStats: {
    [key: string]: {
      total: number;
      completed: number;
    };
  };
  completionPercentage: number;
}

const AwardsScreenComponent: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    loadAchievements();
    loadStats();
  }, []);

  const loadAchievements = async () => {
    try {
      const response = await apiService.getAchievements();
      setAchievements(response);
    } catch (error) {
      console.error('Error loading achievements:', error);
      Alert.alert('Error', 'Failed to load achievements');
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiService.getAchievementStats();
      setStats(response);
    } catch (error) {
      console.error('Error loading stats:', error);
      Alert.alert('Error', 'Failed to load achievement stats');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimAchievement = async (achievementId: string) => {
    try {
      setClaimingId(achievementId);
      const response = await apiService.claimAchievement(achievementId);
      
      // Update local state
      setAchievements(prev => 
        prev.map(achievement => 
          achievement.id === achievementId 
            ? { ...achievement, claimed: true }
            : achievement
        )
      );
      
      Alert.alert(
        'Reward Claimed! 🎉',
        `You earned ${response.points} points!`,
        [{ text: 'Awesome!', style: 'default' }]
      );
      
      // Reload stats to update points
      loadStats();
    } catch (error) {
      console.error('Error claiming achievement:', error);
      Alert.alert('Error', 'Failed to claim reward');
    } finally {
      setClaimingId(null);
    }
  };

  const getIconName = (iconType: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      trophy: 'trophy',
      bullseye: 'radio-button-on',
      fire: 'flame',
      star: 'star',
      medal: 'medal',
      crown: 'diamond'
    };
    return iconMap[iconType] || 'trophy';
  };

  const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
    const categoryMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      streak: 'flame',
      engagement: 'heart',
      social: 'people',
      consistency: 'checkmark-circle'
    };
    return categoryMap[category] || 'trophy';
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      streak: '#f59e0b',
      engagement: '#ef4444',
      social: '#3b82f6',
      consistency: '#10b981'
    };
    return colorMap[category] || '#8b5cf6';
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.type === selectedCategory);

  const categories = [
    { key: 'all', label: 'All', icon: 'apps' as keyof typeof Ionicons.glyphMap },
    { key: 'streak', label: 'Streaks', icon: 'flame' as keyof typeof Ionicons.glyphMap },
    { key: 'engagement', label: 'Engagement', icon: 'heart' as keyof typeof Ionicons.glyphMap },
    { key: 'social', label: 'Social', icon: 'people' as keyof typeof Ionicons.glyphMap },
    { key: 'consistency', label: 'Consistency', icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap },
  ];

  const renderAchievement = (achievement: Achievement) => {
    const progressPercentage = (achievement.progress / achievement.total) * 100;
    const canClaim = achievement.completed && !achievement.claimed;
    
    return (
      <TouchableOpacity
        key={achievement.id}
        className={`mx-4 mb-4 rounded-2xl overflow-hidden ${
          achievement.completed 
            ? canClaim
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
              : isDark 
                ? 'bg-gray-800 border border-green-600' 
                : 'bg-green-50 border border-green-200'
            : isDark 
              ? 'bg-gray-800' 
              : 'bg-white'
        }`}
        style={{
          shadowColor: achievement.completed ? (canClaim ? '#f59e0b' : '#10b981') : '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: achievement.completed ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 5,
          backgroundColor: achievement.completed 
            ? canClaim 
              ? '#f59e0b' 
              : isDark 
                ? '#1f2937' 
                : '#f0fdf4'
            : isDark 
              ? '#1f2937' 
              : '#ffffff'
        }}
        onPress={canClaim ? () => handleClaimAchievement(achievement.id) : undefined}
        disabled={claimingId === achievement.id}
      >
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center flex-1">
              <View className={`w-14 h-14 rounded-full items-center justify-center mr-4 ${
                achievement.completed 
                  ? canClaim
                    ? 'bg-white bg-opacity-20'
                    : 'bg-green-100'
                  : isDark 
                    ? 'bg-gray-700' 
                    : 'bg-gray-100'
              }`}>
                <Ionicons 
                  name={getIconName(achievement.icon)} 
                  size={24} 
                  color={
                    achievement.completed 
                      ? canClaim 
                        ? '#ffffff'
                        : '#10b981'
                      : isDark 
                        ? '#9ca3af' 
                        : '#6b7280'
                  } 
                />
              </View>
              <View className="flex-1">
                <Text className={`font-bold text-lg ${
                  achievement.completed 
                    ? canClaim 
                      ? 'text-white' 
                      : isDark 
                        ? 'text-green-400' 
                        : 'text-green-700'
                    : isDark 
                      ? 'text-white' 
                      : 'text-gray-900'
                }`}>
                  {achievement.title}
                </Text>
                <Text className={`text-sm mt-1 ${
                  achievement.completed 
                    ? canClaim 
                      ? 'text-white opacity-90' 
                      : isDark 
                        ? 'text-green-300' 
                        : 'text-green-600'
                    : isDark 
                      ? 'text-gray-400' 
                      : 'text-gray-600'
                }`}>
                  {achievement.description}
                </Text>
              </View>
            </View>
            
            <View className="items-end">
              {achievement.completed ? (
                canClaim ? (
                  <View className="bg-white bg-opacity-20 px-3 py-2 rounded-full">
                    <Text className="text-white font-bold text-sm">
                      {claimingId === achievement.id ? 'Claiming...' : 'Claim +' + achievement.reward}
                    </Text>
                  </View>
                ) : (
                  <View className="items-center">
                    <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                    <Text className={`text-xs mt-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      Claimed
                    </Text>
                  </View>
                )
              ) : (
                <View className="items-center">
                  <Text className={`text-lg font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    +{achievement.reward}
                  </Text>
                  <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    points
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          {!achievement.completed && (
            <View className="mt-3">
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
        <Header title="Awards" />
        <View className="flex-1 justify-center items-center">
          <Text className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Loading achievements...
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
      <Header title="Awards" />
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Stats Overview */}
        {stats && (
          <View className="mx-4 mt-6 mb-6">
            <View
              className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <View className="items-center mb-4">
                <View className={`w-20 h-20 rounded-full items-center justify-center mb-3 ${
                  isDark ? 'bg-purple-900' : 'bg-purple-100'
                }`}>
                  <Ionicons name="trophy" size={32} color="#8b5cf6" />
                </View>
                <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats.completedAchievements}/{stats.totalAchievements}
                </Text>
                <Text className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Achievements Unlocked
                </Text>
                <Text className={`text-sm mt-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                  {stats.completionPercentage}% Complete
                </Text>
              </View>
              
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Ionicons name="flash" size={20} color="#f59e0b" />
                  <Text className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stats.totalPoints}
                  </Text>
                  <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Points
                  </Text>
                </View>
                
                {Object.entries(stats.categoryStats).map(([category, categoryData]) => (
                  <View key={category} className="items-center">
                    <Ionicons 
                      name={getCategoryIcon(category)} 
                      size={20} 
                      color={getCategoryColor(category)} 
                    />
                    <Text className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {categoryData.completed}/{categoryData.total}
                    </Text>
                    <Text className={`text-xs capitalize ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {category}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Category Filter */}
        <View className="mb-6">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            <View className="flex-row space-x-3">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.key}
                  onPress={() => setSelectedCategory(category.key)}
                  className={`px-4 py-2 rounded-full flex-row items-center ${
                    selectedCategory === category.key
                      ? 'bg-purple-500'
                      : isDark
                        ? 'bg-gray-800'
                        : 'bg-white'
                  }`}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Ionicons 
                    name={category.icon} 
                    size={16} 
                    color={
                      selectedCategory === category.key
                        ? '#ffffff'
                        : isDark
                          ? '#9ca3af'
                          : '#6b7280'
                    } 
                  />
                  <Text className={`ml-2 font-medium ${
                    selectedCategory === category.key
                      ? 'text-white'
                      : isDark
                        ? 'text-gray-300'
                        : 'text-gray-700'
                  }`}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Achievements List */}
        <View className="mb-4">
          {filteredAchievements.length > 0 ? (
            // Sort achievements: unclaimed completed first, then by completion status, then by progress
            filteredAchievements
              .sort((a, b) => {
                if (a.completed && !a.claimed && (!b.completed || b.claimed)) return -1;
                if (b.completed && !b.claimed && (!a.completed || a.claimed)) return 1;
                if (a.completed && !b.completed) return -1;
                if (b.completed && !a.completed) return 1;
                return (b.progress / b.total) - (a.progress / a.total);
              })
              .map(renderAchievement)
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
                No achievements in this category yet.{'\n'}Keep engaging to unlock rewards!
              </Text>
            </View>
          )}
        </View>

        {/* Motivational Message */}
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
            "Achievement is not the destination, but the journey of growth."
          </Text>
          <Text className={`text-center mt-2 font-semibold ${
            isDark ? 'text-purple-400' : 'text-purple-600'
          }`}>
            Keep pushing your limits! 🚀
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const AwardsScreen = React.memo(AwardsScreenComponent);
