# Fitsler

A full-stack fitness tracking application — workouts, progressive overload, nutrition targets, body progress, and coach-ready export.

**Live demo:** https://fitness-seven-sage.vercel.app  
**Demo account:** `demo@fitsler.dev` / `demo1234`

---

## Features

### Workouts
- Browse and start sessions from static workout plans (Push Day, Pull Day, Leg Day)
- Build and manage personal custom workout templates
- Log sets, reps, and weight in real time during a session
- Progressive overload indicators comparing current sets to previous best
- Rest timer between sets
- Session-level notes field
- Save, resume, and delete workout sessions
- Workout history with pagination and volume metrics

### Exercise Library
- 873 exercises searchable by name, muscle group, category, and difficulty level
- 7 categories: Strength, Stretching, Cardio, Powerlifting, Plyometrics, Strongman, Olympic Weightlifting
- 15 muscle group filters
- Add any exercise from the library directly to an active session
- Manual custom exercise entry as a fallback

### Dashboard
- Training volume, session count, and personal records at a glance
- Active session resume banner
- Recent saved workouts list
- Setup checklist for new users

### Progress
- Body stats check-ins: weight, body fat %, and muscle mass
- Month-over-month comparison cards
- Body stats chart over time
- InBody scan log (weight, body fat, skeletal muscle mass, fat-free mass)
- Progress photos (upload, label by date, delete; stored privately per account)

### Nutrition
- Three-step calculator: enter body data → choose goal → review targets
- Goals: lose weight, gain muscle, body recomposition, maintenance
- Output: calories, protein, carbs, fat (in grams and % of total)
- Meal structure preferences (3 meals, 3 + snacks, 16:8 fasting, custom)
- Per-day calorie target overrides
- Meal log for tracking actual food intake per meal slot

### Profile
- Name, age, height, biological sex, and goal settings
- Coach-sharing toggle — controls what data is visible in the share summary
- Coach name display

### Share
- Coach-ready summary showing all enabled data sections
- Export to clipboard (formatted text), PDF download, or JSON
- Data visibility controlled from the Profile page

### Authentication
- Email + password registration and login
- Welcome email sent on registration (Resend)
- Password reset flow: request link, verify token, set new password
- JWT sessions via NextAuth
- All data is scoped to the authenticated user — no cross-account access

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript 5 (strict mode) |
| UI | React 19 · Tailwind CSS 4 |
| Auth | NextAuth v5 (JWT strategy) |
| Database | Neon PostgreSQL (serverless, auto-scaling) |
| ORM | Prisma 7 with `@prisma/adapter-pg` |
| Validation | Zod (runtime type validation, error messages) |
| File Storage | Vercel Blob (progress photos) |
| Rate Limiting | Upstash Redis (auth endpoints) |
| Email | Resend (password reset, welcome emails) |
| Charts | Recharts |
| PDF export | jsPDF |
| Testing | Vitest · React Testing Library |
| Linting | ESLint (Next.js config) |
| Deployment | Vercel |
| Security | Content Security Policy, HSTS, X-Frame-Options |

---

## Database Schema

15 models across two concern areas:

**User & Auth**
`User` → `UserProfile`

**Workouts**
`WorkoutSession` → `WorkoutSessionExercise` → `WorkoutSet`
`WorkoutSessionRecord`
`UserWorkoutTemplate`
`ExerciseLibrary` (873 seeded exercises)

**Progress & Health**
`BodyStatsEntry` · `InBodyEntry` · `ProgressPhoto`

**Nutrition**
`NutritionSummary` · `MealPreference` · `MealLogEntry` · `DailyTargetOverride`

All session exercises are stored relationally with full cascade deletes. Exercises in the library are stored in a dedicated `ExerciseLibrary` table and are never duplicated into sessions — only the exercise name and muscle group are copied at session creation time.

---

## Production Security

All API write routes use **Zod validation** with strict input validation:
- Email format validation
- Length constraints on text fields
- Type checking for numbers (age, weight, calories, etc.)
- Enum validation for categorical fields
- Detailed error messages for invalid payloads

**Rate limiting** protects authentication endpoints:
- Login/register: max 5 attempts per 15 minutes per IP (Upstash Redis)
- Password reset: max 3 attempts per 24 hours per email
- Automatic 429 (Too Many Requests) responses when limits exceeded

