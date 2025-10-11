import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { styles } from './Button.styles';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'outline',
  size = 'medium',
  icon,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size], fullWidth && styles.fullWidth];

    switch (variant) {
      case 'primary':
        return [
          ...baseStyle,
          { backgroundColor: disabled ? (isDark ? '#6b7280' : '#9ca3af') : '#8b5cf6' },
          style,
        ];
      case 'secondary':
        return [
          ...baseStyle,
          {
            backgroundColor: disabled
              ? (isDark ? '#374151' : '#f3f4f6')
              : (isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.15)'),
          },
          style,
        ];
      case 'outline':
        return [
          ...baseStyle,
          {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: disabled ? (isDark ? '#6b7280' : '#9ca3af') : '#8b5cf6',
          },
          style,
        ];
      default:
        return [...baseStyle, style];
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];

    switch (variant) {
      case 'primary':
        return [
          ...baseTextStyle,
          { color: disabled ? (isDark ? '#6b7280' : '#9ca3af') : '#fff' },
          textStyle,
        ];
      case 'secondary':
      case 'outline':
        return [
          ...baseTextStyle,
          {
            color: disabled ? (isDark ? '#6b7280' : '#9ca3af') : '#8b5cf6',
            fontWeight: '700' as const,
          },
          textStyle,
        ];
      default:
        return [...baseTextStyle, textStyle];
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary':
        return disabled ? (isDark ? '#6b7280' : '#9ca3af') : '#fff';
      case 'secondary':
      case 'outline':
        return disabled ? (isDark ? '#6b7280' : '#9ca3af') : '#8b5cf6';
      default:
        return '#8b5cf6';
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.8}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={size === 'small' ? 16 : size === 'large' ? 22 : 18}
          color={getIconColor()}
          style={styles.icon}
        />
      )}
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};
