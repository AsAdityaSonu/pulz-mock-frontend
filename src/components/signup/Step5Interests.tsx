import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Gamepad2, Star, Zap, Trophy } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { CustomButton } from '../CustomButton';

interface Game {
  _id: string;
  name: string;
  category: string;
  description: string;
  popularity_score: number;
}

interface Step5InterestsProps {
  formData: {
    interests: string[];
  };
  onInputChange: (field: string, value: string[]) => void;
  onComplete: () => void;
  onBack: () => void;
}

export const Step5Interests: React.FC<Step5InterestsProps> = ({
  formData,
  onInputChange,
  onComplete,
  onBack
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/games');
      const data = await response.json();
      
      if (data.success) {
        setGames(data.games || []);
      } else {
        setGames([]);
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
      Alert.alert('Error', 'Failed to load games. Please try again.');
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGameSelect = (gameId: string) => {
    const currentInterests = formData.interests || [];
    
    if (currentInterests.includes(gameId)) {
      // Remove game if already selected
      const updatedInterests = currentInterests.filter(id => id !== gameId);
      onInputChange('interests', updatedInterests);
    } else if (currentInterests.length < 3) {
      // Add game if less than 3 selected
      const updatedInterests = [...currentInterests, gameId];
      onInputChange('interests', updatedInterests);
    } else {
      Alert.alert('Limit Reached', 'You can only select up to 3 games.');
    }
  };

  const isSelected = (gameId: string) => {
    return formData.interests?.includes(gameId) || false;
  };

  const getSelectionProgress = () => {
    const selected = formData.interests?.length || 0;
    return `${selected}/3`;
  };

  const isComplete = () => {
    return formData.interests?.length === 3;
  };

  const renderGame = ({ item: game }: { item: Game }) => (
    <TouchableOpacity
      onPress={() => handleGameSelect(game._id)}
      className={`w-full mb-3 p-4 rounded-2xl border-2 ${
        isSelected(game._id)
          ? isDark ? 'bg-purple-900/30 border-purple-500' : 'bg-purple-50 border-purple-400'
          : isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'
      }`}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        {/* Game Icon */}
        <View className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${
          isDark ? 'bg-gray-700' : 'bg-white'
        }`}>
          <Gamepad2 size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
        </View>

        {/* Game Info */}
        <View className="flex-1">
          <Text className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {game.name}
          </Text>
          
          <View className="flex-row items-center mb-1">
            <Trophy size={12} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text className={`ml-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {game.category}
            </Text>
          </View>

          <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`} numberOfLines={2}>
            {game.description}
          </Text>
        </View>

        {/* Selection Indicator */}
        {isSelected(game._id) && (
          <View className="ml-2">
            <View className="w-6 h-6 bg-purple-500 rounded-full items-center justify-center">
              <Star size={14} color="#ffffff" fill="#ffffff" />
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View className="mb-6">
      {/* Header */}
      <View className="items-center mb-6">
        <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${
          isDark ? 'bg-blue-800' : 'bg-blue-100'
        }`}>
          <Gamepad2 size={32} color={isDark ? '#60a5fa' : '#3b82f6'} />
        </View>
        <Text className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Gaming Interests
        </Text>
        <Text className={`text-center px-4 mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Pick your top 3 favorite games to connect with similar gamers
        </Text>
        
        {/* Progress */}
        <View className={`px-4 py-2 rounded-full ${
          isComplete() 
            ? isDark ? 'bg-green-800' : 'bg-green-100'
            : isDark ? 'bg-yellow-800' : 'bg-yellow-100'
        }`}>
          <Text className={`font-semibold ${
            isComplete()
              ? isDark ? 'text-green-400' : 'text-green-700'
              : isDark ? 'text-yellow-400' : 'text-yellow-700'
          }`}>
            Selected: {getSelectionProgress()}
          </Text>
        </View>
      </View>

      {/* Helper Text */}
      <View className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
        <View className="flex-row items-center mb-2">
          <Zap size={16} color={isDark ? '#60a5fa' : '#3b82f6'} />
          <Text className={`ml-2 font-semibold text-sm ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
            Why choose interests?
          </Text>
        </View>
        <Text className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
          We'll use your gaming preferences to suggest friends, communities, and content you'll love.
        </Text>
      </View>

      <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Available Games
      </Text>
    </View>
  );

  const renderFooter = () => (
    <View className="space-y-3 mt-6">
      <CustomButton
        title="Complete Signup"
        onPress={onComplete}
        size="large"
        disabled={!isComplete()}
      />
      
      <CustomButton
        title="Back"
        variant="outline"
        onPress={onBack}
        size="large"
      />
    </View>
  );

  if (loading) {
    return (
      <View className="justify-center items-center py-20">
        <Gamepad2 size={48} color={isDark ? '#8b5cf6' : '#6b46c1'} />
        <Text className={`mt-4 text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Loading games...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={games}
        renderItem={renderGame}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
        contentContainerStyle={{
          paddingBottom: 40,
          flexGrow: 1,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        removeClippedSubviews={false}
        initialNumToRender={8}
        maxToRenderPerBatch={4}
        windowSize={8}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={true}
        nestedScrollEnabled={false}
      />
    </View>
  );
};