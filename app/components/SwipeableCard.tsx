import React, { useRef } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";
import PanResponder from "react-native/Libraries/Interaction/PanResponder";
interface SwipeableCardProps {

  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  swipeThreshold?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  swipeThreshold = 120,
}) => {
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Touch start handled here if needed
      },
      onPanResponderMove: (_evt, gestureState) => {
        if (gestureState) {
          position.setValue({ x: gestureState.dx, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (_evt, gestureState) => {
        if (!gestureState) {
          return;
        }
        if (gestureState.dx > swipeThreshold) {
          // Swiped right
          onSwipeRight();
          Animated.spring(position, {
            toValue: { x: screenWidth + 100, y: gestureState.dy },
            useNativeDriver: false,
          }).start(() => {
            position.setValue({ x: 0, y: 0 });
          });
        } else if (gestureState.dx < -swipeThreshold) {
          // Swiped left
          onSwipeLeft();
          Animated.spring(position, {
            toValue: { x: -screenWidth - 100, y: gestureState.dy },
            useNativeDriver: false,
          }).start(() => {
            position.setValue({ x: 0, y: 0 });
          });
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            friction: 4,
          }).start();
        }
      },
    })
  ).current;

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-screenWidth / 2, 0, screenWidth / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp',
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  return (
    <Animated.View
      style={[styles.container, getCardStyle()]}
      {...panResponder.panHandlers}
      testID="swipeable-card"
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
  },
});
