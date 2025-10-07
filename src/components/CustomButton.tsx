import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: LucideIcon;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon: Icon,
  disabled,
  ...props
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return isDark
          ? 'bg-purple-700 border-purple-700'
          : 'bg-purple-600 border-purple-600';
      case 'secondary':
        return isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-gray-600 border-gray-600';
      case 'outline':
        return isDark
          ? 'bg-gray-900 border-purple-400 border-2'
          : 'bg-white border-purple-600 border-2';
      default:
        return isDark
          ? 'bg-purple-700 border-purple-700'
          : 'bg-purple-600 border-purple-600';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'py-2 px-4';
      case 'medium':
        return 'py-3 px-6';
      case 'large':
        return 'py-4 px-8';
      default:
        return 'py-3 px-6';
    }
  };

  const getTextStyles = () => {
    const baseStyles = 'text-center font-semibold';
    const sizeStyles = size === 'large' ? 'text-lg' : 'text-base';
    let colorStyles = '';
    if (variant === 'outline') {
      colorStyles = isDark ? 'text-purple-400' : 'text-purple-600';
    } else {
      colorStyles = 'text-white';
    }
    return `${baseStyles} ${sizeStyles} ${colorStyles}`;
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      className={`
        ${getVariantStyles()} 
        ${getSizeStyles()} 
        rounded-xl 
        border 
        flex-row 
        items-center 
        justify-center
        ${isDisabled ? 'opacity-50' : ''}
      `}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? (isDark ? '#a78bfa' : '#7c3aed') : '#ffffff'} 
        />
      ) : (
        <>
          {Icon && (
            <Icon 
              size={20} 
              color={variant === 'outline' ? (isDark ? '#a78bfa' : '#7c3aed') : '#ffffff'} 
              style={{ marginRight: 8 }} 
            />
          )}
          <Text className={getTextStyles()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};