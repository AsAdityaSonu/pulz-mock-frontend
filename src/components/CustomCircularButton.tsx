import React from 'react';
import { TouchableOpacity, ActivityIndicator, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

interface CircularButtonProps {
  icon: LucideIcon;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const CircularButton: React.FC<CircularButtonProps> = ({
  icon: Icon,
  onPress,
  size = 'large',
  variant = 'outline',
  loading = false,
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Size logic
  const diameter = size === 'small' ? 36 : size === 'medium' ? 44 : 56;

  // Variant logic with theme
  let borderColor = '#7c3aed', bgColor = 'transparent', iconColor = '#7c3aed';
  if (variant === 'primary') {
    borderColor = isDark ? '#a78bfa' : '#7c3aed';
    bgColor = isDark ? '#7c3aed' : '#7c3aed';
    iconColor = '#fff';
  } else if (variant === 'secondary') {
    borderColor = isDark ? '#374151' : '#6b7280';
    bgColor = isDark ? '#374151' : '#6b7280';
    iconColor = '#fff';
  } else if (variant === 'outline') {
    borderColor = isDark ? '#a78bfa' : '#7c3aed';
    bgColor = isDark ? '#18181b' : 'transparent';
    iconColor = isDark ? '#a78bfa' : '#7c3aed';
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        width: diameter,
        height: diameter,
        borderRadius: diameter / 2,
        backgroundColor: bgColor,
        borderWidth: 2,
        borderColor,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <Icon size={diameter * 0.5} color={iconColor} />
      )}
    </TouchableOpacity>
  );
};
