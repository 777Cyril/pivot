import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TemperatureSlider from '@/components/TemperatureSlider';

describe('TemperatureSlider', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with initial value', () => {
    const { getByText, getByTestId } = render(
      <TemperatureSlider value={0.5} onValueChange={mockOnChange} />
    );

    expect(getByText('How different do you want to go?')).toBeTruthy();
    expect(getByTestId('temperature-slider')).toBeTruthy();
  });

  it('displays correct label for low temperature (0-0.2)', () => {
    const { getByText } = render(
      <TemperatureSlider value={0.1} onValueChange={mockOnChange} />
    );

    expect(getByText('Safe Step')).toBeTruthy();
    expect(getByText('Similar roles in your field')).toBeTruthy();
  });

  it('displays correct label for medium temperature (0.4-0.6)', () => {
    const { getByText } = render(
      <TemperatureSlider value={0.5} onValueChange={mockOnChange} />
    );

    expect(getByText('Pivot')).toBeTruthy();
    expect(getByText('New direction using transferable skills')).toBeTruthy();
  });

  it('displays correct label for high temperature (0.8-1.0)', () => {
    const { getByText } = render(
      <TemperatureSlider value={0.9} onValueChange={mockOnChange} />
    );

    expect(getByText('Reinvention')).toBeTruthy();
    expect(getByText('Complete career transformation')).toBeTruthy();
  });

  it('calls onValueChange when slider moves', () => {
    const { getByTestId } = render(
      <TemperatureSlider value={0.5} onValueChange={mockOnChange} />
    );

    const slider = getByTestId('temperature-slider');
    fireEvent(slider, 'onValueChange', 0.7);

    expect(mockOnChange).toHaveBeenCalledWith(0.7);
  });

  it('shows example career transitions', () => {
    const { getByText } = render(
      <TemperatureSlider value={0.3} onValueChange={mockOnChange} />
    );

    expect(getByText(/Developer → Technical PM/)).toBeTruthy();
  });
});
