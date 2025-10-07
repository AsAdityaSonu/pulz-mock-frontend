import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const SplashScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  return (
    <View className="flex-1 bg-purple-700 justify-center items-center">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="items-center"
      >
        <Animated.View
          style={{
            transform: [{ scale: pulseAnim }],
          }}
          className="w-24 h-24 bg-white rounded-full items-center justify-center mb-6 shadow-lg"
        >
          <Zap size={40} color="#7c3aed" />
        </Animated.View>

        <Animated.Text style={{ opacity: fadeAnim }} className="text-5xl font-bold text-white mb-2">
          Pulz
        </Animated.Text>

        <Animated.Text
          style={{ opacity: fadeAnim }}
          className="text-purple-200 text-lg font-medium"
        >
          Connect • Share • Inspire
        </Animated.Text>
      </Animated.View>
    </View>
  );
};
