import { Job } from '@/types';

export type ApplicationStatus = 'pending' | 'completed' | 'needs_attention';

export interface Application {
  id: string;
  job: Job;
  status: ApplicationStatus;
  appliedAt: Date;
  notes?: string;
  resumeVersion?: string;
  coverLetterRequired?: boolean;
  additionalStepsRequired?: string[];
}
