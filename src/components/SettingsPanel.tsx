import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  X, 
  Moon, 
  Sun, 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  Info, 
  LogOut, 
  ChevronRight,
  Menu
} from 'lucide-react-native';
import { ThemeSwitch } from './ThemeSwitch';

const { width } = Dimensions.get('window');

interface SettingsItem {
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}

interface SettingsPanelProps {
  visible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
  isDark: boolean;
  onLogout: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  visible,
  onClose,
  slideAnim,
  isDark,
  onLogout,
}) => {
  const settingsItems: SettingsItem[] = [
    {
      icon: User,
      title: 'Account Settings',
      subtitle: 'Privacy and security',
      color: '#3b82f6',
      onPress: () => {
        onClose();
        // Navigate to settings
      },
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage your notifications',
      color: '#f59e0b',
      onPress: () => {
        onClose();
        // Navigate to notifications
      },
    },
    {
      icon: Shield,
      title: 'Privacy',
      subtitle: 'Control your privacy settings',
      color: '#10b981',
      onPress: () => {
        onClose();
        // Navigate to privacy
      },
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help and contact us',
      color: '#8b5cf6',
      onPress: () => {
        onClose();
        // Navigate to help
      },
    },
  ];

  const handleLogout = () => {
    onClose();
    onLogout();
  };

  const handleAppInfo = () => {
    onClose();
    Alert.alert(
      'About Pulz',
      'Version 1.0.0\nBuilt with React Native\n\nA modern social platform for sports enthusiasts and gamers.'
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
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
          onPress={onClose}
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
              className={`px-6 py-6 border-b ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text
                    className={`text-2xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Settings
                  </Text>
                  <Text
                    className={`text-sm mt-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Customize your experience
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    isDark ? 'bg-gray-800' : 'bg-gray-100'
                  }`}
                >
                  <X
                    size={20}
                    color={isDark ? '#ffffff' : '#111827'}
                  />
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
                      {isDark ? (
                        <Moon size={22} color="#a855f7" />
                      ) : (
                        <Sun size={22} color="#8b5cf6" />
                      )}
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
                        className={`text-sm mt-0.5 ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {isDark ? 'Dark Mode' : 'Light Mode'}
                      </Text>
                    </View>
                  </View>
                  <ThemeSwitch />
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View
                className={`h-px mx-6 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              />

              {/* Settings Section */}
              <View className="px-6 py-6">
                <Text
                  className={`text-lg font-semibold mb-6 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Settings
                </Text>

                {settingsItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <View key={index}>
                      <TouchableOpacity
                        onPress={item.onPress}
                        className="flex-row items-center py-4"
                      >
                        <View
                          className="w-12 h-12 rounded-full items-center justify-center"
                          style={{ backgroundColor: item.color + '20' }}
                        >
                          <IconComponent size={22} color={item.color} />
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
                        <ChevronRight
                          size={20}
                          color={isDark ? '#6b7280' : '#9ca3af'}
                        />
                      </TouchableOpacity>
                      {index < settingsItems.length - 1 && (
                        <View
                          className={`h-px ml-16 ${
                            isDark ? 'bg-gray-800' : 'bg-gray-100'
                          }`}
                        />
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Divider */}
              <View
                className={`h-px mx-6 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              />

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
                  onPress={handleAppInfo}
                  className="flex-row items-center py-4"
                >
                  <View
                    className={`w-12 h-12 rounded-full items-center justify-center ${
                      isDark ? 'bg-gray-800' : 'bg-gray-100'
                    }`}
                  >
                    <Info
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
                      className={`text-sm mt-0.5 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Version, terms & privacy
                    </Text>
                  </View>
                  <ChevronRight
                    size={20}
                    color={isDark ? '#6b7280' : '#9ca3af'}
                  />
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View
                className={`h-px mx-6 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              />

              {/* Logout Section */}
              <View className="px-6 py-6">
                <TouchableOpacity
                  onPress={handleLogout}
                  className="flex-row items-center py-4"
                >
                  <View
                    className={`w-12 h-12 rounded-full items-center justify-center ${
                      isDark ? 'bg-red-900' : 'bg-red-100'
                    }`}
                  >
                    <LogOut
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
                      className={`text-sm mt-0.5 ${
                        isDark ? 'text-red-500' : 'text-red-500'
                      }`}
                    >
                      Sign out of your account
                    </Text>
                  </View>
                  <ChevronRight
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
  );
};
