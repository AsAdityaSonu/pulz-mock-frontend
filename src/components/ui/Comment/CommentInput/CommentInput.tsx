import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { styles } from './CommentInput.styles';

interface CommentInputProps {
  onSubmit: (comment: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  placeholder = 'Write a comment...',
  initialValue = '',
}) => {
  const [comment, setComment] = useState(initialValue);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textInputRef = useRef<TextInput>(null);

  // Auto-focus when @username is provided (one-time setup)
  useMemo(() => {
    if (initialValue.startsWith('@')) {
      requestAnimationFrame(() => {
        textInputRef.current?.focus();
      });
    }
  }, [initialValue]);

  const handleSubmit = useCallback(() => {
    if (comment.trim()) {
      onSubmit(comment.trim());
      setComment('');
    }
  }, [comment, onSubmit]);

  // Memoize styles to prevent recalculation - Instagram-like design
  const containerStyle = useMemo(() => [styles.container], []);

  const inputStyle = useMemo(
    () => [
      styles.input,
      {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderColor: isDark ? '#374151' : '#d1d5db',
        color: isDark ? '#ffffff' : '#111827',
      },
    ],
    [isDark]
  );

  const sendButtonStyle = useMemo(
    () => [
      styles.sendButton,
      {
        backgroundColor: comment.trim() ? '#8b5cf6' : (isDark ? '#6b7280' : '#9ca3af'),
        opacity: comment.trim() ? 1 : 0.7,
      },
    ],
    [comment, isDark]
  );

  return (
    <View style={containerStyle}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={textInputRef}
          style={inputStyle}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          value={comment}
          onChangeText={setComment}
          multiline
          maxLength={500}
          textAlignVertical="top"
          returnKeyType="default"
          blurOnSubmit={false}
          scrollEnabled={false}
        />
        <TouchableOpacity
          style={sendButtonStyle}
          onPress={handleSubmit}
          disabled={!comment.trim()}
          activeOpacity={0.8}
        >
          <Ionicons name={comment.trim() ? 'send' : 'send-outline'} size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
