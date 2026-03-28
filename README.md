# Fitness App

A coach-focused training tracker built with Next.js App Router, React, TypeScript, and Tailwind CSS.

This README is written as a maintenance guide. It explains how the app is structured, where each feature lives, and exactly what to edit when requirements change.

## 1) What This App Does

- Lists workout templates (Push, Pull, Legs).
- Opens a workout details page by workout id.
- Tracks sets, reps, weight, and completion state in real time.
- Supports adding sets and exercises during a session.
- Calculates progressive overload and volume.
- Saves workout sessions in browser localStorage.
- Builds dashboard metrics from saved sessions.

## 2) Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- ESLint (Next.js + TypeScript config)

## 3) Run Locally

1. Install dependencies:

	 npm install

2. Start the dev server:

	 npm run dev

3. Open:

	 http://localhost:3000

## 4) Scripts

- npm run dev: start local development server
- npm run build: production build
- npm run start: run production server
- npm run lint: lint project files

## 5) Route Map

- / -> Home summary page
	- app/page.tsx
- /dashboard -> Saved session insights
	- app/dashboard/page.tsx
- /workouts -> Workout template list
	- app/workouts/page.tsx
- /workouts/[workoutId] -> Workout detail/session page
	- app/workouts/[workoutId]/page.tsx

## 6) Project Structure (What Owns What)

### App routing and layout

- app/layout.tsx
	- Root HTML layout, fonts, metadata, global page wrapper.
- app/globals.css
	- Global styles and Tailwind import.

### Shared layout components

- components/layout/AppShell.tsx
	- Main shell: sidebar + topbar + page body.
- components/layout/Sidebar.tsx
	- Main navigation links.
- components/layout/Topbar.tsx
	- Header area above content.
- components/layout/PageHeader.tsx
	- Consistent page titles/descriptions/actions.

### UI primitives

- components/ui/Button.tsx
	- Standard button variants used across app.
- components/ui/Card.tsx
	- Card wrapper style.
- components/ui/StatCard.tsx
	- Metric display card.

### Workout feature

- components/workout/WorkoutDayCard.tsx
	- Workout card and link to details route.
- components/workout/WorkoutSession.tsx
	- Main client session container, reducer wiring, hydration, save/reset flow.
- components/workout/SessionsSummary.tsx
	- Session-level totals (exercises, sets, completed sets, volume).
- components/workout/SaveWorkoutBar.tsx
	- Save/reset controls and last-saved timestamp.
- components/workout/AddExerciseForm.tsx
	- Add new exercise to current session.
- components/workout/ExerciseCard.tsx
	- Exercise block, overload badge, set list, add-set action.
- components/workout/SetRow.tsx
	- Inputs for reps/weight/completed + remove set action.
- components/workout/PreviousPerformance.tsx
	- Previous best display.
- components/workout/OverloadBadge.tsx
	- Progress state label.

### Dashboard feature

- components/dashboard/DashboardOverview.tsx
	- Client-side hydration and metric rendering.
- components/dashboard/RecentWorkoutsList.tsx
	- Recent saved sessions list.
- components/dashboard/WorkoutInsightCard.tsx
	- Exists but currently empty (safe to implement or remove).

### Domain types and business logic

- types/workout.ts
	- Domain model: SetEntry, Exercise, WorkoutDay.
- lib/workout-session-reducer.ts
	- All workout session state transitions.
- lib/workout-storage.ts
	- localStorage save/load/clear/all sessions.
- lib/calculations.ts
	- Volume and progressive overload helpers.
- lib/dashboard-data.ts
	- Aggregates saved sessions into dashboard metrics.
- lib/mock-data.ts
	- Seed workout templates used by workouts pages.

## 7) Data Flow (End-to-End)

1. Workouts list page reads templates from lib/mock-data.ts.
2. User opens a workout card linking to /workouts/[workoutId].
3. Workout details page finds matching template by id.
4. WorkoutSession initializes reducer state from that template.
5. On client mount, WorkoutSession attempts to hydrate from localStorage.
6. UI actions dispatch reducer events (update set, add set, add exercise, etc).
7. Save action writes session payload to localStorage.
8. Dashboard reads all saved sessions, computes metrics, renders summary cards/list.

## 8) Change Guide (Where To Edit)

### A) Add or edit workout templates

