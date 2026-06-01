# Exercise Library — Technical Design Document

**Status:** In Design  
**Phase 1 branch:** `feature/exercise-library-core`  
**Phase 2 branch:** `feature/exercise-library-ui`  
**Notion spec:** https://www.notion.so/37223761a07281a2a8a4d3f62f6df495

---

## Problem

The app ships with ~70 hardcoded exercises in `src/backend/data/exercises.ts`. Users cannot browse or search exercises — they must type a name manually in `AddExerciseForm`. The source file `data/exercises/exercises.json` contains 873 well-structured exercises with metadata (level, equipment, category, instructions) that are completely unused.

---

## Goals

- Import the 873-exercise JSON into a permanent `ExerciseLibrary` DB table
- Expose `GET /api/exercises` with search, filter, and pagination
- Upgrade `AddExerciseForm` with a searchable library picker (manual entry stays as fallback)
- Zero changes to `WorkoutSession.exercises` JSON or the `SessionExercise` type

## Non-Goals (deferred)

- Relational `WorkoutSessionExercise` / `WorkoutSet` tables
- User-saved custom exercises in DB
- Exercise image rendering
- Exercise detail pages

---

## Architecture Decisions

### ADR-1 — Muscle group normalisation

**Decision:** Add `muscleGroupTag String` to `ExerciseLibrary` — a server-side mapping from the JSON's `primaryMuscles[0]` to the app's vocabulary (`Back`, `Chest`, etc.) applied at import time.

**Why:** The JSON uses lowercase anatomical terms (`lats`, `middle back`) while the app uses a curated, title-case vocabulary. Mapping at import time enables clean DB-level filtering without any runtime translation cost.

**Rejected:** Map at API layer only — prevents indexed DB filtering.

### ADR-2 — Array storage format

**Decision:** Use native PostgreSQL `String[]` for `primaryMuscles`, `secondaryMuscles`, `instructions`, `images`.

**Why:** The schema already targets PostgreSQL. Native arrays allow future `@>` containment queries without schema changes and are simpler than JSON stringification.

**Rejected:** JSON strings — loses PostgreSQL array advantages.

### ADR-3 — Category handling

**Decision:** Expose `category` as a distinct filter (alongside `muscleGroupTag`) in both the API and UI picker.

**Why:** The 7 categories (strength, stretching, cardio, powerlifting, plyometrics, strongman, olympic weightlifting) are meaningful and irreducible to muscle groups — cardio/stretching exercises have no single primary muscle.

**Rejected:** Collapse into muscle groups — loses important user-facing granularity.

### ADR-4 — Images

**Decision:** Store `images String[]` at import. Do not render in this phase.

**Why:** Zero cost to store. Enables future image display without re-import.

---

## Schema

File: `prisma/schema.prisma`

```prisma
model ExerciseLibrary {
  id               String   @id
  name             String
  category         String
  level            String
  equipment        String
  force            String?
  mechanic         String?
  primaryMuscles   String[]
  secondaryMuscles String[]
  muscleGroupTag   String
  instructions     String[]
  images           String[]
}
```

---

## Muscle Group Normalisation Map

File: `scripts/lib/muscle-map.ts`

Maps `primaryMuscles[0]` from the JSON to the app's vocabulary:

| JSON value | muscleGroupTag |
|---|---|
| lats, middle back, lower back | Back |
| chest | Chest |
| biceps | Biceps |
| triceps | Triceps |
| shoulders | Shoulders |
| quadriceps | Quads |
| hamstrings | Hamstrings |
| glutes | Glutes |
| calves | Calves |
| abdominals | Core |
| forearms | Forearms |
| traps | Traps |
| abductors, adductors | Legs |
| neck | Neck |
| *(no match)* | Full Body |

---

## API Contract

### `GET /api/exercises`

**Query params:**

| Param | Type | Default | Description |
|---|---|---|---|
| `search` | string | — | Case-insensitive partial name match |
| `muscle` | string | — | Filter by `muscleGroupTag` |
| `category` | string | — | Filter by `category` |
| `level` | string | — | `beginner` / `intermediate` / `expert` |
| `limit` | number | 20 | Page size (max 100) |
| `offset` | number | 0 | Pagination offset |

**Response:**

```ts
{
  data: ExerciseCatalogEntry[]   // extended type, see below
  total: number
}
```

**Extended `ExerciseCatalogEntry`:**

```ts
type ExerciseCatalogEntry = {
  id: string
  name: string
  muscleGroup: string    // = muscleGroupTag
  category: string
  level: string
  equipment: string
  force?: string
  mechanic?: string
}
```

**Auth:** Required — returns 401 if unauthenticated (consistent with other routes).

---

## Seed Script

File: `scripts/seed-exercises.ts`

```
1. Read data/exercises/exercises.json
2. Map each entry:
   - Apply muscle-map.ts to get muscleGroupTag
   - Nullify force/mechanic if null in source
3. prisma.exerciseLibrary.createMany({ data, skipDuplicates: true })
4. Log: "Seeded X exercises (Y skipped as duplicates)"
```

Idempotent — safe to re-run at any time.

**Run after checkout:**

```bash
npx prisma migrate dev --name add-exercise-library
npx tsx scripts/seed-exercises.ts
```

---

## UI Changes

### `AddExerciseForm` — before / after

**Before:** Single form with manual name input + muscle group dropdown.

**After:** Two-tab panel.

| Tab | Content |
|---|---|
| **Library** | Search input · category pill row · muscle group dropdown · paginated results list |
| **Custom** | Existing manual form — completely unchanged |

Selecting an exercise from the library calls the same `onAddExercise(SessionExercise)` callback. The `SessionExercise` shape does not change.

### New component tree

```
AddExerciseForm
  ├── Tab: Library
  │     └── ExerciseLibraryPicker
  │           ├── search input
  │           ├── category pills
  │           ├── muscle group select
  │           └── ExerciseResultsList
  └── Tab: Custom
        └── (existing form, unchanged)
```

---

## Branch & PR Strategy

| Branch | Scope | Depends on |
|---|---|---|
| `feature/exercise-library-core` | Schema · migration · seed · API · tests | — |
| `feature/exercise-library-ui` | Picker component · AddExerciseForm integration | core merged |

Each PR is independently reviewable. The UI PR imports nothing from the seed script.

---

## Task Breakdown

### Phase 1 — Core

1. Add `ExerciseLibrary` model to `prisma/schema.prisma`
2. Run `prisma migrate dev --name add-exercise-library`
3. Write normalisation map at `scripts/lib/muscle-map.ts`
4. Write seed script at `scripts/seed-exercises.ts`
5. Add `GET /api/exercises` route
6. Write Vitest tests for the API route

### Phase 2 — UI

7. Build `ExerciseLibraryPicker` component
8. Wire into `AddExerciseForm` as Library tab
9. Manual QA — picker → add exercise → session JSON unchanged

---

## Testing Plan

| Type | Scope |
|---|---|
| Unit (Vitest) | Auth guard · search · muscle filter · category filter · pagination · empty results |
| Integration | Seed idempotency — re-run produces zero duplicates |
| Manual | Picker flow end-to-end · confirm `WorkoutSession.exercises` JSON unchanged |
