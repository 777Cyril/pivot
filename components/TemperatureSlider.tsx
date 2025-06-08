import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

interface TemperatureSliderProps {
  value: number;
  onValueChange: (value: number) => void;
}

interface TemperatureInfo {
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  examples: string[];
}

export default function TemperatureSlider({ value, onValueChange }: TemperatureSliderProps) {
  const getTemperatureInfo = (temp: number): TemperatureInfo => {
    if (temp < 0.2) {
      return {
        label: 'Safe Step',
        description: 'Similar roles in your field',
        icon: 'footsteps',
        color: '#4CAF50',
        examples: ['Developer → Senior Developer', 'Designer → Design Lead']
      };
    } else if (temp < 0.4) {
      return {
        label: 'Stretch',
        description: 'Adjacent roles leveraging your skills',
        icon: 'fitness',
        color: '#2196F3',
        examples: ['Developer → Technical PM', 'Designer → UX Researcher']
      };
    } else if (temp < 0.6) {
      return {
        label: 'Pivot',
        description: 'New direction using transferable skills',
        icon: 'shuffle',
        color: '#FF9800',
        examples: ['Developer → Product Manager', 'Designer → Brand Strategist']
      };
    } else if (temp < 0.8) {
      return {
        label: 'Bold Move',
        description: 'Significant career change',
        icon: 'rocket',
        color: '#FF5722',
        examples: ['Developer → Data Scientist', 'Designer → Entrepreneur']
      };
    } else {
      return {
        label: 'Reinvention',
        description: 'Complete career transformation',
        icon: 'planet',
        color: '#9C27B0',
        examples: ['Developer → Teacher', 'Designer → Therapist']
      };
    }
  };

  const info = getTemperatureInfo(value);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>How different do you want to go?</Text>
        <View style={[styles.badge, { backgroundColor: info.color }]}>
          <Ionicons name={info.icon} size={20} color="white" />
          <Text style={styles.badgeText}>{info.label}</Text>
        </View>
      </View>

      <Slider
        style={styles.slider}
        testID="temperature-slider"
        minimumValue={0}
        maximumValue={1}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={info.color}
        maximumTrackTintColor="#E0E0E0"
        thumbTintColor={info.color}
      />

      <View style={styles.labels}>
        <Text style={styles.labelText}>Similar</Text>
        <Text style={styles.labelText}>Different</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.description}>{info.description}</Text>
        <View style={styles.examples}>
          {info.examples.map((example, index) => (
            <Text key={index} style={styles.example}>• {example}</Text>
          ))}
        </View>
      </View>
    </View>
  );
}

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
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
    marginBottom: 20,
  },
  labelText: {
    fontSize: 12,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
  },
  examples: {
    gap: 4,
  },
  example: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
