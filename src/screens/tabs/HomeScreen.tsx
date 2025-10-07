import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageCircle, Share } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import { ScrollableContainer } from '../../components/ScrollableContainer';

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#ffffff'}
        translucent={false}
      />
      <Header title="Home" />
      <ScrollableContainer>
        <View className="items-center py-8">
          <View
            className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-purple-800' : 'bg-purple-100'}`}
          >
            <Heart size={24} color={isDark ? '#c084fc' : '#7c3aed'} />
          </View>
          <Text className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome to your feed!
          </Text>
          <Text className={`text-center px-6 mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            This is where you'll see posts from people you follow. Start connecting with others to
            see content here.
          </Text>

          {/* Content Categories */}
          <View className="flex-row mb-8 space-x-4">
            <View className={`px-4 py-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Posts</Text>
            </View>
            <View className={`px-4 py-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Stories
              </Text>
            </View>
            <View className={`px-4 py-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Live</Text>
            </View>
          </View>

          {/* Sample Feed Posts - to demonstrate scrolling */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <View
              key={item}
              className={`w-full p-4 mb-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
            >
              <View className="flex-row items-center mb-3">
                <View
                  className={`w-10 h-10 rounded-full ${isDark ? 'bg-purple-700' : 'bg-purple-200'} items-center justify-center`}
                >
                  <Text
                    className={`font-semibold ${isDark ? 'text-purple-200' : 'text-purple-700'}`}
                  >
                    {String.fromCharCode(65 + (item % 26))}
                  </Text>
                </View>
                <View className="ml-3 flex-1">
                  <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    User {item}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    2 hours ago
                  </Text>
                </View>
              </View>

              <Text className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                This is a sample post #{item}. The content here demonstrates how the scrollable area
                works while keeping the header and footer fixed in place.
              </Text>

              <View className="flex-row justify-between items-center">
                <View className="flex-row space-x-6">
                  <View className="flex-row items-center space-x-1">
                    <Heart size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
                    <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {Math.floor(Math.random() * 100) + 1}
                    </Text>
                  </View>
                  <View className="flex-row items-center space-x-1">
                    <MessageCircle size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
                    <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {Math.floor(Math.random() * 20) + 1}
                    </Text>
                  </View>
                </View>
                <Share size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
              </View>
            </View>
          ))}

          {/* Bottom padding for better UX */}
          <View className="h-4" />
        </View>
      </ScrollableContainer>
    </SafeAreaView>
  );
};
