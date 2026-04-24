# Fitness App (Maintainer README)

# Fitsler — Fitness SaaS Frontend

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
UI components
  -> lib/api/*
  -> app/api/*
  -> lib/server/*
  -> temporary server-side stores
