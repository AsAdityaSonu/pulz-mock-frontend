import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Image, Type, Video } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import { CustomButton } from '../../components/CustomButton';
import { ScrollableContainer } from '../../components/ScrollableContainer';

export const CreateScreen: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#ffffff'}
        translucent={false}
      />
      <Header title="Create" />
      <ScrollableContainer>
        <View className="py-8">
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
          
          {/* Quick Actions */}
          <View className="space-y-4 mb-8">
            <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Quick Actions
            </Text>
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

          {/* Recent Drafts */}
          <View className="mb-8">
            <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recent Drafts
            </Text>
            <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No drafts yet. Start creating!
              </Text>
            </View>
          </View>

          {/* Content Ideas */}
          <View className="mb-8">
            <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Content Ideas
            </Text>
            <View className="space-y-3">
              {[
                'Share your gaming achievements',
                'Post about your daily routine',
                'Show off your workspace setup',
                'Share a motivational quote',
                'Document your learning journey',
                'Share your favorite recipes',
                'Post about your weekend plans',
                'Show your workout progress',
              ].map((idea, index) => (
                <View
                  key={index}
                  className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
                >
                  <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    💡 {idea}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Creation Tips */}
          <View className="mb-8">
            <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Creation Tips
            </Text>
            <View className="space-y-3">
              {[
                { emoji: '📸', tip: 'Use good lighting for better photos' },
                { emoji: '✍️', tip: 'Keep your captions engaging and authentic' },
                { emoji: '🎨', tip: 'Add relevant hashtags to reach more people' },
                { emoji: '⏰', tip: 'Post when your audience is most active' },
                { emoji: '💬', tip: 'Engage with comments to build community' },
              ].map((item, index) => (
                <View
                  key={index}
                  className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
                >
                  <View className="flex-row items-start">
                    <Text className="text-xl mr-3">{item.emoji}</Text>
                    <Text className={`flex-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.tip}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          
          {/* Bottom padding */}
          <View className="h-4" />
        </View>
      </ScrollableContainer>
    </SafeAreaView>
  );
};