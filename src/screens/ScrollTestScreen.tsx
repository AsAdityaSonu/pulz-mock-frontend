import React from 'react';
import { View, Text } from 'react-native';
import { TestTube2 } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { Header } from '../components/Header';
import { ScrollableContainer } from '../components/ScrollableContainer';

export const ScrollTestScreen: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Generate test content
  const generateTestItems = (count: number) => {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      title: `Test Item ${index + 1}`,
      description: `This is a long description for test item ${index + 1}. It contains multiple lines of text to test how the scrolling behaves with different content lengths. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    }));
  };

  const testItems = generateTestItems(50);

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <Header title="Scroll Test" showThemeSwitch />
      <ScrollableContainer>
        <View className="py-4">
          {/* Test Header */}
          <View className="items-center mb-8">
            <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${
              isDark ? 'bg-green-800' : 'bg-green-100'
            }`}>
              <TestTube2 size={24} color={isDark ? '#34d399' : '#10b981'} />
            </View>
            <Text className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Scrolling Test
            </Text>
            <Text className={`text-center mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              This screen tests scrolling functionality with many items. If you can scroll smoothly through all 50 items below, scrolling is working correctly.
            </Text>
          </View>

          {/* Test Items */}
          {testItems.map((item) => (
            <View
              key={item.id}
              className={`mb-4 p-4 rounded-xl border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <Text className={`text-lg font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {item.title}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.description}
              </Text>
              
              {/* Progress indicator */}
              <View className="mt-3">
                <View className={`w-full h-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <View 
                    className="h-full bg-purple-500 rounded"
                    style={{ width: `${(item.id / testItems.length) * 100}%` }}
                  />
                </View>
                <Text className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Progress: {item.id} of {testItems.length}
                </Text>
              </View>
            </View>
          ))}

          {/* Footer */}
          <View className={`mt-8 p-6 rounded-xl ${isDark ? 'bg-green-900/20' : 'bg-green-50'}`}>
            <Text className={`text-center font-semibold ${
              isDark ? 'text-green-400' : 'text-green-700'
            }`}>
              🎉 If you can see this, scrolling is working perfectly!
            </Text>
            <Text className={`text-center text-sm mt-2 ${
              isDark ? 'text-green-300' : 'text-green-600'
            }`}>
              You've successfully scrolled through all test items.
            </Text>
          </View>
        </View>
      </ScrollableContainer>
    </View>
  );
};