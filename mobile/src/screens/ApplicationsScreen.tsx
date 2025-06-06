import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Application, Job } from '../types';
import { getItem } from '../utils/storage';

export default function ApplicationsScreen() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    getItem<Application[]>('applications').then((data) => {
      if (data) setApplications(data);
    });
  }, []);

  if (applications.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No applications yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={applications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{item.jobId}</Text>
          <Text>{item.status}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16 },
  item: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: { fontWeight: 'bold' },
});
