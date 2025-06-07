import AsyncStorage from '@react-native-async-storage/async-storage';
import { applicationService } from '../applicationService';
import { Job } from '../../types/Job';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('ApplicationService', () => {
  const mockJob: Job = {
    id: '1',
    title: 'Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    description: 'Great job opportunity',
    postedDate: new Date('2024-01-01'),
    applicationUrl: 'https://example.com/apply',
  } as any;

  const mockJobWithCoverLetter: Job = {
    ...mockJob,
    id: '2',
    description: 'Please submit a cover letter with your application',
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  describe('createApplication', () => {
    it('should create a new application with pending status', async () => {
      const application = await applicationService.createApplication(mockJob);

      expect(application).toMatchObject({
        job: mockJob,
        status: 'pending',
      });
      expect(application.id).toContain('app_');
      expect(application.appliedAt).toBeInstanceOf(Date);
    });

    it('should create application with needs_attention status when cover letter required', async () => {
      const application = await applicationService.createApplication(mockJobWithCoverLetter);

      expect(application.status).toBe('needs_attention');
    });

    it('should save application to AsyncStorage', async () => {
      await applicationService.createApplication(mockJob);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'applications',
        expect.any(String)
      );
    });

    it('should not create duplicate applications for same job', async () => {
      const existingApp = {
        id: 'app_123',
        job: mockJob,
        status: 'pending',
        appliedAt: new Date(),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([existingApp])
      );

      await applicationService.createApplication(mockJob);

      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );

      expect(savedData).toHaveLength(1);
      expect(savedData[0].job.id).toBe(mockJob.id);
    });
  });

  describe('getApplications', () => {
    it('should return empty array when no applications exist', async () => {
      const applications = await applicationService.getApplications();

      expect(applications).toEqual([]);
    });

    it('should return stored applications', async () => {
      const mockApplications = [
        {
          id: 'app_1',
          job: mockJob,
          status: 'pending',
          appliedAt: new Date(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockApplications)
      );

      const applications = await applicationService.getApplications();

      expect(applications).toHaveLength(1);
      expect(applications[0].id).toBe('app_1');
    });
  });

  describe('updateApplicationStatus', () => {
    it('should update application status', async () => {
      const mockApplications = [
        {
          id: 'app_1',
          job: mockJob,
          status: 'pending',
          appliedAt: new Date(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockApplications)
      );

      await applicationService.updateApplicationStatus('app_1', 'completed');

      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );

      expect(savedData[0].status).toBe('completed');
    });
  });

  describe('getApplicationStats', () => {
    it('should return correct statistics', async () => {
      const mockApplications = [
        { id: '1', status: 'completed', job: mockJob, appliedAt: new Date() },
        { id: '2', status: 'pending', job: mockJob, appliedAt: new Date() },
        { id: '3', status: 'pending', job: mockJob, appliedAt: new Date() },
        { id: '4', status: 'needs_attention', job: mockJob, appliedAt: new Date() },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockApplications)
      );

      const stats = await applicationService.getApplicationStats();

      expect(stats).toEqual({
        total: 4,
        completed: 1,
        pending: 2,
        needsAttention: 1,
      });
    });
  });

  describe('rejected jobs', () => {
    it('should save rejected jobs', async () => {
      await applicationService.saveRejectedJob(mockJob);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'rejected_jobs',
        expect.stringContaining(mockJob.id)
      );
    });

    it('should retrieve rejected jobs', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([mockJob])
      );

      const rejected = await applicationService.getRejectedJobs();

      expect(rejected).toHaveLength(1);
      expect(rejected[0].id).toBe(mockJob.id);
    });
  });
});
