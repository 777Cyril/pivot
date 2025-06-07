import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { act } from 'react-test-renderer';
import { ProfileScreen } from '../ProfileScreen';
import { applicationService } from '../../services/applicationService';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock application service
jest.mock('../../services/applicationService');

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  const mockUserProfile = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    location: 'New York, NY',
    bio: 'Experienced developer',
    skills: ['React', 'TypeScript', 'Node.js'],
    experience: '5 years',
    education: 'BS Computer Science',
  };

  it('should render profile form with empty fields initially', () => {
    const { getByPlaceholderText } = render(<ProfileScreen />);
    
    expect(getByPlaceholderText('Your full name')).toBeTruthy();
    expect(getByPlaceholderText('your.email@example.com')).toBeTruthy();
    expect(getByPlaceholderText('(555) 123-4567')).toBeTruthy();
    expect(getByPlaceholderText('City, State')).toBeTruthy();
    expect(getByPlaceholderText('Tell us about yourself...')).toBeTruthy();
    expect(getByPlaceholderText('e.g., JavaScript, React, Node.js')).toBeTruthy();
    expect(getByPlaceholderText('e.g., 5 years')).toBeTruthy();
    expect(getByPlaceholderText('e.g., BS Computer Science')).toBeTruthy();
  });

  it('should load saved profile data', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUserProfile));
    
    const { getByDisplayValue } = render(<ProfileScreen />);
    
    await waitFor(() => {
      expect(getByDisplayValue('John Doe')).toBeTruthy();
      expect(getByDisplayValue('john@example.com')).toBeTruthy();
      expect(getByDisplayValue('123-456-7890')).toBeTruthy();
      expect(getByDisplayValue('New York, NY')).toBeTruthy();
      expect(getByDisplayValue('Experienced developer')).toBeTruthy();
      expect(getByDisplayValue('React, TypeScript, Node.js')).toBeTruthy();
      expect(getByDisplayValue('5 years')).toBeTruthy();
      expect(getByDisplayValue('BS Computer Science')).toBeTruthy();
    });
  });

  it('should update form fields when user types', () => {
    const { getByPlaceholderText } = render(<ProfileScreen />);
    
    const nameInput = getByPlaceholderText('Your full name');
    fireEvent.changeText(nameInput, 'Jane Smith');
    
    expect(nameInput.props.value).toBe('Jane Smith');
  });

  it('should save profile when save button is pressed', async () => {
    const { getByPlaceholderText, getByText } = render(<ProfileScreen />);
    
    // Fill in the form
    fireEvent.changeText(getByPlaceholderText('Your full name'), 'Jane Smith');
    fireEvent.changeText(getByPlaceholderText('your.email@example.com'), 'jane@example.com');
    fireEvent.changeText(getByPlaceholderText('(555) 123-4567'), '987-654-3210');
    fireEvent.changeText(getByPlaceholderText('City, State'), 'Los Angeles, CA');
    fireEvent.changeText(getByPlaceholderText('Tell us about yourself...'), 'Senior developer');
    fireEvent.changeText(getByPlaceholderText('e.g., JavaScript, React, Node.js'), 'React, Vue');
    fireEvent.changeText(getByPlaceholderText('e.g., 5 years'), '8 years');
    fireEvent.changeText(getByPlaceholderText('e.g., BS Computer Science'), 'MS Computer Science');
    
    // Press save button
    fireEvent.press(getByText('Save Profile'));
    
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'userProfile',
        JSON.stringify({
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '987-654-3210',
          location: 'Los Angeles, CA',
          bio: 'Senior developer',
          skills: ['React', 'Vue'],
          experience: '8 years',
          education: 'MS Computer Science',
        })
      );
    });
  });

  it('should show success message after saving', async () => {
    const { getByPlaceholderText, getByText } = render(<ProfileScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Your full name'), 'Test User');
    fireEvent.press(getByText('Save Profile'));
    
    await waitFor(() => {
      expect(getByText('Profile saved successfully!')).toBeTruthy();
    });
  });

  it('should navigate to export resume screen', () => {
    const { getByText } = render(<ProfileScreen />);
    
    fireEvent.press(getByText('Export Resume'));
    
    expect(mockNavigate).toHaveBeenCalledWith('ExportResume');
  });

  it('should clear all data when reset button is pressed', async () => {
    (applicationService.clearAllApplications as jest.Mock).mockResolvedValue(undefined);
    const alertSpy = jest
      .spyOn(Alert, 'alert')
      .mockImplementation((title, message, buttons) => {
        const confirmButton = buttons && (buttons as any)[1];
        confirmButton?.onPress?.();
      });

    const { getByText } = render(<ProfileScreen />);

    fireEvent.press(getByText('Clear All Data'));

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userProfile');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('applications');
      expect(applicationService.clearAllApplications).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
  });

  it('should parse skills as comma-separated values', async () => {
    const { getByPlaceholderText, getByText } = render(<ProfileScreen />);
    
    fireEvent.changeText(
      getByPlaceholderText('e.g., JavaScript, React, Node.js'), 
      'Python, Django, PostgreSQL, Docker'
    );
    fireEvent.press(getByText('Save Profile'));
    
    await waitFor(() => {
      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(savedData.skills).toEqual(['Python', 'Django', 'PostgreSQL', 'Docker']);
    });
  });

  it('should handle empty skills gracefully', async () => {
    const { getByPlaceholderText, getByText } = render(<ProfileScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Your full name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('e.g., JavaScript, React, Node.js'), '');
    fireEvent.press(getByText('Save Profile'));
    
    await waitFor(() => {
      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(savedData.skills).toEqual([]);
    });
  });
});
