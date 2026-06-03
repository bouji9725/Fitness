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
app/                        Next.js App Router pages + API routes
  api/
    exercises/              GET — exercise library (search, filter, pagination)
    nutrition/              GET/PATCH — nutrition summary
    profile/                GET/PATCH — user profile
    progress/               GET/POST — body stats entries
    workout-sessions/       GET/POST — sessions list + create
    workout-sessions/[id]/  GET/PATCH/DELETE — session detail, save, delete
    workout-templates/      GET — static template list
    workout-templates/user/ GET/POST/PATCH/DELETE — user custom templates
    meal-logs/              GET/POST/DELETE — meal log entries
    meal-preference/        GET/PATCH — meal structure preference
    daily-target-override/  GET/PATCH — per-day calorie overrides
  dashboard/                Saved-session metrics view
  login/ register/          Auth pages
  nutrition/                Macro/calorie calculator
  profile/                  User settings + coach sharing toggle
  progress/                 Body stats history + monthly comparison
  share/                    Coach-facing progress export (PDF, clipboard, JSON)
  workouts/                 Template picker + exercise library browser
  workouts/[workoutId]/     Active workout session logging

src/
  backend/
    auth/                   session.ts — getAuthUserId(), actions.ts — signOutAction
    data/                   workout-templates.ts — static seeded templates
    prisma/                 prisma.ts — PrismaClient singleton (dev: no globalThis; prod: globalThis)
    responses/              api-response.ts — apiSuccessResponse / apiErrorResponse
    stores/                 *-store.ts — Prisma-backed data access (profile, nutrition, progress, workout, meal, etc.)
    validation/             workout-validation.ts — session payload validation
  frontend/
    api/                    Client-side fetch wrappers (workouts-api, nutrition-api, profile-api, etc.)
    components/
      auth/                 AuthBrandPanel
      dashboard/            DashboardOverview, RecentWorkoutsList, PersonalRecordsCard, ResumeSessionBanner
      layout/               AppShell, Sidebar, Topbar, PageContainer, PageHeader
      nutrition/            NutritionCalculator, NutritionPlanCard, NutritionSummaryCard
      profile/              BodyStatsForm, ProfileInfoRow, ShareCoachCard, UserProfileCard
      progress/             MonthlyComparisonCard
      share/                ShareOverview, ShareActionsCard, SharePreviewCard, ShareSummaryCard, …
      ui/                   Button, Card, FormField, Input, Label, Select, StatCard, Textarea, Typography, Skeleton, EmptyState
      workout/              WorkoutSession, ExerciseCard, SetRow, AddExerciseForm, ExerciseLibraryPicker,
                            ExerciseLibrarySection, TemplateBuilder, SaveWorkoutBar, SessionSummary,
                            PreviousPerformance, OverloadBadge, RestTimer, WorkoutTemplateDay
    context/                ToastContext
    export/                 share-export.ts — PDF, clipboard, JSON export
    theme/                  theme.ts — design token constants
  shared/
    services/               workout-session-service.ts — session creation + lifecycle helpers
    types/                  nutrition.ts, profile.ts, progress.ts, share.ts, workout.ts
    utils/                  create-id.ts, number.ts

prisma/
  schema.prisma             PostgreSQL schema (13 models incl. ExerciseLibrary, WorkoutSessionExercise, WorkoutSet)
  migrations/               Migration history

lib/
  generated/                Auto-generated Prisma client — gitignored, rebuilt by postinstall

data/
  exercises/                exercises.json — 873-exercise source, used only by seed:exercises script

scripts/
  seed-exercises.ts         npm run seed:exercises — seeds ExerciseLibrary table (idempotent)
  seed-test-user.ts         npm run seed:test-user — creates test@fitsler.dev account
  lib/muscle-map.ts         Muscle group normalisation map used by seed-exercises
