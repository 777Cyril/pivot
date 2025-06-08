import { SkillVector, createEmptyVector } from './vectorOperations';

// Comprehensive skill keywords mapping
export const SkillKeywords = {
  programming: [
    'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
    'swift', 'kotlin', 'php', 'scala', 'r', 'matlab', 'perl', 'bash', 'sql'
  ],
  webDevelopment: [
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'rails',
    'spring', 'html', 'css', 'sass', 'webpack', 'next.js', 'nuxt', 'gatsby'
  ],
  mobileDevelopment: [
    'react native', 'flutter', 'swift', 'swiftui', 'kotlin', 'android', 'ios',
    'xamarin', 'ionic', 'cordova'
  ],
  cloud: [
    'aws', 'azure', 'gcp', 'google cloud', 'kubernetes', 'docker', 'terraform',
    'jenkins', 'ci/cd', 'devops', 'microservices', 'serverless', 'lambda'
  ],
  data: [
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
    'pandas', 'numpy', 'data analysis', 'data science', 'statistics', 'tableau',
    'power bi', 'sql', 'bigquery', 'spark', 'hadoop'
  ],
  leadership: [
    'led', 'managed', 'director', 'head of', 'vp', 'chief', 'senior', 'principal',
    'team lead', 'manager', 'supervised', 'mentored', 'coached', 'guided'
  ],
  communication: [
    'presented', 'collaborated', 'stakeholder', 'client', 'customer', 'negotiated',
    'facilitated', 'coordinated', 'liaised', 'communicated', 'articulated'
  ],
  projectManagement: [
    'project management', 'agile', 'scrum', 'kanban', 'jira', 'roadmap',
    'timeline', 'milestone', 'deliverable', 'budget', 'resource', 'planning'
  ],
  finance: [
    'fintech', 'banking', 'trading', 'investment', 'financial', 'accounting',
    'budget', 'revenue', 'profit', 'blockchain', 'cryptocurrency', 'payments'
  ],
  healthcare: [
    'healthcare', 'medical', 'clinical', 'patient', 'hospital', 'pharma',
    'biotech', 'diagnosis', 'treatment', 'health', 'hipaa', 'ehr'
  ],
};

// Role category to vector mapping
export const RoleCategoryMapping: Record<string, Partial<SkillVector>> = {
  developer: {
    programming: 0.9,
    webDevelopment: 0.7,
    databases: 0.6,
    problemSolving: 0.8,
    teamwork: 0.5,
  },
  manager: {
    leadership: 0.8,
    projectManagement: 0.8,
    communication: 0.7,
    teamwork: 0.6,
    problemSolving: 0.6,
  },
  designer: {
    design: 0.9,
    creativity: 0.8,
    communication: 0.6,
    problemSolving: 0.6,
    webDevelopment: 0.4,
  },
  dataScientist: {
    dataAnalysis: 0.9,
    machineLearning: 0.8,
    programming: 0.7,
    problemSolving: 0.8,
    research: 0.7,
  },
  productManager: {
    projectManagement: 0.8,
    communication: 0.8,
    leadership: 0.6,
    problemSolving: 0.7,
    research: 0.6,
  },
};

/**
 * Extract skills from text (resume, job description, etc.)
 */
export function extractSkillsFromText(text: string): string[] {
  const lowerText = text.toLowerCase();
  const foundSkills = new Set<string>();

  // Check each skill category
  Object.entries(SkillKeywords).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      // Use word boundaries for more accurate matching
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(lowerText)) {
        foundSkills.add(keyword);
      }
    });
  });

  // Map common phrases to standard keywords
  if (/google\s+cloud\s+platform/.test(lowerText)) {
    foundSkills.add('gcp');
  }

  // Extract soft skills based on context
  if (/\b(led|managed|supervised)\b/i.test(lowerText)) {
    foundSkills.add('leadership');
  }
  if (/\b(communicat|present|collaborat)/i.test(lowerText)) {
    foundSkills.add('communication');
  }
  if (/\bproject\s+manag/i.test(lowerText)) {
    foundSkills.add('project management');
  }

  return Array.from(foundSkills);
}

/**
 * Convert text to skill vector
 */