Edit:
- lib/mock-data.ts

Notes:
- Keep each workout id unique and URL-safe (used in route matching).
- The dynamic route depends on workout.id matching /workouts/[workoutId].

### B) Add new fields to set/exercise/workout

Edit in this order:
1. types/workout.ts (type definitions)
2. lib/workout-session-reducer.ts (state updates)
3. components/workout/* (form inputs and rendering)
4. lib/workout-storage.ts (ensure persisted shape still works)
5. lib/dashboard-data.ts and lib/calculations.ts (if metrics depend on new field)

### C) Add a new reducer action

Edit:
1. lib/workout-session-reducer.ts
	 - Extend WorkoutSessionAction union
	 - Add switch case in workoutSessionReducer
2. Dispatch from relevant component (often SetRow.tsx, ExerciseCard.tsx, or AddExerciseForm.tsx)

### D) Change progressive overload logic

Edit:
- lib/calculations.ts -> isProgressiveOverload

UI dependency:
- components/workout/ExerciseCard.tsx uses this helper to drive OverloadBadge.

### E) Change volume logic

Edit:
- lib/calculations.ts -> calculateExerciseVolume and/or calculateSetVolume

Consumers:
- components/workout/ExerciseCard.tsx
- components/workout/SessionsSummary.tsx
- lib/dashboard-data.ts

### F) Change dashboard metrics/cards

Edit:
1. lib/dashboard-data.ts (source of truth for metrics)
2. components/dashboard/DashboardOverview.tsx (render cards)
3. components/dashboard/RecentWorkoutsList.tsx (list rendering)

### G) Change navigation links

Edit:
- components/layout/Sidebar.tsx

### H) Change page titles/descriptions

Edit route page files:
- app/page.tsx
- app/dashboard/page.tsx
- app/workouts/page.tsx
- app/workouts/[workoutId]/page.tsx

### I) Change save/reset behavior

Edit:
- components/workout/WorkoutSession.tsx
- lib/workout-storage.ts
- components/workout/SaveWorkoutBar.tsx

### J) Change visual style system

Edit:
- app/globals.css (global theme variables)
- components/ui/Button.tsx (button variants)
- components/ui/Card.tsx and components/ui/StatCard.tsx (card styles)

## 9) localStorage Contract

Key pattern:
- fitness-workout-session:{workoutId}

Value shape:
- { workout: WorkoutDay, savedAt: string }

Owned by:
- lib/workout-storage.ts

When changing persisted shape, add backward-compatible parsing in loadWorkoutSession and loadAllWorkoutSessions to avoid breaking existing users.

## 10) Developer Conventions

- Use the alias path prefix @/ for internal imports.
- Keep business logic in lib and rendering logic in components.
- Keep reducer pure (no side effects in reducer switch cases).
- For any hook usage (useState/useEffect/useReducer), component must be a client component.
- Ensure route params and template ids stay aligned.
- Prefer editing shared helpers over duplicating logic in components.

## 11) Common Pitfalls

- Import/file-name mismatch (example: SessionSummary vs SessionsSummary) can break workout pages.
- Renaming a workout id in lib/mock-data.ts without updating links/bookmarks can create not-found behavior.
- Direct localStorage usage in server components will fail; keep storage access in client components/lib functions guarded by window checks.
- Reducer changes without updating action dispatches can create runtime bugs that TypeScript may not fully catch if casts are introduced.

## 12) Recommended Workflow For Safe Changes

1. Update types first.
2. Update reducer or lib logic.
3. Update UI components.
4. Run npm run lint.
5. Manually test:
	 - open a workout
	 - edit sets/exercises
	 - save
	 - reload page
	 - check dashboard metrics

## 13) Current Improvement Opportunities

- app/layout.tsx metadata still uses default create-next-app title/description.
- app/globals.css body font still falls back to Arial instead of the loaded Geist variable.
- components/dashboard/WorkoutInsightCard.tsx is empty.
- No automated tests yet.

## 14) Onboarding Checklist For New Developers

1. Run npm install and npm run dev.
2. Read route files under app to understand page entry points.
3. Read lib/workout-session-reducer.ts and lib/workout-storage.ts to understand core behavior.
4. Inspect components/workout/WorkoutSession.tsx to see full user interaction flow.
5. Use this README change guide when implementing feature updates.
