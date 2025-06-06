import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Job } from '../types';

type SwipeDirection = 'left' | 'right' | 'up' | 'down';

interface Props {
  job: Job;
  onSwipe: (direction: SwipeDirection) => void;
}

const SwipeCard: React.FC<Props> = ({ job, onSwipe }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: () => {
      let direction: SwipeDirection | null = null;
      if (translateX.value > 120) direction = 'right';
      else if (translateX.value < -120) direction = 'left';
      else if (translateY.value < -120) direction = 'up';
      else if (translateY.value > 120) direction = 'down';

      if (direction) {
        translateX.value = withSpring(Math.sign(translateX.value) * 500);
        onSwipe(direction);
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text style={styles.title}>{job.title}</Text>
        <Text>{job.company}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SwipeCard;
