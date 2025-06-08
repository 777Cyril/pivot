import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';

let jobCardStackProps: any;

// Mock the job service
jest.mock('../../services/jobService');
jest.mock('../../services/applicationService', () => ({
  applicationService: {
    createApplication: jest.fn(),
  },
}));

// Mock the components to simplify testing
jest.mock('../../components/JobCardStack', () => ({
  JobCardStack: (props: any) => {
    jobCardStackProps = props;
    const { jobs, isLoading } = props;
    const MockComponent = require('react-native').View;
    const MockText = require('react-native').Text;
    
    if (isLoading) {
      return <MockText testID="loading">Loading...</MockText>;
    }
    
    return (
      <MockComponent testID="job-card-stack">
        <MockText>{`Jobs count: ${jobs.length}`}</MockText>
      </MockComponent>
    );
  },
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (jobService.sortJobsByDate as jest.Mock).mockImplementation((jobs: any) => jobs);
  });

  it('should render the screen with header', () => {
    (jobService.fetchJobs as jest.Mock).mockResolvedValue([]);
    
    const { getByText } = render(<HomeScreen />);
    
    expect(getByText('Job Swiper')).toBeTruthy();
  });

  it('should show loading state initially', () => {
    (jobService.fetchJobs as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );
    
    const { getByTestId } = render(<HomeScreen />);
    
    expect(getByTestId('loading')).toBeTruthy();
  });

  it('should load and display jobs', async () => {
    const mockJobs = [
      { id: '1', title: 'Job 1' },
      { id: '2', title: 'Job 2' },
    ];
    
    (jobService.fetchJobs as jest.Mock).mockResolvedValue(mockJobs);
    
    const { getByText, getByTestId } = render(<HomeScreen />);
    
    await waitFor(() => {
      expect(getByTestId('job-card-stack')).toBeTruthy();
      expect(getByText('Jobs count: 2')).toBeTruthy();
    });
  });

  it('should show swipe instructions', () => {
    (jobService.fetchJobs as jest.Mock).mockResolvedValue([]);
    
    const { getByText } = render(<HomeScreen />);
    
    expect(getByText(/Swipe right to apply/i)).toBeTruthy();
    expect(getByText(/Swipe left to pass/i)).toBeTruthy();
  });

  it('should have refresh button', () => {
    (jobService.fetchJobs as jest.Mock).mockResolvedValue([]);
    
    const { getByTestId } = render(<HomeScreen />);
    
    expect(getByTestId('refresh-button')).toBeTruthy();
  });

  it('should refresh jobs when refresh button is pressed', async () => {
    const mockJobs = [{ id: '1', title: 'Job 1' }];
    (jobService.fetchJobs as jest.Mock).mockResolvedValue(mockJobs);
    
    const { getByTestId } = render(<HomeScreen />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(jobService.fetchJobs).toHaveBeenCalledTimes(1);
    });
    
    // Press refresh
    const refreshButton = getByTestId('refresh-button');
    fireEvent.press(refreshButton);
    
    await waitFor(() => {
      expect(jobService.fetchJobs).toHaveBeenCalledTimes(2);
    });
  });

  it('should track applied and rejected jobs count', () => {
    (jobService.fetchJobs as jest.Mock).mockResolvedValue([]);

    const { getByText } = render(<HomeScreen />);

    expect(getByText(/Applied: 0/)).toBeTruthy();
    expect(getByText(/Passed: 0/)).toBeTruthy();
  });

  it('should create an application when swiped right', async () => {
    const mockJobs = [{ id: '1', title: 'Job 1' }];
    (jobService.fetchJobs as jest.Mock).mockResolvedValue(mockJobs);

    const { getByTestId } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByTestId('job-card-stack')).toBeTruthy();
    });

    // Trigger the onSwipeRight callback from the mocked component
    await jobCardStackProps.onSwipeRight(mockJobs[0]);

    expect(applicationService.createApplication).toHaveBeenCalledWith(mockJobs[0]);
  });
});
