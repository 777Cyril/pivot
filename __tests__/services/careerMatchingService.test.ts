import {
  CareerMatchingService,
  UserProfile,
  JobWithVector,
  CareerTransition
} from '@/services/careerMatchingService';
import { createEmptyVector } from '@/services/vectorOperations';

describe('CareerMatchingService', () => {
  let service: CareerMatchingService;

  beforeEach(() => {
    service = new CareerMatchingService();
  });

  describe('parseResume', () => {
    it('creates user profile from resume text', async () => {
      const resumeText = `
        John Doe
        Senior Software Engineer
        
        Experience:
        - 5 years building web applications with React and Node.js
        - Led team of 4 developers
        - Implemented CI/CD pipelines with AWS
        
        Skills: JavaScript, Python, AWS, Leadership, Agile
      `;

      const profile = await service.parseResume(resumeText);

      expect(profile.currentRole).toBe('Software Engineer');
      expect(profile.yearsExperience).toBe(5);
      expect(profile.skills).toContain('javascript');
      expect(profile.skills).toContain('aws');
      expect(profile.vector.programming).toBeGreaterThan(0.7);
      expect(profile.vector.leadership).toBeGreaterThan(0.4);
    });

    it('handles product manager resume', async () => {
      const resumeText = `
        Jane Smith
        Senior Product Manager at Tech Corp
        
        8 years experience in product management
        - Define product roadmap and strategy
        - Collaborate with engineering and design teams
        - Analyze user metrics and A/B tests
        - Previously: Software Developer (3 years)
      `;

      const profile = await service.parseResume(resumeText);

      expect(profile.currentRole).toBe('Product Manager');
      expect(profile.yearsExperience).toBe(8);
      expect(profile.vector.projectManagement).toBeGreaterThan(0.7);
      expect(profile.vector.communication).toBeGreaterThan(0.6);
      expect(profile.vector.programming).toBeGreaterThan(0.3); // Past experience
    });
  });

  describe('createJobVector', () => {
    it('creates vector from job description', () => {
      const jobDescription = `
        Product Manager - FinTech Startup
        
        Requirements:
        - 5+ years product management experience
        - Technical background preferred
        - Experience with financial products
        - Strong analytical and communication skills
        - Work with engineering teams
      `;

      const jobVector = service.createJobVector(jobDescription);

      expect(jobVector.vector.projectManagement).toBeGreaterThan(0.7);
      expect(jobVector.vector.communication).toBeGreaterThan(0.6);
      expect(jobVector.vector.finance).toBeGreaterThan(0.5);
      expect(jobVector.requiredExperience).toBe(5);
    });
  });

  describe('getCareerMatches', () => {
    const userProfile: UserProfile = {
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
      },
      temperature: 0.5, // Moderate pivot
    };

    const jobs: JobWithVector[] = [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'Tech Co',
        vector: {
          ...createEmptyVector(),
          programming: 0.95,
          webDevelopment: 0.85,
          leadership: 0.4,
        },
        requiredExperience: 5,
      },
      {
        id: '2',
        title: 'Technical Product Manager',
        company: 'Product Co',
        vector: {
          ...createEmptyVector(),
          programming: 0.4,
          projectManagement: 0.8,
          communication: 0.8,
          leadership: 0.6,
        },
        requiredExperience: 4,
      },
      {
        id: '3',
        title: 'UX Designer',
        company: 'Design Co',
        vector: {
          ...createEmptyVector(),
          design: 0.9,
          creativity: 0.8,
          communication: 0.6,
        },
        requiredExperience: 3,
      },
      {
        id: '4',
        title: 'Sales Manager',
        company: 'Sales Co',
        vector: {
          ...createEmptyVector(),
          sales: 0.9,
          communication: 0.9,
          leadership: 0.7,
        },
        requiredExperience: 5,
      },
    ];

    it('returns jobs matching temperature preference', () => {
      const matches = service.getCareerMatches(userProfile, jobs);

      // At temperature 0.5 (pivot), should prefer moderate changes
      expect(matches).toHaveLength(4);
      expect(matches[0].title).toBe('Technical Product Manager'); // Best pivot match
      expect(matches[0].matchScore).toBeGreaterThan(0.7);
      expect(matches[0].similarity).toBeGreaterThan(0.4);
      expect(matches[0].similarity).toBeLessThan(0.7);
    });

    it('returns similar jobs for low temperature', () => {
      const conservativeProfile = { ...userProfile, temperature: 0.1 };
      const matches = service.getCareerMatches(conservativeProfile, jobs);

      expect(matches[0].title).toBe('Senior Software Engineer');
      expect(matches[0].similarity).toBeGreaterThan(0.8);
    });

    it('returns different jobs for high temperature', () => {
      const boldProfile = { ...userProfile, temperature: 0.9 };
      const matches = service.getCareerMatches(boldProfile, jobs);

      // Should prefer very different roles
      expect(matches[0].title).toBe('Sales Manager');
      expect(matches[0].similarity).toBeLessThan(0.4);
    });

    it('includes transferable skills in matches', () => {
      const matches = service.getCareerMatches(userProfile, jobs);
      const pmMatch = matches.find(m => m.title === 'Technical Product Manager');

      expect(pmMatch?.transferableSkills).toContain('problem solving');
      expect(pmMatch?.transferableSkills).toContain('technical knowledge');
      expect(pmMatch?.skillGaps).toContain('project management');
    });
  });

  describe('suggestCareerPaths', () => {
    it('suggests paths for software developer', () => {
      const profile: UserProfile = {
        id: '1',
        currentRole: 'Software Engineer',
        yearsExperience: 5,
        skills: ['javascript', 'react', 'leadership'],
        vector: {
          ...createEmptyVector(),
          programming: 0.9,
          leadership: 0.4,
        },
        temperature: 0.5,
      };

      const paths = service.suggestCareerPaths(profile);

      expect(paths).toHaveLength(3);
      expect(paths[0].targetRole).toBe('Technical Lead');
      expect(paths[1].targetRole).toBe('Product Manager');
      expect(paths[2].targetRole).toBe('Solutions Architect');

      // Each path should have steps
      const pmPath = paths.find(p => p.targetRole === 'Product Manager');
      expect(pmPath?.steps).toContain('Build product thinking skills');
      expect(pmPath?.estimatedTime).toBe('6-12 months');
    });

    it('suggests paths based on temperature', () => {
      const profile: UserProfile = {
        id: '1',
        currentRole: 'Software Engineer',
        yearsExperience: 3,
        skills: ['python', 'data analysis'],
        vector: {
          ...createEmptyVector(),
          programming: 0.8,
          dataAnalysis: 0.6,
        },
        temperature: 0.8, // Bold move
      };

      const paths = service.suggestCareerPaths(profile);

      // Should suggest more dramatic transitions
      expect(paths.some(p => p.targetRole === 'Data Scientist')).toBe(true);
      expect(paths.some(p => p.targetRole === 'Technical Writer')).toBe(true);
    });
  });

  describe('analyzeSkillGaps', () => {
    it('identifies missing skills for transition', () => {
      const currentVector = {
        ...createEmptyVector(),
        programming: 0.9,
        webDevelopment: 0.8,
        leadership: 0.3,
        communication: 0.5,
      };

      const targetVector = {
        ...createEmptyVector(),
        programming: 0.4,
        projectManagement: 0.8,
        leadership: 0.7,
        communication: 0.8,
      };

      const gaps = service.analyzeSkillGaps(currentVector, targetVector);

      expect(gaps.missing).toContain('project management');
      expect(gaps.missing).toContain('leadership');
      expect(gaps.transferable).toContain('programming');
      expect(gaps.overallGap).toBeGreaterThan(0.3);
      expect(gaps.overallGap).toBeLessThan(0.7);
    });
  });
});
