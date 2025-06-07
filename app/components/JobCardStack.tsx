import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Job } from '../types/Job';
import { JobCard } from './JobCard';
import { SwipeableCard } from './SwipeableCard';

interface JobCardStackProps {
  jobs: Job[];
  onSwipeLeft: (job: Job) => void;
  onSwipeRight: (job: Job) => void;
  isLoading?: boolean;
}

const { height: screenHeight } = Dimensions.get('window');

export const JobCardStack: React.FC<JobCardStackProps> = ({
  jobs,
  onSwipeLeft,
  onSwipeRight,
  isLoading = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipeLeft = useCallback(() => {
    if (currentIndex < jobs.length) {
      onSwipeLeft(jobs[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, jobs, onSwipeLeft]);

  const handleSwipeRight = useCallback(() => {
    if (currentIndex < jobs.length) {
      onSwipeRight(jobs[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, jobs, onSwipeRight]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color="#007AFF"
          testID="loading-indicator"
        />
        <Text style={styles.loadingText}>Loading jobs...</Text>
      </View>
    );
  }

  if (jobs.length === 0 || currentIndex >= jobs.length) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No more jobs available</Text>
      </View>
    );
  }

  // Render up to 3 cards for smooth transitions
  const visibleCards = jobs
    .slice(currentIndex, currentIndex + 3)
    .map((job, index) => {
      const isTopCard = index === 0;

      return (
        <View
          key={job.id}
          style={[
            styles.cardContainer,
            {
              zIndex: 3 - index,
              top: index * 8,
              opacity: index === 2 ? 0.7 : 1,
              transform: [{ scale: 1 - index * 0.03 }],
            },
          ]}
          pointerEvents={isTopCard ? 'auto' : 'none'}
        >
          {isTopCard ? (
            <SwipeableCard
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            >
              <JobCard job={job} />
            </SwipeableCard>
          ) : (
            <JobCard job={job} />
          )}
        </View>
      );
    });

  return <View style={styles.container}>{visibleCards.reverse()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    position: 'absolute',
    width: '100%',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
