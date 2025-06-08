export interface SkillVector {
  // Technical skills
  programming: number;
  dataAnalysis: number;
  cloudComputing: number;
  machineLearning: number;
  webDevelopment: number;
  mobileDevelopment: number;
  devOps: number;
  databases: number;
  
  // Soft skills
  leadership: number;
  communication: number;
  projectManagement: number;
  teamwork: number;
  problemSolving: number;
  creativity: number;
  sales: number;
  marketing: number;
  writing: number;
  teaching: number;
  design: number;
  research: number;
  
  // Domain knowledge
  finance: number;
  healthcare: number;
  retail: number;
  manufacturing: number;
  education: number;
  government: number;
  nonprofit: number;
  startup: number;
  
  // Allow additional properties
  [key: string]: number;
}

/**
 * Create an empty skill vector with all dimensions set to 0
 */
export function createEmptyVector(): SkillVector {
  return {
    // Technical skills
    programming: 0,
    dataAnalysis: 0,
    cloudComputing: 0,
    machineLearning: 0,
    webDevelopment: 0,
    mobileDevelopment: 0,
    devOps: 0,
    databases: 0,
    
    // Soft skills
    leadership: 0,
    communication: 0,
    projectManagement: 0,
    teamwork: 0,
    problemSolving: 0,
    creativity: 0,
    sales: 0,
    marketing: 0,
    writing: 0,
    teaching: 0,
    design: 0,
    research: 0,
    
    // Domain knowledge
    finance: 0,
    healthcare: 0,
    retail: 0,
    manufacturing: 0,
    education: 0,
    government: 0,
    nonprofit: 0,
    startup: 0,
  };
}

/**
 * Normalize a vector to unit length (magnitude = 1)
 */
export function normalizeVector(vector: SkillVector): SkillVector {
  const magnitude = Math.sqrt(
    Object.values(vector).reduce((sum, val) => sum + val * val, 0)
  );
  
  if (magnitude === 0) {
    return { ...vector };
  }
  
  const normalized = createEmptyVector();
  Object.keys(vector).forEach(key => {
    normalized[key] = vector[key] / magnitude;
  });
  
  return normalized;
}

/**
 * Calculate cosine similarity between two skill vectors
 * Returns a value between -1 and 1, where:
 * 1 = identical vectors
 * 0 = orthogonal vectors
 * -1 = opposite vectors
 */
export function cosineSimilarity(a: SkillVector, b: SkillVector): number {
  const keys = Object.keys(a).filter(
    key => (a[key] || 0) !== 0 && (b[key] || 0) !== 0
  );

  if (keys.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  keys.forEach(key => {
    const valA = a[key];
    const valB = b[key];

    dotProduct += valA * valB;
    magnitudeA += valA * valA;
    magnitudeB += valB * valB;
  });

  const magnitude = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);

  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

/**
 * Calculate Euclidean distance between two vectors
 */
export function vectorDistance(a: SkillVector, b: SkillVector): number {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  
  let sumOfSquares = 0;
  keys.forEach(key => {
    const diff = (a[key] || 0) - (b[key] || 0);
    sumOfSquares += diff * diff;
  });
  
  return Math.sqrt(sumOfSquares);
}

/**
 * Add two vectors together
 */
export function addVectors(a: SkillVector, b: SkillVector): SkillVector {
  const result = createEmptyVector();
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  
  keys.forEach(key => {
    result[key] = (a[key] || 0) + (b[key] || 0);
  });
  
  return result;
}

/**
 * Scale a vector by a constant factor
 */
export function scaleVector(vector: SkillVector, scale: number): SkillVector {
  const result = createEmptyVector();
  
  Object.keys(vector).forEach(key => {
    result[key] = vector[key] * scale;
  });
  
  return result;
}

/**
 * Calculate the weighted average of multiple vectors
 */
export function averageVectors(vectors: SkillVector[], weights?: number[]): SkillVector {
  if (vectors.length === 0) {
    return createEmptyVector();
  }
  
  const effectiveWeights = weights || vectors.map(() => 1 / vectors.length);
  const result = createEmptyVector();
  
  vectors.forEach((vector, index) => {
    const weight = effectiveWeights[index];
    Object.keys(vector).forEach(key => {
      result[key] = (result[key] || 0) + vector[key] * weight;
    });
  });
  
  return result;
}
