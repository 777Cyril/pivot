import {
  SkillVector,
  createEmptyVector,
  cosineSimilarity,
  normalizeVector,
  vectorDistance
} from './vectorOperations';
import {
  extractSkillsFromText,
  textToVector,
  extractYearsOfExperience,
  identifyCurrentRole
} from './skillExtraction';

export interface UserProfile {
  id: string;
  currentRole: string;
  yearsExperience: number;
  skills: string[];
  vector: SkillVector;
  temperature: number; // 0-1, how different they want roles to be
}

export interface JobWithVector {
  id: string;
  title: string;
  company: string;
  vector: SkillVector;
  requiredExperience: number;
  description?: string;
  location?: string;
  salary?: string;
}

export interface CareerMatch extends JobWithVector {
  similarity: number;
  matchScore: number; // Adjusted for temperature preference
  transferableSkills: string[];
  skillGaps: string[];
  transitionDifficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Difficult';
}

export interface CareerTransition {
  targetRole: string;
  similarity: number;
  steps: string[];
  estimatedTime: string;
  difficulty: string;
}

export interface SkillGapAnalysis {
  missing: string[];
  transferable: string[];
  overallGap: number;
}

export class CareerMatchingService {
  /**
   * Parse resume text into a user profile with skill vector
   */
  async parseResume(resumeText: string): Promise<UserProfile> {
    const skills = extractSkillsFromText(resumeText);
    const vector = textToVector(resumeText);
    const currentRole = identifyCurrentRole(resumeText);
    const yearsExperience = extractYearsOfExperience(resumeText);

    return {
      id: Date.now().toString(),
      currentRole,
      yearsExperience,
      skills,
      vector: normalizeVector(vector),
      temperature: 0.5, // Default to moderate pivot
    };
  }

  /**
   * Create job vector from job description
   */
  createJobVector(jobDescription: string): JobWithVector {
    const vector = textToVector(jobDescription);
    const requiredExperience = extractYearsOfExperience(jobDescription);

    // Extract title from description (simplified)
    const titleMatch = jobDescription.match(/^([^\n]+)/);
    const title = titleMatch ? titleMatch[1].trim() : 'Unknown Position';

    return {
      id: Date.now().toString(),
      title,
      company: 'Company',
      vector: normalizeVector(vector),
      requiredExperience,
      description: jobDescription,
    };
  }

