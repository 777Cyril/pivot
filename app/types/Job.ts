export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  requirements: string[];
  postedDate: Date;
  applicationUrl: string;
  logoUrl?: string;
  isRemote: boolean;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  // For future auto-apply features
  platform?: 'greenhouse' | 'lever' | 'ashby' | 'linkedin' | 'indeed' | 'other';
  canAutoApply?: boolean;
}
