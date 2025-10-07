import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

interface AnimatedTabBarButtonProps {
  children: React.ReactNode;
  onPress?: (e?: any) => void;
  accessibilityState?: { selected?: boolean };
  style?: any;
  label?: string;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const AnimatedTabBarButton: React.FC<AnimatedTabBarButtonProps> = React.memo(({
  children,
  onPress,
  accessibilityState,
  style,
  label,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isSelected = accessibilityState?.selected;

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      dampingRatio: 0.86,
    });
    opacity.value = withTiming(0.7, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      dampingRatio: 0.86,
    });
    opacity.value = withTiming(1, { duration: 150 });
  };

  const handlePress = () => {
    'worklet';
    if (onPress) {
      runOnJS(onPress)();
    }
  };

  return (
    <AnimatedTouchableOpacity
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 8,
        },
        style,
        animatedStyle,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      accessibilityState={accessibilityState}
    >
      <View style={{ alignItems: 'center' }}>
        {children}
        {label && (
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              marginTop: 2,
              color: isSelected ? '#7c3aed' : (isDark ? '#9ca3af' : '#6b7280'),
            }}
          >
            {label}
          </Text>
        )}
      </View>
    </AnimatedTouchableOpacity>
  );
});