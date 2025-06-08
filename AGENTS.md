# AGENTS.md - Pivot Career Transition Platform

## Project Overview
Pivot is a mobile-first career transition platform that helps professionals intelligently navigate career changes. Using AI-powered skill analysis and vector-based job matching, Pivot identifies transferable skills and suggests career paths that align with users' desired level of change—from adjacent roles to complete reinventions.

**Core Value Proposition**: Help a media professional transition to tech, a developer become a product manager, or a consultant pivot to entrepreneurship by understanding their transferable skills and matching them with opportunities.

## Core Features

### 1. **Intelligent Onboarding**
- Resume upload and parsing
- AI-powered skill extraction and vectorization
- Career history analysis
- Transferable skills identification
- Initial career path suggestions

### 2. **Temperature-Controlled Discovery**
- **Temperature Slider**: Control how different suggested roles should be
  - 0.0-0.2: Safe steps (similar roles)
  - 0.2-0.4: Stretch opportunities
  - 0.4-0.6: True pivots
  - 0.6-0.8: Bold moves
  - 0.8-1.0: Complete reinvention
- Visual feedback showing example transitions at each level

### 3. **Smart Swipe Interface**
- **Swipe right**: Apply immediately (triggers real application)
- **Swipe left**: Not interested
- **Tap card**: View full details and career path alignment
- Vector-based job recommendations (not random)
- Shows skill overlap percentage
- Highlights transferable skills

### 4. **Career Path Visualization**
- Show potential career trajectories
- Skill gap analysis
- Recommended learning paths
- Success stories from similar transitions

### 5. **Application Automation**
- Direct application submission
- Auto-fill from parsed resume data
- Track application status
- Monitor for email confirmations

## Technical Architecture

### Core Technologies
- **Framework**: React Native with Expo SDK (latest)
- **Language**: TypeScript (strict mode)
- **State Management**: Redux Toolkit (for complex state)
- **Navigation**: React Navigation v6
- **Styling**: StyleSheet API with consistent design tokens
- **Testing**: Jest + React Native Testing Library

### AI/ML Stack
- **Vector Operations**: Custom similarity algorithms
- **NLP**: Resume parsing (OpenAI/Anthropic API)
- **Embeddings**: Skill vectorization
- **Storage**: Vector database (future: Pinecone/Weaviate)

### External Integrations
- **Job APIs**: Indeed, LinkedIn, Glassdoor
- **Application Systems**: Greenhouse, Lever, Workday
- **Email Monitoring**: Gmail API for confirmations
- **Resume Parsing**: OpenAI/Anthropic

## Data Models

### Enhanced Job Interface
```typescript
interface Job {
  id: string;
  company: {
    name: string;
    logo?: string;
    culture?: string[];
  };
  title: string;
  location: {
    city: string;
    state?: string;
    country: string;
  };
  workArrangement: 'In Person' | 'Remote' | 'Hybrid';
  employmentType: 'Full Time' | 'Part Time' | 'Contract' | 'Freelance';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  experienceLevel: 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Executive';
  description: string;
  requirements: string[];
  
  // New fields for career transition
  skillVector: SkillVector;
  industryTags: string[];
  careerPathAlignment: number; // 0-1 score
  transferableSkills: string[];
  skillGaps: string[];
}
```

### User Profile with Vectors
```typescript
interface UserProfile {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    location: string;
  };
  
  // Career transition data
  currentRole: string;
  targetRoles: string[];
  yearsExperience: number;
  skillVector: SkillVector;
  temperature: number; // 0-1, how different they want to go
  
  // Parsed from resume
  workHistory: WorkExperience[];
  education: Education[];
  skills: string[];
  achievements: string[];
}

interface SkillVector {
  // Technical dimensions
  programming: number;
  dataAnalysis: number;
  cloudComputing: number;
  machineLearning: number;
  webDevelopment: number;
  mobileDevelopment: number;
  
  // Soft skills dimensions
  leadership: number;
  communication: number;
  projectManagement: number;
  sales: number;
  marketing: number;
  design: number;
  writing: number;
  
  // Industry dimensions
  finance: number;
  healthcare: number;
  retail: number;
  education: number;
  startup: number;
  enterprise: number;
  // ... more dimensions
}
```

## Core Algorithms

### Vector-Based Matching
1. Convert user profile to multi-dimensional skill vector
2. Convert each job to comparable skill vector
3. Calculate cosine similarity with temperature adjustment
4. Filter and rank based on:
   - Skill overlap (with temperature consideration)
   - Experience level compatibility
   - Industry transferability
   - Growth potential

### Temperature Algorithm
```typescript
function getMatchScore(userVector: SkillVector, jobVector: SkillVector, temperature: number): number {
  const similarity = cosineSimilarity(userVector, jobVector);
  
  // Temperature adjusts the "sweet spot"
  // Low temp: prefer high similarity (0.8-1.0)
  // High temp: prefer moderate similarity (0.3-0.6)
  const targetSimilarity = 0.9 - (temperature * 0.5);
  const variance = 0.1 + (temperature * 0.2);
  
  // Score based on distance from target
  const distance = Math.abs(similarity - targetSimilarity);
  return Math.max(0, 1 - (distance / variance));
}
```

## Development Principles

### 1. **AI-First Development**
- Every feature should leverage AI for personalization
- Continuous learning from user interactions
- Feedback loops to improve recommendations

### 2. **Privacy & Trust**
- Transparent about data usage
- Secure resume storage
- Clear consent for application submissions

### 3. **Real-World Impact**
- Track actual job placements
- Measure career transition success
- Build case studies

## MVP Success Metrics
1. **User uploads resume** → Skills extracted successfully
2. **Temperature adjustment** → Jobs change meaningfully
3. **Swipe right** → Real application submitted
4. **Email confirmation** received within 1 hour
5. **Career path** shown makes sense to user

## Testing Strategy
- **Unit Tests**: Vector calculations, matching algorithms
- **Integration Tests**: Resume parsing → job matching flow
- **ML Tests**: Validate skill extraction accuracy
- **User Tests**: Career transition recommendations make sense

## Performance Requirements
- Resume parsing: < 5 seconds
- Job vector calculation: < 100ms per job
- Recommendation generation: < 2 seconds
- Swipe response: < 16ms (60 FPS)

## Phase 1 Deliverables (MVP)
1. Resume upload and basic parsing
2. Skill vector generation (simplified)
3. Temperature-controlled job matching
4. Mock application submission
5. Basic career path suggestions

## Phase 2 Enhancements
1. Real job API integration
2. Automated application submission
3. Email confirmation tracking
4. ML model for better skill extraction
5. Success story collection

## Phase 3 Scale
1. Company partnerships
2. Direct ATS integration
3. Career coaching features
4. Skill gap training recommendations
5. Transition success prediction

## Competitive Advantages
1. **Not keyword matching**: Understanding transferable skills
2. **User-controlled discovery**: Temperature setting
3. **Real applications**: Not just bookmarking
4. **Career intelligence**: Showing viable paths
5. **Transition focus**: Built for career change, not job search

This platform isn't about finding the same job at a different company—it's about discovering what's possible when you're ready to pivot.
