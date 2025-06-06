import React from 'react';
import { render } from '@testing-library/react-native';
import SwipeCard from './SwipeCard';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('SwipeCard', () => {
  it('displays job information', () => {
    const job = { id: '1', title: 'Engineer', company: 'Acme', description: '' };
    const { getByText } = render(
      <SwipeCard job={job} onSwipe={() => {}} />
    );
    expect(getByText('Engineer')).toBeTruthy();
    expect(getByText('Acme')).toBeTruthy();
  });
});
