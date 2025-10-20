import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity, TextInput, ScrollView, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../../components/Header';
import apiService from '../../services/api';

interface Draft {
  id: string;
  content: string;
  sport: string;
  createdAt: string;
}

const SPORTS_OPTIONS = [
  'Basketball', 'Soccer', 'Cricket', 'Tennis', 'Football', 
  'Baseball', 'Hockey', 'Esports', 'Other'
];

const CONTENT_IDEAS = [
  'Share your gaming achievements 🎮',
  'Post about your daily routine ⏰',
  'Show off your workspace setup 💻',
  'Share a motivational quote 💪',
  'Document your learning journey 📚',
  'Share your favorite recipes 🍳',
  'Post about your weekend plans 🎉',
  'Show your workout progress 💪',
  'Share your sports highlights ⚽',
  'Post about your hobbies 🎨'
];

export const CreateScreen: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedSport, setSelectedSport] = useState('Other');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    currentStreak: 0
  });

  useEffect(() => {
    loadUserStats();
    loadDrafts();
  }, []);

  const loadUserStats = async () => {
    try {
      const response = await apiService.getUserStats();
      if (response.success) {
        setUserStats({
          totalPosts: response.stats.posts.total,
          totalLikes: response.stats.posts.likes,
          currentStreak: response.stats.streaks.current
        });
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const loadDrafts = () => {
    // For now, we'll use local storage for drafts
    // In a real app, this would be an API call
    setDrafts([]);
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.createPost(postContent.trim(), selectedSport);
      
      if (response.success) {
        Alert.alert('Success', 'Your post has been created!', [
          { text: 'OK', onPress: () => {
            setPostContent('');
            setSelectedSport('Other');
            setShowCreateModal(false);
            loadUserStats(); // Refresh stats
          }}
        ]);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = () => {
    if (!postContent.trim()) return;
    
    const newDraft: Draft = {
      id: Date.now().toString(),
      content: postContent,
      sport: selectedSport,
      createdAt: new Date().toISOString()
    };
    
    setDrafts(prev => [newDraft, ...prev]);
    setPostContent('');
    setSelectedSport('Other');
    Alert.alert('Success', 'Draft saved!');
  };

  const loadDraft = (draft: Draft) => {
    setPostContent(draft.content);
    setSelectedSport(draft.sport);
    setShowCreateModal(true);
  };

  const deleteDraft = (draftId: string) => {
    setDrafts(prev => prev.filter(d => d.id !== draftId));
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#f9fafb'}
        translucent={false}
      />
      <Header title="Create" />
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Stats Overview */}
        <View className={`mx-4 mt-6 mb-6 p-4 rounded-2xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {userStats.totalPosts}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Posts
              </Text>
            </View>
            <View className="items-center">
              <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {userStats.totalLikes}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Likes
              </Text>
            </View>
            <View className="items-center">
              <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {userStats.currentStreak}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Day Streak
              </Text>
            </View>
          </View>
        </View>

        {/* Create Post Button */}
        <View className="mx-4 mb-6">
          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            className="bg-purple-500 p-4 rounded-2xl"
            style={{
              shadowColor: '#8b5cf6',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="add-circle" size={24} color="#ffffff" />
              <Text className="text-white text-lg font-semibold ml-2">
                Create New Post
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View className="mx-4 mb-6">
          <Text className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {[
              { icon: 'document-text', title: 'Text Post', color: '#8b5cf6' },
              { icon: 'camera', title: 'Photo', color: '#10b981' },
              { icon: 'videocam', title: 'Video', color: '#f59e0b' },
              { icon: 'mic', title: 'Audio', color: '#ef4444' },
            ].map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setShowCreateModal(true)}
                className={`w-[48%] mb-3 p-4 rounded-xl ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View className="items-center">
                  <View className="w-12 h-12 rounded-full items-center justify-center mb-2"
                    style={{ backgroundColor: action.color + '20' }}>
                    <Ionicons 
                      name={action.icon as keyof typeof Ionicons.glyphMap} 
                      size={24} 
                      color={action.color} 
                    />
                  </View>
                  <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {action.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Drafts */}
        {drafts.length > 0 && (
          <View className="mx-4 mb-6">
            <Text className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recent Drafts
            </Text>
            {drafts.slice(0, 3).map((draft) => (
              <TouchableOpacity
                key={draft.id}
                onPress={() => loadDraft(draft)}
                className={`mb-3 p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {draft.content.substring(0, 50)}...
                    </Text>
                    <Text className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      #{draft.sport} • {new Date(draft.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteDraft(draft.id)}>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Content Ideas */}
        <View className="mx-4 mb-6">
          <Text className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Content Ideas
          </Text>
          <View className="space-y-3">
            {CONTENT_IDEAS.slice(0, 5).map((idea, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setPostContent(idea.replace(/[^\w\s]/gi, ''));
                  setShowCreateModal(true);
                }}
                className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  💡 {idea}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Creation Tips */}
        <View className="mx-4 mb-6">
          <Text className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Pro Tips
          </Text>
          <View className="space-y-3">
            {[
              { emoji: '📸', tip: 'Use good lighting for better photos' },
              { emoji: '✍️', tip: 'Keep your captions engaging and authentic' },
              { emoji: '🎨', tip: 'Add relevant hashtags to reach more people' },
              { emoji: '⏰', tip: 'Post when your audience is most active' },
            ].map((item, index) => (
              <View
                key={index}
                className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
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
      </ScrollView>

      {/* Create Post Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <View className={`flex-row items-center justify-between px-4 py-3 border-b ${
            isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Create Post
            </Text>
            <TouchableOpacity onPress={saveDraft}>
              <Text className="text-lg font-semibold text-purple-500">
                Save Draft
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <View className="space-y-4">
              {/* Content Input */}
              <View>
                <Text className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  What's on your mind?
                </Text>
                <TextInput
                  value={postContent}
                  onChangeText={setPostContent}
                  className={`p-4 rounded-lg border h-32 ${
                    isDark 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  placeholder="Share your thoughts..."
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              {/* Sport Selection */}
              <View>
                <Text className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Category
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row space-x-2">
                    {SPORTS_OPTIONS.map((sport) => (
                      <TouchableOpacity
                        key={sport}
                        onPress={() => setSelectedSport(sport)}
                        className={`px-4 py-2 rounded-full ${
                          selectedSport === sport
                            ? 'bg-purple-500'
                            : isDark
                              ? 'bg-gray-700'
                              : 'bg-gray-200'
                        }`}
                      >
                        <Text className={`font-medium ${
                          selectedSport === sport
                            ? 'text-white'
                            : isDark
                              ? 'text-gray-300'
                              : 'text-gray-700'
                        }`}>
                          {sport}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Character Count */}
              <View className="items-end">
                <Text className={`text-sm ${
                  postContent.length > 1000 
                    ? 'text-red-500' 
                    : isDark 
                      ? 'text-gray-400' 
                      : 'text-gray-600'
                }`}>
                  {postContent.length}/1000
                </Text>
              </View>

              {/* Create Button */}
              <TouchableOpacity
                onPress={handleCreatePost}
                disabled={loading || !postContent.trim()}
                className={`p-4 rounded-xl ${
                  loading || !postContent.trim()
                    ? 'bg-gray-400'
                    : 'bg-purple-500'
                }`}
                style={{
                  shadowColor: '#8b5cf6',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <Text className="text-white text-center text-lg font-semibold">
                  {loading ? 'Creating...' : 'Create Post'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};
