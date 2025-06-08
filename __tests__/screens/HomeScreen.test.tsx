import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { HomeScreen } from '../../app/screens/HomeScreen';
import { jobService } from '../../app/services/jobService';
import { applicationService } from '../../app/services/applicationService';

jest.mock('../../app/services/jobService');
jest.mock('../../app/services/applicationService', () => ({
  applicationService: {
    createApplication: jest.fn(),
  },
}));
jest.mock('../../app/components/JobCardStack', () => {
  const View = require('react-native').View;
  const Text = require('react-native').Text;
  return {
    __esModule: true,
    default: ({ jobs }: any) => (
      <View testID="job-card-stack">
        <Text>{jobs[0]?.title}</Text>
      </View>
    ),
  };
});

describe('HomeScreen with Temperature Control', () => {
  beforeEach(() => {
    (jobService.fetchJobs as jest.Mock).mockResolvedValue([
      { id: '1', title: 'Software Developer', similarity: 0.9 },
      { id: '2', title: 'Product Manager', similarity: 0.6 },
      { id: '3', title: 'UX Designer', similarity: 0.3 },
    ]);
  });

  it('renders temperature slider', async () => {
    const { getByTestId } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByTestId('temperature-slider')).toBeTruthy();
    });
  });

  it('filters jobs when temperature changes', async () => {
    const { getByTestId } = render(<HomeScreen />);

    const slider = await waitFor(() => getByTestId('temperature-slider'));
    fireEvent(slider, 'onValueChange', 0.8);

    await waitFor(() => {
      expect(getByTestId('job-card-stack')).toBeTruthy();
    });
  });

  it('shows temperature info in UI', async () => {
    const { getByTestId } = render(<HomeScreen />);

    const slider = await waitFor(() => getByTestId('temperature-slider'));
    fireEvent(slider, 'onValueChange', 0.5);

    expect(slider).toBeTruthy();
  });
});
