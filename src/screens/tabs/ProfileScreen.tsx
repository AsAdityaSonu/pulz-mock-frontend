import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Settings, Edit, Bell, Shield, HelpCircle } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import { ScrollableContainer } from '../../components/ScrollableContainer';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleLogout = () => {
    logout();
  };

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
      <Header title="Profile" />
      <ScrollableContainer>
        {/* User Info */}
        <View className="items-center py-4">
          <View
            className={`w-24 h-24 rounded-full items-center justify-center mb-4 ${
              isDark ? 'bg-purple-800' : 'bg-purple-100'
            }`}
          >
            <Text
              className={`text-2xl font-bold ${isDark ? 'text-purple-300' : 'text-purple-600'}`}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {user?.name}
          </Text>
          <Text className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {user?.email}
          </Text>

          <TouchableOpacity
            className={`mt-3 px-4 py-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
          >
            <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Stats */}
        <View className="flex-row justify-around mb-8">
          <View className="items-center">
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              0
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Posts</Text>
          </View>
          <View className="items-center">
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              0
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Following
            </Text>
          </View>
          <View className="items-center">
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              0
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Followers
            </Text>
          </View>
          <View className="items-center">
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              0
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Streak</Text>
          </View>
        </View>

        {/* Settings Options */}
        <View className="space-y-2 mb-8">
          {[
            { icon: Edit, title: 'Edit Profile', subtitle: 'Update your information' },
            { icon: Settings, title: 'Account Settings', subtitle: 'Privacy and security' },
            { icon: Bell, title: 'Notifications', subtitle: 'Manage your notifications' },
            { icon: Shield, title: 'Privacy', subtitle: 'Control your privacy settings' },
            { icon: HelpCircle, title: 'Help & Support', subtitle: 'Get help and contact us' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                >
                  <item.icon size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                </View>
                <View className="ml-3 flex-1">
                  <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className={`flex-row items-center justify-center px-6 py-4 rounded-xl ${
            isDark ? 'bg-red-900 border border-red-800' : 'bg-red-50 border border-red-200'
          }`}
        >
          <LogOut size={20} color={isDark ? '#f87171' : '#dc2626'} />
          <Text className={`ml-2 font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            Sign Out
          </Text>
        </TouchableOpacity>

        {/* Bottom padding */}
        <View className="h-4" />
      </ScrollableContainer>
    </SafeAreaView>
  );
};
