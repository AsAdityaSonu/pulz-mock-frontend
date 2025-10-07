import React from 'react';
import { ScrollView, ViewStyle, ScrollViewProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ScrollableContainerProps extends ScrollViewProps {
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  padded?: boolean;
}

export const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  children,
  containerStyle,
  padded = true,
  ...scrollViewProps
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const defaultContentContainerStyle: ViewStyle = {
    flexGrow: 1,
    paddingHorizontal: padded ? 24 : 0,
    paddingVertical: padded ? 16 : 0,
  };

  return (
    <ScrollView
      style={[{ flex: 1 }, containerStyle]}
      contentContainerStyle={[defaultContentContainerStyle, scrollViewProps.contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      bounces={true}
      alwaysBounceVertical={false}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}
      // Performance optimizations for smoother scrolling
      removeClippedSubviews={true}
      scrollEventThrottle={16}
      decelerationRate="normal"
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  );
};