# Fitness App (Maintainer README)

Next.js 16 fitness tracking app with modules for workouts, progress, nutrition, profile, dashboard, and coach sharing.

## 1) Current Status

- Frontend: implemented and functional.
- API: partially implemented for workouts.
- Persistence: mostly browser localStorage.
- Prisma/backend: not ready yet (setup and refactor still required).

## 2) Feature Map

- Home: `app/page.tsx`
- Dashboard: `app/dashboard/page.tsx`
- Workouts list: `app/workouts/page.tsx`
- Workout details/session: `app/workouts/[workoutId]/page.tsx`
- Progress: `app/progress/page.tsx`
- Nutrition: `app/nutrition/page.tsx`
- Profile: `app/profile/page.tsx`
- Share: `app/share/page.tsx`

## 3) Data Ownership (Important)

- Browser localStorage data layer:
  - `lib/data/workouts.ts`
  - `lib/data/progress.ts`
  - `lib/data/nutrition.ts`
  - `lib/data/profile.ts`
- Mock templates:
  - `lib/data/workout-templates.ts`
- API handlers:
  - `app/api/workout-sessions/route.ts`
  - `app/api/workout--sessions/[sessionId]/route.ts`
  - `app/api/workout-templates/route.ts`
  - `app/api/workout--templates/[templateId]/route.ts`

## 4) Backend Readiness Verdict

Not fully ready for Prisma yet.

Blocking gaps:

1. No Prisma setup (`prisma` CLI, `@prisma/client`, schema, migrations).
2. No DB config (`DATABASE_URL`, `.env.example`).
3. API route naming inconsistency (`workout-sessions` vs `workout--sessions`, same for templates).
4. API route `app/api/workout--sessions/[sessionId]/route.ts` uses localStorage helpers from `lib/data/workouts.ts`, which are browser-only patterns.
5. No runtime request validation for API payloads.
6. No auth/user isolation (profile defaults to static `user-1`).

## 5) What To Do Before Prisma Integration

1. Add dependencies:
   - `npm install prisma @prisma/client zod`
   - `npx prisma init`
2. Add env files:
   - `.env.local` with `DATABASE_URL`
   - `.env.example` documenting required variables
3. Standardize API route names:
   - Keep only single-dash route folders (`workout-sessions`, `workout-templates`)
   - Remove double-dash variants after migration
4. Add DB client layer:
   - `lib/db/client.ts` (Prisma singleton)
   - `lib/db/queries/*.ts` (domain queries)
5. Add validation layer:
   - `lib/schemas/*.ts` using Zod for request parsing in API routes
6. Refactor API routes:
   - Replace localStorage/mocks with Prisma queries
7. Introduce auth context and `userId` scoping for all write/read routes
8. Keep localStorage only as optional offline cache (client-only), not source of truth

## 6) Minimal Target API Plan

- `GET /api/workout-templates` -> DB templates
- `GET /api/workout-templates/[templateId]` -> single template
- `POST /api/workout-sessions` -> create session from template (user scoped)
- `GET /api/workout-sessions/[sessionId]` -> session detail
- `PATCH /api/workout-sessions/[sessionId]` -> update session
- `DELETE /api/workout-sessions/[sessionId]` -> archive/delete session

Future parity routes:

- `GET/PATCH /api/profile`
- `GET/POST /api/nutrition`
- `GET/POST /api/progress`
- `GET /api/share` (aggregated payload)

## 7) Developer Workflow

- Install: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`

## 8) Maintenance Rules

1. Keep types in `types/*` synchronized with route payload schemas.
2. Keep business logic in `lib/*`, keep components mostly presentational.
3. Do not import localStorage helpers in server route handlers.
4. Prefer one canonical route per resource; avoid duplicate path variants.
5. Update this README when route contracts or persistence strategy changes.
