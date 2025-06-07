import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { applicationService } from '../services/applicationService';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  experience: string;
  education: string;
}

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    experience: '',
    education: '',
  });
  const [skillsText, setSkillsText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        setSkillsText(parsed.skills.join(', '));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    try {
      const profileToSave = {
        ...profile,
        skills: skillsText
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0),
      };

      await AsyncStorage.setItem('userProfile', JSON.stringify(profileToSave));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your profile information and job applications. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userProfile');
              await AsyncStorage.removeItem('applications');
              await applicationService.clearAllApplications();

              setProfile({
                name: '',
                email: '',
                phone: '',
                location: '',
                bio: '',
                skills: [],
                experience: '',
                education: '',
              });
              setSkillsText('');

              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {showSuccess && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>Profile saved successfully!</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your full name"
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="your.email@example.com"
            value={profile.email}
            onChangeText={(text) => setProfile({ ...profile, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="(555) 123-4567"
            value={profile.phone}
            onChangeText={(text) => setProfile({ ...profile, phone: text })}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="City, State"
            value={profile.location}
            onChangeText={(text) => setProfile({ ...profile, location: text })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Information</Text>

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about yourself..."
            value={profile.bio}
            onChangeText={(text) => setProfile({ ...profile, bio: text })}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Skills</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., JavaScript, React, Node.js"
            value={skillsText}
            onChangeText={setSkillsText}
          />
          <Text style={styles.hint}>Separate skills with commas</Text>

          <Text style={styles.label}>Experience</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 5 years"
            value={profile.experience}
            onChangeText={(text) => setProfile({ ...profile, experience: text })}
          />

          <Text style={styles.label}>Education</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., BS Computer Science"
            value={profile.education}
            onChangeText={(text) => setProfile({ ...profile, education: text })}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => navigation.navigate('ExportResume' as never)}
        >
          <Text style={styles.exportButtonText}>Export Resume</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={clearAllData}>
          <Text style={styles.clearButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  successBanner: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exportButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 32,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
