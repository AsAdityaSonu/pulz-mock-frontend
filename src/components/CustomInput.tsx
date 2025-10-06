import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, TextInputProps } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

interface CustomInputProps extends TextInputProps {
  icon: LucideIcon;
  label?: string;
  error?: string;
  rightIcon?: LucideIcon;
  onRightIconPress?: () => void;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  icon: Icon,
  label,
  error,
  rightIcon: RightIcon,
  onRightIconPress,
  ...props
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className={`mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center border rounded-2xl px-4 py-[14px] ${
          error 
            ? 'border-red-500' 
            : isFocused
              ? 'border-purple-500'
              : isDark 
                ? 'border-gray-700/50 bg-gray-800/30' 
                : 'border-gray-300/50 bg-white/70'
        }`}
        style={{
          shadowColor: isDark ? '#000' : '#8b5cf6',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <Icon 
          size={20} 
          color={
            error 
              ? '#ef4444' 
              : isFocused 
                ? '#7c3aed'
                : isDark 
                  ? '#9ca3af' 
                  : '#6b7280'
          } 
        />
        <TextInput
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          className={`flex-1 ml-3 text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}
        />
        {RightIcon && (
          <TouchableOpacity onPress={onRightIconPress}>
            <RightIcon 
              size={20} 
              color={isDark ? '#9ca3af' : '#6b7280'} 
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-red-500 text-sm mt-1 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
};