import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Job } from '../types/Job';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const formatEmploymentType = (type: string): string => {
    return type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{job.title}</Text>
        {job.isRemote && (
          <View style={styles.remoteBadge}>
            <Text style={styles.remoteBadgeText}>Remote</Text>
          </View>
        )}
      </View>

      <Text style={styles.company}>{job.company}</Text>
      <Text style={styles.location}>{job.location}</Text>

      {job.salary && <Text style={styles.salary}>{job.salary}</Text>}

      <View style={styles.footer}>
        <View style={styles.employmentBadge}>
          <Text style={styles.employmentText}>
            {formatEmploymentType(job.employmentType)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  company: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  salary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 15,
  },
  remoteBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  remoteBadgeText: {
    color: '#1976d2',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  employmentBadge: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  employmentText: {
    fontSize: 12,
    color: '#666',
  },
});
