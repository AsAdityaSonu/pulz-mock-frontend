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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import { ThemeSwitch } from '../../components/ThemeSwitch';
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

interface SettingsItem {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
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
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const toggleRightPanel = () => {
    if (showRightPanel) {
      // Hide panel
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowRightPanel(false));
    } else {
      // Show panel
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
              <Ionicons name="menu" size={24} color={isDark ? '#ffffff' : '#111827'} />
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
            <Ionicons name="menu" size={24} color={isDark ? '#ffffff' : '#111827'} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Profile Header */}
        <View
          className={`mx-4 mt-6 mb-6 p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <View className="items-center">
            {/* Avatar */}
            <View
              className={`w-24 h-24 rounded-full items-center justify-center mb-4 ${
                isDark ? 'bg-purple-900' : 'bg-purple-100'
              }`}
              style={{
                shadowColor: '#8b5cf6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Text
                className={`text-2xl font-bold ${isDark ? 'text-purple-300' : 'text-purple-600'}`}
              >
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
              <Text className="text-white font-semibold text-center">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        {stats && (
          <View className="mx-4 mb-6">
            <View
              className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Your Stats
              </Text>

              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text
                    className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
                  >
                    {stats.profile.followers}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Followers
                  </Text>
                </View>

                <View className="items-center">
                  <Text
                    className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
                  >
                    {stats.profile.following}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Following
                  </Text>
                </View>

                <View className="items-center">
                  <Text
                    className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
                  >
                    {stats.posts.total}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Posts
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Right Panel Modal */}
      <Modal
        visible={showRightPanel}
        animationType="none"
        transparent={true}
        onRequestClose={toggleRightPanel}
      >
        <View style={{ flex: 1 }}>
          {/* Overlay */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            onPress={toggleRightPanel}
            activeOpacity={1}
          />

          {/* Right Panel */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: width * 0.8,
              transform: [{ translateX: slideAnim }],
            }}
            className={`${isDark ? 'bg-gray-900' : 'bg-white'}`}
          >
            <SafeAreaView className="flex-1">
              {/* Panel Header */}
              <View
                className={`px-6 py-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text
                      className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                    >
                      Settings
                    </Text>
                    <Text className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Customize your experience
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={toggleRightPanel}
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      isDark ? 'bg-gray-800' : 'bg-gray-100'
                    }`}
                  >
                    <Ionicons name="close" size={20} color={isDark ? '#ffffff' : '#111827'} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Panel Content */}
              <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Theme Section */}
                <View className="px-6 py-6">
                  <Text
                    className={`text-lg font-semibold mb-6 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Appearance
                  </Text>

