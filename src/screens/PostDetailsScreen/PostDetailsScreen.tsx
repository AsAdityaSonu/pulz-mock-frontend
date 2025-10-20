import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { CommentItem } from '../../components/ui/Comment/CommentItem/CommentItem';
import { formatAvatarInitial } from '../../utils/formatName';
import { styles } from './PostDetailsScreen.styles';

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

interface PostDetailsScreenProps {
  post: Post;
  onBack: () => void;
  onAddComment: (postId: string, content: string) => void;
  onLike: (postId: string) => void;
  onCommentLike?: (postId: string, commentId: string, isReply?: boolean) => void;
}

export const PostDetailsScreen: React.FC<PostDetailsScreenProps> = ({
  post,
  onBack,
  onAddComment,
  onLike,
  onCommentLike,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(post.id, commentText.trim());
      setCommentText('');
      setReplyingTo(null);
    }
  };

  const handleReply = (commentId: string, username: string) => {
    setReplyingTo(username);
    setCommentText(`@${username} `);
  };

  const handleCommentLike = (commentId: string, isReply?: boolean) => {
    if (onCommentLike) {
      onCommentLike(post.id, commentId, isReply);
    }
  };

  const formatCompactNumber = (num: number): string => {
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-purple-50'}`}>
      {/* Header */}
      <View className={`flex-row items-center justify-between px-4 py-3 border-b ${
        isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <TouchableOpacity onPress={onBack} className="p-2">
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDark ? '#ffffff' : '#111827'} 
          />
        </TouchableOpacity>
        <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Post
        </Text>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Post Content */}
          <View className={`mx-4 mt-4 p-4 rounded-2xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Post Header */}
            <View className="flex-row items-center mb-3">
              {post.author.avatar ? (
                <Image 
                  source={{ uri: post.author.avatar }} 
                  className="w-12 h-12 rounded-full mr-3"
                />
              ) : (
                <View className="w-12 h-12 rounded-full bg-purple-500 items-center justify-center mr-3">
                  <Text className="text-white font-bold text-lg">
                    {post.author.displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View className="flex-1">
                <Text className={`font-semibold text-base ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {formatAvatarInitial(post.author.displayName, 20)}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  @{post.author.username}
                </Text>
              </View>
            </View>

            {/* Post Content */}
            <Text className={`text-base mb-3 leading-6 ${
              isDark ? 'text-gray-100' : 'text-gray-800'
            }`}>
              {post.content}
            </Text>

            {/* Sport Tag */}
            <View className="bg-purple-100 self-start px-3 py-1 rounded-full mb-4">
              <Text className="text-purple-700 text-sm font-medium">
                #{post.sport}
              </Text>
            </View>

            {/* Post Actions */}
            <View className="flex-row items-center justify-between pt-3 border-t border-gray-200">
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => onLike(post.id)}
              >
                <Ionicons
                  name={post.isLiked ? 'heart' : 'heart-outline'}
                  size={20}
                  color={post.isLiked ? '#ef4444' : (isDark ? '#9ca3af' : '#6b7280')}
                />
                <Text className={`ml-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatCompactNumber(post.likes)}
                </Text>
              </TouchableOpacity>

              <View className="flex-row items-center">
                <Ionicons 
                  name="chatbubble-outline" 
                  size={20} 
                  color={isDark ? '#9ca3af' : '#6b7280'} 
                />
                <Text className={`ml-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatCompactNumber(post.commentsList?.length || 0)}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="flash" size={16} color="#fbbf24" />
                <Text className="ml-1 text-purple-500 text-sm font-medium">
                  +{formatCompactNumber(post.pulzPoints)}
                </Text>
              </View>
            </View>
          </View>

          {/* Comments Section */}
          <View className="mx-4 mt-4">
            <Text className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Comments ({post.commentsList?.length || 0})
            </Text>

            {post.commentsList && post.commentsList.length > 0 ? (
              <View className="space-y-4">
                {post.commentsList.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onReply={handleReply}
                    onLike={handleCommentLike}
                  />
                ))}
              </View>
            ) : (
              <View className="py-8 items-center">
                <Ionicons 
                  name="chatbubble-outline" 
                  size={48} 
                  color={isDark ? '#4b5563' : '#d1d5db'} 
                />
                <Text className={`mt-2 text-center ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No comments yet.{'\n'}Be the first to comment!
                </Text>
              </View>
            )}
          </View>

          {/* Bottom spacing for input */}
          <View className="h-20" />
        </ScrollView>

        {/* Comment Input */}
        <View className={`px-4 py-3 border-t ${
          isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          {replyingTo && (
            <View className="flex-row items-center mb-2">
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Replying to @{replyingTo}
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setReplyingTo(null);
                  setCommentText('');
                }}
                className="ml-2"
              >
                <Ionicons 
                  name="close" 
                  size={16} 
                  color={isDark ? '#9ca3af' : '#6b7280'} 
                />
              </TouchableOpacity>
            </View>
          )}
          
          <View className="flex-row items-end">
            <TextInput
              className={`flex-1 border rounded-full px-4 py-3 mr-3 max-h-20 ${
                isDark 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-gray-50 text-gray-900'
              }`}
              placeholder="Write a comment..."
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              multiline
              value={commentText}
              onChangeText={setCommentText}
              onSubmitEditing={handleAddComment}
            />
            <TouchableOpacity
              onPress={handleAddComment}
              disabled={!commentText.trim()}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                commentText.trim() 
                  ? 'bg-purple-500' 
                  : (isDark ? 'bg-gray-600' : 'bg-gray-300')
              }`}
            >
              <Ionicons 
                name="send" 
                size={18} 
                color={commentText.trim() ? '#ffffff' : (isDark ? '#9ca3af' : '#6b7280')} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
