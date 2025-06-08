import AsyncStorage from '@react-native-async-storage/async-storage';
import { Job } from '@/types';
import { createEmptyVector, SkillVector } from './vectorOperations';
import { careerMatchingService, JobWithVector } from './careerMatchingService';

// Mock user profile for MVP (in production, this would come from parsed resume)
const mockUserProfile = {
  id: '1',
  currentRole: 'Software Engineer',
  yearsExperience: 5,
  skills: ['javascript', 'react', 'node.js', 'aws'],
  vector: {
    ...createEmptyVector(),
    programming: 0.9,
    webDevelopment: 0.8,
    cloudComputing: 0.6,
    leadership: 0.3,
    communication: 0.5,
    problemSolving: 0.8,
    teamwork: 0.6,
  },
  temperature: 0.5,
};

// Enhanced mock jobs with vectors
const vectorizedJobs: JobWithVector[] = [
  // Similar roles (high similarity)
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp',
    vector: {
      ...createEmptyVector(),
      programming: 0.95,
      webDevelopment: 0.85,
      cloudComputing: 0.7,
      leadership: 0.4,
      problemSolving: 0.85,
    },
    requiredExperience: 5,
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    vector: {
      ...createEmptyVector(),
      programming: 0.85,
      webDevelopment: 0.9,
      databases: 0.7,
      problemSolving: 0.8,
    },
    requiredExperience: 4,
  },
  
  // Moderate pivots
  {
    id: '3',
    title: 'Technical Product Manager',
    company: 'ProductCo',
    vector: {
      ...createEmptyVector(),
      programming: 0.4,
      projectManagement: 0.8,
      communication: 0.8,
      leadership: 0.6,
      problemSolving: 0.7,
    },
    requiredExperience: 4,
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudFirst',
    vector: {
      ...createEmptyVector(),
      programming: 0.7,
      cloudComputing: 0.9,
      devOps: 0.95,
      problemSolving: 0.8,
    },
    requiredExperience: 3,
  },
  {
    id: '5',
    title: 'Solutions Architect',
    company: 'Enterprise Inc',
    vector: {
      ...createEmptyVector(),
      programming: 0.6,
      cloudComputing: 0.8,
      communication: 0.7,
      leadership: 0.5,
      problemSolving: 0.9,
    },
    requiredExperience: 6,
  },
  
  // Significant pivots
  {
    id: '6',
    title: 'Data Scientist',
    company: 'DataDriven',
    vector: {
      ...createEmptyVector(),
      programming: 0.7,
      dataAnalysis: 0.9,
      machineLearning: 0.8,
      research: 0.7,
      problemSolving: 0.85,
    },
    requiredExperience: 3,
  },
  {
    id: '7',
    title: 'UX Engineer',
    company: 'DesignTech',
    vector: {
      ...createEmptyVector(),
      programming: 0.5,
      webDevelopment: 0.6,
      design: 0.7,
      creativity: 0.6,
      problemSolving: 0.6,
    },
    requiredExperience: 3,
  },
  
  // Bold pivots
  {
    id: '8',
    title: 'Technical Writer',
    company: 'DocuCorp',
    vector: {
      ...createEmptyVector(),
      programming: 0.3,
      writing: 0.9,
      communication: 0.9,
      research: 0.6,
    },
    requiredExperience: 2,
  },
  {
    id: '9',
    title: 'Developer Relations',
    company: 'APIFirst',
    vector: {
      ...createEmptyVector(),
      programming: 0.5,
      communication: 0.9,
      writing: 0.7,
      teaching: 0.8,
      marketing: 0.4,
    },
    requiredExperience: 4,
  },
  {
    id: '10',
    title: 'Sales Engineer',
    company: 'SalesTech',
    vector: {
      ...createEmptyVector(),
      programming: 0.4,
      communication: 0.8,
      sales: 0.7,
      problemSolving: 0.6,
    },
    requiredExperience: 3,
  },
];

class JobService {
  private REJECTED_JOBS_KEY = 'rejected_jobs';
  private USER_PROFILE_KEY = 'user_profile';

