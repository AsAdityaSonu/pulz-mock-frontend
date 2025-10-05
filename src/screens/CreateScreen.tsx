import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Camera, Image, Type, Video } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { Header } from '../components/Header';
import { CustomButton } from '../components/CustomButton';

export const CreateScreen: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <Header title="Create" />
      <ScrollView className="flex-1 px-6 py-4">
        <View className="py-12">
          <View className="items-center mb-8">
            <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-green-800' : 'bg-green-100'}`}>
              <Camera size={24} color={isDark ? '#34d399' : '#10b981'} />
            </View>
            <Text className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Share Your Story
            </Text>
            <Text className={`text-center px-6 mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Share your thoughts with the world! Create posts, upload photos, and express yourself.
            </Text>
          </View>
          
          <View className="space-y-4">
            <CustomButton
              title="Write a Post"
              icon={Type}
              variant="outline"
              size="large"
              onPress={() => {}}
            />
            <CustomButton
              title="Upload Photo"
              icon={Image}
              variant="outline"
              size="large"
              onPress={() => {}}
            />
            <CustomButton
              title="Record Video"
              icon={Video}
              variant="outline"
              size="large"
              onPress={() => {}}
            />
            <CustomButton
              title="Take Photo"
              icon={Camera}
              variant="primary"
              size="large"
              onPress={() => {}}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};