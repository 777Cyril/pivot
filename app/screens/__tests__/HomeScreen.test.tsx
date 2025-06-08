import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { HomeScreen } from '../HomeScreen';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';

jest.mock('../../services/jobService');
jest.mock('../../services/applicationService', () => ({
  applicationService: {
    createApplication: jest.fn(),
  },
}));

let jobCardStackProps: any;
jest.mock('../../components/JobCardStack', () => ({
  __esModule: true,
  JobCardStack: (props: any) => {
    jobCardStackProps = props;
    const View = require('react-native').View;
    const Text = require('react-native').Text;
    return (
      <View testID="job-card-stack">
        <Text>{`Jobs count: ${props.jobs.length}`}</Text>
      </View>
    );
  },
}));

describe('HomeScreen (updated)', () => {
  beforeEach(() => {
    (jobService.fetchJobs as jest.Mock).mockResolvedValue([
      { id: '1', title: 'Developer', similarity: 0.9 },
      { id: '2', title: 'Designer', similarity: 0.3 },
    ]);
  });

  it('renders temperature slider and jobs', async () => {
    const { getByTestId } = render(<HomeScreen />);
    await waitFor(() => {
      expect(getByTestId('temperature-slider')).toBeTruthy();
      expect(getByTestId('job-card-stack')).toBeTruthy();
    });
  });

  it('calls applicationService on swipe right', async () => {
    const { getByTestId } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByTestId('job-card-stack')).toBeTruthy();
    });

    await act(async () => {
      await jobCardStackProps.onSwipeRight({ id: '1', title: 'Developer', similarity: 0.9 });
    });

    expect(applicationService.createApplication).toHaveBeenCalled();
  });
});
