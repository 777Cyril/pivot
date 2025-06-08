import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import JobCardStack from '../components/JobCardStack';
import TemperatureSlider from '@/components/TemperatureSlider';
import { Job } from '../types/Job';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { filterJobsByTemperature, addSimilarityScores } from '../../services/temperatureMatching';

export const HomeScreen: React.FC = () => {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [temperature, setTemperature] = useState(0.3);
  const [loading, setLoading] = useState(true);
  const [appliedCount, setAppliedCount] = useState(0);
  const [passedCount, setPassedCount] = useState(0);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const fetchedJobs = await jobService.fetchJobs();
      const jobsWithScores = addSimilarityScores(fetchedJobs);
      setAllJobs(jobsWithScores);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    return filterJobsByTemperature(allJobs, temperature);
  }, [allJobs, temperature]);

  const handleSwipeRight = async (job: Job) => {
    try {
      await applicationService.createApplication(job);
      setAppliedCount(prev => prev + 1);

      console.log('Application created for:', job.title, 'at', job.company);
      console.log('Similarity score:', job.similarity);
      console.log('Temperature setting:', temperature);
    } catch (error) {
      console.error('Error creating application:', error);
    }
  };

  const handleSwipeLeft = async (job: Job) => {
    try {
      await jobService.rejectJob(job.id);
      setPassedCount(prev => prev + 1);
    } catch (error) {
      console.error('Error rejecting job:', error);
    }
  };

  const handleTemperatureChange = (newTemp: number) => {
    setTemperature(newTemp);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Pivot</Text>
          <TouchableOpacity onPress={loadJobs} style={styles.refreshButton} testID="refresh-button">
            <Ionicons name="refresh" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <TemperatureSlider 
          value={temperature}
          onValueChange={handleTemperatureChange}
        />

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Applied:</Text>
            <Text style={styles.statValue}>{appliedCount}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Jobs Available:</Text>
            <Text style={styles.statValue}>{filteredJobs.length}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Passed:</Text>
            <Text style={styles.statValue}>{passedCount}</Text>
          </View>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instruction}>← Swipe left to pass</Text>
          <Text style={styles.instruction}>Swipe right to apply →</Text>
        </View>

        <View style={styles.stackContainer}>
          <JobCardStack
            jobs={filteredJobs}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  instructionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  instruction: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  stackContainer: {
    flex: 1,
    minHeight: 600,
  },
});
