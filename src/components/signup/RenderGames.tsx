import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface Game {
  _id: string;
  name: string;
  category: string;
  description: string;
  popularity_score: number;
}

interface RenderGamesProps {
  games: Game[];
  isDark: boolean;
  isSelected: (gameId: string) => boolean;
  handleGameSelect: (gameId: string) => void;
}

export const groupGamesByCategory = (games: Game[]) => {
  const grouped: { [key: string]: Game[] } = {};
  games.forEach((game) => {
    if (!grouped[game.category]) {
      grouped[game.category] = [];
    }
    grouped[game.category].push(game);
  });
  return grouped;
};

export const renderGame = (
  game: Game,
  isDark: boolean,
  isSelected: (gameId: string) => boolean,
  handleGameSelect: (gameId: string) => void
) => (
  <TouchableOpacity
    key={game._id}
    onPress={() => handleGameSelect(game._id)}
    className={`m-1 px-3 py-2 rounded-full ${
      isSelected(game._id)
        ? isDark
          ? 'bg-purple-800'
          : 'bg-purple-100'
        : isDark
          ? 'bg-gray-800'
          : 'bg-gray-100'
    }`}
    activeOpacity={0.7}
  >
    <View className="items-center justify-center relative">
      <Text
        className={`font-semibold text-xs text-center ${isDark ? 'text-white' : 'text-gray-900'}`}
      >
        {game.name}
      </Text>
    </View>
  </TouchableOpacity>
);

export const renderGameSection = (
  category: string,
  categoryGames: Game[],
  isDark: boolean,
  isSelected: (gameId: string) => boolean,
  handleGameSelect: (gameId: string) => void
) => (
  <View key={category} className="mb-6">
    {/* Category Header with Line */}
    <View className="flex-row items-center mb-3">
      <Text className={`text-lg font-bold mr-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {category}
      </Text>
      <View className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
    </View>

    {/* Games Flexbox Container */}
    <View className="flex-row flex-wrap justify-start">
      {categoryGames.map((game) => renderGame(game, isDark, isSelected, handleGameSelect))}
    </View>
  </View>
);