  /**
   * Get career matches based on user profile and temperature
   */
  getCareerMatches(
    profile: UserProfile,
    availableJobs: JobWithVector[]
  ): CareerMatch[] {
    // Calculate similarity and match scores for all jobs
    const matches = availableJobs.map(job => {
      const similarity = cosineSimilarity(profile.vector, job.vector);
      const matchScore = this.calculateMatchScore(similarity, profile.temperature);
      const { transferableSkills, skillGaps } = this.analyzeTransition(
        profile,
        job
      );
      const transitionDifficulty = this.assessTransitionDifficulty(similarity);

      return {
        ...job,
        similarity,
        matchScore,
        transferableSkills,
        skillGaps,
        transitionDifficulty,
      };
    });

    // Sort by match score (higher is better)
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Calculate match score based on similarity and temperature preference
   */
  private calculateMatchScore(similarity: number, temperature: number): number {
    // Temperature determines the "sweet spot" for similarity
    // Low temp (0): prefer high similarity (0.8-1.0)
    // Medium temp (0.5): prefer moderate similarity (0.4-0.7)
    // High temp (1): prefer low similarity (0.1-0.4)
    
    const targetSimilarity = 0.9 - temperature * 0.7;
    const variance = 1.5;

    const distance = Math.abs(similarity - targetSimilarity);
    const score = Math.max(0, 1 - distance / variance);
    
    return score;
  }

  /**
   * Analyze what skills transfer and what gaps exist
   */
  private analyzeTransition(
    profile: UserProfile,
    job: JobWithVector
  ): { transferableSkills: string[]; skillGaps: string[] } {
    const transferableSkills: string[] = [];
    const skillGaps: string[] = [];

    // Define skill categories and thresholds
    const skillCategories = [
      { name: 'programming', label: 'technical knowledge' },
      { name: 'leadership', label: 'leadership' },
      { name: 'communication', label: 'communication' },
      { name: 'projectManagement', label: 'project management' },
      { name: 'problemSolving', label: 'problem solving' },
      { name: 'dataAnalysis', label: 'analytical skills' },
    ];

    skillCategories.forEach(({ name, label }) => {
      const userSkill = profile.vector[name] || 0;
      const jobRequirement = job.vector[name] || 0;

      if (userSkill > 0.3 && jobRequirement > 0.3) {
        transferableSkills.push(label);
      } else if (userSkill < 0.3 && jobRequirement > 0.5) {
        skillGaps.push(label);
      }
    });

    return { transferableSkills, skillGaps };
  }

  /**
   * Assess how difficult a career transition would be
   */
  private assessTransitionDifficulty(
    similarity: number
  ): 'Easy' | 'Moderate' | 'Challenging' | 'Difficult' {
    if (similarity > 0.8) return 'Easy';
    if (similarity > 0.6) return 'Moderate';
    if (similarity > 0.4) return 'Challenging';
    return 'Difficult';
  }

  /**
   * Suggest specific career paths based on profile
   */
  suggestCareerPaths(profile: UserProfile): CareerTransition[] {
    const paths: CareerTransition[] = [];

    // Software Engineer paths
    if (profile.currentRole.includes('Software Engineer') || 
        profile.currentRole.includes('Developer')) {
      
      if (profile.temperature < 0.3) {
        // Conservative transitions
        paths.push({
          targetRole: 'Technical Lead',
          similarity: 0.85,
          steps: [
            'Mentor junior developers',
            'Lead technical design discussions',
            'Own larger technical initiatives',
          ],
          estimatedTime: '6-12 months',
          difficulty: 'Easy',
        });
      }

      if (profile.temperature >= 0.3 && profile.temperature < 0.7) {
        // Moderate pivots
        paths.push({
          targetRole: 'Product Manager',
          similarity: 0.55,
          steps: [
            'Build product thinking skills',
            'Work closely with PMs on feature definition',
            'Take a PM course or certification',
            'Lead a small product initiative',
          ],
          estimatedTime: '6-12 months',
          difficulty: 'Moderate',
        });

        paths.push({
          targetRole: 'Solutions Architect',
          similarity: 0.65,
          steps: [
            'Deepen system design knowledge',
            'Get cloud certifications (AWS/Azure)',
            'Work on customer-facing projects',
          ],
          estimatedTime: '3-6 months',
          difficulty: 'Moderate',
        });
      }

      if (profile.temperature >= 0.7) {
        // Bold transitions
        if (profile.vector.dataAnalysis > 0.4) {
          paths.push({
            targetRole: 'Data Scientist',
            similarity: 0.45,
            steps: [
              'Study statistics and machine learning',
              'Complete data science bootcamp',
              'Build ML portfolio projects',
              'Contribute to data initiatives at work',
            ],
            estimatedTime: '12-18 months',
            difficulty: 'Challenging',
          });
        }

        paths.push({
          targetRole: 'Technical Writer',
          similarity: 0.35,
          steps: [
            'Start technical blog',
            'Contribute to documentation',
            'Take technical writing course',
            'Freelance writing projects',
          ],
          estimatedTime: '6-9 months',
          difficulty: 'Challenging',
        });
      }
    }

    // Add PM paths, Designer paths, etc. based on current role

    return paths.slice(0, 3); // Return top 3 suggestions
  }

  /**
   * Analyze skill gaps between current and target vectors
   */
  analyzeSkillGaps(
    currentVector: SkillVector,
    targetVector: SkillVector
  ): SkillGapAnalysis {
    const missing: string[] = [];
    const transferable: string[] = [];

    const skillMap: Record<string, string> = {
      programming: 'programming',
      projectManagement: 'project management',
      leadership: 'leadership',
      communication: 'communication',
      dataAnalysis: 'data analysis',
      design: 'design',
      sales: 'sales',
      marketing: 'marketing',
    };

    Object.entries(skillMap).forEach(([key, label]) => {
      const current = currentVector[key] || 0;
      const target = targetVector[key] || 0;

      if (target > 0.5 && current < 0.3) {
        missing.push(label);
      } else if (current > 0.4 && target > 0.3) {
        transferable.push(label);
      }
    });

    const overallGap = vectorDistance(currentVector, targetVector) / 
                      Math.sqrt(Object.keys(currentVector).length);

    return {
      missing,
      transferable,
      overallGap: Math.min(1, overallGap),
    };
  }
}

// Export singleton instance
export const careerMatchingService = new CareerMatchingService();
