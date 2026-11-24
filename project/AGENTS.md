# AGENTS.md

## Project
Smart Campus room availability checker; a catalog of at least 4 fictional rooms, each with id, name, capacity, equipment (string[]), blocked and bookings.
User story: As a student, I want to check a room's availability so I can choose a valid booking time.

## Structure
- src/lib/availability.ts: booking rules (checkAvailability, time parsing helpers, constants)
- src/lib/filtering.ts: capacity and equipment filters
- src/App.tsx: state and composition
- src/components/: presentational UI components (form, validation display, room details, banners)
- src/lib/types.ts: Room, Booking and decision types
- src/lib/sampleData.ts: fictional fixture data (sampleRooms catalog with bookings)
- src/lib/availability.test.ts, src/lib/filtering.test.ts, src/App.test.tsx: Vitest tests

## Constraints
Preserve AC1–AC6; no backend, database, login or booking creation.
- AC1: reject start >= end and past requests.
- AC2: reject durations longer than 120 minutes.
- AC3: reject a blocked room.
- AC4: reject overlaps; allow bookings that only touch at endpoints.
- AC5: do not mutate booking data.
- AC6: keep clear desktop and mobile UI feedback.

## Engineering rules
Prefer pure functions and minimal changes; use at most 2 justified patterns.
Do not mutate booking fixtures; keep responsive UI feedback.
Do not add Strategy or Adapter unless there is a real need (one policy and one fixture format now).
Do not delete or weaken existing test assertions.

## Commands
- npm run dev: start the dev server
- npm run build: production build
- npm run typecheck: TypeScript check
- npm run test: run the tests once (vitest run)
- npm run lint: ESLint check

## Forbidden
Do not change the acceptance contract, UI design or existing room data. Adding rooms and the equipment field to fixtures is allowed.
Do not refactor files outside the agreed scope.

## Delivery and safety
- Never commit or hardcode secrets, API keys or credentials.
- Do not deploy externally (hosting, publishing or third-party deployment) without human approval.
- Run npm run test before proposing acceptance and report the result.
- Work on a separate branch, not directly on the main line.
- Human approval is required before any merge.

## Verification
Run existing tests and add focused regression tests.
Report changed files, rationale and test evidence.