                  <TouchableOpacity className="flex-row items-center justify-between py-4">
                    <View className="flex-row items-center flex-1">
                      <View
                        className={`w-12 h-12 rounded-full items-center justify-center ${
                          isDark ? 'bg-purple-900' : 'bg-purple-100'
                        }`}
                      >
                        <Ionicons
                          name={isDark ? 'moon' : 'sunny'}
                          size={22}
                          color={isDark ? '#a855f7' : '#8b5cf6'}
                        />
                      </View>
                      <View className="ml-4 flex-1">
                        <Text
                          className={`font-semibold text-base ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          Theme
                        </Text>
                        <Text
                          className={`text-sm mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                        >
                          {isDark ? 'Dark Mode' : 'Light Mode'}
                        </Text>
                      </View>
                    </View>
                    <ThemeSwitch />
                  </TouchableOpacity>
                </View>

                {/* Divider */}
                <View className={`h-px mx-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

                {/* Settings Section */}
                <View className="px-6 py-6">
                  <Text
                    className={`text-lg font-semibold mb-6 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Settings
                  </Text>

                  {(
                    [
                      {
                        icon: 'person-outline',
                        title: 'Account Settings',
                        subtitle: 'Privacy and security',
                        color: '#3b82f6',
                        onPress: () => {
                          toggleRightPanel();
                          // Navigate to settings
                        },
                      },
                      {
                        icon: 'notifications-outline',
                        title: 'Notifications',
                        subtitle: 'Manage your notifications',
                        color: '#f59e0b',
                        onPress: () => {
                          toggleRightPanel();
                          // Navigate to notifications
                        },
                      },
                      {
                        icon: 'shield-checkmark-outline',
                        title: 'Privacy',
                        subtitle: 'Control your privacy settings',
                        color: '#10b981',
                        onPress: () => {
                          toggleRightPanel();
                          // Navigate to privacy
                        },
                      },
                      {
                        icon: 'help-circle-outline',
                        title: 'Help & Support',
                        subtitle: 'Get help and contact us',
                        color: '#8b5cf6',
                        onPress: () => {
                          toggleRightPanel();
                          // Navigate to help
                        },
                      },
                    ] as SettingsItem[]
                  ).map((item, index) => (
                    <View key={index}>
                      <TouchableOpacity
                        onPress={item.onPress}
                        className="flex-row items-center py-4"
                      >
                        <View
                          className="w-12 h-12 rounded-full items-center justify-center"
                          style={{ backgroundColor: item.color + '20' }}
                        >
                          <Ionicons name={item.icon} size={22} color={item.color} />
                        </View>
                        <View className="ml-4 flex-1">
                          <Text
                            className={`font-semibold text-base ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {item.title}
                          </Text>
                          <Text
                            className={`text-sm mt-0.5 ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            {item.subtitle}
                          </Text>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color={isDark ? '#6b7280' : '#9ca3af'}
                        />
                      </TouchableOpacity>
                      {index < 3 && (
                        <View className={`h-px ml-16 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                      )}
                    </View>
                  ))}
                </View>

                {/* Divider */}
                <View className={`h-px mx-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

                {/* About Section */}
                <View className="px-6 py-6">
                  <Text
                    className={`text-lg font-semibold mb-6 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    About
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      toggleRightPanel();
                      Alert.alert(
                        'About Pulz',
                        'Version 1.0.0\nBuilt with React Native\n\nA modern social platform for sports enthusiasts and gamers.'
                      );
                    }}
                    className="flex-row items-center py-4"
                  >
                    <View
                      className={`w-12 h-12 rounded-full items-center justify-center ${
                        isDark ? 'bg-gray-800' : 'bg-gray-100'
                      }`}
                    >
                      <Ionicons
                        name="information-circle-outline"
                        size={22}
                        color={isDark ? '#9ca3af' : '#6b7280'}
                      />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text
                        className={`font-semibold text-base ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        App Info
                      </Text>
                      <Text
                        className={`text-sm mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        Version, terms & privacy
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={isDark ? '#6b7280' : '#9ca3af'}
                    />
                  </TouchableOpacity>
                </View>

                {/* Divider */}
                <View className={`h-px mx-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

                {/* Logout Section */}
                <View className="px-6 py-6">
                  <TouchableOpacity
                    onPress={() => {
                      toggleRightPanel();
                      handleLogout();
                    }}
                    className="flex-row items-center py-4"
                  >
                    <View
                      className={`w-12 h-12 rounded-full items-center justify-center ${
                        isDark ? 'bg-red-900' : 'bg-red-100'
                      }`}
                    >
                      <Ionicons
                        name="log-out-outline"
                        size={22}
                        color={isDark ? '#f87171' : '#dc2626'}
                      />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text
                        className={`font-semibold text-base ${
                          isDark ? 'text-red-400' : 'text-red-600'
                        }`}
                      >
                        Sign Out
                      </Text>
                      <Text
                        className={`text-sm mt-0.5 ${isDark ? 'text-red-500' : 'text-red-500'}`}
                      >
                        Sign out of your account
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={isDark ? '#f87171' : '#dc2626'}
                    />
                  </TouchableOpacity>
                </View>

                {/* Bottom Spacing */}
                <View className="h-8" />
              </ScrollView>
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>

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