```

---

## Architecture

### API-first pattern
All data flows through API routes. The boundary is:

```
UI / page ("use client")
  → src/frontend/api/*.ts      (client fetch wrappers)
  → app/api/*/route.ts         (Next.js Route Handlers)
  → src/backend/stores/*.ts    (Prisma-backed stores)
  → PostgreSQL via Prisma      (prisma.config.ts → db.prisma.io)
```

### Prisma stores
All stores live in `src/backend/stores/`. Each store wraps Prisma queries for one domain (workout, profile, nutrition, progress, meal, inbody, progress-photo). The `PrismaClient` singleton is in `src/backend/prisma/prisma.ts` — uses `globalThis` in production to avoid pool exhaustion; skips it in development so `prisma generate` changes are picked up without a server restart.

### Workout session lifecycle
1. User picks a template → `POST /api/workout-sessions` → `workoutStore.createSession(templateId)`
2. Session page loads → `GET /api/workout-sessions/[sessionId]` — returns session with nested `WorkoutSessionExercise[]` + `WorkoutSet[]`
3. User edits sets in real time → `useReducer(workoutSessionReducer, null)` (client-only, no API call per keystroke)
4. User saves → `PATCH /api/workout-sessions/[sessionId]` → `workoutStore.saveSession()` — deletes + recreates exercises relationally (sets cascade)

### Exercise library
873 exercises live in `ExerciseLibrary` table (seeded from `data/exercises/exercises.json`). `GET /api/exercises` exposes search, muscle, category, level filters with pagination. `AddExerciseForm` shows a Library/Custom two-tab picker in the active session view.

### Calculations are pure functions
`src/shared/` utilities contain no side effects. Pages compute results client-side, then optionally persist via API.

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
- Path aliases: `@/` → project root, `@backend/*` → `src/backend/*`, `@frontend/*` → `src/frontend/*`, `@shared/*` → `src/shared/*`.
- IDs generated with `createId(prefix)` from `@shared/utils/create-id`.
- API responses always use `apiSuccessResponse` / `apiErrorResponse` from `@backend/responses/api-response`.
- No comments by default — only add one when the WHY is non-obvious.
- No inline styles — use Tailwind utilities and CSS custom properties.
- Tailwind v4 is imported via `@import "tailwindcss"` (not the v3 `@tailwind` directives).

---

## Key types

```ts
// src/shared/types/workout.ts
ExerciseCatalogEntry → { id, name, muscleGroup, category?, level?, equipment?, force?, mechanic? }
WorkoutTemplate      → { id, name, exercises: ExerciseTemplate[], isCustom? }
WorkoutSession       → { id, templateId, templateName, performedAt, status, exercises, notes?, createdAt, updatedAt }
WorkoutSessionRecord → { session: WorkoutSession, savedAt }
SessionExercise      → { id, name, muscleGroup, sets: SetEntry[], isCompleted?, previousBest?, templateExerciseId? }
SetEntry             → { id, reps, weight, completed }

// src/shared/types/profile.ts
UserProfile → { id, name, sex?, age?, heightCm?, goal?, coachSharingEnabled, coachName? }

// src/shared/types/nutrition.ts
NutritionGoal    = "lose-weight" | "gain-muscle" | "body-recomp" | "maintenance"
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

## Database setup

**Database:** Prisma Postgres (hosted at db.prisma.io). `DATABASE_URL` in `.env`.

**First-time setup after clone:**
```bash
npm install          # also runs prisma generate via postinstall
npm run db:setup     # prisma migrate deploy + seed:exercises (873 exercises)
npm run seed:test-user  # optional: creates test@fitsler.dev / testpassword123
npm run dev
```

**During development:**
```bash
npm run db:migrate      # prisma migrate dev (interactive — creates + applies new migrations)
npm run db:generate     # prisma generate (regenerate client after manual schema edits)
npm run db:studio       # open Prisma Studio
```

**Note:** After `prisma migrate dev` or `prisma generate`, the dev server picks up new models automatically (no restart needed) because the Prisma singleton skips `globalThis` in development.
