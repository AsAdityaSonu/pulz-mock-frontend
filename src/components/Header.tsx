import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ThemeSwitch } from './ThemeSwitch';

interface HeaderProps {
  title: string;
  showThemeSwitch?: boolean;
  rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showThemeSwitch = false,
  rightComponent,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View
      className={`px-6 py-4 border-b ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}
    >
      <View className="flex-row justify-between items-center">
        <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </Text>
        {showThemeSwitch && <ThemeSwitch />}
        {rightComponent}
      </View>
    </View>
  );
};
