# Smart Campus Room Availability Checker (Assignment #04)

React + TypeScript + Vite + Tailwind. Fictional data only; no backend, login or booking creation.

## Setup and run
npm install
npm run dev        # start dev server

## Test and check
npm run test       # Vitest: 48 tests (rules, filtering, UI)
npm run typecheck
npm run build

## Evidence scripts
node scripts/count-dup.mjs     # counts duplicated snippets in src (excl. lib and tests)
node scripts/count-lines.mjs   # counts lines per file (excl. tests)

## Structure
- src/lib/availability.ts  booking rules AC1-AC4 (+ F3 blocked room)
- src/lib/filtering.ts     capacity and equipment filters (F1, F2)
- src/lib/sampleData.ts    4 fictional rooms with equipment
- src/components/          presentational UI components
- src/App.tsx              state and composition
- src/*.test.* and src/lib/*.test.ts   tests