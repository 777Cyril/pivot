import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import { SwipeableCard } from '../SwipeableCard';

jest.mock('react-native/Libraries/Interaction/PanResponder', () => {
  return {
    create: (config: any) => ({
      panHandlers: {
        onStartShouldSetResponder: config.onStartShouldSetPanResponder,
        onResponderGrant: (e: any) => config.onPanResponderGrant?.(e, e?.gestureState),
        onResponderMove: (e: any) => config.onPanResponderMove?.(e, e?.gestureState),
        onResponderRelease: (e: any) => config.onPanResponderRelease?.(e, e?.gestureState),
      },
    }),
  };
});

jest.useFakeTimers();

describe('SwipeableCard', () => {
  const mockOnSwipeLeft = jest.fn();
  const mockOnSwipeRight = jest.fn();
  
  const TestChild = () => (
    <View testID="test-child">
      <Text>Test Card Content</Text>
    </View>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children correctly', () => {
    const { getByTestId } = render(
      <SwipeableCard onSwipeLeft={mockOnSwipeLeft} onSwipeRight={mockOnSwipeRight}>
        <TestChild />
      </SwipeableCard>
    );
    
    expect(getByTestId('test-child')).toBeTruthy();
  });

  it('should have swipeable-card testID', () => {
    const { getByTestId } = render(
      <SwipeableCard onSwipeLeft={mockOnSwipeLeft} onSwipeRight={mockOnSwipeRight}>
        <TestChild />
      </SwipeableCard>
    );
    
    expect(getByTestId('swipeable-card')).toBeTruthy();
  });

  it('should handle pan responder grant', () => {
    const { getByTestId } = render(
      <SwipeableCard onSwipeLeft={mockOnSwipeLeft} onSwipeRight={mockOnSwipeRight}>
        <TestChild />
      </SwipeableCard>
    );
    
    const card = getByTestId('swipeable-card');
    
    // Simulate touch start
    fireEvent(card, 'responderGrant', {
      nativeEvent: { locationX: 100, locationY: 100 }
    });
    
    // Component should handle the event without crashing
    expect(card).toBeTruthy();
  });

  it('should call onSwipeLeft when swiped left beyond threshold', () => {
    const { getByTestId } = render(
      <SwipeableCard 
        onSwipeLeft={mockOnSwipeLeft} 
        onSwipeRight={mockOnSwipeRight}
        swipeThreshold={120}
      >
        <TestChild />
      </SwipeableCard>
    );
    
    const card = getByTestId('swipeable-card');
    
    // Simulate swipe left
    fireEvent(card, 'responderGrant');
    fireEvent(card, 'responderMove', {
      nativeEvent: { pageX: 0, pageY: 100 }
    });
    fireEvent(card, 'responderRelease', {
      nativeEvent: {},
      gestureState: { dx: -150, dy: 0, vx: -0.5 }
    });

    jest.runAllTimers();
    
    expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1);
    expect(mockOnSwipeRight).not.toHaveBeenCalled();
  });

  it('should call onSwipeRight when swiped right beyond threshold', () => {
    const { getByTestId } = render(
      <SwipeableCard 
        onSwipeLeft={mockOnSwipeLeft} 
        onSwipeRight={mockOnSwipeRight}
        swipeThreshold={120}
      >
        <TestChild />
      </SwipeableCard>
    );
    
    const card = getByTestId('swipeable-card');
    
    // Simulate swipe right
    fireEvent(card, 'responderGrant');
    fireEvent(card, 'responderMove', {
      nativeEvent: { pageX: 200, pageY: 100 }
    });
    fireEvent(card, 'responderRelease', {
      nativeEvent: {},
      gestureState: { dx: 150, dy: 0, vx: 0.5 }
    });

    jest.runAllTimers();
    
    expect(mockOnSwipeRight).toHaveBeenCalledTimes(1);
    expect(mockOnSwipeLeft).not.toHaveBeenCalled();
  });
});
