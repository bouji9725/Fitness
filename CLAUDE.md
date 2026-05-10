@AGENTS.md

# Fitsler — Fitness Tracking App

## Project overview

**Fitsler** is a personal fitness tracking web app. It covers workout logging, dashboard metrics, body progress tracking, macro/calorie calculation, and coach-friendly progress sharing (PDF + clipboard export).

**Stack:** Next.js 16.2.1 (App Router) · React 19.2.4 · TypeScript (strict) · Tailwind CSS v4 · jspdf

Run the dev server: `npm run dev`  
Lint: `npm run lint`  
Build: `npm run build`

---

## Directory structure

```
app/                   Next.js App Router pages + API routes
  api/
    nutrition/         GET/PATCH  — nutrition summary
    profile/           GET/PATCH  — user profile
    progress/          GET/POST   — body stats entries
    workout-sessions/  GET/POST   — sessions list + create
    workout-sessions/[sessionId]/  GET/PATCH — session detail + save
    workout-templates/  GET       — static template list
  dashboard/           Saved-session metrics view
  nutrition/           Macro/calorie calculator
  profile/             User settings + coach sharing toggle
  progress/            Body stats history + monthly comparison
  share/               Coach-facing progress export (PDF, clipboard, JSON)
  workouts/            Template picker
  workouts/[workoutId]/ Active workout session logging

components/
  dashboard/           DashboardOverview, RecentWorkoutsList, WorkoutInsightCard
  layout/              AppShell, Sidebar, Topbar, PageContainer, PageHeader
  nutrition/           NutritionCalculator, NutritionPlanCard, NutritionSummaryCard, ProteinRecommendationCard
  profile/             BodyStatsForm, ProfileInfoRow, ShareCoachCard, UserProfileCard
  progress/            MonthlyComparisonCard (also components/progress/page.tsx)
  share/               ShareOverview, ShareActionsCard, SharePermissionCard, SharePreviewCard,
                        ShareSummaryCard, ShareBodyStatsSummary, ShareNutritionSummary, ShareWorkoutSummary
  ui/                  Button, Card, FormField, Input, Label, Select, StatCard, Textarea, Typography
  workout/             WorkoutSession, ExerciseCard, SetRow, AddExerciseForm, SaveWorkoutBar,
                        SessionSummary, PreviousPerformance, OverloadBadge, WorkoutTemplateDay

lib/
  api/                 Client-side fetch wrappers (nutrition-api, profile-api, progress-api, workouts-api)
  calculations/        Pure functions: dashboard.ts, nutrition.ts, progress.ts, workouts.ts
  data/                Static seed data: workout-templates.ts, nutrition.ts, profile.ts, progress.ts, share.ts, workouts.ts
  export/              share-export.ts — copyToClipboard, downloadJSON, downloadPDFReport, formatShareText
  server/              Server-only: *-store.ts (in-memory stores), api-response.ts, workout-validation.ts
  services/            workout-session-service.ts — session creation + touch (updatedAt bump)
  utils/               create-id.ts, number.ts
  theme.ts             Design token constants mirroring globals.css
  workout-session-reducer.ts  useReducer actions for live session state

types/                 Shared TypeScript types: nutrition.ts, profile.ts, progress.ts, share.ts, workout.ts
```

---

## Architecture

### API-first pattern
All data flows through API routes — pages and components never import from `lib/server/` or `lib/data/` directly. The boundary is:

```
UI / page ("use client")
  → lib/api/*.ts       (client fetch wrappers)
  → app/api/*/route.ts (Next.js Route Handlers)
  → lib/server/*-store.ts  (in-memory stores, server-only)
```

### In-memory stores (temporary)
All stores (`workoutStore`, `profileStore`, `nutritionStore`, `progressStore`) live in `lib/server/`. They use `globalThis.__fitness*` to survive Next.js hot-reload cycles in development. State resets on server restart. A Prisma/database layer is planned to replace these.

### Workout session lifecycle
1. User picks a template → `POST /api/workout-sessions` → `workoutStore.createSession(templateId)`
2. Session page loads → `GET /api/workout-sessions/[sessionId]`
3. User edits sets in real time → `useReducer(workoutSessionReducer, null)` (client-only, no API call per keystroke)
4. User saves → `PATCH /api/workout-sessions/[sessionId]` → `workoutStore.saveSession()`

