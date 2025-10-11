import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Colors } from '../../../../contexts/ThemeContext';
import { styles } from './AppBar.styles';
import { formatCompactNumber } from '@/src/utils/formatPulzPoints';

const appBarValues = {
  pulzPoints: 1247,
  notifications: [
    { id: 1, message: 'You have a new follower!' },
    { id: 2, message: 'Your post got 10 likes!' },
  ],
};

export function AppBar() {
  const { colorScheme } = useTheme();
  const themeColors = Colors[colorScheme];
  const notificationCount = appBarValues.notifications.length;
  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: themeColors.background,
          borderBottomColor: colorScheme === 'dark' ? '#333' : '#E5E5E5',
        },
      ]}
    >
      <View style={styles.leftSection}>
        <View style={styles.logo}>
          <Ionicons name="flash-outline" size={24} color={themeColors.tint} />
          <Text style={[styles.logoText, { color: themeColors.text }]}>Gamepulz</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="search-outline" size={20} color={themeColors.tabIconDefault} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={20} color={themeColors.tabIconDefault} />
          {notificationCount > 0 && (
            <View
              style={[
                styles.notificationDot,
                {
                  backgroundColor: themeColors.tint,
                  minWidth: 8,
                  minHeight: 8,
                  paddingHorizontal: notificationCount > 9 ? 3 : 0,
                },
              ]}
            >
              {notificationCount > 0 && notificationCount < 10 ? null : (
                <Text
                  style={{ color: '#fff', fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}
                >
                  {notificationCount > 9
                    ? notificationCount > 99
                      ? '99+'
                      : notificationCount
                    : ''}
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>
        <View style={[styles.pulzContainer, { backgroundColor: themeColors.tint }]}>
          <Ionicons name="flash-outline" size={16} color={themeColors.background} />
          <Text style={[styles.pulzText, { color: themeColors.background }]}>
            {formatCompactNumber(appBarValues.pulzPoints)} Pulz
          </Text>
        </View>
      </View>
    </View>
  );
}
