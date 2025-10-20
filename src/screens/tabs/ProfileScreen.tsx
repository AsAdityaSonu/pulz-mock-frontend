import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Menu, 
  CheckCircle, 
  Grid3X3, 
  Bookmark, 
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Calendar,
  MapPin,
  Link,
  Users,
  Camera,
  Edit3
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import { SettingsPanel } from '../../components/SettingsPanel';
import apiService from '../../services/api';

const { width } = Dimensions.get('window');

interface UserProfile {
  id: string;
  user_name: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  date_of_birth: string;
  is_private: boolean;
  interests: string[];
  profile_image?: string;
  bio?: string;
  is_verified: boolean;
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: string;
}

interface UserStats {
  posts: {
    total: number;
    likes: number;
    comments: number;
    shares: number;
    pulzPoints: number;
  };
  streaks: {
    current: number;
    longest: number;
  };
  achievements: {
    completed: number;
    points: number;
  };
  profile: {
    followers: number;
    following: number;
    joinedDate: string;
    isVerified: boolean;
  };
}

interface Post {
  id: string;
  content: string;
  sport: string;
  likes: number;
  comments: number;
  shares: number;
  pulzPoints: number;
  isLiked: boolean;
  createdAt: string;
  author: {
    username: string;
    displayName: string;
    avatar?: string;
  };
}

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [slideAnim] = useState(new Animated.Value(width));
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    is_private: false,
  });

  useEffect(() => {
    loadProfile();
    loadStats();
    loadUserPosts();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await apiService.getUserProfile();
      if (response.success) {
        setProfile(response.user);
        setEditForm({
          first_name: response.user.first_name,
          last_name: response.user.last_name,
          bio: response.user.bio || '',
          is_private: response.user.is_private,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiService.getUserStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      Alert.alert('Error', 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async () => {
    try {
      setPostsLoading(true);
      // For now, we'll use the feed API and filter for user posts
      // In a real app, you'd have a dedicated endpoint for user posts
      const response = await apiService.getFeed(1, 20);
      if (response.success) {
        // Filter posts by current user (this would be done server-side in production)
        const userPosts = response.posts.filter((post: any) => 
          post.author.username === profile?.user_name
        );
        setPosts(userPosts);
      }
    } catch (error) {
      console.error('Error loading user posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadProfile(), loadStats(), loadUserPosts()]);
    setRefreshing(false);
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await apiService.updateUserProfile(editForm);
      if (response.success) {
        setProfile(response.user);
        setShowEditModal(false);
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const toggleRightPanel = () => {
    if (showRightPanel) {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowRightPanel(false));
    } else {
      setShowRightPanel(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCompactNumber = (num: number): string => {
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View
      className={`mb-4 rounded-2xl overflow-hidden ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Post Header */}
      <View className="p-4 pb-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${
                isDark ? 'bg-purple-900' : 'bg-purple-100'
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  isDark ? 'text-purple-300' : 'text-purple-600'
                }`}
              >
                {getInitials(item.author.displayName)}
              </Text>
            </View>
            <View className="ml-3">
              <Text
                className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {item.author.displayName}
              </Text>
              <Text
                className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <MoreHorizontal
              size={20}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Post Content */}
      <View className="px-4 pb-2">
        <Text
          className={`text-base leading-5 ${
            isDark ? 'text-gray-100' : 'text-gray-800'
          }`}
        >
          {item.content}
        </Text>
        <View className="mt-2">
          <Text className="text-purple-500 font-medium">#{item.sport}</Text>
        </View>
      </View>

      {/* Post Actions */}
      <View className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-6">
            <TouchableOpacity className="flex-row items-center">
              <Heart
                size={20}
                color={item.isLiked ? '#ef4444' : (isDark ? '#9ca3af' : '#6b7280')}
                fill={item.isLiked ? '#ef4444' : 'none'}
              />
              <Text
                className={`ml-1 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {formatCompactNumber(item.likes)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center">
              <MessageCircle
                size={20}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <Text
                className={`ml-1 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {formatCompactNumber(item.comments)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center">
              <Share
                size={20}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
              <Text
                className={`ml-1 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {formatCompactNumber(item.shares)}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center">
            <Text className="text-purple-500 font-medium text-sm">
              +{formatCompactNumber(item.pulzPoints)} Pulz
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

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
        <Header
          title="Profile"
          rightComponent={
            <TouchableOpacity onPress={toggleRightPanel}>
              <Menu size={24} color={isDark ? '#ffffff' : '#111827'} />
            </TouchableOpacity>
          }
        />
        <View className="flex-1 justify-center items-center">
          <Text className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Loading profile...
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
      <Header
        title="Profile"
        rightComponent={
          <TouchableOpacity onPress={toggleRightPanel}>
            <Menu size={24} color={isDark ? '#ffffff' : '#111827'} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Cover Photo Area */}
        <View
          className={`h-32 ${isDark ? 'bg-gradient-to-r from-purple-900 to-blue-900' : 'bg-gradient-to-r from-purple-500 to-blue-500'}`}
         
        >
          <View className="absolute inset-0 bg-black opacity-20" />
        </View>

        {/* Profile Info */}
        <View className="px-4 -mt-16">
          {/* Avatar */}
          <View className="mb-6">
            <View
              className={`w-32 h-32 rounded-full items-center justify-center border-4 ${
                isDark ? 'bg-purple-900 border-gray-800' : 'bg-purple-100 border-white'
              }`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text
                className={`text-4xl font-bold ${
                  isDark ? 'text-purple-300' : 'text-purple-600'
                }`}
              >
                {profile ? getInitials(profile.full_name) : 'U'}
              </Text>
              <TouchableOpacity
                className="absolute bottom-2 right-2 w-8 h-8 bg-purple-500 rounded-full items-center justify-center"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Camera size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Name and Verification - Left Aligned */}
            <View className="mt-4 mb-3">
              <View className="flex-row items-center mb-2">
                <Text
                  className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {profile?.full_name}
                </Text>
                {profile?.is_verified && (
                  <CheckCircle
                    size={24}
                    color="#3b82f6"
                    style={{ marginLeft: 8 }}
                  />
                )}
              </View>

              {/* Username - Left Aligned */}
              <Text
                className={`text-lg mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                @{profile?.user_name}
              </Text>

              {/* Bio - Left Aligned */}
              {profile?.bio && (
                <Text
                  className={`text-base leading-6 mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {profile.bio}
                </Text>
              )}

              {/* Join Date - Left Aligned */}
              <View className="flex-row items-center">
                <Calendar size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text
                  className={`ml-2 text-sm ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}
                >
                  Joined {profile ? formatJoinDate(profile.created_at) : ''}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          {stats && (
            <View
              className={`mb-6 p-6 rounded-2xl ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View className="flex-row justify-around">
                <TouchableOpacity className="items-center">
                  <Text
                    className={`text-2xl font-bold ${
                      isDark ? 'text-purple-400' : 'text-purple-600'
                    }`}
                  >
                    {formatCompactNumber(stats.posts.total)}
                  </Text>
                  <Text
                    className={`text-sm mt-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Posts
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center">
                  <Text
                    className={`text-2xl font-bold ${
                      isDark ? 'text-purple-400' : 'text-purple-600'
                    }`}
                  >
                    {formatCompactNumber(stats.profile.followers)}
                  </Text>
                  <Text
                    className={`text-sm mt-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Followers
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center">
                  <Text
                    className={`text-2xl font-bold ${
                      isDark ? 'text-purple-400' : 'text-purple-600'
                    }`}
                  >
                    {formatCompactNumber(stats.profile.following)}
                  </Text>
                  <Text
                    className={`text-sm mt-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Following
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center">
                  <Text
                    className={`text-2xl font-bold ${
                      isDark ? 'text-purple-400' : 'text-purple-600'
                    }`}
                  >
                    {formatCompactNumber(stats.posts.pulzPoints)}
                  </Text>
                  <Text
                    className={`text-sm mt-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Pulz Points
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row mb-8 space-x-4">
            <TouchableOpacity
              onPress={() => setShowEditModal(true)}
              className="flex-1 py-3 bg-purple-500 rounded-xl flex-row items-center justify-center"
              style={{
                shadowColor: '#8b5cf6',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Edit3 size={18} color="#ffffff" />
              <Text className="text-white font-semibold ml-2">Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-6 py-3 rounded-xl border ${
                isDark
                  ? 'border-gray-600 bg-gray-800'
                  : 'border-gray-300 bg-white'
              }`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Users
                size={18}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
            </TouchableOpacity>
          </View>

          {/* Tab Navigation */}
          <View
            className={`flex-row mb-6 rounded-xl p-1 ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <TouchableOpacity
              onPress={() => setActiveTab('posts')}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-lg ${
                activeTab === 'posts'
                  ? 'bg-purple-500'
                  : 'bg-transparent'
              }`}
            >
              <Grid3X3
                size={18}
                color={
                  activeTab === 'posts'
                    ? '#ffffff'
                    : isDark
                    ? '#9ca3af'
                    : '#6b7280'
                }
              />
              <Text
                className={`ml-2 font-medium ${
                  activeTab === 'posts'
                    ? 'text-white'
                    : isDark
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                Posts
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('saved')}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-lg ${
                activeTab === 'saved'
                  ? 'bg-purple-500'
                  : 'bg-transparent'
              }`}
            >
              <Bookmark
                size={18}
                color={
                  activeTab === 'saved'
                    ? '#ffffff'
                    : isDark
                    ? '#9ca3af'
                    : '#6b7280'
                }
              />
              <Text
                className={`ml-2 font-medium ${
                  activeTab === 'saved'
                    ? 'text-white'
                    : isDark
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                Saved
              </Text>
            </TouchableOpacity>
          </View>

          {/* Posts Section */}
          {activeTab === 'posts' && (
            <View>
              {postsLoading ? (
                <View className="py-12">
                  <Text
                    className={`text-center ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Loading posts...
                  </Text>
                </View>
              ) : posts.length > 0 ? (
                <FlatList
                  data={posts}
                  renderItem={renderPost}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="h-4" />}
                />
              ) : (
                <View className="py-16 items-center">
                  <Grid3X3
                    size={48}
                    color={isDark ? '#4b5563' : '#d1d5db'}
                  />
                  <Text
                    className={`mt-4 text-lg font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    No posts yet
                  </Text>
                  <Text
                    className={`mt-2 text-center px-8 ${
                      isDark ? 'text-gray-500' : 'text-gray-500'
                    }`}
                  >
                    Share your first post to get started!
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Saved Section */}
          {activeTab === 'saved' && (
            <View className="py-16 items-center">
              <Bookmark
                size={48}
                color={isDark ? '#4b5563' : '#d1d5db'}
              />
              <Text
                className={`mt-4 text-lg font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                No saved posts
              </Text>
              <Text
                className={`mt-2 text-center px-8 ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}
              >
                Posts you save will appear here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Settings Panel */}
      <SettingsPanel
        visible={showRightPanel}
        onClose={toggleRightPanel}
        slideAnim={slideAnim}
        isDark={isDark}
        onLogout={handleLogout}
      />

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditModal(false)}
      >
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <View className={`px-4 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Edit Profile
              </Text>
              <TouchableOpacity onPress={handleUpdateProfile}>
                <Text className="text-base text-purple-500 font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 px-4 py-6">
            <View className="space-y-6">
              <View>
                <Text
                  className={`text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  First Name
                </Text>
                <TextInput
                  value={editForm.first_name}
                  onChangeText={(text) => setEditForm((prev) => ({ ...prev, first_name: text }))}
                  className={`px-4 py-3 rounded-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter first name"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                />
              </View>

              <View>
                <Text
                  className={`text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Last Name
                </Text>
                <TextInput
                  value={editForm.last_name}
                  onChangeText={(text) => setEditForm((prev) => ({ ...prev, last_name: text }))}
                  className={`px-4 py-3 rounded-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter last name"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                />
              </View>

              <View>
                <Text
                  className={`text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Bio
                </Text>
                <TextInput
                  value={editForm.bio}
                  onChangeText={(text) => setEditForm((prev) => ({ ...prev, bio: text }))}
                  className={`px-4 py-3 rounded-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Tell us about yourself"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View className="flex-row items-center justify-between">
                <Text
                  className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Private Account
                </Text>
                <TouchableOpacity
                  onPress={() => setEditForm((prev) => ({ ...prev, is_private: !prev.is_private }))}
                  className={`w-12 h-6 rounded-full ${
                    editForm.is_private ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      editForm.is_private ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                    style={{ marginTop: 2 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};
