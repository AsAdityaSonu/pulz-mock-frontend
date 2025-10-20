import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Trophy, 
  Target, 
  Flame, 
  Star, 
  Medal, 
  Diamond,
  Heart,
  Users,
  CheckCircle,
  Grid3X3,
  Zap,
  TrophyIcon
} from 'lucide-react-native';
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
    { key: 'all', label: 'All' },
    { key: 'streak', label: 'Streaks' },
    { key: 'engagement', label: 'Engagement' },
    { key: 'social', label: 'Social' },
    { key: 'consistency', label: 'Consistency' },
  ];

  const renderAchievement = (achievement: Achievement) => {
    const progressPercentage = (achievement.progress / achievement.total) * 100;
    const canClaim = achievement.completed && !achievement.claimed;
    
    return (
      <TouchableOpacity
        key={achievement.id}
        className={`mx-4 mb-6 rounded-2xl overflow-hidden ${
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
        <View className="p-6">
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
                {(() => {
                  const iconColor = achievement.completed 
                    ? canClaim 
                      ? '#ffffff'
                      : '#10b981'
                    : isDark 
                      ? '#9ca3af' 
                      : '#6b7280';
                  
                  switch(achievement.icon) {
                    case 'trophy':
                      return <Trophy size={24} color={iconColor} />;
                    case 'bullseye':
                      return <Target size={24} color={iconColor} />;
                    case 'fire':
                      return <Flame size={24} color={iconColor} />;
                    case 'star':
                      return <Star size={24} color={iconColor} />;
                    case 'medal':
                      return <Medal size={24} color={iconColor} />;
                    case 'crown':
                      return <Diamond size={24} color={iconColor} />;
                    default:
                      return <Trophy size={24} color={iconColor} />;
                  }
                })()}
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
                    <CheckCircle size={24} color="#10b981" />
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
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Stats Overview */}
        {stats && (
          <View className="mx-4 mt-6 mb-8">
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
              {/* Header Section - Left Aligned */}
              <View className="mb-6">
                <View className="flex-row items-center mb-4">
                  <View className={`w-16 h-16 rounded-full items-center justify-center mr-4 ${
                    isDark ? 'bg-purple-900' : 'bg-purple-100'
                  }`}>
                    <Trophy size={28} color="#8b5cf6" />
                  </View>
                  <View className="flex-1">
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
                </View>
              </View>
              
              {/* Stats Grid */}
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Zap size={20} color="#f59e0b" />
                  <Text className={`text-xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stats.totalPoints}
                  </Text>
                  <Text className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Points
                  </Text>
                </View>
                
                {Object.entries(stats.categoryStats).map(([category, categoryData]) => {
                  const iconColor = getCategoryColor(category);
                  let IconComponent;
                  
                  switch(category) {
                    case 'streak':
                      IconComponent = <Flame size={20} color={iconColor} />;
                      break;
                    case 'engagement':
                      IconComponent = <Heart size={20} color={iconColor} />;
                      break;
                    case 'social':
                      IconComponent = <Users size={20} color={iconColor} />;
                      break;
                    case 'consistency':
                      IconComponent = <CheckCircle size={20} color={iconColor} />;
                      break;
                    default:
                      IconComponent = <Trophy size={20} color={iconColor} />;
                  }
                  
                  return (
                    <View key={category} className="items-center">
                      {IconComponent}
                      <Text className={`text-xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {categoryData.completed}/{categoryData.total}
                      </Text>
                      <Text className={`text-xs mt-1 capitalize ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {category}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* Category Filter */}
        <View className="mb-8">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            <View className="flex-row space-x-4">
              {categories.map((category) => {
                const iconColor = selectedCategory === category.key
                  ? '#ffffff'
                  : isDark
                    ? '#9ca3af'
                    : '#6b7280';
                
                let IconComponent;
                switch(category.key) {
                  case 'all':
                    IconComponent = <Grid3X3 size={16} color={iconColor} />;
                    break;
                  case 'streak':
                    IconComponent = <Flame size={16} color={iconColor} />;
                    break;
                  case 'engagement':
                    IconComponent = <Heart size={16} color={iconColor} />;
                    break;
                  case 'social':
                    IconComponent = <Users size={16} color={iconColor} />;
                    break;
                  case 'consistency':
                    IconComponent = <CheckCircle size={16} color={iconColor} />;
                    break;
                  default:
                    IconComponent = <Grid3X3 size={16} color={iconColor} />;
                }
                
                return (
                  <TouchableOpacity
                    key={category.key}
                    onPress={() => setSelectedCategory(category.key)}
                    className={`px-5 py-3 rounded-full flex-row items-center ${
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
                    {IconComponent}
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
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Achievements List */}
        <View className="mb-8">
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
              <Trophy 
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
        <View className={`mx-4 mb-8 p-8 rounded-2xl ${
          isDark ? 'bg-gray-800' : 'bg-purple-50'
        }`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}>
          <View className="flex-row items-center mb-4">
            <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
              isDark ? 'bg-purple-900' : 'bg-purple-100'
            }`}>
              <Star size={20} color="#8b5cf6" />
            </View>
            <View className="flex-1">
              <Text className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Keep Going!
              </Text>
              <Text className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Every achievement starts with a single step
              </Text>
            </View>
          </View>
          <Text className={`text-base font-medium italic ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            "Achievement is not the destination, but the journey of growth."
          </Text>
          <Text className={`mt-3 font-semibold ${
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
