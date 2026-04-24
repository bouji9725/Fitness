# Fitness App (Maintainer README)

# Fitsler — Fitness App

A production-minded fitness tracking application built with Next.js, React, TypeScript, and Tailwind CSS.

Fitsler is designed as a portfolio-grade SaaS-style product that helps users log workouts, track training progress, calculate nutrition targets, manage profile data, and prepare coach-ready summaries.

## Live Demo

https://fitness-seven-sage.vercel.app

## Core Features

- Workout template browsing
- Workout session logging
- Set, rep, weight, and completion tracking
- Progressive overload indicators
- Saved workout history
- Dashboard metrics and training insights
- Progress tracking with body stats
- Nutrition calculator for calories and macros
- User profile and coach-sharing settings
- Coach-ready share summary
- API-first frontend architecture

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Next.js API Routes
- Temporary server-side stores
- ESLint

## Architecture

The app follows an API-first frontend architecture:

```txt
| Route                   | Purpose                              |
| ----------------------- | ------------------------------------ |
| `/`                     | Product overview                     |
| `/dashboard`            | Training metrics and recent activity |
| `/workouts`             | Workout template selection           |
| `/workouts/[workoutId]` | Active workout session logging       |
| `/progress`             | Body stats tracking                  |
| `/nutrition`            | Nutrition and macro planning         |
| `/profile`              | Profile and coach-sharing settings   |
| `/share`                | Coach-ready summary                  |

| Method | Endpoint                            | Purpose                     |
| ------ | ----------------------------------- | --------------------------- |
| GET    | `/api/workout-templates`            | List workout templates      |
| GET    | `/api/workout-sessions`             | List saved workout sessions |
| POST   | `/api/workout-sessions`             | Create workout session      |
| GET    | `/api/workout-sessions/[sessionId]` | Get workout session         |
| PATCH  | `/api/workout-sessions/[sessionId]` | Save workout session        |
| GET    | `/api/profile`                      | Get profile                 |
| PUT    | `/api/profile`                      | Update profile              |
| GET    | `/api/progress`                     | List progress entries       |
| POST   | `/api/progress`                     | Add progress entry          |
| GET    | `/api/nutrition`                    | Get nutrition summary       |
| PUT    | `/api/nutrition`                    | Save nutrition summary      |

