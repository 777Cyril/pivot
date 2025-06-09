# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the App
- `npm start` or `npx expo start` - Start the Expo development server
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start web version

### Testing
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:temperature` - Run temperature slider and matching tests
- `npm run test:vectors` - Run vector operations and career matching tests with coverage
- `npm run test:vector:watch` - Watch vector-related tests during development

### Code Quality
- `npm run lint` - Run ESLint on TypeScript files
- `npm run format` - Format code with Prettier

## Architecture Overview

### Core Concept
Pivot is a career transition platform that uses **vector-based job matching** with **temperature-controlled discovery**. Unlike traditional keyword matching, it analyzes transferable skills through multi-dimensional vectors to suggest career paths based on desired change level.

### Key Technologies
- **React Native with Expo SDK** - Cross-platform mobile development
- **TypeScript in strict mode** - Type safety throughout
- **Expo Router** - File-based navigation (tabs in `app/(tabs)/`)
- **Jest + React Native Testing Library** - Comprehensive testing

### Vector-Based Matching System
The core innovation is the skill vector system in `/services/`:

- **`vectorOperations.ts`** - Mathematical operations on skill vectors (cosine similarity, normalization, distance)
- **`skillExtraction.ts`** - Converts resume text into skill vectors
- **`careerMatchingService.ts`** - Matches users to jobs using temperature-adjusted similarity
- **`temperatureMatching.ts`** - Controls how different suggested roles should be (0=similar, 1=complete pivot)

### Temperature System
The temperature slider (0.0-1.0) controls career transition aggressiveness:
- 0.0-0.2: Safe steps (similar roles)
- 0.2-0.4: Stretch opportunities  
- 0.4-0.6: True pivots
- 0.6-0.8: Bold moves
- 0.8-1.0: Complete reinvention

### Data Models
- **Job interface** in `types/index.ts` - Core job structure with platform integration support
- **SkillVector interface** in `services/vectorOperations.ts` - Multi-dimensional skill representation
- **UserProfile, CareerMatch** in `services/careerMatchingService.ts` - User and matching data

### File Structure
- `app/(tabs)/` - Main navigation screens (index, profile, applications, explore)
- `app/components/` - Reusable UI components (JobCard, SwipeableCard, JobCardStack)
- `app/screens/` - Screen components with business logic
- `app/services/` - Application services (job fetching, applications)
- `services/` - Core AI/ML services (vector operations, career matching)
- `components/` - Shared UI components (TemperatureSlider, themed components)

### Testing Strategy
- Unit tests for vector calculations and matching algorithms in `__tests__/services/`
- Component tests in `__tests__/components/`
- Screen integration tests in `__tests__/screens/`
- Use specific test commands for focused development (e.g., `npm run test:vectors`)

### Development Notes
- Always run `npm run lint` before committing changes
- The app uses file-based routing - new screens go in `app/` directory
- Vector operations are performance-critical - test thoroughly
- Temperature matching logic is complex - refer to AGENTS.md for algorithm details
- Mock data and services are used during development phase