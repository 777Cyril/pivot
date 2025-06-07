import { Job } from './Job';

export interface Application {
  id: string;
  job: Job;
  status: 'pending' | 'completed' | 'needs_attention';
  appliedAt: Date;
  notes?: string;
  resumeVersion?: string;
  coverLetterRequired?: boolean;
  additionalStepsRequired?: string[];
}
