import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';

export const ThreeDot: React.FC<{ size?: number }> = ({ size = 22 }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return <Ionicons name="ellipsis-horizontal" size={size} color={isDark ? '#9ca3af' : '#6b7280'} />;
};
