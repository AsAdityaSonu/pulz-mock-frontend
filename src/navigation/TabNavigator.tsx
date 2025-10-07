import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Zap, Plus, Award, User } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { HomeScreen } from '../screens/tabs/HomeScreen';
import { StreaksScreen } from '../screens/tabs/StreaksScreen';
import { CreateScreen } from '../screens/tabs/CreateScreen';
import { AwardsScreen } from '../screens/tabs/AwardsScreen';
import { ProfileScreen } from '../screens/tabs/ProfileScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        // Performance optimization - preload all screens for instant switching
        lazy: false,
        tabBarHideOnKeyboard: Platform.OS === 'ios',
        tabBarStyle: {
          backgroundColor: isDark ? '#111827' : '#ffffff',
          borderTopColor: isDark ? '#374151' : '#e5e7eb',
          borderTopWidth: 0.5,
          height: 85,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: isDark ? '#9ca3af' : '#6b7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 0,  // Removed margin to eliminate space above labels
        },
        tabBarIconStyle: {
          marginBottom: 0,  // Adjusted to center icons better
        },
        tabBarAllowFontScaling: false,
      }}
      screenListeners={{
        focus: () => {
          // Smooth focus transitions
          if (Platform.OS === 'ios') {
            // Optional: Add haptic feedback for iOS
            // You can uncomment this if you install expo-haptics
            // import * as Haptics from 'expo-haptics';
            // Haptics.selectionAsync();
          }
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tab.Screen
        name="Streaks"
        component={StreaksScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Zap size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Plus size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tab.Screen
        name="Awards"
        component={AwardsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Award size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User size={size} color={color} strokeWidth={2} />,
        }}
      />
    </Tab.Navigator>
  );
};