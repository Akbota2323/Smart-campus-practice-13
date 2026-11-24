# Practice #12 — Code-based vs Low-code: Smart Campus Room Availability Checker

## Task 01 — Baseline (code-based version, frozen)

- **Project:** Smart Campus Room Availability Checker, copy of the Practice #11 version (Bolt.new, React + TypeScript)
- **Test runner:** Vitest v2.1.9
- **Baseline result:** 4 test files, **65 / 65 tests passed**
  (`App.test.tsx` 8, `availability.test.ts` 33, `explainAvailability.test.ts` 14, `filtering.test.ts` 10)
- **Rule engine:** `src/lib/availability.ts` → pure function `checkAvailability(room, start, end, currentTime)`; never mutates rooms or bookings
- **Booking rules were not modified** for this practice.

### Fictional booking data (`src/lib/sampleData.ts`)

| Room | Building | Blocked | Existing bookings |
|---|---|---|---|
| Engineering Lab A | Block C | no | 09:00–10:00 Circuits Workshop (Prof. Hale); 13:00–14:00 Robotics Demo (Prof. Okafor) |
| Lecture Hall B | Block A | no | 10:00–12:00 Open Lecture: AI Ethics (Dean Mora) |
| Design Studio | Block D | **yes** | 08:00–09:00 Maintenance Window (Facilities) |
| Seminar Room 4 | Block B | no | — |

Simulated current time: **08:00** (editable "Current time" field, so tests are reproducible).

---

## Task 02 — Common Contract (shared by both solutions)

### User story
As a student, I want to check whether a campus room is free for a chosen future time slot, so that I know if I can book it and, if not, why.

### Acceptance criteria
- **AC1:** The start time must be in the future (after the current time).
- **AC2:** The duration must be greater than 0 and at most 120 minutes.
- **AC3:** A request that overlaps an existing booking is Unavailable. Touching endpoints are allowed.
- **AC4:** A blocked room is Unavailable.
- **AC5:** The system displays a clear decision and does not change existing bookings.
- **AC6:** Invalid input receives understandable feedback.

> Note: comments inside `availability.ts` use a different AC numbering (AC3 = blocked, AC4 = overlap). This document uses the numbering from the practice slides.

### Inputs

| Input | Type | Note |
|---|---|---|
| Start time | HH:MM | must be after Current time |
| Duration | minutes | code-based: derived as End − Start; low-code: entered directly |
| Blocked flag | boolean | room status |
| Bookings | list of {start, end, title} | fictional, fixed |
| Current time | HH:MM | simulated, default 08:00 |

### Outputs

| Output | Type | Values |
|---|---|---|
| Availability | boolean | true / false |
| Reason code | text | `overlaps_booking`, `room_blocked`, `duration_too_long`, `start_not_after_now`, `invalid_interval` (+ `invalid_input` in low-code) |
| Visible message | text | e.g. "This room is currently blocked and cannot be booked." |

### Common test inputs (prepared before implementation)
Room: Engineering Lab A unless stated. Current time = 08:00.

| # | Input | Expected |
|---|---|---|
| T1 | 10:30–11:30 (60 min) | Available |
| T2 | 09:30–10:30 (60 min) | Unavailable — `overlaps_booking` |
| T3 | 10:30–11:30, blocked room (code: Design Studio; low-code: blocked toggle ON) | Unavailable — `room_blocked` |
| T4 | 11:00, duration 0 | Validation error — `invalid_interval` |
| T5 | 10:00, duration 121 | Validation error — `duration_too_long` |
| T6 | 07:00, duration 30 | Validation error — `start_not_after_now` |
| T7 | 10:00–11:00 (adjacent to 09:00–10:00) | Available |
| T8 | Bookings list before vs after T1–T7 | Unchanged (2 bookings) |
