import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeSwitch } from '../components/ThemeSwitch';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#ffffff'}
        translucent={false}
      />
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Profile
          </Text>
          <ThemeSwitch />
        </View>

        {/* User Info */}
        <View className="items-center mb-12">
          <View className={`w-24 h-24 rounded-full items-center justify-center mb-4 ${
            isDark ? 'bg-purple-800' : 'bg-purple-100'
          }`}>
            <Text className={`text-2xl font-bold ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {user?.name}
          </Text>
          <Text className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {user?.email}
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 justify-center items-center">
          <Text className={`text-center px-6 mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Your profile settings and preferences will be available here. 
            Customize your experience and manage your account.
          </Text>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className={`flex-row items-center px-6 py-3 rounded-xl ${
              isDark ? 'bg-red-900 border border-red-800' : 'bg-red-50 border border-red-200'
            }`}
          >
            <LogOut size={20} color={isDark ? '#f87171' : '#dc2626'} />
            <Text className={`ml-2 font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};