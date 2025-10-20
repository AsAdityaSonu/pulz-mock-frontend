import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import apiService from '../../services/api';

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

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    is_private: false,
  });

  useEffect(() => {
    loadProfile();
    loadStats();
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
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
        <Header title="Profile" />
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
      <Header title="Profile" />
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Profile Header */}
        <View className={`mx-4 mt-6 mb-6 p-6 rounded-2xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}>
          <View className="items-center">
            {/* Avatar */}
            <View className={`w-24 h-24 rounded-full items-center justify-center mb-4 ${
              isDark ? 'bg-purple-900' : 'bg-purple-100'
            }`}
            style={{
              shadowColor: '#8b5cf6',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}>
              <Text className={`text-2xl font-bold ${
                isDark ? 'text-purple-300' : 'text-purple-600'
              }`}>
                {profile ? getInitials(profile.full_name) : 'U'}
              </Text>
            </View>

            {/* Name and Verification */}
            <View className="flex-row items-center mb-2">
              <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {profile?.full_name}
              </Text>
              {profile?.is_verified && (
                <Ionicons 
                  name="checkmark-circle" 
                  size={20} 
                  color="#3b82f6" 
                  style={{ marginLeft: 8 }}
                />
              )}
            </View>

            {/* Username and Email */}
            <Text className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              @{profile?.user_name}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {profile?.email}
            </Text>

            {/* Bio */}
            {profile?.bio && (
              <Text className={`text-center mt-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {profile.bio}
              </Text>
            )}

            {/* Join Date */}
            <Text className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Joined {profile ? formatJoinDate(profile.created_at) : ''}
            </Text>

            {/* Edit Profile Button */}
            <TouchableOpacity
              onPress={() => setShowEditModal(true)}
              className="mt-4 px-6 py-2 bg-purple-500 rounded-full"
              style={{
                shadowColor: '#8b5cf6',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text className="text-white font-semibold">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        {stats && (
          <View className="mx-4 mb-6">
            <View className="flex-row flex-wrap justify-between">
              {/* Posts Stats */}
              <View className={`w-[48%] mb-4 p-4 rounded-xl ${
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
                  <Ionicons name="document-text" size={24} color="#8b5cf6" />
                  <Text className={`text-2xl font-bold mt-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stats.posts.total}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Posts
                  </Text>
                </View>
              </View>

              {/* Followers */}
              <View className={`w-[48%] mb-4 p-4 rounded-xl ${
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
                  <Ionicons name="people" size={24} color="#10b981" />
                  <Text className={`text-2xl font-bold mt-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stats.profile.followers}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Followers
                  </Text>
                </View>
              </View>

              {/* Following */}
              <View className={`w-[48%] mb-4 p-4 rounded-xl ${
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
                  <Ionicons name="person-add" size={24} color="#3b82f6" />
                  <Text className={`text-2xl font-bold mt-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stats.profile.following}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Following
                  </Text>
                </View>
              </View>

              {/* Current Streak */}
              <View className={`w-[48%] mb-4 p-4 rounded-xl ${
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
                  <Ionicons name="flame" size={24} color="#f59e0b" />
                  <Text className={`text-2xl font-bold mt-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stats.streaks.current}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Day Streak
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Achievements Summary */}
        {stats && (
          <View className={`mx-4 mb-6 p-4 rounded-xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="trophy" size={24} color="#f59e0b" />
                <View className="ml-3">
                  <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Achievements
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stats.achievements.completed} unlocked
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className={`text-lg font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  {stats.achievements.points}
                </Text>
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  points
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Settings Options */}
        <View className="mx-4 mb-6">
          {[
            { icon: 'settings-outline', title: 'Account Settings', subtitle: 'Privacy and security' },
            { icon: 'notifications-outline', title: 'Notifications', subtitle: 'Manage your notifications' },
            { icon: 'shield-outline', title: 'Privacy', subtitle: 'Control your privacy settings' },
            { icon: 'help-circle-outline', title: 'Help & Support', subtitle: 'Get help and contact us' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              className={`mb-3 p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center">
                <View className={`w-10 h-10 rounded-full items-center justify-center ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <Ionicons 
                    name={item.icon as keyof typeof Ionicons.glyphMap} 
                    size={20} 
                    color={isDark ? '#9ca3af' : '#6b7280'} 
                  />
                </View>
                <View className="ml-3 flex-1">
                  <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.subtitle}
                  </Text>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={isDark ? '#6b7280' : '#9ca3af'} 
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className={`mx-4 mb-6 flex-row items-center justify-center px-6 py-4 rounded-xl ${
            isDark ? 'bg-red-900 border border-red-800' : 'bg-red-50 border border-red-200'
          }`}
          style={{
            shadowColor: '#ef4444',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons name="log-out-outline" size={20} color={isDark ? '#f87171' : '#dc2626'} />
          <Text className={`ml-2 font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <View className={`flex-row items-center justify-between px-4 py-3 border-b ${
            isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Edit Profile
            </Text>
            <TouchableOpacity onPress={handleUpdateProfile}>
              <Text className="text-lg font-semibold text-purple-500">
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <View className="space-y-4">
              <View>
                <Text className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  First Name
                </Text>
                <TextInput
                  value={editForm.first_name}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, first_name: text }))}
                  className={`p-3 rounded-lg border ${
                    isDark 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  placeholder="Enter your first name"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                />
              </View>

              <View>
                <Text className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Last Name
                </Text>
                <TextInput
                  value={editForm.last_name}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, last_name: text }))}
                  className={`p-3 rounded-lg border ${
                    isDark 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  placeholder="Enter your last name"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                />
              </View>

              <View>
                <Text className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Bio
                </Text>
                <TextInput
                  value={editForm.bio}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, bio: text }))}
                  className={`p-3 rounded-lg border h-20 ${
                    isDark 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <View className="flex-row items-center justify-between">
                <Text className={`text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Private Account
                </Text>
                <TouchableOpacity
                  onPress={() => setEditForm(prev => ({ ...prev, is_private: !prev.is_private }))}
                  className={`w-12 h-6 rounded-full ${
                    editForm.is_private ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                >
                  <View className={`w-5 h-5 rounded-full bg-white mt-0.5 ${
                    editForm.is_private ? 'ml-6' : 'ml-0.5'
                  }`} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};
