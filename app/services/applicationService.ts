import AsyncStorage from '@react-native-async-storage/async-storage';
import { Job } from '@/types';
import { Application } from '../types/Application';

const APPLICATIONS_KEY = 'applications';
const REJECTED_JOBS_KEY = 'rejected_jobs';

export class ApplicationService {
  async getApplications(): Promise<Application[]> {
    try {
      const data = await AsyncStorage.getItem(APPLICATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading applications:', error);
      return [];
    }
  }

  async createApplication(job: Job): Promise<Application> {
    const application: Application = {
      id: `app_${Date.now()}_${job.id}`,
      job,
      status: this.determineInitialStatus(job),
      appliedAt: new Date(),
    };

    try {
      const applications = await this.getApplications();
      const updated = [application, ...applications.filter(a => a.job.id !== job.id)];
      await AsyncStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));
      return application;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  private determineInitialStatus(job: Job): Application['status'] {
    // Simple logic: if job has specific requirements, it needs attention
    if (job.description?.toLowerCase().includes('cover letter') ||
        job.description?.toLowerCase().includes('portfolio')) {
      return 'needs_attention';
    }
    return 'pending';
  }

  async updateApplicationStatus(id: string, status: Application['status']): Promise<void> {
    try {
      const applications = await this.getApplications();
      const updated = applications.map(app => 
        app.id === id ? { ...app, status } : app
      );
      await AsyncStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating application:', error);
    }
  }

  async getApplicationStats() {
    const applications = await this.getApplications();
    return {
      total: applications.length,
      completed: applications.filter(a => a.status === 'completed').length,
      pending: applications.filter(a => a.status === 'pending').length,
      needsAttention: applications.filter(a => a.status === 'needs_attention').length,
    };
  }

  async saveRejectedJob(job: Job): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(REJECTED_JOBS_KEY);
      const rejected = data ? JSON.parse(data) : [];
      const updated = [job, ...rejected.filter((j: Job) => j.id !== job.id)];
      await AsyncStorage.setItem(REJECTED_JOBS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving rejected job:', error);
    }
  }

  async getRejectedJobs(): Promise<Job[]> {
    try {
      const data = await AsyncStorage.getItem(REJECTED_JOBS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading rejected jobs:', error);
      return [];
    }
  }

  async clearAllApplications(): Promise<void> {
    try {
      await AsyncStorage.removeItem(APPLICATIONS_KEY);
    } catch (error) {
      console.error('Error clearing applications:', error);
    }
  }
}

export const applicationService = new ApplicationService();