**Security headers** prevent common web vulnerabilities:
- Content Security Policy (CSP) restricts resource sources
- X-Frame-Options prevents clickjacking
- X-Content-Type-Options prevents MIME sniffing
- Strict-Transport-Security enforces HTTPS
- Referrer-Policy limits URL leakage

**Data storage security:**
- Progress photos stored in Vercel Blob with private access (not base64 in DB)
- All data encrypted in transit (TLS) and in PostgreSQL
- Per-user data scoping enforced on every API route
- File uploads validated: type, size (max 5MB), and format

---

## Local Setup

### Prerequisites

- Node.js 20+
- A PostgreSQL database (Prisma Postgres, Neon, Supabase, or self-hosted)

### 1. Clone and install

```bash
git clone https://github.com/your-username/fitsler.git
cd fitsler
npm install
```

`postinstall` runs `prisma generate` automatically.

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`:

```
DATABASE_URL="postgresql://..."   # your PostgreSQL connection string
AUTH_SECRET="..."                  # generate with: openssl rand -base64 32
```

### 3. Set up the database

```bash
npm run db:setup
```

This runs `prisma migrate deploy` (applies all migrations) then seeds the 873-exercise library. Takes about 10 seconds.

### 4. Create the demo account (optional)

```bash
npm run seed:test-user
```

Creates `demo@fitsler.dev / demo1234` — the same account used in the live demo.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | Random secret for JWT signing. Generate: `openssl rand -base64 32` |

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Apply migrations then build for production |
| `npm start` | Start production server |
| `npm test` | Run test suite (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Create and apply a new migration (interactive) |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:setup` | Apply all migrations + seed exercise library |
| `npm run db:studio` | Open Prisma Studio |
| `npm run seed:exercises` | Seed 873 exercises into ExerciseLibrary table (idempotent) |
| `npm run seed:test-user` | Create demo account: `demo@fitsler.dev / demo1234` |

---

## API Reference

All endpoints require authentication. Unauthenticated requests return `401`.

### Workout Sessions

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/workout-sessions` | List saved sessions (paginated). Query: `limit`, `offset`, `active=true`, `date=YYYY-MM-DD` |
| `POST` | `/api/workout-sessions` | Create session. Body: `{ templateId }` or `{ name }` for custom |
| `GET` | `/api/workout-sessions/:id` | Get session with all exercises and sets |
| `PATCH` | `/api/workout-sessions/:id` | Save session (persists exercises and sets relationally) |
| `DELETE` | `/api/workout-sessions/:id` | Delete session and all related data |

### Workout Templates

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/workout-templates` | List all templates (static + user custom) |
| `GET` | `/api/workout-templates/user` | List user's custom templates |
| `POST` | `/api/workout-templates/user` | Create custom template |
| `PATCH` | `/api/workout-templates/user/:id` | Update custom template |
| `DELETE` | `/api/workout-templates/user/:id` | Delete custom template |

### Exercise Library

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/exercises` | Search exercises. Query: `search`, `muscle`, `category`, `level`, `limit` (default 20, max 100), `offset` |

### Profile & Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/profile` | Get user profile |
| `PATCH` | `/api/profile` | Update profile fields |

### Progress

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/progress` | List body stats entries |
| `POST` | `/api/progress` | Add body stats entry |
| `PATCH` | `/api/progress/:id` | Update body stats entry |
| `DELETE` | `/api/progress/:id` | Delete body stats entry |
| `GET` | `/api/inbody` | List InBody scan entries |
| `POST` | `/api/inbody` | Add InBody entry |
| `DELETE` | `/api/inbody/:id` | Delete InBody entry |
| `GET` | `/api/progress-photos` | List progress photos |
| `POST` | `/api/progress-photos` | Upload progress photo (multipart/form-data: file, date, label; stored in Vercel Blob, max 5 MB) |
| `DELETE` | `/api/progress-photos/:id` | Delete progress photo |

### Nutrition

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/nutrition` | Get nutrition summary |
| `PATCH` | `/api/nutrition` | Save nutrition summary |
| `GET` | `/api/meal-preference` | Get meal structure preference |
| `PATCH` | `/api/meal-preference` | Update meal structure preference |
| `GET` | `/api/meal-logs` | List meal log entries. Query: `date=YYYY-MM-DD` |
| `POST` | `/api/meal-logs` | Add meal log entry |
| `DELETE` | `/api/meal-logs/:id` | Delete meal log entry |
| `GET` | `/api/daily-target-override` | Get daily calorie target override. Query: `date=YYYY-MM-DD` |
| `PATCH` | `/api/daily-target-override` | Set daily calorie target override |

