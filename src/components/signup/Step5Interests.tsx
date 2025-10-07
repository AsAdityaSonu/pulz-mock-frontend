import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { Gamepad2, Star, Zap, Trophy, ArrowLeft } from "lucide-react-native";
import { useTheme } from "../../context/ThemeContext";
import { CustomButton } from "../CustomButton";
import { CircularButton } from "../CustomCircularButton";
import { apiService } from "../../services/api";
import {
  groupGamesByCategory,
  renderGameSection,
  Game as ImportedGame,
} from "./RenderGames";

type Game = ImportedGame;

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
  onBack,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const data = await apiService.getGames();

      if (data.success) {
        setGames(data.games || []);
      } else {
        setGames([]);
      }
    } catch (error) {
      console.error("Failed to fetch games:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert("Error", `Failed to load games: ${errorMessage}. Please try again.`);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGameSelect = (gameId: string) => {
    const currentInterests = formData.interests || [];

    if (currentInterests.includes(gameId)) {
      // Remove game if already selected
      const updatedInterests = currentInterests.filter((id) => id !== gameId);
      onInputChange("interests", updatedInterests);
    } else if (currentInterests.length < 3) {
      // Add game if less than 3 selected
      const updatedInterests = [...currentInterests, gameId];
      onInputChange("interests", updatedInterests);
    } else {
      Alert.alert("Limit Reached", "You can only select up to 3 games.");
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

  const renderFooter = () => (
    <View className="space-y-4 mt-8">
      <CustomButton
        title="Complete Signup"
        onPress={onComplete}
        size="large"
        disabled={!isComplete()}
        style={{
          shadowColor: "#8b5cf6",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
        }}
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
        <Gamepad2 size={48} color={isDark ? "#8b5cf6" : "#6b46c1"} />
        <Text
          className={`mt-4 text-lg ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Loading games...
        </Text>
      </View>
    );
  }

  return (
    <View className="py-4">
      {/* Header */}
      <View className="items-center mb-4">
        <View
          className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${
            isDark ? "bg-blue-900" : "bg-blue-100"
          }`}
          style={{
            shadowColor: "#3b82f6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Gamepad2 size={32} color={isDark ? "#60a5fa" : "#3b82f6"} />
        </View>
        <Text
          className={`text-3xl font-bold mb-3 text-center ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Gaming Interests
        </Text>
        <Text
          className={`text-center px-6 text-lg ${isDark ? "text-gray-400" : "text-gray-600"} leading-relaxed`}
        >
          Pick your top 3 favorite games to connect with similar gamers
        </Text>
        {/* Progress */}
        <View
          className={`px-4 py-2 mt-4 rounded-full ${
            isComplete()
              ? isDark
                ? "bg-green-800"
                : "bg-green-100"
              : isDark
                ? "bg-yellow-800"
                : "bg-yellow-100"
          }`}
        >
          <Text
            className={`font-semibold ${
              isComplete()
                ? isDark
                  ? "text-green-400"
                  : "text-green-700"
                : isDark
                  ? "text-yellow-400"
                  : "text-yellow-700"
            }`}
          >
            Selected: {getSelectionProgress()}
          </Text>
        </View>
      </View>

      {/* Helper Text */}
      <Text
        className={`text-sm mb-4 text-center ${isDark ? "text-gray-500" : "text-gray-500"}`}
      >
        We'll use your gaming preferences to suggest friends, communities, and
        content you'll love.
      </Text>

      {/* Games by Category */}
      <View className="mb-4">
        {Object.entries(groupGamesByCategory(games)).map(
          ([category, categoryGames]) =>
            renderGameSection(
              category,
              categoryGames,
              isDark,
              isSelected,
              handleGameSelect
            )
        )}
      </View>

      {/* Navigation Buttons */}
      <View className="-mb-4">
        <CustomButton
          title="Create Account"
          onPress={onComplete}
          size="large"
          disabled={!isComplete()}
          style={{
            shadowColor: "#8b5cf6",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
        />

        <View className="mt-8 flex-row justify-center">
          <CircularButton icon={ArrowLeft} onPress={onBack} disabled={false} />
        </View>
      </View>
    </View>
  );
};
