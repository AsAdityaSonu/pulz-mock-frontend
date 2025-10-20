import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { styles } from './PostCard.styles';
import { ThreeDot } from '../../common/ThreeDot/ThreeDot';
import { formatAvatarInitial } from '../../../utils/formatName';
import { Comment } from '../Comment/CommentItem/CommentItem';
// import { Post } from '@/types';
// import { formatDate, formatNumber } from '@/utils';

interface PostCardProps {
  post: {
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
  };
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onPress: (postId: string) => void;
  onCommentLike?: (postId: string, commentId: string, isReply?: boolean) => void;
  onCommentReply?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onPress,
  onCommentLike,
  onCommentReply,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleCommentPress = () => {
    setShowCommentInput(!showCommentInput);
    onComment(post.id);
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      // Add comment logic here - could call parent component's onAddComment
      console.log('Adding comment:', commentText);
      setCommentText('');
      setShowCommentInput(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}
      onPress={() => onPress(post.id)}
      activeOpacity={0.98}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          {post.author.avatar ? (
            <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: '#8b5cf6' }]}>
              <Text style={[styles.avatarText, { color: '#fff' }]}>
                {post.author.displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.authorDetails}>
            <Text style={[styles.displayName, { color: isDark ? '#ffffff' : '#111827' }]}>
              {formatAvatarInitial(post.author.displayName, 20)}
            </Text>
            <Text style={[styles.username, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              @{post.author.username}
            </Text>
          </View>
        </View>
        <View style={styles.postMeta}>
          <ThreeDot />
          <Text style={[styles.timestamp, { color: isDark ? '#9ca3af' : '#6b7280' }]}>2h</Text>
        </View>
      </View>

      {/* Content */}
      <Text style={[styles.content, { color: isDark ? '#f3f4f6' : '#1f2937' }]}>{post.content}</Text>

      <View style={styles.sportTag}>
        <Text style={styles.sportText}>#{post.sport}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onLike(post.id)}>
          <Ionicons
            name={post.isLiked ? 'heart' : 'heart-outline'}
            size={20}
            color={post.isLiked ? '#ef4444' : (isDark ? '#9ca3af' : '#6b7280')}
          />
          <Text style={[styles.actionText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            {formatCompactNumber(post.likes)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleCommentPress}>
          <Ionicons name="chatbubble-outline" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text style={[styles.actionText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            {formatCompactNumber(post.commentsList?.length || 0)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => onShare(post.id)}>
          <Ionicons name="arrow-redo-outline" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text style={[styles.actionText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            {formatCompactNumber(post.shares)}
          </Text>
        </TouchableOpacity>

        <View style={styles.pulzPoints}>
          <Ionicons name="flash" size={16} color="#fbbf24" />
          <Text style={[styles.pulzText, { color: '#8b5cf6' }]}>
            {'+'}
            {formatCompactNumber(post.pulzPoints)}
          </Text>
        </View>
      </View>

      {/* Integrated Comments Section */}
      {post.commentsList && post.commentsList.length > 0 && (
        <View
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#374151' : '#e5e7eb',
          }}
        >
          {/* Most Recent Comment - Always Visible */}
          <View style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: '#8b5cf6',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 8,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
                  {post.commentsList[0].author.displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    backgroundColor: isDark ? '#374151' : '#f3f4f6',
                    borderRadius: 16,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                >
                  <Text style={{ color: isDark ? '#ffffff' : '#111827', fontWeight: '600', fontSize: 13 }}>
                    {post.commentsList[0].author.displayName}
                  </Text>
                  <Text style={{ color: isDark ? '#f3f4f6' : '#1f2937', fontSize: 14, lineHeight: 18 }}>
                    {post.commentsList[0].content}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 4,
                    marginLeft: 12,
                  }}
                >
                  <Text
                    style={{
                      color: isDark ? '#9ca3af' : '#6b7280',
                      fontSize: 11,
                    }}
                  >
                    {post.commentsList[0].createdAt}
                  </Text>
                  <TouchableOpacity
                    style={{ marginLeft: 12 }}
                    onPress={() =>
                      onCommentLike && onCommentLike(post.id, post.commentsList![0].id, false)
                    }
                  >
                    <Text
                      style={{
                        color: post.commentsList[0].isLiked
                          ? '#8b5cf6'
                          : (isDark ? '#9ca3af' : '#6b7280'),
                        fontSize: 11,
                        fontWeight: '500',
                      }}
                    >
                      {post.commentsList[0].isLiked ? '♥' : '♡'}{' '}
                      {post.commentsList[0].likes > 0 ? post.commentsList[0].likes : ''}
                    </Text>
                  </TouchableOpacity>
                  {post.commentsList[0].replies.length > 0 && (
                    <Text
                      style={{
                        color: isDark ? '#9ca3af' : '#6b7280',
                        fontSize: 11,
                        marginLeft: 12,
                      }}
                    >
                      {post.commentsList[0].replies.length}{' '}
                      {post.commentsList[0].replies.length === 1 ? 'reply' : 'replies'}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={{ marginLeft: 12 }}
                    onPress={() => onCommentReply && onCommentReply(post.id)}
                  >
                    <Text
                      style={{
                        color: isDark ? '#9ca3af' : '#6b7280',
                        fontSize: 11,
                        fontWeight: '500',
                      }}
                    >
                      Reply
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* View More Comments Link */}
          {post.commentsList.length > 1 && (
            <TouchableOpacity style={{ marginBottom: 8 }} onPress={() => onPress(post.id)}>
              <Text style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: 13, fontWeight: '500' }}>
                View {post.commentsList.length - 1} more comment
                {post.commentsList.length > 2 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          )}

          {/* Comment Input - Appears when comment button is clicked */}
          {showCommentInput && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginTop: 8,
                paddingTop: 8,
                borderTopWidth: 1,
                borderTopColor: isDark ? '#374151' : '#e5e7eb',
              }}
            >
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                <TextInput
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: isDark ? '#374151' : '#d1d5db',
                    backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    marginRight: 8,
                    maxHeight: 80,
                    fontSize: 14,
                    color: isDark ? '#ffffff' : '#111827',
                  }}
                  placeholder="Write a comment..."
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  multiline
                  value={commentText}
                  onChangeText={setCommentText}
                  onSubmitEditing={handleAddComment}
                />
                <TouchableOpacity
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: '#8b5cf6',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={handleAddComment}
                >
                  <Ionicons name="send" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

// Temporary utility function until utils are properly imported
const formatCompactNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  return `${(num / 1000000).toFixed(1)}M`;
};
