import { Job } from '../types/Job';

export function createMockJob(overrides?: Partial<Job>): Job {
  return {
    id: Math.random().toString(36).substring(7),
    title: 'Software Developer',
    company: 'Example Corp',
    location: 'New York, NY',
    description: 'We are looking for a talented developer...',
    requirements: ['React Native', 'TypeScript', 'Jest'],
    postedDate: new Date().toISOString(),
    applicationUrl: 'https://example.com/apply',
    isRemote: false,
    employmentType: 'full-time',
    experienceLevel: 'mid',
    ...overrides,
  };
}

export function isJobNew(job: Job, daysThreshold: number = 7): boolean {
  const postedDate = new Date(job.postedDate);
  const now = new Date();
  const daysDifference =
    (now.getTime() - postedDate.getTime()) / (1000 * 3600 * 24);

  return daysDifference <= daysThreshold;
}
