import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

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
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-purple-600 border-purple-600';
      case 'secondary':
        return 'bg-gray-600 border-gray-600';
      case 'outline':
        return 'bg-transparent border-purple-600';
      default:
        return 'bg-purple-600 border-purple-600';
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
    const colorStyles = variant === 'outline' ? 'text-purple-600' : 'text-white';
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
          color={variant === 'outline' ? '#7c3aed' : '#ffffff'} 
        />
      ) : (
        <>
          {Icon && (
            <Icon 
              size={20} 
              color={variant === 'outline' ? '#7c3aed' : '#ffffff'} 
              style={{ marginRight: 8 }} 
            />
          )}
          <Text className={getTextStyles()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};