import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, FlatList, RefreshControl, Alert, Modal, StatusBar, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './HomeScreen.styles';
import { PostCard } from '../../../components/ui/PostCard/PostCard';
import { WelcomeCard } from '../../../components/common/WelcomeCard/WelcomeCard';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import apiService from '../../../services/api';

// Define Post interface
interface Post {
  id: string;
  author: {
    username: string;
    displayName: string;
    avatar?: string;
  };
  content: string;
  sport: string;
  likes: number;
  comments: number;
  shares: number;
  pulzPoints: number;
  isLiked: boolean;
  createdAt: string;
  commentsList?: Comment[];
}

interface Comment {
  id: string;
  author: {
    username: string;
    displayName: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies: Reply[];
}

interface Reply {
  id: string;
  author: {
    username: string;
    displayName: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  parentId: string;
  likes: number;
  isLiked: boolean;
}

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAuth();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const checkWelcomeCard = async () => {
      try {
        const lastShown = await AsyncStorage.getItem('welcomeCardLastShown');
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayLocal = `${year}-${month}-${day}`;
        
        if (lastShown !== todayLocal) {
          setShowWelcome(true);
          await AsyncStorage.setItem('welcomeCardLastShown', todayLocal);
        } else {
          setShowWelcome(false);
        }
      } catch {
        setShowWelcome(true);
      }
    };
    
    checkWelcomeCard();
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFeed(1, 20);
      if (response.success) {
        setPosts(response.posts);
      }
    } catch (error) {
      console.error('Error loading feed:', error);
      Alert.alert('Error', 'Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await apiService.getFeed(1, 20);
      if (response.success) {
        setPosts(response.posts);
      }
    } catch (error) {
      console.error('Error refreshing feed:', error);
      Alert.alert('Error', 'Failed to refresh posts');
    } finally {
      setRefreshing(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      // Optimistic update
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              }
            : post
        )
      );

      const response = await apiService.likePost(postId);
      
      if (response.success) {
        // Update with actual server response
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: response.likes,
                  isLiked: response.isLiked,
                  pulzPoints: response.pulzPoints,
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert optimistic update on error
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes + 1 : post.likes - 1,
              }
            : post
        )
      );
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const handleComment = async (postId: string) => {
    // Open post details for commenting
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setShowPostDetail(true);
    }
  };

  const handleAddComment = async (postId: string, content: string) => {
    try {
      const response = await apiService.addComment(postId, content);
      
      if (response.success) {
        // Update posts with new comment
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: post.comments + 1,
                  pulzPoints: response.pulzPoints,
                  commentsList: [...(post.commentsList || []), response.comment],
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const handleCommentLike = (postId: string, commentId: string, isReply?: boolean) => {
    // TODO: Implement comment liking
    console.log('Like comment:', commentId, 'isReply:', isReply);
  };

  const handleCommentReply = (postId: string) => {
    handleComment(postId);
  };

  const handleShare = (postId: string) => {
    // TODO: Implement share functionality
    console.log('Share post:', postId);
  };

  const handlePostPress = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setShowPostDetail(true);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onLike={handleLike}
      onComment={handleComment}
      onShare={handleShare}
      onPress={handlePostPress}
      onCommentLike={handleCommentLike}
      onCommentReply={handleCommentReply}
    />
  );

  const renderHeader = () => (
    showWelcome ? (
      <WelcomeCard 
        displayName={user?.name || 'User'} 
        streakCount={1} 
      />
    ) : null
  );

  if (loading) {
    return (
      <View className={`flex-1 justify-center items-center ${isDark ? 'bg-gray-900' : 'bg-purple-50'}`}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={isDark ? '#111827' : '#f8faff'}
          translucent={false}
        />
        <SafeAreaView className="flex-1 justify-center items-center">
          <Text className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Loading posts...
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-purple-50'}`}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#f8faff'}
        translucent={false}
      />
      <SafeAreaView className="flex-1">
        {/* Background Overlay */}
        <View className={`absolute inset-0 ${isDark ? 'bg-gray-900' : 'bg-purple-50'}`} />
        
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#8b5cf6']}
              tintColor="#8b5cf6"
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center py-20">
              <Text className={`text-lg text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No posts available.{'\n'}Pull to refresh!
              </Text>
            </View>
          )}
        />

        {/* Post Detail Modal - Will be implemented later when PostDetails component is available */}
        {/* 
        <Modal visible={showPostDetail} animationType="slide" presentationStyle="pageSheet">
          {selectedPost && (
            <PostDetails
              post={selectedPost}
              onBack={() => setShowPostDetail(false)}
              onAddComment={handleAddComment}
            />
          )}
        </Modal>
        */}
      </SafeAreaView>
    </View>
  );
};