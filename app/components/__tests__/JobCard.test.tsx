import React from 'react';
import { render } from '@testing-library/react-native';
import { JobCard } from '../JobCard';
import { createMockJob } from '../../utils/jobUtils';

describe('JobCard', () => {
  it('should render job title', () => {
    const job = createMockJob({ title: 'Senior React Developer' });
    const { getByText } = render(<JobCard job={job} />);

    expect(getByText('Senior React Developer')).toBeTruthy();
  });

  it('should render company name', () => {
    const job = createMockJob({ company: 'Tech Innovators Inc' });
    const { getByText } = render(<JobCard job={job} />);

    expect(getByText('Tech Innovators Inc')).toBeTruthy();
  });

  it('should render location', () => {
    const job = createMockJob({ location: 'San Francisco, CA' });
    const { getByText } = render(<JobCard job={job} />);

    expect(getByText('San Francisco, CA')).toBeTruthy();
  });

  it('should render salary when provided', () => {
    const job = createMockJob({ salary: '$120k - $150k' });
    const { getByText } = render(<JobCard job={job} />);

    expect(getByText('$120k - $150k')).toBeTruthy();
  });

  it('should not crash when salary is not provided', () => {
    const job = createMockJob({ salary: undefined });
    const { queryByText } = render(<JobCard job={job} />);

    expect(queryByText('$')).toBeNull();
  });

  it('should show remote badge when job is remote', () => {
    const job = createMockJob({ isRemote: true });
    const { getByText } = render(<JobCard job={job} />);

    expect(getByText('Remote')).toBeTruthy();
  });

  it('should display employment type', () => {
    const job = createMockJob({ employmentType: 'contract' });
    const { getByText } = render(<JobCard job={job} />);

    expect(getByText('Contract')).toBeTruthy();
  });
});
