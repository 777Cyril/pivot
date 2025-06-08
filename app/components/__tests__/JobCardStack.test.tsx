import React from 'react';
import { render } from '@testing-library/react-native';
import { JobCardStack } from '../JobCardStack';
import { createMockJob } from '../../utils/jobUtils';
import { Job } from '@/types';

// Mock the SwipeableCard component to simplify testing
jest.mock('../SwipeableCard', () => ({
  SwipeableCard: jest.fn(({ children }) => <>{children}</>),
}));

import { SwipeableCard } from '../SwipeableCard';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('JobCardStack', () => {
  const createMockJobs = (count: number): Job[] => {
    return Array.from({ length: count }, (_, i) =>
      createMockJob({
        id: `job-${i}`,
        title: `Job Title ${i}`,
        company: `Company ${i}`,
      })
    );
  };

  it('should render empty state when no jobs provided', () => {
    const { getByText } = render(
      <JobCardStack jobs={[]} onSwipeLeft={() => {}} onSwipeRight={() => {}} />
    );

    expect(getByText('No more jobs available')).toBeTruthy();
  });

  it('should render the first job card', () => {
    const jobs = createMockJobs(3);
    const { getByText } = render(
      <JobCardStack jobs={jobs} onSwipeLeft={() => {}} onSwipeRight={() => {}} />
    );

    expect(getByText('Job Title 0')).toBeTruthy();
    expect(getByText('Company 0')).toBeTruthy();
  });

  it('should call onSwipeLeft with job data', () => {
    const mockOnSwipeLeft = jest.fn();
    const jobs = createMockJobs(2);

    render(
      <JobCardStack jobs={jobs} onSwipeLeft={mockOnSwipeLeft} onSwipeRight={() => {}} />
    );

    // Since we mocked SwipeableCard, we need to test the callback directly
    const { onSwipeLeft: propOnSwipeLeft } = (SwipeableCard as jest.Mock).mock.calls[0][0];
    propOnSwipeLeft();

    expect(mockOnSwipeLeft).toHaveBeenCalledWith(jobs[0]);
  });

  it('should show loading state when isLoading is true', () => {
    const jobs = createMockJobs(2);
    const { getByTestId } = render(
      <JobCardStack
        jobs={jobs}
        onSwipeLeft={() => {}}
        onSwipeRight={() => {}}
        isLoading={true}
      />
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should render preview of next cards', () => {
    const jobs = createMockJobs(4);
    const { getByText, queryByText } = render(
      <JobCardStack jobs={jobs} onSwipeLeft={() => {}} onSwipeRight={() => {}} />
    );

    // Should show current card
    expect(getByText('Job Title 0')).toBeTruthy();

    // Should not show cards beyond preview limit
    expect(queryByText('Job Title 3')).toBeNull();
  });
});