### Calculations are pure functions
`lib/calculations/*` contains no side effects. They take typed inputs and return typed outputs. Pages compute results client-side using these, then optionally persist via API.

---

## Design system

### CSS custom properties (`globals.css`)
All visual tokens live in `:root`. Use them in Tailwind via `var()`:

| Token | Value |
|---|---|
| `--color-bg` | `#020617` (deep navy) |
| `--color-accent` | `#818cf8` (indigo) |
| `--color-text-primary` | `#f8fafc` |
| `--color-text-secondary` | `#cbd5e1` |
| `--color-text-muted` | `#94a3b8` |
| `--radius-sm/md/lg/xl` | `0.75/1/1.25/1.5rem` |

### Shared utility classes
- `.app-surface` — card surface (bg-card, border, shadow, backdrop blur 14px)
- `.app-panel` — elevated panel (sidebar, hero blocks, backdrop blur 18px)
- `.app-hairline` — applies `--color-border` as border color
- `.text-muted` / `.text-secondary` — semantic text helpers

### Layout components
Every page wraps content in: `<AppShell> → <PageContainer> → <PageHeader> + content`

- `AppShell` — owns sidebar + topbar + mobile overlay; must be a Client Component
- `PageContainer` — consistent max-width padding
- `PageHeader` — eyebrow + title + description + optional `actions` slot

---

## Conventions

- `"use client"` at the top of any component that uses hooks, browser APIs, or event handlers. Server components are the exception — most pages are client components here.
- Path alias `@/` maps to the project root (configured in `tsconfig.json`).
- IDs generated with `createId(prefix)` from `lib/utils/create-id.ts`.
- API responses always use `apiSuccessResponse` / `apiErrorResponse` from `lib/server/api-response.ts`.
- No comments by default — only add one when the WHY is non-obvious.
- No inline styles — use Tailwind utilities and CSS custom properties.
- Tailwind v4 is imported via `@import "tailwindcss"` (not the v3 `@tailwind` directives).

---

## Key types

```ts
// types/workout.ts
WorkoutTemplate  → { id, name, exercises: ExerciseTemplate[] }
WorkoutSession   → { id, templateId, templateName, performedAt, status, exercises, createdAt, updatedAt }
WorkoutSessionRecord → { session, savedAt }
SessionExercise  → { id, name, muscleGroup, sets: SetEntry[], isCompleted? }
SetEntry         → { id, reps, weight, completed }

// types/profile.ts
UserProfile      → { id, name, age?, heightCm?, goal?, coachSharingEnabled, coachName? }

// types/nutrition.ts
NutritionGoal    = "lose-weight" | "gain-muscle" | "body-recomp"
NutritionInputs  → { weightKg, bodyFatPercent, bmr, tdee, goal, adjustment, recompDirection }
NutritionResults → { proteinTargetGrams, calorieTarget, fatTargetGrams, carbsTargetGrams, ... }
```

---

## Workflow rules

These rules apply in every session, no exceptions.

1. **Plan before changes** — Before editing any project file, state the problem and present the solution options. Wait for explicit approval before touching code.
2. **CLAUDE.md stays current** — Run `/sync-claude-md` (or the Stop hook handles it automatically) to keep this file accurate after structural changes.
3. **Log work to Notion** — After each session where meaningful work is done, append an entry to the Work Log page in the Fitsler App Notion space.
4. **No unsolicited refactors** — Only change what the approved task requires. Do not clean up surrounding code, rename things, or add abstractions unless asked.

---

## Slash commands

| Command | What it does |
|---|---|
| `/sync-claude-md` | Analyzes the project, updates all stale sections of this file, commits the result |

The `Stop` hook (`.claude/settings.json`) auto-patches the **Current branch status** section below after every session.

---

## Current branch status (2026-05-10)

**Branch:** `styling`

**Modified files:**
```
Clean — no uncommitted changes
```

**Recent commits:**
```
a1337a1 add CLAUDE.md with full codebase documentation and styling updates
6c241f5 remove legacy local data access after API-first migration
39ae1a3 feat: add API-first nutrition data boundary
0274775 feat: add API-first progress data boundary
3dfdfbd feat: add API-first profile data boundary
```
