export interface Job {
  id: string;
  company: string;
  title: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits?: string[];
  postedDate: string;
  url: string;
  logo?: string;
  isRemote: boolean;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  similarity?: number;
}

export enum ApplicationStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Completed = 'completed',
  Rejected = 'rejected',
  NeedsAttention = 'needs_attention'
}

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  appliedDate: string;
  status: ApplicationStatus;
  notes?: string;
  lastUpdated?: string;
}


