import { Job } from '@/types';

export interface SkillVector {
  programming?: number;
  webDevelopment?: number;
  leadership?: number;
  communication?: number;
  projectManagement?: number;
  [key: string]: number | undefined;
}

export function calculateSimilarityScore(
  userVector: SkillVector,
  jobVector: SkillVector
): number {
  const keys = new Set([...Object.keys(userVector), ...Object.keys(jobVector)]);

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  keys.forEach(key => {
    const a = userVector[key] || 0;
    const b = jobVector[key] || 0;

    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  });

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function filterJobsByTemperature(
  jobs: Job[],
  temperature: number
): Job[] {
  const getSimlarityRange = (temp: number): [number, number] => {
    if (temp < 0.2) {
      return [0.8, 1.0];
    } else if (temp < 0.4) {
      return [0.6, 0.8];
    } else if (temp < 0.6) {
      return [0.4, 0.7];
    } else if (temp < 0.8) {
      return [0.2, 0.5];
    } else {
      return [0.0, 0.4];
    }
  };

  const [minSimilarity, maxSimilarity] = getSimlarityRange(temperature);

  return jobs.filter(job => {
    const similarity = job.similarity || 0;
    return similarity >= minSimilarity && similarity <= maxSimilarity;
  });
}

export function addSimilarityScores(jobs: Job[], userProfile?: any): Job[] {
  return jobs.map(job => {
    let similarity = 0.5;
    const title = job.title.toLowerCase();

    if (title.includes('developer') || title.includes('engineer')) {
      similarity = 0.85 + Math.random() * 0.1;
    } else if (title.includes('product') || title.includes('manager')) {
      similarity = 0.55 + Math.random() * 0.15;
    } else if (title.includes('designer') || title.includes('ux')) {
      similarity = 0.35 + Math.random() * 0.1;
    } else if (title.includes('data') || title.includes('analyst')) {
      similarity = 0.45 + Math.random() * 0.15;
    } else if (title.includes('sales') || title.includes('marketing')) {
      similarity = 0.15 + Math.random() * 0.15;
    }

    return {
      ...job,
      similarity
    };
  });
}
