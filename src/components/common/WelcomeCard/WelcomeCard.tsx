import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { OutlineButton } from '../OutlineButton/OutlineButton';
import { styles } from './WelcomeCard.styles';

interface WelcomeCardProps {
  displayName?: string;
  streakCount?: number;
  onClose?: () => void;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ displayName, streakCount, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <View
      style={[styles.container, { backgroundColor: '#8B5CF6' }]}
    >
      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Ionicons
          name="close"
          size={20}
          color="#fff"
        />
      </TouchableOpacity>

      {/* Main content */}
      <View style={styles.content}>
        {/* Welcome message */}
        <View style={styles.messageContainer}>
          <Text style={[styles.welcomeMessage, { color: '#fff' }]}>
            {displayName ? `Hey ${displayName}! 👋` : 'Ready to share? 🚀'}
          </Text>
          <Text style={[styles.motivationText, { color: 'rgba(255,255,255,0.92)' }]}>
            {streakCount && streakCount > 0
              ? `You're on a ${streakCount}-day streak! Keep it going by sharing your latest sports moments with the community.`
              : `Start your first streak today! Share your first post and begin your journey to unlock rewards and join the community fun.`}
          </Text>
        </View>

        {/* Action button */}
        <OutlineButton
          title="Create Post"
          icon="add"
          size="medium"
          fullWidth
          onPress={() => {
            // Handle create post navigation
            console.log('Navigate to create post');
          }}
        />
      </View>
    </View>
  );
};
