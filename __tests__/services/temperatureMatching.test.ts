import { filterJobsByTemperature, calculateSimilarityScore } from '@/services/temperatureMatching';
import { Job } from '@/types';

describe('Temperature-based Job Matching', () => {
  const mockUserProfile = {
    currentRole: 'Software Developer',
    skillVector: {
      programming: 0.9,
      webDevelopment: 0.8,
      leadership: 0.3,
      communication: 0.5,
      projectManagement: 0.4,
    }
  };

  const mockJobs: Partial<Job>[] = [
    {
      id: '1',
      title: 'Senior Software Developer',
      similarity: 0.95,
    },
    {
      id: '2',
      title: 'Technical Product Manager',
      similarity: 0.65,
    },
    {
      id: '3',
      title: 'UX Designer',
      similarity: 0.35,
    },
    {
      id: '4',
      title: 'Data Scientist',
      similarity: 0.45,
    },
    {
      id: '5',
      title: 'Sales Manager',
      similarity: 0.15,
    },
  ];

  describe('filterJobsByTemperature', () => {
    it('returns similar jobs for low temperature', () => {
      const filtered = filterJobsByTemperature(mockJobs as Job[], 0.1);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Senior Software Developer');
    });

    it('returns moderate pivots for medium temperature', () => {
      const filtered = filterJobsByTemperature(mockJobs as Job[], 0.5);
      expect(filtered.map(j => j.title)).toContain('Technical Product Manager');
      expect(filtered.map(j => j.title)).toContain('Data Scientist');
      expect(filtered).toHaveLength(2);
    });

    it('returns very different jobs for high temperature', () => {
      const filtered = filterJobsByTemperature(mockJobs as Job[], 0.9);
      expect(filtered.map(j => j.title)).toContain('Sales Manager');
      expect(filtered.map(j => j.title)).toContain('UX Designer');
    });

    it('returns empty array if no jobs match temperature range', () => {
      const filtered = filterJobsByTemperature([], 0.5);
      expect(filtered).toHaveLength(0);
    });
  });

  describe('calculateSimilarityScore', () => {
    it('calculates high similarity for similar roles', () => {
      const jobVector = {
        programming: 0.9,
        webDevelopment: 0.9,
        leadership: 0.4,
        communication: 0.5,
        projectManagement: 0.5,
      };
      const score = calculateSimilarityScore(mockUserProfile.skillVector, jobVector);
      expect(score).toBeGreaterThan(0.8);
    });

    it('calculates low similarity for very different roles', () => {
      const jobVector = {
        programming: 0.1,
        webDevelopment: 0.0,
        leadership: 0.9,
        communication: 0.9,
        projectManagement: 0.8,
      };
      const score = calculateSimilarityScore(mockUserProfile.skillVector, jobVector);
      expect(score).toBeLessThan(0.6);
    });
  });
});
