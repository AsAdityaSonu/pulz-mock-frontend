import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';

export default function App() {
  const [count, setCount] = React.useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-3xl font-bold text-gray-800 mb-2">Welcome to Expo!</Text>
        <Text className="text-lg text-gray-500 mb-8 text-center">Now with React Native + TypeScript</Text>

        <View className="items-center mb-8">
          <Text className="text-2xl font-semibold text-blue-600 mb-4">Count: {count}</Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="px-6 py-3 rounded-lg bg-red-500"
              onPress={handleDecrement}
            >
              <Text className="text-white font-semibold">Decrement</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-6 py-3 rounded-lg bg-green-500"
              onPress={handleIncrement}
            >
              <Text className="text-white font-semibold">Increment</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-8">
          <Text className="text-gray-500 text-center">Try editing App.tsx to see changes</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ...existing code...