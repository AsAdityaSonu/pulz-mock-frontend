import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { styles } from './CommentItem.styles';

export interface Reply {
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

export interface Comment {
  id: string;
  author: {
    username: string;
    displayName: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  replies: Reply[];
  likes: number;
  isLiked: boolean;
}

interface CommentItemProps {
  comment: Comment;
  onReply?: (commentId: string, username: string) => void;
  onLike?: (commentId: string, isReply?: boolean) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, onLike }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showReplies, setShowReplies] = useState(false);

  const handleReplyPress = () => {
    if (onReply) {
      onReply(comment.id, comment.author.username);
    }
  };

  const handleLikePress = () => {
    if (onLike) {
      onLike(comment.id, false);
    }
  };

  const handleReplyLikePress = (replyId: string) => {
    if (onLike) {
      onLike(replyId, true);
    }
  };

  const renderReply = (reply: Reply) => (
    <View key={reply.id} style={styles.replyContainer}>
      <View style={[styles.avatar, styles.replyAvatar, { backgroundColor: '#8b5cf6' }]}>
        <Text style={[styles.avatarText, styles.replyAvatarText]}>
          {reply.author.displayName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.replyContent}>
        <View
          style={[
            styles.bubble,
            styles.replyBubble,
            {
              backgroundColor: isDark ? '#374151' : '#f9fafb',
              borderColor: isDark ? '#4b5563' : '#e5e7eb',
            },
          ]}
        >
          <Text style={[styles.authorName, styles.replyAuthorName, { color: isDark ? '#ffffff' : '#111827' }]}>
            {reply.author.displayName}
          </Text>
          <Text style={[styles.replyContentText, { color: isDark ? '#f3f4f6' : '#1f2937' }]}>
            {reply.content}
          </Text>
        </View>
        <View style={styles.replyTimestampContainer}>
          <Text style={[styles.timestamp, styles.replyTimestamp, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            {reply.createdAt}
          </Text>
          <TouchableOpacity
            style={styles.replyLikeButton}
            onPress={() => handleReplyLikePress(reply.id)}
          >
            <Text
              style={[
                styles.likeText,
                styles.replyLikeText,
                { color: reply.isLiked ? '#8b5cf6' : (isDark ? '#9ca3af' : '#6b7280') },
              ]}
            >
              {reply.isLiked ? '♥' : '♡'} {reply.likes > 0 ? reply.likes : ''}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.replyReplyButton}
            onPress={() => onReply && onReply(comment.id, reply.author.username)}
          >
            <Text
              style={[styles.replyText, styles.replyReplyText, { color: isDark ? '#9ca3af' : '#6b7280' }]}
            >
              Reply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: '#8b5cf6' }]}>
        <Text style={styles.avatarText}>{comment.author.displayName.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.content}>
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
              borderColor: isDark ? '#4b5563' : '#d1d5db',
            },
          ]}
        >
          <Text style={[styles.authorName, { color: isDark ? '#ffffff' : '#111827' }]}>
            {comment.author.displayName}
          </Text>
          <Text style={[styles.commentText, { color: isDark ? '#f3f4f6' : '#1f2937' }]}>{comment.content}</Text>
        </View>
        <View style={styles.timestampContainer}>
          <Text style={[styles.timestamp, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            {comment.createdAt}
          </Text>
          <TouchableOpacity style={styles.likeButton} onPress={handleLikePress}>
            <Text
              style={[
                styles.likeText,
                { color: comment.isLiked ? '#8b5cf6' : (isDark ? '#9ca3af' : '#6b7280') },
              ]}
            >
              {comment.isLiked ? '♥' : '♡'} {comment.likes > 0 ? comment.likes : ''}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.replyButton} onPress={handleReplyPress}>
            <Text style={[styles.replyText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Reply</Text>
          </TouchableOpacity>
          {comment.replies.length > 0 && (
            <TouchableOpacity
              style={styles.viewRepliesButton}
              onPress={() => setShowReplies(!showReplies)}
            >
              <Text style={[styles.viewRepliesText, { color: '#8b5cf6' }]}>
                {showReplies ? 'Hide' : 'View'} {comment.replies.length}{' '}
                {comment.replies.length === 1 ? 'reply' : 'replies'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {showReplies && (
          <View style={styles.repliesContainer}>{comment.replies.map(renderReply)}</View>
        )}
      </View>
    </View>
  );
};
