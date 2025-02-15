# Scratchpad

## Instructions

During you interaction with the user, if you find anything reusable in this project (e.g. version of a library, model name), especially about a fix to a mistake you made or a correction you received, you should take note in the `Lessons` section in the `scratchpad.md` file so you will not make the same mistake again.

You should also use the `scratchpad.md` file as a scratchpad to organize your thoughts. Especially when you receive a new task, you should first review the content of the scratchpad, clear old different task if necessary, first explain the task, and plan the steps you need to take to complete the task. You can use todo markers to indicate the progress, e.g.
[X] Task 1
[ ] Task 2
Also update the progress of the task in the Scratchpad when you finish a subtask.
Especially when you finished a milestone, it will help to improve your depth of task accomplishment to use the scratchpad to reflect and plan.
The goal is to help you maintain a big picture as well as the progress of the task. Always refer to the Scratchpad when you plan the next step.

## User Specified Lessons

- Include info useful for debugging in the program output.
- Read the file before you try to edit it.
- Use LLM to perform flexible text understanding tasks. First test on a few files. After success, make it parallel.

## Lessons Learned

- Use `jwt-decode` to decode JWT tokens in the frontend.
- When using MUI's `sx` prop with multiple style objects in TypeScript, use a theme callback and type assertions:
  ```tsx
  sx={(theme) => ({
    ...(style1 as any),
    ...(style2 as any)
  })}
  ```
  This ensures proper type compatibility while allowing style composition.

## Reusable Information

- Library: `jwt-decode`

# Current Task: Project Restructuring

## Current Structure Analysis

The project is a React/TypeScript frontend application with the following structure:

- `src/`
  - `components/` - React components
  - `hooks/` - Custom React hooks
  - `services/` - API and service layer
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions
  - `validations/` - Form validation logic
  - `assets/` - Static assets
  - `styles/` - CSS and style files

## Proposed Restructuring Plan

### 1. Component Organization

[X] Review current components directory
[X] Create feature-based modules:

- `src/features/` directory for feature-specific code
- Move related components, hooks, and logic into feature modules
- Each feature module should have its own:
  - Components
  - Hooks
  - Types
  - Utils
  - Tests

### 2. Shared Code Organization

[ ] Create `src/shared/` directory for:

- Common components
- Utility functions
- Types
- Constants
- Hooks used across features

### 3. API Layer Restructuring

[ ] Improve services organization:

- Create `src/api/` directory
- Separate API clients by domain
- Add proper error handling
- Add request/response types
- Add API documentation

### 4. State Management

[ ] Review and organize state management:

- Separate global and local state
- Create dedicated stores for features
- Add proper TypeScript types for state

### 5. Testing Structure

[ ] Set up proper test organization:

- Add `__tests__` directories in each feature
- Set up test utilities
- Add test configuration

### 6. Build and Configuration

[ ] Organize build and config files:

- Review and update TypeScript configuration
- Optimize build process
- Add proper environment configuration

## Progress

[X] Analyzed current project structure
[X] Moved Auth components
[X] Created feature-based modules
[X] Moved components to features
[X] Moved types to features
[X] Moved services to api
[X] Updated component imports
[X] Organized shared code
[ ] Set up testing structure
[ ] Update build configuration

## Component Movement Progress

### Completed

[X] Auth components moved:

- `Login.tsx`
- `Register.tsx`
- `VerifyEmail.tsx`
  [X] Dashboard feature:
- Move `src/components/Dashboard.tsx` → `src/features/dashboard/components/`
- Move `src/components/charts/*` → `src/features/dashboard/components/charts/`
  [X] Landing feature:
- Move `src/components/landing.tsx` → `src/features/landing/components/`
  [X] WebSocket feature:
- Move `src/components/WebSocket.tsx` → `src/features/websocket/components/`
  [X] Shared components:
- Move `src/components/PrivateRoute.tsx` → `src/shared/components/`
  [X] Update import paths in App.tsx

### Next Steps

1. [x] Move components to feature modules
2. [x] Move types to feature modules:
   - [x] Move dashboard types to dashboard feature
   - [x] Move auth types to auth feature
   - [x] Move websocket types to websocket feature
   - [x] Move ApiResponse to shared types
3. [x] Move services to api directory:
   - [x] Move auth service
   - [x] Move websocket service
4. [x] Update imports in components to use new paths:
   - [x] Update auth components
   - [x] Update dashboard components
   - [x] Update websocket components
5. [x] Set up shared module structure:
   - [x] Move shared utilities (crypto.ts, backgroundImages.ts)
   - [x] Move shared validations (authValidation.ts)
   - [x] Move shared styles (auth.styles.ts, dashboard.styles.ts)
6. [ ] Set up testing structure:
   - [ ] Add **tests** directories in each feature
   - [ ] Set up test utilities
   - [ ] Add test configuration
7. [ ] Review and update build configuration

### Notes

- Keep original files until all imports are updated and tested
- Test each component after moving to ensure functionality
- Update any relative paths in the components

## Next Actions

1. Set up testing structure with **tests** directories
2. Review and update build configuration

## Next Steps

1. Start with creating the feature-based module structure
2. Move existing components into appropriate feature modules
3. Create shared module for common code
4. Update imports and dependencies

## Notes

- Need to ensure backward compatibility during restructuring
- Will need to update import paths across the project
- Should maintain TypeScript strict mode
- Consider adding proper documentation for the new structure

## sensor data format

{
"sensor": "13/client2/veml770",
"values": "[{\"type\":\"t\",\"value\":57.54705809083287},{\"type\":\"h\",\"value\":79.98249094270346}]"
}
