import {
  extractSkillsFromText,
  textToVector,
  extractYearsOfExperience,
  identifyCurrentRole,
  SkillKeywords,
  RoleCategoryMapping
} from '@/services/skillExtraction';
import { SkillVector } from '@/services/vectorOperations';

describe('Skill Extraction', () => {
  describe('extractSkillsFromText', () => {
    it('extracts programming languages', () => {
      const text = 'Experienced developer with Python, JavaScript, and React skills.';
      const skills = extractSkillsFromText(text);
      
      expect(skills).toContain('python');
      expect(skills).toContain('javascript');
      expect(skills).toContain('react');
    });

    it('extracts cloud platforms', () => {
      const text = 'Deployed applications on AWS and Google Cloud Platform';
      const skills = extractSkillsFromText(text);
      
      expect(skills).toContain('aws');
      expect(skills).toContain('gcp');
    });

    it('extracts soft skills', () => {
      const text = 'Led cross-functional teams, excellent communication and project management';
      const skills = extractSkillsFromText(text);
      
      expect(skills).toContain('leadership');
      expect(skills).toContain('communication');
      expect(skills).toContain('project management');
    });

    it('handles case insensitive matching', () => {
      const text = 'PYTHON developer with AWS experience';
      const skills = extractSkillsFromText(text);
      
      expect(skills).toContain('python');
      expect(skills).toContain('aws');
    });

    it('avoids duplicate skills', () => {
      const text = 'Python Python python PYTHON';
      const skills = extractSkillsFromText(text);
      
      const pythonCount = skills.filter(s => s === 'python').length;
      expect(pythonCount).toBe(1);
    });
  });

  describe('textToVector', () => {
    it('creates vector with programming skills', () => {
      const text = 'Senior Python developer with 5 years experience in Django and React';
      const vector = textToVector(text);
      
      expect(vector.programming).toBeGreaterThan(0.7);
      expect(vector.webDevelopment).toBeGreaterThan(0.6);
    });

    it('creates vector with leadership skills', () => {
      const text = 'Engineering Manager leading a team of 10 developers';
      const vector = textToVector(text);
      
      expect(vector.leadership).toBeGreaterThan(0.7);
      expect(vector.projectManagement).toBeGreaterThan(0.5);
    });

    it('creates vector with mixed skills', () => {
      const text = `
        Full-stack developer transitioning to product management.
        5 years coding experience, recently completed PM certification.
        Led feature development and stakeholder communication.
      `;
      const vector = textToVector(text);
      
      expect(vector.programming).toBeGreaterThan(0.6);
      expect(vector.projectManagement).toBeGreaterThan(0.5);
      expect(vector.communication).toBeGreaterThan(0.4);
    });

    it('weights skills based on frequency and context', () => {
      const text = `
        Python Python Python JavaScript
        Senior Python Developer
        Built Python applications
      `;
      const vector = textToVector(text);
      
      // Python mentioned more times, should have higher weight
      expect(vector.programming).toBeGreaterThan(0.8);
    });

    it('identifies domain expertise', () => {
      const text = 'FinTech developer building trading systems for investment banks';
      const vector = textToVector(text);
      
      expect(vector.finance).toBeGreaterThan(0.6);
    });
  });

  describe('extractYearsOfExperience', () => {
    it('extracts years from various formats', () => {
      expect(extractYearsOfExperience('5 years of experience')).toBe(5);
      expect(extractYearsOfExperience('10+ years')).toBe(10);
      expect(extractYearsOfExperience('3-5 years experience')).toBe(4); // Average
      expect(extractYearsOfExperience('over 7 years')).toBe(7);
    });

    it('returns 0 when no experience mentioned', () => {
      expect(extractYearsOfExperience('Fresh graduate')).toBe(0);
      expect(extractYearsOfExperience('No prior experience')).toBe(0);
    });

    it('handles experience in months', () => {
      expect(extractYearsOfExperience('18 months experience')).toBe(1.5);
      expect(extractYearsOfExperience('6 month internship')).toBe(0.5);
    });
  });

  describe('identifyCurrentRole', () => {
    it('identifies developer roles', () => {
      expect(identifyCurrentRole('Senior Software Engineer at Google')).toBe('Software Engineer');
      expect(identifyCurrentRole('Full Stack Developer')).toBe('Full Stack Developer');
      expect(identifyCurrentRole('Python Developer with AWS')).toBe('Python Developer');
    });

    it('identifies management roles', () => {
      expect(identifyCurrentRole('Engineering Manager')).toBe('Engineering Manager');
      expect(identifyCurrentRole('VP of Engineering')).toBe('VP Engineering');
      expect(identifyCurrentRole('Product Manager at Meta')).toBe('Product Manager');
    });

    it('identifies designer roles', () => {
      expect(identifyCurrentRole('Senior UX Designer')).toBe('UX Designer');
      expect(identifyCurrentRole('UI/UX Designer')).toBe('UI/UX Designer');
    });

    it('returns generic role when unclear', () => {
      expect(identifyCurrentRole('Works at tech company')).toBe('Professional');
      expect(identifyCurrentRole('')).toBe('Professional');
    });
  });

  describe('Skill Keywords', () => {
    it('has comprehensive programming language coverage', () => {
      expect(SkillKeywords.programming).toContain('python');
      expect(SkillKeywords.programming).toContain('javascript');
      expect(SkillKeywords.programming).toContain('typescript');
      expect(SkillKeywords.programming).toContain('java');
      expect(SkillKeywords.programming).toContain('go');
    });

    it('has cloud platform keywords', () => {
      expect(SkillKeywords.cloud).toContain('aws');
      expect(SkillKeywords.cloud).toContain('azure');
      expect(SkillKeywords.cloud).toContain('gcp');
      expect(SkillKeywords.cloud).toContain('kubernetes');
    });

    it('has soft skill keywords', () => {
      expect(SkillKeywords.leadership).toContain('led');
      expect(SkillKeywords.leadership).toContain('managed');
      expect(SkillKeywords.communication).toContain('presented');
      expect(SkillKeywords.communication).toContain('collaborated');
    });
  });

  describe('Role Category Mapping', () => {
    it('maps developer roles to vector weights', () => {
      const developerVector = RoleCategoryMapping['developer'];
      expect(developerVector.programming).toBeGreaterThan(0.7);
      expect(developerVector.problemSolving).toBeGreaterThan(0.6);
    });

    it('maps manager roles to vector weights', () => {
      const managerVector = RoleCategoryMapping['manager'];
      expect(managerVector.leadership).toBeGreaterThan(0.7);
      expect(managerVector.projectManagement).toBeGreaterThan(0.6);
    });

    it('maps designer roles to vector weights', () => {
      const designerVector = RoleCategoryMapping['designer'];
      expect(designerVector.design).toBeGreaterThan(0.8);
      expect(designerVector.creativity).toBeGreaterThan(0.7);
    });
  });
});
