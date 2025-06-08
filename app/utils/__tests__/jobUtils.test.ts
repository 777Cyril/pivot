import { createMockJob, isJobNew } from '../jobUtils';

describe('jobUtils', () => {
  describe('createMockJob', () => {
    it('should create a valid mock job with default values', () => {
      const mockJob = createMockJob();
      
      expect(mockJob).toHaveProperty('id');
      expect(mockJob).toHaveProperty('title');
      expect(mockJob).toHaveProperty('company');
      expect(mockJob).toHaveProperty('location');
      expect(mockJob).toHaveProperty('description');
      expect(mockJob.requirements).toBeInstanceOf(Array);
      expect(mockJob.isRemote).toBe(false);
      expect(mockJob.employmentType).toBe('Full-time');
    });

    it('should override default values with provided partial job data', () => {
      const mockJob = createMockJob({
        title: 'Senior React Native Developer',
        company: 'Tech Corp',
        isRemote: true
      });
      
      expect(mockJob.title).toBe('Senior React Native Developer');
      expect(mockJob.company).toBe('Tech Corp');
      expect(mockJob.isRemote).toBe(true);
    });
  });

  describe('isJobNew', () => {
    it('should return true for jobs posted within 7 days', () => {
      const recentJob = createMockJob({
        postedDate: new Date()
      });
      
      expect(isJobNew(recentJob)).toBe(true);
    });

    it('should return false for jobs posted more than 7 days ago', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 10);
      
      const oldJob = createMockJob({
        postedDate: oldDate
      });
      
      expect(isJobNew(oldJob)).toBe(false);
    });
  });
});
