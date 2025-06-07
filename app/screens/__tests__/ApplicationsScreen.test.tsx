import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import { ApplicationsScreen } from '../ApplicationsScreen';
import { applicationService } from '../../services/applicationService';
import { Application } from '../../types/Application';

// Mock the navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock the application service to avoid AsyncStorage dependency
jest.mock('../../services/applicationService', () => ({
  applicationService: {
    getApplications: jest.fn(),
    getApplicationStats: jest.fn(),
    updateApplicationStatus: jest.fn(),
  },
}));

describe('ApplicationsScreen', () => {
  const mockApplications: Application[] = [
    {
      id: 'app_1',
      job: {
        id: '1',
        title: 'Senior Developer',
        company: 'Tech Corp',
        location: 'Remote',
        description: 'Great opportunity',
        postedDate: new Date(),
        applicationUrl: 'https://example.com',
      },
      status: 'pending',
      appliedAt: new Date('2024-01-15'),
    },
    {
      id: 'app_2',
      job: {
        id: '2',
        title: 'Product Manager',
        company: 'StartupXYZ',
        location: 'New York, NY',
        description: 'Cover letter required',
        postedDate: new Date(),
        applicationUrl: 'https://example.com',
      },
      status: 'needs_attention',
      appliedAt: new Date('2024-01-14'),
    },
    {
      id: 'app_3',
      job: {
        id: '3',
        title: 'UX Designer',
        company: 'Design Co',
        location: 'San Francisco, CA',
        description: 'Creative role',
        postedDate: new Date(),
        applicationUrl: 'https://example.com',
      },
      status: 'completed',
      appliedAt: new Date('2024-01-13'),
    },
  ];

  const mockStats = {
    total: 3,
    completed: 1,
    pending: 1,
    needsAttention: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (applicationService.getApplications as jest.Mock).mockResolvedValue(mockApplications);
    (applicationService.getApplicationStats as jest.Mock).mockResolvedValue(mockStats);
  });

  const renderScreen = () => {
    return render(
      <NavigationContainer>
        <ApplicationsScreen />
      </NavigationContainer>
    );
  };

  it('should render loading state initially', () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should display statistics after loading', async () => {
    const { getByText, getAllByText } = renderScreen();
    
    await waitFor(() => {
      expect(getByText('3')).toBeTruthy(); // Total applications
      expect(getAllByText('1').length).toBe(3); // Each status count
      expect(getByText('Total Applications')).toBeTruthy();
      expect(getAllByText('Completed')[0]).toBeTruthy();
      expect(getAllByText('Pending')[0]).toBeTruthy();
      expect(getAllByText('Needs Attention')[0]).toBeTruthy();
    });
  });

  it('should display all applications', async () => {
    const { getByText } = renderScreen();
    
    await waitFor(() => {
      expect(getByText('Senior Developer')).toBeTruthy();
      expect(getByText('Tech Corp')).toBeTruthy();
      expect(getByText('Product Manager')).toBeTruthy();
      expect(getByText('StartupXYZ')).toBeTruthy();
      expect(getByText('UX Designer')).toBeTruthy();
      expect(getByText('Design Co')).toBeTruthy();
    });
  });

  it('should display correct status badges', async () => {
    const { getByText } = renderScreen();
    
    await waitFor(() => {
      expect(getByText('PENDING')).toBeTruthy();
      expect(getByText('NEEDS ATTENTION')).toBeTruthy();
      expect(getByText('COMPLETED')).toBeTruthy();
    });
  });

  it('should filter applications by status', async () => {
    const { getByText, getAllByText, queryByText } = renderScreen();
    
    await waitFor(() => {
      expect(getByText('Senior Developer')).toBeTruthy();
    });

    // Click on "Needs Attention" filter
    fireEvent.press(getAllByText('Needs Attention')[1]);
    
    await waitFor(() => {
      expect(getByText('Product Manager')).toBeTruthy();
      expect(queryByText('Senior Developer')).toBeNull();
      expect(queryByText('UX Designer')).toBeNull();
    });
  });

  it('should show all applications when "All" filter is selected', async () => {
    const { getByText, getAllByText, queryByText } = renderScreen();
    
    await waitFor(() => {
      expect(getByText('Senior Developer')).toBeTruthy();
    });

    // First filter by status
    fireEvent.press(getAllByText('Completed')[1]);
    
    await waitFor(() => {
      expect(queryByText('Senior Developer')).toBeNull();
    });

    // Then click "All"
    fireEvent.press(getByText('All'));
    
    await waitFor(() => {
      expect(getByText('Senior Developer')).toBeTruthy();
      expect(getByText('Product Manager')).toBeTruthy();
      expect(getByText('UX Designer')).toBeTruthy();
    });
  });

  it('should update status when status button is pressed', async () => {
    const { getByTestId, getByText } = renderScreen();
    
    await waitFor(() => {
      expect(getByText('Senior Developer')).toBeTruthy();
    });

    // Find and press the status update button for the first application
    const statusButton = getByTestId('status-button-app_1');
    fireEvent.press(statusButton);
    
    expect(applicationService.updateApplicationStatus).toHaveBeenCalledWith(
      'app_1',
      'completed'
    );
  });

  it('should navigate to job details when application is pressed', async () => {
    const { getByTestId } = renderScreen();
    
    await waitFor(() => {
      const firstApplication = getByTestId('application-app_1');
      fireEvent.press(firstApplication);
    });

    expect(mockNavigate).toHaveBeenCalledWith('JobDetails', {
      job: mockApplications[0].job,
    });
  });

  it('should refresh when pulled down', async () => {
    const { getByTestId } = renderScreen();
    
    await waitFor(() => {
      expect(applicationService.getApplications).toHaveBeenCalledTimes(1);
    });

    const scrollView = getByTestId('applications-scroll-view');
    await act(async () => {
      scrollView.props.refreshControl.props.onRefresh();
    });
    
    await waitFor(() => {
      expect(applicationService.getApplications).toHaveBeenCalledTimes(2);
      expect(applicationService.getApplicationStats).toHaveBeenCalledTimes(2);
    });
  });

  it('should display empty state when no applications exist', async () => {
    (applicationService.getApplications as jest.Mock).mockResolvedValue([]);
    (applicationService.getApplicationStats as jest.Mock).mockResolvedValue({
      total: 0,
      completed: 0,
      pending: 0,
      needsAttention: 0,
    });

    const { getByText } = renderScreen();
    
    await waitFor(() => {
      expect(getByText('No applications yet')).toBeTruthy();
      expect(getByText('Start swiping on jobs to track your applications!')).toBeTruthy();
    });
  });
});
