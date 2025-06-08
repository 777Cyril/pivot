import { JobService } from '../jobService';
import { Job } from '@/types';

describe('JobService', () => {
  let jobService: JobService;

  beforeEach(() => {
    jobService = new JobService();
  });

  describe('fetchJobs', () => {
    it('should return an array of jobs', async () => {
      const jobs = await jobService.fetchJobs();
      
      expect(Array.isArray(jobs)).toBe(true);
      expect(jobs.length).toBeGreaterThan(0);
    });

    it('should return jobs with valid structure', async () => {
      const jobs = await jobService.fetchJobs();
      const firstJob = jobs[0];
      
      expect(firstJob).toHaveProperty('id');
      expect(firstJob).toHaveProperty('title');
      expect(firstJob).toHaveProperty('company');
      expect(firstJob).toHaveProperty('location');
      expect(firstJob).toHaveProperty('description');
      expect(firstJob).toHaveProperty('requirements');
      expect(firstJob).toHaveProperty('postedDate');
      expect(firstJob).toHaveProperty('applicationUrl');
    });

    it('should return at least 10 mock jobs', async () => {
      const jobs = await jobService.fetchJobs();
      
      expect(jobs.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('filterJobsByLocation', () => {
    it('should filter jobs by location keyword', async () => {
      const allJobs = await jobService.fetchJobs();
      const nycJobs = jobService.filterJobsByLocation(allJobs, 'New York');
      
      expect(nycJobs.length).toBeGreaterThan(0);
      nycJobs.forEach(job => {
        expect(job.location.toLowerCase()).toContain('new york');
      });
    });

    it('should return empty array when no jobs match location', async () => {
      const allJobs = await jobService.fetchJobs();
      const marsJobs = jobService.filterJobsByLocation(allJobs, 'Mars');
      
      expect(marsJobs).toEqual([]);
    });

    it('should be case insensitive', async () => {
      const allJobs = await jobService.fetchJobs();
      const upperCaseResults = jobService.filterJobsByLocation(allJobs, 'REMOTE');
      const lowerCaseResults = jobService.filterJobsByLocation(allJobs, 'remote');
      
      expect(upperCaseResults.length).toBe(lowerCaseResults.length);
    });
  });

  describe('filterJobsByExperienceLevel', () => {
    it('should filter jobs by experience level', async () => {
      const allJobs = await jobService.fetchJobs();
      const entryJobs = jobService.filterJobsByExperienceLevel(allJobs, 'Entry');
      
      expect(entryJobs.length).toBeGreaterThan(0);
      entryJobs.forEach(job => {
        expect(job.experienceLevel).toBe('Entry');
      });
    });

    it('should handle multiple experience levels', async () => {
      const allJobs = await jobService.fetchJobs();
      const juniorJobs = jobService.filterJobsByExperienceLevel(allJobs, ['Entry', 'Mid']);
      
      juniorJobs.forEach(job => {
        expect(['Entry', 'Mid']).toContain(job.experienceLevel);
      });
    });
  });

  describe('sortJobsByDate', () => {
    it('should sort jobs from newest to oldest', () => {
      const jobs: Job[] = [
        { postedDate: new Date('2024-01-01'), id: '1' } as Job,
        { postedDate: new Date('2024-03-01'), id: '2' } as Job,
        { postedDate: new Date('2024-02-01'), id: '3' } as Job,
      ];
      
      const sorted = jobService.sortJobsByDate(jobs);
      
      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('1');
    });
  });
});
