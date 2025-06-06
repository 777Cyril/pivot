# AGENTS.md - Pivot Job Search App

## Project Overview
Pivot is a mobile-first job search application with a Tinder-style swipe interface for applying to jobs. Users can swipe right to apply, left to pass, and view detailed job information.

## Core Features
1. **Swipe Interface**: Tinder-style card stack for job listings
   - Swipe right: Express interest/apply
   - Swipe left: Pass on opportunity
   - Tap card: View full job details
   
2. **Job Cards Display**:
   - Company name and logo
   - Job title
   - Location (city, state, country)
   - Work arrangement (In Person, Remote, Hybrid)
   - Employment type (Full Time, Part Time, Contract)
   - Salary range
   - Experience level (Entry, Mid, Senior)
   - Education requirements
   - Brief job description preview
   - "APPLY" indicator for swipe right
   - "PASS" indicator for swipe left

3. **Navigation**:
   - Bottom tab navigation with icons
   - Feed (main swipe view)
   - Applications (saved/applied jobs)
   - Feedback
   - Profile

## Technical Stack
- **Framework**: React Native with Expo SDK (latest)
- **Language**: TypeScript
- **State Management**: React Context API (initially), upgrade to Redux Toolkit if needed
- **Navigation**: React Navigation v6
- **Styling**: StyleSheet API with consistent design tokens
- **Testing**: Jest + React Native Testing Library
- **Gesture Handling**: react-native-gesture-handler + react-native-reanimated
- **Data**: Mock data initially, prepared for API integration

## Development Principles
1. **Test-Driven Development (TDD)**:
   - Write tests before implementation
   - Unit test every component and function
   - Integration tests for user flows
   - Minimum 80% code coverage

2. **Atomic Development**:
   - Small, focused commits
   - One feature per branch
   - Descriptive commit messages

3. **Code Quality**:
   - TypeScript strict mode
   - ESLint + Prettier configuration
   - Consistent naming conventions
   - Comments for complex logic

## File Structure
pivot/
├── src/
│   ├── components/
│   │   ├── JobCard/
│   │   ├── SwipeableStack/
│   │   └── common/
│   ├── screens/
│   │   ├── FeedScreen/
│   │   ├── ApplicationsScreen/
│   │   ├── FeedbackScreen/
│   │   └── ProfileScreen/
│   ├── navigation/
│   ├── services/
│   ├── utils/
│   ├── types/
│   └── constants/
├── assets/
├── tests/
└── App.tsx

## Component Specifications

### JobCard Component
- Display all job information in a card format
- Smooth animations for swipe indicators
- Responsive to different screen sizes
- Accessibility labels for screen readers

### SwipeableStack Component
- Manages stack of job cards
- Handles swipe gestures and animations
- Preloads next cards for performance
- Undo functionality (stretch goal)

### Navigation
- Tab bar with custom icons
- Smooth transitions between screens
- Deep linking support (future)

## Data Models

### Job Interface
```typescript
interface Job {
  id: string;
  company: {
    name: string;
    logo?: string;
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
  education: string;
  description: string;
  requirements: string[];
  benefits?: string[];
  postedDate: Date;
}
```

Testing Strategy

Unit Tests: Every component, utility function, and service
Integration Tests: User flows (swipe, apply, navigate)
Snapshot Tests: UI consistency
E2E Tests: Critical paths (future with Detox)

Performance Goals

App launch: < 2 seconds
Swipe response: < 16ms (60 FPS)
Card preloading: Next 3 cards
Memory usage: < 200MB

Accessibility Requirements

VoiceOver/TalkBack support
Minimum contrast ratios (WCAG AA)
Gesture alternatives for all actions
Clear focus indicators

Future Enhancements

User authentication
Real job API integration
Application tracking
Push notifications
Saved searches and filters
Company research integration
Resume upload and management

Deployment Targets

iOS: 13.0+
Android: API 21+ (Android 5.0)
Initial release: TestFlight (iOS) and Internal Testing (Android)
Production: Apple App Store and Google Play Store

This file will serve as the single source of truth for all development decisions and requirements throughout the project.
