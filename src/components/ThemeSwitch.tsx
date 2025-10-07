import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

export const ThemeSwitch: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className={`w-12 h-12 rounded-full items-center justify-center ${
        theme === 'dark'
          ? 'bg-purple-800 border border-purple-600'
          : 'bg-purple-200 border border-purple-300'
      }`}
    >
      {theme === 'dark' ? <Sun size={20} color="#dcbbfb" /> : <Moon size={20} color="#7c3aed" />}
    </TouchableOpacity>
  );
};