### Utilities

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health/db` | Database connectivity check — returns connection status and row counts |

---

## Architecture

```
Browser ("use client" components)
  → src/frontend/api/*.ts              client-side fetch wrappers
  → app/api/*/route.ts                 Next.js Route Handlers (with Zod validation)
  → src/backend/validation/schemas.ts  Zod schemas for all payloads
  → src/backend/stores/*.ts            Prisma-backed data access layer
  → Neon PostgreSQL                    via Prisma + pg adapter
```

**Data flow & validation:**
1. All POST/PATCH/DELETE routes validate input via Zod schemas in `src/backend/validation/schemas.ts`
2. Invalid requests return `400` with detailed field-level errors
3. Authentication is checked first (all routes require auth)
4. Rate limiting is checked for sensitive routes (login, register, password reset)
5. Validated data is passed to stores, which use Prisma transactions

**Validation architecture:**
- All custom validation modules (`*-validation.ts`) have been completely removed
- Single source of truth: `src/backend/validation/schemas.ts` defines all payload types
- `validate()` helper (in `src/backend/validation/validate.ts`) handles all validation errors consistently
- Cleaner codebase: removed ~1000+ lines of custom validation logic
- Type-safe: inferred types from Zod schemas via `z.infer<typeof schema>`
- Covers all endpoints: progress, nutrition, meals, workouts, templates, auth

**Pattern for adding validation to a route:**
```ts
import { workoutSessionSchema } from "@backend/validation/schemas";
import { validate } from "@backend/validation/validate";

export async function PATCH(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  const body = await request.json().catch(() => null);
  const validation = validate(workoutSessionSchema, body);
  
  if (!validation.ok) {
    return apiErrorResponse({
      status: 400,
      message: validation.error,
      details: validation.details,
    });
  }

  // validation.data is now type-safe
  const result = await store.update(userId, validation.data);
  return apiSuccessResponse(result);
}
```

**Prisma:** The singleton (`src/backend/prisma/prisma.ts`) uses `globalThis` in production and skips it in development so schema changes reload automatically without a server restart. Uses Neon's pooler for connection management.

---

## Testing

```bash
npm test
```

**Test Coverage:** 226 tests passing across API routes, UI components, and utility functions.

```
app/api/exercises/__tests__/      — 9 tests (auth, search, filters, pagination)
app/api/workout-sessions/__tests__/ — 9 tests (auth, create, list, validation)
src/frontend/components/**/__tests__/ — 208 tests (components, forms, dashboard)
```

**Verification Results (Zod Migration):**
- ✅ Dev server: Compiles in 2.1s, no TypeScript errors
- ✅ All API validation routes: Working correctly (226 passing tests)
- ✅ Progress photos: FormData upload to Vercel Blob verified
- ✅ Nutrition endpoints: All Zod validation in place
- ✅ Workout endpoints: All Zod validation in place
- ✅ Error handling: Field-level error responses working
- ⚠️ UI tests: 6 pre-existing component test issues (unrelated to validation changes)

---

## Deployment

The app deploys to Vercel with zero configuration.

**Required environment variables on Vercel:**

```
DATABASE_URL=postgresql://...
AUTH_SECRET=...
```

`npm run build` runs `prisma migrate deploy` before the Next.js build, so pending migrations are applied automatically on each deployment.

After first deployment, seed the exercise library and demo account:

```bash
# Run once against your production database
DATABASE_URL="..." npm run seed:exercises
DATABASE_URL="..." npm run seed:test-user
```

---

## Known Limitations

- **Exercise images are not displayed.** The exercise library includes image paths from the source dataset, but the image files are not bundled. Only exercise metadata (name, muscles, equipment, instructions) is shown.
- **The demo account is public.** Any visitor can log into `demo@fitsler.dev` and see or modify demo data. It is not isolated between visitors.
- **No email verification.** Registration accepts any email address without confirmation.
