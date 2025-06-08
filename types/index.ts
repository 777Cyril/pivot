export interface Job {
  id: string;
  company: string;
  title: string;
  location: string;
  description: string;
  requirements: string[];
  /** Optional salary range */
  salary?: string;
  /** Optional benefits offered by the job */
  benefits?: string[];
  /** Date the job was posted */
  postedDate: Date;
  /** Public job posting URL */
  url: string;
  /** URL used for the actual application step */
  applicationUrl?: string;
  /** Company logo */
  logoUrl?: string;
  isRemote: boolean;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  /** Platform the job came from */
  platform?: 'greenhouse' | 'lever' | 'ashby' | 'linkedin' | 'indeed' | 'other';
  /** Whether the job can be auto applied to */
  canAutoApply?: boolean;
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


