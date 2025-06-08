import { Job } from '../types/Job';
import { createMockJob } from '../utils/jobUtils';

export class JobService {
  // Mock data for now, will be replaced with API calls later
  private mockJobs: Job[] = [
    createMockJob({
      id: '1',
      title: 'Senior React Native Developer',
      company: 'TechCorp',
      location: 'New York, NY',
      salary: '$150k - $180k',
      isRemote: false,
      experienceLevel: 'senior',
      platform: 'greenhouse',
      canAutoApply: true,
    }),
    createMockJob({
      id: '2',
      title: 'Mobile Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$120k - $140k',
      isRemote: true,
      experienceLevel: 'mid',
      platform: 'lever',
      canAutoApply: true,
    }),
    createMockJob({
      id: '3',
      title: 'Junior React Developer',
      company: 'Digital Agency',
      location: 'San Francisco, CA',
      salary: '$80k - $100k',
      experienceLevel: 'entry',
      platform: 'ashby',
      canAutoApply: true,
    }),
    createMockJob({
      id: '4',
      title: 'Full Stack Developer',
      company: 'Enterprise Co',
      location: 'Chicago, IL',
      salary: '$110k - $130k',
      experienceLevel: 'mid',
      employmentType: 'full-time',
    }),
    createMockJob({
      id: '5',
      title: 'React Native Contractor',
      company: 'Consulting Firm',
      location: 'Remote',
      isRemote: true,
      experienceLevel: 'senior',
      employmentType: 'contract',
    }),
    createMockJob({
      id: '6',
      title: 'Mobile Dev Intern',
      company: 'Big Tech Co',
      location: 'Seattle, WA',
      salary: '$25/hour',
      experienceLevel: 'entry',
      employmentType: 'internship',
    }),
    createMockJob({
      id: '7',
      title: 'Lead Mobile Engineer',
      company: 'FinTech Startup',
      location: 'New York, NY',
      salary: '$180k - $220k',
      experienceLevel: 'lead',
      platform: 'linkedin',
    }),
    createMockJob({
      id: '8',
      title: 'React Developer',
      company: 'Healthcare Tech',
      location: 'Boston, MA',
      experienceLevel: 'mid',
      platform: 'indeed',
    }),
    createMockJob({
      id: '9',
      title: 'Senior Frontend Engineer',
      company: 'E-commerce Giant',
      location: 'Remote',
      isRemote: true,
      salary: '$160k - $190k',
      experienceLevel: 'senior',
    }),
    createMockJob({
      id: '10',
      title: 'React Native Developer',
      company: 'Media Company',
      location: 'Los Angeles, CA',
      experienceLevel: 'mid',
      employmentType: 'full-time',
    }),
  ];

  async fetchJobs(): Promise<Job[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return jobs with varied posted dates
    const now = new Date();
    return this.mockJobs.map((job, index) => {
      const daysAgo = Math.floor(Math.random() * 30);
      const postedDate = new Date(now);
      postedDate.setDate(postedDate.getDate() - daysAgo);

      return {
        ...job,
        postedDate,
      };
    });
  }

  filterJobsByLocation(jobs: Job[], location: string): Job[] {
    const searchTerm = location.toLowerCase();
    return jobs.filter(job => 
      job.location.toLowerCase().includes(searchTerm)
    );
  }

  filterJobsByExperienceLevel(
    jobs: Job[], 
    level: Job['experienceLevel'] | Job['experienceLevel'][]
  ): Job[] {
    const levels = Array.isArray(level) ? level : [level];
    return jobs.filter(job => levels.includes(job.experienceLevel));
  }

  sortJobsByDate(jobs: Job[]): Job[] {
    return [...jobs].sort((a, b) => {
      const dateA = a.postedDate.getTime();
      const dateB = b.postedDate.getTime();
      return dateB - dateA; // Newest first
    });
  }

  async rejectJob(id: string): Promise<void> {
    // In a real app, this would notify the backend
    this.mockJobs = this.mockJobs.filter(job => job.id !== id);
  }
}

// Export singleton instance
export const jobService = new JobService();
