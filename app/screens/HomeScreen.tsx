import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { JobCardStack } from '../components/JobCardStack';
import { Job } from '../types/Job';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { ApplicationStatus } from '../types/Application';

export const HomeScreen: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [appliedCount, setAppliedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  const loadJobs = useCallback(async () => {
    try {
      const fetchedJobs = await jobService.fetchJobs();
      const sortedJobs = jobService.sortJobsByDate(fetchedJobs);
      setJobs(sortedJobs);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadJobs();
  }, [loadJobs]);

  const handleSwipeLeft = useCallback((job: Job) => {
    console.log('Rejected job:', job.title);
    setRejectedCount(prev => prev + 1);
  }, []);

  const handleSwipeRight = useCallback(async (job: Job) => {
    try {
      await applicationService.createApplication(job);
      console.log('Application created for:', job.title);
      setAppliedCount(prev => prev + 1);
    } catch (error) {
      console.error('Error creating application:', error);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Job Swiper</Text>
        <TouchableOpacity
          onPress={handleRefresh}
          testID="refresh-button"
          style={styles.refreshButton}
        >
          <Text style={styles.refreshButtonText}>↻</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Applied: {appliedCount}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Passed: {rejectedCount}</Text>
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>← Swipe left to pass</Text>
        <Text style={styles.instructionText}>Swipe right to apply →</Text>
      </View>

      <View style={styles.cardContainer}>
        <JobCardStack
          jobs={jobs}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          isLoading={isLoading || isRefreshing}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 10,
  },
  refreshButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'white',
    marginTop: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  instructions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  instructionText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  cardContainer: {
    flex: 1,
  },
});
