import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { styles } from './OutlineButton.styles';

export type OutlineButtonSize = 'small' | 'medium' | 'large';

interface OutlineButtonProps {
  title: string;
  onPress: () => void;
  size?: OutlineButtonSize;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const OutlineButton: React.FC<OutlineButtonProps> = ({
  title,
  onPress,
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
    const border = '#fff';
    return [
      styles.button,
      styles[size],
      fullWidth && styles.fullWidth,
      {
        borderColor: disabled ? (isDark ? '#6b7280' : '#9ca3af') : border,
      },
      style,
    ];
  };

  const getTextStyle = () => {
    const color = '#fff';
    return [
      styles.text,
      styles[`${size}Text`],
      {
        color: disabled ? (isDark ? '#6b7280' : '#9ca3af') : color,
      },
      textStyle,
    ];
  };

  const getIconColor = () => {
    const color = '#fff';
    return disabled ? (isDark ? '#6b7280' : '#9ca3af') : color;
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
          size={size === 'small' ? 20 : size === 'large' ? 28 : 24}
          color={getIconColor()}
          style={styles.icon}
        />
      )}
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};
