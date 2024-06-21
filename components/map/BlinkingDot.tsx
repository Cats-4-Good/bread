import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

const BlinkingDot = ({ isMapView }: { isMapView?: boolean }) => {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  // Blinking animation
  opacity.value = withRepeat(
    withSequence(
      withTiming(0, { duration: 1000, easing: Easing.linear }),
      withTiming(1, { duration: 1000, easing: Easing.linear })
    ),
    -1, // -1 means repeat indefinitely
    true // reverse the animation on repeat
  );

  const MAX_SIZE = isMapView ? 100 : 30;

  // Broadcast waves animation
  scale.value = withRepeat(
    withSequence(
      withTiming(0, { duration: 0 }), // Start at scale 1
      withTiming(MAX_SIZE, { duration: 3000, easing: Easing.quad }) // Expand to scale 3
    ),
    -1, // -1 means repeat indefinitely
    true // reverse the animation on repeat
  );

  const animatedDotStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const animatedWaveStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: 0.2 * (1 - (scale.value / MAX_SIZE)), // Fade out as it scales
    };
  });

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.wave, animatedWaveStyle]} pointerEvents="none" />
      <Animated.View style={[styles.dot, animatedDotStyle]} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    borderWidth: 3,
    borderColor: 'white'
  },
  wave: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
  },
});

export default BlinkingDot;