export function textToVector(text: string): SkillVector {
  const vector = createEmptyVector();
  const lowerText = text.toLowerCase();
  const skills = extractSkillsFromText(text);

  // Count skill mentions for weighting
  const skillCounts: Record<string, number> = {};
  skills.forEach(skill => {
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedSkill}\\b`, 'gi');
    const matches = lowerText.match(regex);
    skillCounts[skill] = matches ? matches.length : 1;
  });

  // Programming skills
  const programmingCount = SkillKeywords.programming.reduce(
    (sum, key) => sum + (skillCounts[key] || 0),
    0
  );
  if (programmingCount > 0) {
    vector.programming = Math.min(0.9, 0.4 + programmingCount * 0.15);
  }

  // Web development
  const webCount = SkillKeywords.webDevelopment.reduce(
    (sum, key) => sum + (skillCounts[key] || 0),
    0
  );
  if (webCount > 0) {
    vector.webDevelopment = Math.min(0.9, 0.4 + webCount * 0.15);
  }

  // Cloud/DevOps
  const cloudCount = SkillKeywords.cloud.reduce(
    (sum, key) => sum + (skillCounts[key] || 0),
    0
  );
  if (cloudCount > 0) {
    vector.cloudComputing = Math.min(0.8, 0.3 + cloudCount * 0.1);
    vector.devOps = Math.min(0.7, 0.2 + cloudCount * 0.1);
  }

  // Data/ML
  const dataSkills = skills.filter(s => 
    SkillKeywords.data.includes(s)
  );
  if (dataSkills.length > 0) {
    vector.dataAnalysis = Math.min(0.9, 0.3 + dataSkills.length * 0.15);
    if (skills.includes('machine learning') || skills.includes('deep learning')) {
      vector.machineLearning = 0.8;
    }
  }

  // Leadership
  const leadershipKeywords = SkillKeywords.leadership;
  const leadershipScore = leadershipKeywords.reduce((score, keyword) => {
    return lowerText.includes(keyword) ? score + 0.3 : score;
  }, 0);
  if (leadershipScore > 0) {
    vector.leadership = Math.min(0.9, 0.2 + leadershipScore);
  }

  // Communication
  if (skills.includes('communication') || /communicat/i.test(text)) {
    vector.communication = 0.6;
    if (/excellent\s+communication/i.test(text)) {
      vector.communication = 0.8;
    }
  }

  // Project Management
  if (skills.includes('project management') || /project\s+manag/i.test(text)) {
    vector.projectManagement = 0.7;
  }

  // Domain expertise
  if (SkillKeywords.finance.some(keyword => lowerText.includes(keyword))) {
    vector.finance = 0.7;
  }
  if (SkillKeywords.healthcare.some(keyword => lowerText.includes(keyword))) {
    vector.healthcare = 0.7;
  }

  // General skills based on context
  vector.problemSolving = 0.5; // Default for most tech roles
  vector.teamwork = 0.5; // Default for most roles

  // Boost based on seniority indicators
  if (/senior|lead|principal|staff/i.test(text)) {
    vector.leadership = Math.min(0.9, vector.leadership + 0.2);
    vector.problemSolving = Math.min(0.9, vector.problemSolving + 0.2);
  }

  return vector;
}

/**
 * Extract years of experience from text
 */
export function extractYearsOfExperience(text: string): number {
  // Match patterns like "5 years", "3-5 years", "10+ years"
  const yearPatterns = [
    /(\d+)-(\d+)\s*years?/i,
    /(\d+)\+?\s*years?/i,
    /over\s+(\d+)\s*years?/i,
  ];

  for (const pattern of yearPatterns) {
    const match = text.match(pattern);
    if (match) {
      if (match[2]) {
        // Range like "3-5 years" - return average
        return (parseInt(match[1]) + parseInt(match[2])) / 2;
      }
      return parseInt(match[1]);
    }
  }

  // Check for months
  const monthPattern = /(\d+)\s*months?/i;
  const monthMatch = text.match(monthPattern);
  if (monthMatch) {
    return parseInt(monthMatch[1]) / 12;
  }

  // No experience mentioned or explicitly stated
  if (/no\s+(prior\s+)?experience|fresh\s+graduate/i.test(text)) {
    return 0;
  }

  return 0;
}

/**
 * Identify current role from text
 */
export function identifyCurrentRole(text: string): string {
  const rolePatterns = [
    { pattern: /software\s+engineer/i, role: 'Software Engineer' },
    { pattern: /full\s*stack\s+developer/i, role: 'Full Stack Developer' },
    { pattern: /front[\s-]?end\s+developer/i, role: 'Frontend Developer' },
    { pattern: /back[\s-]?end\s+developer/i, role: 'Backend Developer' },
    { pattern: /python\s+developer/i, role: 'Python Developer' },
    { pattern: /javascript\s+developer/i, role: 'JavaScript Developer' },
    { pattern: /engineering\s+manager/i, role: 'Engineering Manager' },
    { pattern: /product\s+manager/i, role: 'Product Manager' },
    { pattern: /ui\/ux\s+designer/i, role: 'UI/UX Designer' },
    { pattern: /ux\s+designer/i, role: 'UX Designer' },
    { pattern: /data\s+scientist/i, role: 'Data Scientist' },
    { pattern: /data\s+analyst/i, role: 'Data Analyst' },
    { pattern: /vp\s+(of\s+)?engineering/i, role: 'VP Engineering' },
    { pattern: /dev\s*ops/i, role: 'DevOps Engineer' },
  ];

  for (const { pattern, role } of rolePatterns) {
    if (pattern.test(text)) {
      return role;
    }
  }

  // Generic fallback
  return 'Professional';
}
