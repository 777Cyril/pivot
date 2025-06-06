import { useCallback } from 'react';
import { Job, Application } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useSwipeActions() {
  return useCallback(async (direction: string, job: Job) => {
    const record: Application = {
      id: Date.now().toString(),
      jobId: job.id,
      userId: 'local',
      status:
        direction === 'right'
          ? 'applied'
          : direction === 'left'
          ? 'rejected'
          : direction === 'up'
          ? 'prioritized'
          : 'saved',
      createdAt: new Date().toISOString(),
    };

    const existing = await AsyncStorage.getItem('applications');
    const apps: Application[] = existing ? JSON.parse(existing) : [];
    apps.push(record);
    await AsyncStorage.setItem('applications', JSON.stringify(apps));
  }, []);
}