  async fetchJobs(temperature?: number): Promise<Job[]> {
    // Get user profile (mock for now)
    const userProfile = { ...mockUserProfile, temperature: temperature || 0.5 };
    
    // Get rejected job IDs
    const rejectedIds = await this.getRejectedJobIds();
    
    // Filter out rejected jobs
    const availableJobs = vectorizedJobs.filter(job => !rejectedIds.includes(job.id));
    
    // Get career matches using the matching service
    const matches = careerMatchingService.getCareerMatches(userProfile, availableJobs);
    
    // Convert to Job type with similarity scores
    return matches.map(match => ({
      id: match.id,
      company: match.company,
      title: match.title,
      location: this.getRandomLocation(),
      salary: this.getRandomSalary(match.requiredExperience),
      description: this.generateDescription(match),
      requirements: this.generateRequirements(match),
      benefits: this.getRandomBenefits(),
      postedDate: this.getRandomPostedDate(),
      url: `https://example.com/jobs/${match.id}`,
      logo: `https://picsum.photos/seed/${match.company}/100`,
      isRemote: Math.random() > 0.5,
      employmentType: 'Full-time' as const,
      experienceLevel: this.getExperienceLevel(match.requiredExperience),
      similarity: match.similarity,
    }));
  }

  private generateDescription(match: JobWithVector): string {
    const { transferableSkills, skillGaps, transitionDifficulty } = 
      careerMatchingService.getCareerMatches(mockUserProfile, [match])[0];
    
    let description = `Join us as a ${match.title} at ${match.company}. `;
    
    if (transferableSkills.length > 0) {
      description += `Your experience with ${transferableSkills.join(', ')} will be valuable in this role. `;
    }
    
    if (skillGaps.length > 0) {
      description += `This role will help you develop ${skillGaps.join(', ')}. `;
    }
    
    description += `Career transition difficulty: ${transitionDifficulty}.`;
    
    return description;
  }

  private generateRequirements(job: JobWithVector): string[] {
    const requirements: string[] = [];
    
    if (job.vector.programming > 0.7) {
      requirements.push('Strong programming skills');
    }
    if (job.vector.projectManagement > 0.6) {
      requirements.push('Project management experience');
    }
    if (job.vector.communication > 0.7) {
      requirements.push('Excellent communication skills');
    }
    if (job.vector.leadership > 0.6) {
      requirements.push('Leadership experience');
    }
    if (job.requiredExperience > 0) {
      requirements.push(`${job.requiredExperience}+ years experience`);
    }
    
    return requirements.length > 0 ? requirements : ['Passion for learning'];
  }

  private getExperienceLevel(years: number): 'Entry' | 'Mid' | 'Senior' | 'Lead' {
    if (years <= 2) return 'Entry';
    if (years <= 5) return 'Mid';
    if (years <= 8) return 'Senior';
    return 'Lead';
  }

  private getRandomLocation(): string {
    const locations = [
      'San Francisco, CA',
      'New York, NY',
      'Austin, TX',
      'Seattle, WA',
      'Remote',
      'Chicago, IL',
      'Boston, MA',
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  private getRandomSalary(experience: number): string {
    const base = 80000 + (experience * 15000);
    const min = base + Math.floor(Math.random() * 20000);
    const max = min + 20000 + Math.floor(Math.random() * 30000);
    return `$${(min/1000).toFixed(0)}k - $${(max/1000).toFixed(0)}k`;
  }

  private getRandomBenefits(): string[] {
    const allBenefits = [
      'Health insurance',
      '401k matching',
      'Unlimited PTO',
      'Remote work',
      'Stock options',
      'Learning budget',
      'Gym membership',
      'Free lunch',
    ];
    
    const count = 3 + Math.floor(Math.random() * 3);
    return allBenefits.sort(() => Math.random() - 0.5).slice(0, count);
  }

  private getRandomPostedDate(): string {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  }

  async rejectJob(jobId: string): Promise<void> {
    const rejectedIds = await this.getRejectedJobIds();
    rejectedIds.push(jobId);
    await AsyncStorage.setItem(this.REJECTED_JOBS_KEY, JSON.stringify(rejectedIds));
  }

  private async getRejectedJobIds(): Promise<string[]> {
    try {
      const stored = await AsyncStorage.getItem(this.REJECTED_JOBS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  async clearRejectedJobs(): Promise<void> {
    await AsyncStorage.removeItem(this.REJECTED_JOBS_KEY);
  }
}

export const jobService = new JobService();
