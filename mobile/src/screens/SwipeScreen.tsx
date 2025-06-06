import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SwipeCard from '../components/SwipeCard';
import { Job } from '../types';
import useSwipeActions from '../hooks/useSwipeActions';

const sampleJobs: Job[] = [
  { id: '1', title: 'Software Engineer', company: 'Acme Corp', description: '' },
  { id: '2', title: 'Product Manager', company: 'Beta Inc', description: '' },
];

export default function SwipeScreen() {
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);
  const handleSwipe = useSwipeActions();

  const popJob = () => setJobs((prev) => prev.slice(1));

  if (jobs.length === 0) return null;

  const current = jobs[0];

  return (
    <View style={styles.container}>
      <SwipeCard
        job={current}
        onSwipe={(dir) => {
          handleSwipe(dir, current);
          popJob();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
