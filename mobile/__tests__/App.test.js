import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('App', () => {
  it('shows onboarding screen by default', () => {
    const { getByText } = render(<App />);
    expect(getByText('Welcome to Pivot')).toBeTruthy();
    expect(getByText('Get Started')).toBeTruthy();
  });
});
