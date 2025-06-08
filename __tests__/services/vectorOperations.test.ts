import {
  createEmptyVector,
  normalizeVector,
  cosineSimilarity,
  vectorDistance,
  addVectors,
  scaleVector,
  SkillVector
} from '@/services/vectorOperations';

describe('Vector Operations', () => {
  describe('createEmptyVector', () => {
    it('creates a vector with all zero values', () => {
      const vector = createEmptyVector();
      
      expect(vector.programming).toBe(0);
      expect(vector.leadership).toBe(0);
      expect(vector.communication).toBe(0);
      expect(Object.values(vector).every(v => v === 0)).toBe(true);
    });

    it('has all required skill dimensions', () => {
      const vector = createEmptyVector();
      const requiredDimensions = [
        'programming', 'dataAnalysis', 'cloudComputing', 'machineLearning',
        'webDevelopment', 'mobileDevelopment', 'devOps', 'databases',
        'leadership', 'communication', 'projectManagement', 'teamwork',
        'problemSolving', 'creativity', 'sales', 'marketing',
        'writing', 'teaching', 'design', 'research',
        'finance', 'healthcare', 'retail', 'manufacturing',
        'education', 'government', 'nonprofit', 'startup'
      ];

      requiredDimensions.forEach(dim => {
        expect(vector).toHaveProperty(dim);
        expect(typeof vector[dim]).toBe('number');
      });
    });
  });

  describe('normalizeVector', () => {
    it('normalizes a vector to unit length', () => {
      const vector: SkillVector = createEmptyVector();
      vector.programming = 3;
      vector.leadership = 4; // 3-4-5 triangle

      const normalized = normalizeVector(vector);
      
      // Magnitude should be 1
      const magnitude = Math.sqrt(
        Object.values(normalized).reduce((sum, val) => sum + val * val, 0)
      );
      expect(magnitude).toBeCloseTo(1, 5);
    });

    it('handles zero vectors', () => {
      const vector = createEmptyVector();
      const normalized = normalizeVector(vector);
      
      expect(Object.values(normalized).every(v => v === 0)).toBe(true);
    });

    it('preserves relative proportions', () => {
      const vector: SkillVector = createEmptyVector();
      vector.programming = 0.8;
      vector.leadership = 0.4;

      const normalized = normalizeVector(vector);
      const ratio = normalized.programming / normalized.leadership;
      
      expect(ratio).toBeCloseTo(2, 5);
    });
  });

  describe('cosineSimilarity', () => {
    it('returns 1 for identical vectors', () => {
      const vector: SkillVector = createEmptyVector();
      vector.programming = 0.8;
      vector.leadership = 0.6;

      const similarity = cosineSimilarity(vector, vector);
      expect(similarity).toBeCloseTo(1, 5);
    });

    it('returns 0 for orthogonal vectors', () => {
      const vector1: SkillVector = createEmptyVector();
      vector1.programming = 1;

      const vector2: SkillVector = createEmptyVector();
      vector2.leadership = 1;

      const similarity = cosineSimilarity(vector1, vector2);
      expect(similarity).toBeCloseTo(0, 5);
    });

    it('returns negative values for opposite vectors', () => {
      const vector1: SkillVector = createEmptyVector();
      vector1.programming = 1;

      const vector2: SkillVector = createEmptyVector();
      vector2.programming = -1;

      const similarity = cosineSimilarity(vector1, vector2);
      expect(similarity).toBeCloseTo(-1, 5);
    });

    it('calculates correct similarity for similar roles', () => {
      // Software Developer vector
      const developer: SkillVector = createEmptyVector();
      developer.programming = 0.9;
      developer.webDevelopment = 0.8;
      developer.databases = 0.7;
      developer.problemSolving = 0.8;

      // Senior Developer vector (very similar)
      const seniorDev: SkillVector = createEmptyVector();
      seniorDev.programming = 0.95;
      seniorDev.webDevelopment = 0.85;
      seniorDev.databases = 0.8;
      seniorDev.problemSolving = 0.85;
      seniorDev.leadership = 0.4;

      const similarity = cosineSimilarity(developer, seniorDev);
      expect(similarity).toBeGreaterThan(0.9);
    });

    it('calculates correct similarity for pivot roles', () => {
      // Software Developer vector
      const developer: SkillVector = createEmptyVector();
      developer.programming = 0.9;
      developer.webDevelopment = 0.8;
      developer.problemSolving = 0.8;

      // Product Manager vector (moderate pivot)
      const productManager: SkillVector = createEmptyVector();
      productManager.programming = 0.3;
      productManager.communication = 0.9;
      productManager.projectManagement = 0.8;
      productManager.leadership = 0.7;
      productManager.problemSolving = 0.8; // Shared skill

      const similarity = cosineSimilarity(developer, productManager);
      expect(similarity).toBeGreaterThan(0.3);
      expect(similarity).toBeLessThan(0.7);
    });
  });

  describe('vectorDistance', () => {
    it('returns 0 for identical vectors', () => {
      const vector: SkillVector = createEmptyVector();
      vector.programming = 0.5;
      vector.leadership = 0.5;

      const distance = vectorDistance(vector, vector);
      expect(distance).toBe(0);
    });

    it('calculates Euclidean distance correctly', () => {
      const vector1: SkillVector = createEmptyVector();
      vector1.programming = 1;

      const vector2: SkillVector = createEmptyVector();
      vector2.programming = 0;
      vector2.leadership = 1;

      // Distance should be sqrt(1^2 + 1^2) = sqrt(2)
      const distance = vectorDistance(vector1, vector2);
      expect(distance).toBeCloseTo(Math.sqrt(2), 5);
    });
  });

  describe('addVectors', () => {
    it('adds two vectors correctly', () => {
      const vector1: SkillVector = createEmptyVector();
      vector1.programming = 0.5;
      vector1.leadership = 0.3;

      const vector2: SkillVector = createEmptyVector();
      vector2.programming = 0.3;
      vector2.communication = 0.4;

      const result = addVectors(vector1, vector2);
      expect(result.programming).toBeCloseTo(0.8, 5);
      expect(result.leadership).toBeCloseTo(0.3, 5);
      expect(result.communication).toBeCloseTo(0.4, 5);
    });

    it('handles empty vectors', () => {
      const vector1 = createEmptyVector();
      const vector2 = createEmptyVector();

      const result = addVectors(vector1, vector2);
      expect(Object.values(result).every(v => v === 0)).toBe(true);
    });
  });

  describe('scaleVector', () => {
    it('scales a vector by a constant', () => {
      const vector: SkillVector = createEmptyVector();
      vector.programming = 0.5;
      vector.leadership = 0.4;

      const scaled = scaleVector(vector, 2);
      expect(scaled.programming).toBeCloseTo(1.0, 5);
      expect(scaled.leadership).toBeCloseTo(0.8, 5);
    });

    it('handles zero scaling', () => {
      const vector: SkillVector = createEmptyVector();
      vector.programming = 0.5;

      const scaled = scaleVector(vector, 0);
      expect(Object.values(scaled).every(v => v === 0)).toBe(true);
    });

    it('handles negative scaling', () => {
      const vector: SkillVector = createEmptyVector();
      vector.programming = 0.5;

      const scaled = scaleVector(vector, -1);
      expect(scaled.programming).toBeCloseTo(-0.5, 5);
    });
  });
});
