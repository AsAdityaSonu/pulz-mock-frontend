import React from 'react';
import { TouchableOpacity, ActivityIndicator, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

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
  // Size logic
  const diameter = size === 'small' ? 36 : size === 'medium' ? 44 : 56;

  // Variant logic
  let borderColor = '#7c3aed', bgColor = 'transparent', iconColor = '#7c3aed';
  if (variant === 'primary') {
    borderColor = '#7c3aed';
    bgColor = '#7c3aed';
    iconColor = '#fff';
  } else if (variant === 'secondary') {
    borderColor = '#6b7280';
    bgColor = '#6b7280';
    iconColor = '#fff';
  } else if (variant === 'outline') {
    borderColor = '#7c3aed';
    bgColor = 'rgba(124,58,237,0.08)';
    iconColor = '#7c3aed';
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
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
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
